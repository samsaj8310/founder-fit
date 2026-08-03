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

export default function Dashboard({ appState, shareLink }) {
  const { role, name, otherData, answers, sessionId, profile } = appState
  const [isPdfGenerating, setIsPdfGenerating] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [showDetailedReport, setShowDetailedReport] = useState(false)
  const dashboardRef = useRef()

  // Data processing...
  const dataA = role === 'A' ? { name, answers } : otherData
  const dataB = role === 'B' ? { name, answers } : otherData
  const isSolo = !otherData
  
  const effA = dataA?.answers || answers
  const effB = dataB?.answers || answers
  
  const nameA = dataA?.name || name || 'Founder A'
  const nameB = dataB?.name || (isSolo ? 'Evaluation Baseline' : 'Co-Founder B')

  const { catScores, overall } = computeScores(effA, effB)
  const scoresA = getIndividualScores(effA)
  const scoresB = getIndividualScores(effB)

  const cats = Object.keys(CATEGORIES)
  const sortedCats = [...cats].sort((a, b) => (catScores[b] || 0) - (catScores[a] || 0))
  const weakCats = sortedCats.slice(-3)
  const topCat = sortedCats[0]

  // Payment status check
  const isPaid = true

  // Status mapping helpers
  const getStatus = (val) => val >= 80 ? 'Strong' : val >= 60 ? 'Medium' : 'Work'
  const getRiskStatus = (val) => val >= 80 ? 'Low' : val >= 60 ? 'Med' : 'High'

  const capabilityData = [
    { label: 'Strategic Thinking', statusA: getStatus(scoresA['Strategy']), statusB: getStatus(scoresB['Strategy']) },
    { label: 'Execution Ability', statusA: getStatus(scoresA['Resilience']), statusB: getStatus(scoresB['Resilience']) },
    { label: 'Market Vision', statusA: getStatus(scoresA['Market Approach']), statusB: getStatus(scoresB['Market Approach']) },
    { label: 'Leadership', statusA: getStatus(scoresA['Leadership']), statusB: getStatus(scoresB['Leadership']) },
    { label: 'Equity Mindset', statusA: getStatus(scoresA['Equity']), statusB: getStatus(scoresB['Equity']) },
  ]

  const riskData = [
    { label: 'Roles', statusA: getRiskStatus(catScores['Roles']), statusB: getRiskStatus(catScores['Roles']) },
    { label: 'Strategy', statusA: getRiskStatus(catScores['Strategy']), statusB: getRiskStatus(catScores['Strategy']) },
    { label: 'Market', statusA: getRiskStatus(catScores['Market Approach']), statusB: getRiskStatus(catScores['Market Approach']) },
    { label: 'Leadership', statusA: getRiskStatus(catScores['Leadership']), statusB: getRiskStatus(catScores['Leadership']) },
    { label: 'Resilience', statusA: getRiskStatus(catScores['Resilience']), statusB: getRiskStatus(catScores['Resilience']) },
    { label: 'Conflict', statusA: getRiskStatus(catScores['Conflict Resolution']), statusB: getRiskStatus(catScores['Conflict Resolution']) },
    { label: 'Equity', statusA: getRiskStatus(catScores['Equity']), statusB: getRiskStatus(catScores['Equity']) },
  ]

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
      .single()

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
        throw new Error('Failed to retrieve order ID from payment server.')
      }

      const data = await response.json()

      // 2. Configure and launch the Razorpay Checkout popup
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: 'INR',
        order_id: data.order_id,
        callback_url: data.callback_url, // Target Payment Hub
        prefill: {
          name: name || '',
          email: profile?.email || 'customer@example.com',
          contact: profile?.phone || '9999999999'
        },
        theme: { color: '#6c2bd9' }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
      setShowCheckoutModal(false)
    } catch (err) {
      console.error(err)
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
          .single()
          
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
      <div className="top-purple-bar">Founder-Co-Founder Compatibility Assessment</div>
      
      <div className="dashboard-screen">
        <header className="dash-header">
          <div className="dash-logo" style={{ color: 'var(--brand-accent)', fontWeight: 800, fontSize: '20px' }}>
            ⚡ FounderSync
          </div>
          <div className="dash-founders">
            <div className="founder-pill pill-a"><div className="pill-dot dot-a" />{nameA}</div>
            <div className="founder-pill pill-b"><div className="pill-dot dot-b" />{nameB}</div>
          </div>
          <div className="dash-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
              datasets={[
            { label: nameA, data: cats.map(c => scoresA[c]), borderColor: '#00A9D6', backgroundColor: 'rgba(0, 169, 214, 0.1)' },
            { label: nameB, data: cats.map(c => scoresB[c]), borderColor: '#2E2A8C', backgroundColor: 'rgba(46, 42, 140, 0.1)' }

              ]} 
            />
          } />

          <KPICard title="DECISION-MAKING STYLE MATRIX" className="c-matrix" child={
            <LineChart 
              labels={cats.slice(0, 7).map(c => c.split(' ')[0])} 
              datasets={[
                { label: nameA, data: cats.slice(0, 7).map(c => scoresA[c]), borderColor: '#00A9D6', backgroundColor: '#00A9D6' },
                { label: nameB, data: cats.slice(0, 7).map(c => scoresB[c]), borderColor: '#2E2A8C', backgroundColor: '#2E2A8C' }
              ]} 
            />
          } />


          <KPICard title="FOUNDER CAPABILITY MAP" className="c-capmap" child={<StatusTable data={capabilityData} />} />

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

          <KPICard title="PARTNERSHIP RISK MAP" className="c-riskmap" child={<StatusTable data={riskData} />} />

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


