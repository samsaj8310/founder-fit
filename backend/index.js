require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS for frontend connectivity
app.use(cors());
app.use(express.json());

// Initialize clients
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Helper: Locate session ID associated with a Razorpay order ID
async function findSessionIdByOrderId(orderId) {
  try {
    // 1. Query checks using JSONB path lookups
    const { data: dataA } = await supabase
      .from('sessions')
      .select('id')
      .eq('founder_a->>order_id', orderId)
      .maybeSingle();
    if (dataA) return dataA.id;

    const { data: dataB } = await supabase
      .from('sessions')
      .select('id')
      .eq('founder_b->>order_id', orderId)
      .maybeSingle();
    if (dataB) return dataB.id;

    // 2. Query fallback: retrieve all sessions to search manually (safety buffer)
    const { data: allSessions } = await supabase
      .from('sessions')
      .select('id, founder_a, founder_b');
    if (allSessions) {
      const matched = allSessions.find(s => 
        (s.founder_a && s.founder_a.order_id === orderId) || 
        (s.founder_b && s.founder_b.order_id === orderId)
      );
      if (matched) return matched.id;
    }
  } catch (err) {
    console.error('findSessionIdByOrderId Error:', err);
  }
  return null;
}

// Helper: Update Supabase to set paid status for both founders
async function markSessionAsPaid(sessionId, paymentDetails) {
  try {
    const { data: session, error: fetchErr } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (fetchErr || !session) throw new Error(fetchErr?.message || 'Session not found');

    const updates = {};
    const paymentInfo = {
      payment_id: paymentDetails.payment_id,
      order_id: paymentDetails.order_id,
      signature: paymentDetails.signature,
      status: paymentDetails.status,
      timestamp: new Date().toISOString()
    };

    if (session.founder_a) {
      updates.founder_a = { 
        ...session.founder_a, 
        paid: true, 
        payment_details: paymentInfo 
      };
    }
    if (session.founder_b) {
      updates.founder_b = { 
        ...session.founder_b, 
        paid: true, 
        payment_details: paymentInfo 
      };
    }

    if (Object.keys(updates).length > 0) {
      const { error: updateErr } = await supabase
        .from('sessions')
        .update(updates)
        .eq('id', sessionId);
      if (updateErr) throw updateErr;
      console.log(`Session ${sessionId} successfully marked as paid with transaction details.`);
    }
  } catch (err) {
    console.error('markSessionAsPaid Error:', err);
  }
}

// Route: Health check
app.get('/health', (req, res) => {
  res.status(200).send('Backend is running healthy.');
});

// Route: Create Razorpay Order
app.post('/api/create-payment', async (req, res) => {
  const { amount, sessionId, role } = req.body;

  if (!amount || !sessionId || !role) {
    return res.status(400).json({ error: 'Missing required parameters: amount, sessionId, or role.' });
  }

  try {
    // 1. Create order on Razorpay
    const order = await razorpay.orders.create({
      amount: amount, // e.g. 49900 representing ₹499.00
      currency: 'INR',
      receipt: `rcpt_${sessionId}_${role}_${Date.now()}`
    });

    // 2. Fetch session from Supabase safely
    const { data: session } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();

    // 3. Save order_id in founder object JSONB
    const key = role === 'A' ? 'founder_a' : 'founder_b';
    const currentFounderData = session ? session[key] || {} : {};
    const updatedFounderData = {
      ...currentFounderData,
      order_id: order.id
    };

    const { error: updateErr } = await supabase
      .from('sessions')
      .upsert({ id: sessionId, [key]: updatedFounderData }, { onConflict: 'id' });

    if (updateErr) {
      throw new Error(`Failed to associate order with session: ${updateErr.message}`);
    }

    const callbackUrl = process.env.PAYMENT_HUB_URL ? `${process.env.PAYMENT_HUB_URL}/?app_id=cofit` : undefined;

    // 4. Return parameters required by Razorpay SDK
    res.status(200).json({
      key_id: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      order_id: order.id,
      callback_url: callbackUrl
    });
  } catch (error) {
    console.error('Create Payment Error:', error);
    res.status(500).json({ error: 'Failed to create payment order.', details: error.message });
  }
});

// Route: Verify Razorpay Payment (Client JS Popup Callback)
app.post('/api/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, sessionId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !sessionId) {
    return res.status(400).json({ error: 'Missing required parameters for payment verification.' });
  }

  try {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const computedSignature = hmac.digest('hex');

    if (computedSignature !== razorpay_signature) {
      console.error(`Signature mismatch during verification for session ${sessionId}`);
      return res.status(400).json({ error: 'Invalid payment signature.' });
    }

    await markSessionAsPaid(sessionId, {
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      signature: razorpay_signature,
      status: 'success'
    });

    res.status(200).json({ success: true, message: 'Payment verified and session updated.' });
  } catch (err) {
    console.error('Verify Payment Exception:', err);
    res.status(500).json({ error: 'Payment verification failed.', details: err.message });
  }
});

// Route: Redirect Landing from Payment Hub
app.get('/payment-status', async (req, res) => {
  const { status, payment_id, order_id, signature } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'https://cofit.infopaceindia.co.in';

  // 1. Locate session ID from order ID
  const sessionId = await findSessionIdByOrderId(order_id);
  if (!sessionId) {
    return res.status(404).send('Invalid or unrecognized order ID.');
  }

  // 2. Check if payment failed or was cancelled
  if (status !== 'success') {
    console.log(`Payment failed for session ${sessionId}, redirecting back...`);
    return res.redirect(`${frontendUrl}/?session=${sessionId}&payment=failed`);
  }

  // 3. Verify Razorpay signature securely
  try {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${order_id}|${payment_id}`);
    const computedSignature = hmac.digest('hex');

    if (computedSignature !== signature) {
      console.error(`Signature mismatch for session ${sessionId}. Tampering check failed.`);
      return res.redirect(`${frontendUrl}/?session=${sessionId}&payment=failed&error=signature_invalid`);
    }

    // 4. Update Database
    await markSessionAsPaid(sessionId, {
      payment_id,
      order_id,
      signature,
      status
    });

    // 5. Redirect back to frontend
    res.redirect(`${frontendUrl}/?session=${sessionId}&payment=success`);
  } catch (err) {
    console.error('Signature verification / redirection exception:', err);
    res.redirect(`${frontendUrl}/?session=${sessionId}&payment=failed`);
  }
});

app.listen(PORT, () => {
  console.log(`FounderSync Payment Server listening on port ${PORT}`);
});
