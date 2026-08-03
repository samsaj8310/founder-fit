import React from 'react'

export default function DetailedReport({ 
  onClose,
  nameA,
  nameB,
  overall,
  catScores,
  scoresA,
  scoresB,
  riskData,
  weakCats
}) {

  const handlePrint = () => {
    window.print()
  }

  const getRiskColor = (status) => {
    if (status === 'Low') return '#10b981'
    if (status === 'Med') return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="detailed-report-overlay">
      
      {/* Document Viewer Header Bar */}
      <header className="detailed-report-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#38bdf8' }}>⚡ FounderSync</span>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>|</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>Detailed Partnership Report</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="report-print-btn" onClick={handlePrint}>
            Print / Save as PDF 🖨️
          </button>
          <button className="report-close-btn" onClick={onClose}>
            Close ×
          </button>
        </div>
      </header>

      {/* Pages Container */}
      <div className="detailed-report-body">
        
        {/* ================= PAGE 1: COVER PAGE ================= */}
        <div className="report-page page-cover">
          <div className="cover-header-accent" />
          <div className="cover-content">
            <div className="cover-logo-box">
              <img src="/logo.png" alt="Infopace" className="cover-logo-img" />
            </div>
            
            <h1 className="cover-main-title">AI ASSESSMENT REPORT</h1>
            <p className="cover-subtitle">Founder & Co-Founder Compatibility Fit</p>
            
            <div className="cover-divider" />
            
            <div className="cover-metadata">
              <div className="meta-row">
                <span className="meta-label">PREPARED FOR:</span>
                <span className="meta-value">{nameA} & {nameB}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">DATE GENERATED:</span>
                <span className="meta-value">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-label">REPORT ISSUED BY:</span>
                <span className="meta-value">Infopace Management Pvt. Ltd.</span>
              </div>
            </div>
          </div>
          <div className="cover-footer-bar">
            <span>© 2026 INFOPACE MANAGEMENT PVT LTD. ALL RIGHTS RESERVED.</span>
          </div>
        </div>

        {/* ================= PAGE 2: EXECUTIVE SUMMARY ================= */}
        <div className="report-page">
          <div className="report-header">
            <span>INFOPACE AI ASSESSMENT SUITE</span>
            <span>EXECUTIVE SUMMARY</span>
          </div>
          
          <div className="report-body-content">
            <h2 className="section-title">EXECUTIVE SUMMARY</h2>
            
            <p className="report-para">
              Over the reporting period, Infopace continued to strengthen its portfolio of AI-powered business assessment tools, delivering intelligent, data-driven solutions that assists entrepreneurs, startups, and organizations make informed strategic decisions.
            </p>
            <p className="report-para" style={{ marginBottom: '32px' }}>
              Each assessment leverages AI to analyze user responses and generate comprehensive reports containing actionable insights, key findings, strengths, improvement areas, and tailored recommendations.
            </p>

            <h3 className="sub-section-title">THE ASSESSMENT SUITE</h3>
            
            <div className="suite-item">
              <strong>Market Research Assessment</strong>
              <p>Validates business ideas by analyzing market demand, customer needs, industry trends, and competition, enabling informed market-entry decisions.</p>
            </div>
            
            <div className="suite-item">
              <strong>Market Potential</strong>
              <p>Evaluates the growth potential and commercial viability of a product or business by assessing market size, demand, scalability and risk opportunities.</p>
            </div>
            
            <div className="suite-item">
              <strong>Creative Innovation Index</strong>
              <p>Measures innovation capability by assessing creativity, problem-solving and adaptability, assisting individuals and organizations strengthen their innovation potential.</p>
            </div>
            
            <div className="suite-item">
              <strong>Business Risk Assessment</strong>
              <p>Identifies strategic, operational, financial and market risks, enabling businesses to proactively mitigate challenges and improve resilience.</p>
            </div>
            
            <div className="suite-item" style={{ borderBottom: 'none' }}>
              <strong>Founder & Co-Founder Compatibility</strong>
              <p>Assesses alignment between founders in leadership, communication, values, and decision-making to build stronger partnerships and reduce future conflicts.</p>
            </div>
          </div>
          
          <div className="report-footer">
            <span>Page 2</span>
            <span>infopaceindia.com</span>
          </div>
        </div>

        {/* ================= PAGE 3: COMPATIBILITY FIT (TOOL CONTENT 1) ================= */}
        <div className="report-page">
          <div className="report-header">
            <span>FOUNDER COMPATIBILITY FIT</span>
            <span>PARTNERSHIP OVERVIEW</span>
          </div>
          
          <div className="report-body-content">
            <h2 className="section-title">CO-FOUNDER SYNERGY ASSESSMENT</h2>
            
            <div className="score-summary-box">
              <div className="score-circle-big">
                <span className="score-big-num">{overall}%</span>
                <span className="score-big-label">Match</span>
              </div>
              <div className="score-summary-details">
                <h3>Overall Fit Quality: {overall >= 85 ? '🎯 Excellent Partner Fit' : overall >= 60 ? 'Strong Alignment' : '⚠ Caution & Tuning Required'}</h3>
                <p className="report-para" style={{ fontSize: '13px', margin: 0 }}>
                  This compatibility matrix compares leadership styles, values, resilience patterns, strategy alignment, and operational execution choices. Open areas indicate specific risk gaps to resolve prior to structuring final founder agreements.
                </p>
              </div>
            </div>

            <h3 className="sub-section-title" style={{ marginTop: '36px', marginBottom: '16px' }}>ALIGNMENT SCORE BY DIMENSION</h3>
            
            <div className="category-scores-table">
              <div className="table-header-row">
                <span>COMPATIBILITY DIMENSION</span>
                <span style={{ textAlign: 'right' }}>SCORE</span>
              </div>
              {Object.keys(catScores).map((cat) => (
                <div key={cat} className="table-data-row">
                  <span className="table-cat-name">{cat}</span>
                  <div className="table-score-bar-wrap">
                    <div className="table-score-bar-fill" style={{ width: `${catScores[cat]}%` }} />
                    <span className="table-score-num">{catScores[cat]}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="report-footer">
            <span>Page 3</span>
            <span>infopaceindia.com</span>
          </div>
        </div>

        {/* ================= PAGE 4: RISK MAP & ACTIONS (TOOL CONTENT 2) ================= */}
        <div className="report-page">
          <div className="report-header">
            <span>FOUNDER COMPATIBILITY FIT</span>
            <span>RISK MAP & ACTION PLANS</span>
          </div>
          
          <div className="report-body-content">
            <h2 className="section-title">PARTNERSHIP RISK ANALYSIS</h2>
            
            <p className="report-para" style={{ marginBottom: '24px' }}>
              We map the operational conflicts and decision-making overlaps between <strong>{nameA}</strong> and <strong>{nameB}</strong>. High risk fields indicate potential areas of friction that require explicit alignment.
            </p>

            <table className="report-risk-table">
              <thead>
                <tr>
                  <th>DIMENSION</th>
                  <th style={{ textAlign: 'center' }}>FOUNDER A</th>
                  <th style={{ textAlign: 'center' }}>FOUNDER B</th>
                  <th style={{ textAlign: 'center' }}>RISK STATUS</th>
                </tr>
              </thead>
              <tbody>
                {riskData.map((row) => (
                  <tr key={row.label}>
                    <td style={{ fontWeight: 700 }}>{row.label}</td>
                    <td style={{ textAlign: 'center' }}>{row.statusA}</td>
                    <td style={{ textAlign: 'center' }}>{row.statusB}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="risk-level-badge" style={{ background: getRiskColor(row.statusA) }}>
                        {row.statusA === 'Low' ? 'Low Risk' : row.statusA === 'Med' ? 'Medium Risk' : 'High Risk'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="sub-section-title" style={{ marginTop: '36px' }}>AI PARTNERSHIP MITIGATION RECCOMENDATIONS</h3>
            <ul className="mitigation-action-list">
              <li>
                <strong>Establish Vesting & Milestones:</strong> Set milestones in equity division to protect the venture from premature co-founder departures.
              </li>
              <li>
                <strong>Define Clear Decision Owners:</strong> Avoid operational gridlock by assigning distinct areas (e.g. Tech, Strategy, Sales) to specific final decision-makers.
              </li>
              <li>
                <strong>Conflict Resolution Frameworks:</strong> Set up a structured review process every quarter to sync on communication styles and handle strategy disagreements.
              </li>
            </ul>
          </div>

          <div className="report-footer">
            <span>Page 4</span>
            <span>infopaceindia.com</span>
          </div>
        </div>

        {/* ================= PAGE 5: DISCLAIMER & POLICIES (ALL ON ONE PAGE) ================= */}
        <div className="report-page">
          <div className="report-header">
            <span>INFOPACE AI ASSESSMENT SUITE</span>
            <span>DISCLAIMER, POLICY, TERMS & CONDITIONS</span>
          </div>
          
          <div className="report-body-content" style={{ gap: '16px' }}>
            <div>
              <h2 className="section-title" style={{ fontSize: '16px', marginBottom: '8px' }}>DISCLAIMER</h2>
              <p className="report-para" style={{ fontSize: '11px', lineHeight: '1.5', margin: 0 }}>
                The AI-generated assessment report is intended for informational and decision-support purposes only. Results are based on the information provided by the user and AI-driven analysis and should not be considered legal, financial, investment, or professional advice. Users are encouraged to validate critical decisions with relevant experts before taking action.
              </p>
            </div>

            <div>
              <h2 className="section-title" style={{ fontSize: '16px', marginBottom: '8px' }}>PRIVACY POLICY</h2>
              <p className="report-para" style={{ fontSize: '11px', lineHeight: '1.5', margin: 0 }}>
                All information shared during the assessment is handled with confidentiality and used solely for generating personalized assessment reports and improving the quality of the assessment platform. User data is processed securely and is not shared with third parties without consent, except where required by applicable law.
              </p>
            </div>

            <div>
              <h2 className="section-title" style={{ fontSize: '16px', marginBottom: '8px' }}>TERMS & CONDITIONS</h2>
              <p className="report-para" style={{ fontSize: '11.5px', lineHeight: '1.5', margin: 0 }}>
                By using Infopace's AI-powered assessment tools, users acknowledge that the assessment results are generated based on the information they provide and the AI-driven evaluation methodology. The reports are intended to support decision-making and should not be considered a substitute for professional legal, financial, or business advice. Users are responsible for ensuring the accuracy of the information submitted and for any decisions or actions taken based on the report. Infopace does not guarantee specific business outcomes or success resulting from the recommendations provided. All assessment content, methodologies, reports, and related intellectual property remain the exclusive property of Infopace and may not be copied, reproduced, modified, or distributed without prior written consent. Infopace reserves the right to update, modify, or discontinue the assessment tools, methodologies, and these terms at any time without prior notice.
              </p>
            </div>
          </div>

          <div className="report-footer">
            <span>Page 5</span>
            <span>infopaceindia.com</span>
          </div>
        </div>

        {/* ================= PAGE 6: ABOUT INFOPACE (EXACT WORD STATS) ================= */}
        <div className="report-page">
          <div className="report-header">
            <span>INFOPACE AI ASSESSMENT SUITE</span>
            <span>ABOUT INFOPACE</span>
          </div>
          
          <div className="report-body-content">
            <h2 className="section-title">ABOUT INFOPACE</h2>
            <p className="report-para" style={{ marginBottom: '20px' }}>
              Infopace Management Pvt. Ltd is a Bengaluru-based strategic change management and business transformation company established in 1999. The organization provides advisory and technology-driven solutions that assist businesses improve operational efficiency, accelerate growth and adapt to changing market conditions.
            </p>
            <p className="report-para" style={{ marginBottom: '32px' }}>
              Its services include strategic change management, digital transformation, leadership development, market research, business incubation, innovation management, data analytics and AI-enabled solutions.
            </p>
            <p className="report-para" style={{ marginBottom: '32px' }}>
              Serving industries such as information technology, manufacturing, healthcare, education, retail, energy and telecommunications, Infopace partners with organizations to drive sustainable growth, enhance organizational performance, and support long-term business success.
            </p>

            <div className="info-stats-grid" style={{ gap: '16px' }}>
              <div className="info-stat-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px' }}>
                <span className="info-stat-num">200+</span>
                <span className="info-stat-label" style={{ fontSize: '10px', marginTop: '6px' }}>
                  Specialist with average of 7 years of expertise
                </span>
              </div>
              <div className="info-stat-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px' }}>
                <span className="info-stat-num">850+</span>
                <span className="info-stat-label" style={{ fontSize: '10px', marginTop: '6px' }}>
                  Delighted clients long lasting Partnership with exceptional experience
                </span>
              </div>
              <div className="info-stat-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px' }}>
                <span className="info-stat-num">7000+</span>
                <span className="info-stat-label" style={{ fontSize: '10px', marginTop: '6px' }}>
                  Delivered projects guiding Businesses through Digital Transformation
                </span>
              </div>
            </div>
          </div>

          <div className="report-footer">
            <span>Page 6</span>
            <span>infopaceindia.com</span>
          </div>
        </div>

        {/* ================= PAGE 7: THANK YOU & CONTACT ================= */}
        <div className="report-page">
          <div className="report-header">
            <span>INFOPACE AI ASSESSMENT SUITE</span>
            <span>THANK YOU</span>
          </div>
          
          <div className="report-body-content" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20mm' }}>
            <h2 className="section-title" style={{ fontSize: '28px', color: '#1e3a8a', marginBottom: '16px' }}>THANK YOU!</h2>
            
            <p className="report-para" style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '48px', color: '#334155' }}>
              Thank you for taking the time to read this report. If you have any questions or would like to discuss our findings further, please don't hesitate to reach out to us.
            </p>

            <div className="contact-box-report" style={{ width: '100%', textAlign: 'left', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '24px', borderRadius: '16px' }}>
              <span className="contact-item-report" style={{ fontSize: '13.5px', display: 'block', marginBottom: '12px' }}>
                📍 2nd Floor, Halkatti Icon, 14, Sankey Rd, Sadashiva Nagar, Guttahalli, Bengaluru, Karnataka 560003
              </span>
              <span className="contact-item-report" style={{ fontSize: '13.5px', display: 'block', marginBottom: '12px' }}>
                📞 +91 9845263775
              </span>
              <span className="contact-item-report" style={{ fontSize: '13.5px', display: 'block' }}>
                ✉️ info@infopaceindia.com
              </span>
            </div>
          </div>

          <div className="report-footer">
            <span>Page 7</span>
            <span>infopaceindia.com</span>
          </div>
        </div>

      </div>
    </div>
  )
}
