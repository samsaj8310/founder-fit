import React, { useState } from 'react'
import { computeScores } from '../utils/scoring'

export default function InfoModal({ onClose, history = [], onSelectHistory, appState }) {
  const [activeTab, setActiveTab] = useState('overview')

  const getCompatibilityScore = (session) => {
    if (session.founder_a?.answers && session.founder_b?.answers) {
      const { overall } = computeScores(session.founder_a.answers, session.founder_b.answers)
      return `${overall}% Match`
    }
    return 'Pending Partner'
  }

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal-card" onClick={e => e.stopPropagation()}>
        
        {/* Header - Deep Blue with Logo & Subtitle */}
        <div className="info-modal-header-bg">
          <button className="info-modal-close-x" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="info-modal-logo-wrap">
            <img src="/logo.png" alt="Infopace" className="info-modal-logo-img" />
          </div>
          <span className="info-modal-subtitle">FOUNDER COMPATIBILITY ASSESSMENT</span>
        </div>

        {/* Navigation Tabs */}
        <div className="info-modal-tabs">
          <button 
            className={`info-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`info-tab-btn ${activeTab === 'legal' ? 'active' : ''}`}
            onClick={() => setActiveTab('legal')}
          >
            Terms & Policies
          </button>
          {history.length > 0 && (
            <button 
              className={`info-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              History ({history.length})
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="info-modal-body">
          {activeTab === 'overview' ? (
            <>
              <h2 className="info-body-title">
                INDIA'S FIRST STRATEGIC CHANGE MANAGEMENT COMPANY
              </h2>
              
              <p className="info-body-text">
                <strong>Infopace Management Pvt. Ltd.</strong> has been a trusted partner for organizations navigating transformation, delivering value through deep expertise, behavioural science, AI-driven innovation, people-centric solutions, and scalable SaaS platforms. We assist organizations accelerate innovation, build leadership capability, streamline operations with intelligent technologies, and achieve measurable business outcomes while empowering individuals and strengthening organizations.
              </p>

              {/* Stats Grid */}
              <div className="info-stats-grid">
                <div className="info-stat-card">
                  <span className="info-stat-num">25+</span>
                  <span className="info-stat-label">Years of Impact</span>
                </div>
                <div className="info-stat-card">
                  <span className="info-stat-num">850+</span>
                  <span className="info-stat-label">Delighted Clients</span>
                </div>
                <div className="info-stat-card">
                  <span className="info-stat-num">7000+</span>
                  <span className="info-stat-label">Business Projects</span>
                </div>
              </div>

              {/* About This Tool Section */}
              <div className="info-section-box">
                <h3 className="info-box-title">ABOUT THIS TOOL</h3>
                <p className="info-box-text">
                  The <strong>Founder & Co-Founder Compatibility Assessment</strong> is Infopace's proprietary AI-driven psychometric and strategic alignment engine. It measures operational and vision alignment across 7 core dimensions — Roles & Responsibilities, Growth Strategy, Market Approach, Leadership Style, Resilience, Conflict Resolution, and Equity Mindset. Supporting 2 to 5 participating founders, the platform computes pairwise compatibility matrices and generates a real-time synergy dashboard and investor-ready intelligence report in ~10 minutes.
                </p>
              </div>

              {/* Core Suite Section */}
              <div className="info-section-box">
                <h3 className="info-box-title">INFOPACE AI ASSESSMENT SUITE</h3>
                <p className="info-box-text" style={{ fontSize: '12.5px' }}>
                  Infopace empowers entrepreneurs, venture builders, and enterprise leadership teams to evaluate partnership viability, identify strategic growth opportunities, and mitigate operational risks:
                </p>
                <ul style={{ paddingLeft: '18px', marginTop: '8px', fontSize: '12.5px', color: '#475569', lineHeight: '1.6' }}>
                  <li><strong>Founder & Co-Founder Compatibility Fit</strong>: Evaluates pairwise operational synergy, leadership dynamics, equity mindsets, and conflict risk across 2–5 co-founders.</li>
                  <li><strong>Market Research & Demand Assessment</strong>: Validates market demand, customer ICP, and competitive differentiation.</li>
                  <li><strong>Market Potential & Commercial Viability</strong>: Evaluates scalability, TAM/SAM market size, and revenue potential.</li>
                  <li><strong>Creative Innovation Index (CII)</strong>: Measures individual and organizational innovation capabilities.</li>
                  <li><strong>Business & Operational Risk Assessment</strong>: Identifies strategic, financial, governance, and operational risks.</li>
                </ul>
              </div>

              {/* Connect With Us Section */}
              <div className="info-connect-wrap">
                <h3 className="info-box-title" style={{ marginBottom: '14px' }}>CONNECT WITH US</h3>
                <div className="info-social-buttons">
                  <a href="https://www.linkedin.com/company/infopace-management-pvt-ltd/" target="_blank" rel="noopener noreferrer" className="social-btn social-linkedin">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>

                  <a href="https://www.youtube.com/@infopace8174" target="_blank" rel="noopener noreferrer" className="social-btn social-youtube">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M23.498 6.163c-.272-.98-1.09-1.755-2.116-2.02C19.516 3.6 12 3.6 12 3.6s-7.516 0-9.382.543C1.59 4.408.773 5.184.5 6.163.076 7.727 0 12 0 12s.076 4.273.5 5.837c.272.98 1.09 1.755 2.116 2.02C4.484 20.4 12 20.4 12 20.4s7.516 0 9.382-.543c1.025-.265 1.843-1.04 2.116-2.02.424-1.564.5-5.837.5-5.837s-.076-4.273-.5-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </a>

                  <a href="https://www.instagram.com/infopace_india/" target="_blank" rel="noopener noreferrer" className="social-btn social-instagram">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                    Instagram
                  </a>

                  <a href="https://www.facebook.com/Infopace/" target="_blank" rel="noopener noreferrer" className="social-btn social-facebook">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>

                  <a href="https://x.com/InfopaceL31094" target="_blank" rel="noopener noreferrer" className="social-btn social-x">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X (Twitter)
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="legal-content-wrap">
              <div className="info-section-box">
                <h3 className="info-box-title" style={{ color: '#D97706' }}>DISCLAIMER</h3>
                <p className="info-box-text" style={{ fontSize: '13px' }}>
                  The AI-generated assessment report is intended for informational and decision-support purposes only. Results are based on the information provided by the user and AI-driven analysis and should not be considered legal, financial, investment, or professional advice. Users are encouraged to validate critical decisions with relevant experts before taking action.
                </p>
              </div>

              <div className="info-section-box">
                <h3 className="info-box-title" style={{ color: '#16A34A' }}>PRIVACY POLICY</h3>
                <p className="info-box-text" style={{ fontSize: '13px' }}>
                  All information shared during the assessment is handled with confidentiality and used solely for generating personalized assessment reports and improving the quality of the assessment platform. User data is processed securely and is not shared with third parties without consent, except where required by applicable law.
                </p>
              </div>

              <div className="info-section-box">
                <h3 className="info-box-title" style={{ color: '#2563EB' }}>TERMS & CONDITIONS</h3>
                <p className="info-box-text" style={{ fontSize: '12.5px' }}>
                  By using Infopace's AI-powered assessment tools, users acknowledge that the assessment results are generated based on the information they provide and the AI-driven evaluation methodology. The reports are intended to support decision-making and should not be considered a substitute for professional legal, financial, or business advice.
                </p>
                <p className="info-box-text" style={{ fontSize: '12.5px', marginTop: '8px' }}>
                  Users are responsible for ensuring the accuracy of the information submitted and for any decisions or actions taken based on the report. Infopace does not guarantee specific business outcomes or success resulting from the recommendations provided. All assessment content, methodologies, reports, and related intellectual property remain the exclusive property of Infopace and may not be copied, reproduced, modified, or distributed without prior written consent. Infopace reserves the right to update, modify, or discontinue the assessment tools, methodologies, and these terms at any time without prior notice.
                </p>
              </div>

              <div className="info-section-box">
                <h3 className="info-box-title">CORPORATE HEADQUARTERS</h3>
                <p className="info-box-text" style={{ fontSize: '13px' }}>
                  <strong>Address:</strong> 2nd Floor, Halkatti Icon, 14, Sankey Rd, Sadashiva Nagar, Guttahalli, Bengaluru, Karnataka 560003<br/>
                  <strong>Phone:</strong> +91 9845263775<br/>
                  <strong>Email:</strong> info@infopaceindia.com
                </p>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="info-scroll-body">
              <div className="history-list" style={{ marginTop: 0, maxHeight: 'none' }}>
                {history.map((session) => {
                  const isA = session.founder_a?.profile?.email === appState.profile?.email
                  const other = isA ? session.founder_b : session.founder_a
                  
                  const dateStr = new Date(session.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                  
                  const partnerName = other?.name || 'Pending Co-Founder'
                  const isComplete = !!(session.founder_a?.answers && session.founder_b?.answers)
                  const scoreText = getCompatibilityScore(session)
                  
                  return (
                    <div key={session.id} className="history-item">
                      <div className="history-item-details">
                        <div className="history-item-primary">
                          <span className="history-item-partner">👥 {partnerName}</span>
                          <span className={`history-badge ${isComplete ? 'badge-complete' : 'badge-pending'}`}>
                            {scoreText}
                          </span>
                        </div>
                        <div className="history-item-meta">
                          <span>📅 {dateStr}</span>
                          <span className="history-meta-divider">|</span>
                          <span>Session: {session.id.substring(0, 8)}...</span>
                        </div>
                      </div>
                      
                      <button 
                        className="history-action-btn"
                        onClick={() => onSelectHistory(session)}
                      >
                        {isComplete ? 'View Report 👁️' : 'Resume Setup ⚡'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Footer Copyright & Link */}
          <div className="info-footer-divider" />
          <div className="info-modal-footer">
            <span className="info-footer-copyright">© 2026 INFOPACE MANAGEMENT PVT LTD</span>
            <a href="https://infopaceindia.com" target="_blank" rel="noopener noreferrer" className="info-footer-link">
              infopaceindia.com →
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
