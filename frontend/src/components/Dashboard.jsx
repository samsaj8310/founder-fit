import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { CATEGORIES } from '../data/questions'
import { computeScores, getIndividualScores } from '../utils/scoring'
import { supabase } from '../utils/supabase'

// Modular Components
import KPICard from './dashboard/KPICard'
import RadarChart from './dashboard/RadarChart'
import AIInsightsBox from './dashboard/AIInsightsBox'
import Gauge from './dashboard/Gauge'
import LineChart from './dashboard/LineChart'
import RoleDonut from './dashboard/RoleDonut'
import StatusTable from './dashboard/StatusTable'
import DetailedReport from './DetailedReport'

export default function Dashboard({ appState, shareLink, onGoBack }) {
  const { role, name, otherData, answers, sessionId, profile, paid } = appState
  const [isPdfGenerating, setIsPdfGenerating] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [showDetailedReport, setShowDetailedReport] = useState(false)
  const dashboardRef = useRef()

  // 1. Process Multi-Founder Data (2 to 5 Founders)
  const numFounders = appState.numFounders || 2
  const roleLetters = ['A', 'B', 'C', 'D', 'E'].slice(0, numFounders)
  const founderColors = ['#00A9D6', '#6C2BD9', '#10B981', '#F59E0B', '#EC4899']

  const foundersList = roleLetters.map((letter, idx) => {
    const key = `founder_${letter.toLowerCase()}`
    const data = appState.foundersData?.[key] || 
      (appState.role === letter ? { name: appState.name, answers: appState.answers, profile: appState.profile } : 
      (letter === 'B' && appState.otherData ? appState.otherData : null))
    
    const effName = data?.name || (letter === 'A' ? 'Founder A' : `Co-Founder ${letter}`)
    const effAnswers = data?.answers || appState.answers || {}
    const scores = getIndividualScores(effAnswers)

    return {
      role: letter,
      name: effName,
      answers: effAnswers,
      scores: scores,
      color: founderColors[idx],
      hasAnswers: !!(data?.answers && Object.keys(data.answers).length > 0)
    }
  })

  // Compute overall compatibility across all active founder answer sets
  const validAnswerSets = foundersList.filter(f => f.hasAnswers).map(f => f.answers)
  const { catScores, overall } = computeScores(validAnswerSets.length > 0 ? validAnswerSets : [answers])

  const dataA = foundersList[0]
  const dataB = foundersList[1] || foundersList[0]
  const scoresA = dataA.scores
  const scoresB = dataB.scores
  const nameA = dataA.name
  const nameB = dataB.name

  const cats = Object.keys(CATEGORIES)
  const sortedCats = [...cats].sort((a, b) => (catScores[b] || 0) - (catScores[a] || 0))
  const weakCats = sortedCats.slice(-3)
  const topCat = sortedCats[0]

  // Payment status check (Disabled - Free Access)
  const isPaid = true

  // Status mapping helpers
  const getStatus = (val) => val >= 80 ? 'Strong' : val >= 60 ? 'Medium' : 'Work'
  const getRiskStatus = (val) => val >= 80 ? 'Low' : val >= 60 ? 'Med' : 'High'

  const capabilityMetrics = [
    { label: 'Strategic Thinking', cat: 'Strategy' },
    { label: 'Execution Ability', cat: 'Resilience' },
    { label: 'Market Vision', cat: 'Market Approach' },
    { label: 'Leadership', cat: 'Leadership' },
    { label: 'Equity Mindset', cat: 'Equity' },
  ]

  const capabilityData = capabilityMetrics.map(m => ({
    label: m.label,
    statuses: foundersList.map(f => ({
      name: f.name,
      status: getStatus(f.scores[m.cat] || 70)
    }))
  }))

  const riskMetrics = [
    { label: 'Roles', cat: 'Roles' },
    { label: 'Strategy', cat: 'Strategy' },
    { label: 'Market', cat: 'Market Approach' },
    { label: 'Leadership', cat: 'Leadership' },
    { label: 'Resilience', cat: 'Resilience' },
    { label: 'Conflict', cat: 'Conflict Resolution' },
    { label: 'Equity', cat: 'Equity' },
  ]

  const riskData = riskMetrics.map(m => ({
    label: m.label,
    statuses: foundersList.map(f => ({
      name: f.name,
      status: getRiskStatus(f.scores[m.cat] || catScores[m.cat] || 70)
    }))
  }))

  const radarDatasets = foundersList.map(f => ({
    label: f.name,
    data: cats.map(c => f.scores[c]),
    borderColor: f.color,
    backgroundColor: f.color + '1A'
  }))

  const lineDatasets = foundersList.map(f => ({
    label: f.name,
    data: cats.slice(0, 7).map(c => f.scores[c]),
    borderColor: f.color,
    backgroundColor: f.color
  }))

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink)
    alert('Link copied to clipboard!')
  }

  // Upload helpers to encapsulate pdf generation and upload
  const captureAndUploadReport = async (isManual = false) => {
    const element = dashboardRef.current
    if (!element) return null

    const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#f1f5f9' })
    const imgData = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF('l', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height)
    const imgWidth = canvas.width * ratio
    const imgHeight = canvas.height * ratio
    
    const xOffset = (pdfWidth - imgWidth) / 2
    const yOffset = (pdfHeight - imgHeight) / 2

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight)

    // Trigger download if manually requested
    if (isManual) {
      pdf.save(`compatibility-report-${new Date().getTime()}.pdf`)
    }

    const pdfBlob = pdf.output('blob')
    const fileName = `report-${sessionId || 'session'}-${role}-${Date.now()}.pdf`

    // Upload to Supabase Storage reports bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('reports')
      .upload(fileName, pdfBlob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      console.error('Storage Upload Error:', uploadError)
      if (isManual) alert(`Failed to upload PDF: ${uploadError.message}`)
      return null
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from('reports')
      .getPublicUrl(fileName)
    
    const publicUrl = publicUrlData.publicUrl

    // Update session record in database
    const key = role === 'A' ? 'founder_a' : 'founder_b'
    
    // First retrieve current database details to preserve existing data
    const { data: dbData, error: dbError } = await supabase
      .from('sessions')
      .select(key)
      .eq('id', sessionId)
      .maybeSingle()

    const currentFounderData = dbData?.[key] || {}
    const updatedPayload = { 
      name, 
      answers, 
      profile: profile || {}, 
      ...currentFounderData,
      pdf_url: publicUrl 
    }

    const { error: updateError } = await supabase
      .from('sessions')
      .update({ [key]: updatedPayload })
      .eq('id', sessionId)

    if (updateError) {
      console.error('Database Update Error:', updateError)
      if (isManual) alert(`Failed to save report URL: ${updateError.message}`)
    } else {
      console.log('Report PDF link saved successfully:', publicUrl)
    }

    return publicUrl
  }

  const downloadPdf = async () => {
    if (!isPaid) {
      setShowCheckoutModal(true)
      return
    }
    try {
      setIsPdfGenerating(true)
      await captureAndUploadReport(true)
    } catch (err) { 
      console.error(err) 
    } finally { 
      setIsPdfGenerating(false) 
    }
  }

  const handleProceedToPayment = async () => {
    try {
      setIsPdfGenerating(true)
      const backendUrl = import.meta.env.VITE_BACKEND_URL || ''
      
      // 1. Request Razorpay order creation from our backend
      const response = await fetch(`${backendUrl}/api/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 49900, // ₹499.00 in paise
          sessionId: sessionId,
          role: role
        })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || errData.details || `Server responded with HTTP ${response.status}`)
      }

      const data = await response.json()

      // 2. Configure and launch the Razorpay Checkout popup
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: 'INR',
        name: 'FounderSync',
        description: 'Compatibility Assessment & Report',
        order_id: data.order_id,
        ...(data.callback_url ? { callback_url: data.callback_url } : {}),
        handler: async function (paymentResponse) {
          try {
            const verifyRes = await fetch(`${backendUrl}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                sessionId: sessionId
              })
            })

            if (verifyRes.ok) {
              alert('Payment successful! Your detailed report is now unlocked.')
              window.location.reload()
            } else {
              window.location.href = `${window.location.pathname}?session=${sessionId}&payment=success`
            }
          } catch (e) {
            console.error("Payment verification error:", e)
            window.location.href = `${window.location.pathname}?session=${sessionId}&payment=success`
          }
        },
        prefill: {
          name: name || '',
          email: profile?.email || 'customer@example.com',
          contact: profile?.phone || '9999999999'
        },
        theme: { color: '#6c2bd9' }
      }

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection or ad-blocker.')
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
      setShowCheckoutModal(false)
    } catch (err) {
      console.error('Proceed To Payment Error:', err)
      alert(`Checkout initialization failed: ${err.message || err}`)
    } finally {
      setIsPdfGenerating(false)
    }
  }

  // Auto save screenshot / PDF report on component mount
  useEffect(() => {
    let active = true

    const autoSaveReport = async () => {
      if (!sessionId) return

      try {
        const key = role === 'A' ? 'founder_a' : 'founder_b'
        
        // Fetch current session state to check if pdf_url is already present
        const { data, error } = await supabase
          .from('sessions')
          .select(key)
          .eq('id', sessionId)
          .maybeSingle()
          
        if (error) {
          console.error("Failed to check existing pdf_url:", error)
          return
        }

        const currentFounderData = data?.[key]
        if (currentFounderData && currentFounderData.pdf_url) {
          console.log("PDF Report URL already present in database:", currentFounderData.pdf_url)
          return
        }

        console.log("No PDF Report URL found. Auto-capturing screenshot after delay...")
        
        // Delay to allow Chart.js layout animations to finish rendering completely
        setTimeout(async () => {
          if (!active) return
          try {
            await captureAndUploadReport(false)
          } catch (e) {
            console.error("Auto save execution failed:", e)
          }
        }, 3000)
      } catch (err) {
        console.error("Auto save initialization failed:", err)
      }
    }

    autoSaveReport()

    return () => {
      active = false
    }
  }, [sessionId, role])


  return (
    <div className="dashboard-wrapper" ref={dashboardRef}>
      <div className="top-purple-bar" style={{ fontWeight: 'bold' }}>Founder-Co-Founder Compatibility Assessment</div>
      
      <div className="dashboard-screen">
        <header className="dash-header">
          <div className="dash-founders" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {foundersList.map((f) => (
              <div key={f.role} className="founder-pill" style={{ border: `1px solid ${f.color}40`, color: '#1e293b', background: '#ffffff' }}>
                <div className="pill-dot" style={{ background: f.color }} />
                {f.name}
              </div>
            ))}
          </div>
          <div className="dash-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {appState.isViewingHistory && onGoBack && (
              <button 
                onClick={onGoBack} 
                className="btn-back-to-active"
                style={{ 
                  background: 'transparent', 
                  border: '2px solid #3b82f6', 
                  color: '#3b82f6', 
                  padding: '8px 16px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Outfit', sans-serif",
                  transition: 'all 0.2s ease',
                  fontSize: '13px'
                }}
              >
                ← Back to Active
              </button>
            )}
            <button className="btn-detailed-report" onClick={() => {
              if (!isPaid) {
                setShowCheckoutModal(true)
              } else {
                setShowDetailedReport(true)
              }
            }} style={{ background: '#2563eb', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
              📋 Detailed Report
            </button>
            <button className="btn-download" onClick={downloadPdf} disabled={isPdfGenerating} style={{ background: '#10b981', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
              ↓ {isPdfGenerating ? 'Processing...' : 'Save PDF'}
            </button>
          </div>
        </header>

        <main className="dash-grid">
          {/* Row 1: KPIs */}
          <KPICard title="COMPATIBILITY SCORE" className="c-kpi1" child={
            <div className="kpi-main-circle">
              <span className="kpi-big">{overall}%</span>
              <div className={`kpi-fit-pill ${overall >= 75 ? 'fit-good' : 'fit-warn'}`}>
                {overall >= 85 ? '🎯 Excellent Fit' : overall >= 60 ? 'Strong Fit' : '⚠ Needs Work'}
              </div>
            </div>
          } />

          <KPICard title="PARTNERSHIP STABILITY" className="c-kpi2" child={<Gauge value={overall - 5} meta="Partnership stability index" />} />
          <KPICard title="FOUNDER ALIGNMENT INDEX" className="c-kpi3" child={<Gauge value={overall + 2} meta="Strategic alignment index" />} />
          <KPICard title="CONFLICT RISK" className="c-kpi4" child={<Gauge value={100 - overall} meta="Medium risk 41%" />} />

          {/* Row 2 */}
          <KPICard title="STRATEGIC ALIGNMENT RADAR" className="c-radar" child={
            <RadarChart 
              labels={cats.map(c => c.split(' ')[0])} 
              datasets={radarDatasets} 
            />
          } />

          <KPICard title="DECISION-MAKING STYLE MATRIX" className="c-matrix" child={
            <LineChart 
              labels={cats.slice(0, 7).map(c => c.split(' ')[0])} 
              datasets={lineDatasets} 
            />
          } />


          <KPICard title="FOUNDER CAPABILITY MAP" className="c-capmap" child={<StatusTable data={capabilityData} columns={foundersList} />} />

          <KPICard title="AI PARTNERSHIP INSIGHT" className="c-ai1" child={
            <AIInsightsBox 
              title="Synergy Report" 
              insights={`The founders demonstrate strong alignment in ${topCat}. However, moderate gaps exist in ${weakCats[0]}.`} 
            />
          } />

          {/* Row 3 */}
          <KPICard title="FOUNDER ROLE DISTRIBUTION" className="c-roledist" child={
            <RoleDonut data={cats.map(c => ({ label: c, value: catScores[c] }))} />
          } />

          <div className="dc c-gap">
            <div className="dc-title">ALIGNMENT GAP ANALYSIS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {sortedCats.slice(0, 5).map(cat => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '80px', fontSize: '11px', fontWeight: 600 }}>{cat}</div>
                  <div className="progress-bar" style={{ flex: 1 }}><div className="progress-fill" style={{ width: `${100 - catScores[cat]}%`, background: '#ef4444' }} /></div>
                  <div style={{ width: '30px', fontSize: '11px', fontWeight: 700, color: '#ef4444' }}>{100 - catScores[cat]}%</div>
                </div>
              ))}
            </div>
            <div className="share-box dash-bottom">
              <label>Store link with co-founder</label>
              <div className="share-row">
                <input readOnly value={shareLink} />
                <button onClick={copyShareLink}>Copy</button>
              </div>
            </div>
          </div>

          <KPICard title="PARTNERSHIP RISK MAP" className="c-riskmap" child={<StatusTable data={riskData} columns={foundersList} />} />

          <KPICard title="AI PARTNERSHIP INSIGHT" className="c-ai2" child={
            <AIInsightsBox 
              title="Risk Mitigation" 
              insights="Key actions to strengthen this partnership:" 
              recommendation={[
                `Clarify ${weakCats[0]} expectations`,
                `Establish conflict resolution protocols`
              ]}
            />
          } />
        </main>
      </div>

      {showCheckoutModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-card">
            <button className="payment-modal-close" onClick={() => setShowCheckoutModal(false)}>×</button>
            <div className="payment-modal-header">
              <div className="payment-modal-icon">🔒</div>
              <h2 className="payment-modal-title">Unlock Premium Compatibility Report</h2>
              <p className="payment-modal-subtitle">Get the complete data-driven assessment for your partnership.</p>
            </div>
            
            <div className="payment-modal-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">📊</span>
                <div className="benefit-text">
                  <strong>7-Dimension Compatibility Map</strong>
                  <p>Detailed alignment scores across Strategy, Roles, Market, Equity, and more.</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <span className="benefit-icon">🛡️</span>
                <div className="benefit-text">
                  <strong>In-depth Risk Assessment</strong>
                  <p>Pinpoint exact operational overlap, conflict points, and warning areas.</p>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">🤖</span>
                <div className="benefit-text">
                  <strong>AI Synergy Brief & Mitigation Plan</strong>
                  <p>Tailored recommendations and action plans generated specifically for your answers.</p>
                </div>
              </div>

              <div className="benefit-item">
                <span className="benefit-icon">📄</span>
                <div className="benefit-text">
                  <strong>Premium PDF Export</strong>
                  <p>Beautiful, investor-ready report to store, print, or share with partners and stakeholders.</p>
                </div>
              </div>
            </div>

            <div className="payment-modal-pricing">
              <div className="price-tag">
                <span className="price-currency">₹</span>
                <span className="price-amount">499</span>
                <span className="price-period">/ session</span>
              </div>
              <p className="price-guarantee">Includes lifetime access for both co-founders.</p>
            </div>

            <button className="payment-modal-btn-pay" onClick={handleProceedToPayment}>
              Proceed to Payment →
            </button>
            <p className="payment-modal-secure-text">🔒 Secured payments via standard payment hub</p>
          </div>
        </div>
      )}

      {showDetailedReport && (
        <DetailedReport 
          onClose={() => setShowDetailedReport(false)}
          nameA={nameA}
          nameB={nameB}
          foundersList={foundersList}
          overall={overall}
          catScores={catScores}
          scoresA={scoresA}
          scoresB={scoresB}
          riskData={riskData}
          weakCats={weakCats}
        />
      )}
    </div>
  )
}


