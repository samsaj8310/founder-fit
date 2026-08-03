import React from 'react'

export default function InfoModal({ onClose }) {
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
          <span className="info-modal-subtitle">CREATIVE INNOVATION INDEX</span>
        </div>

        {/* Body Content - Corporate Info & Stats */}
        <div className="info-modal-body">
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
              The <strong>Creative Innovation Index (CII)</strong> is Infopace's proprietary AI-scored psychometric assessment. It measures creative potential across 5 dimensions — Divergent Thinking, Remote Association, Risk & Openness, Creative Vision, and Real-world Behaviour — generating a personalised innovation profile in ~12 minutes.
            </p>
          </div>

          {/* Connect With Us Section */}
          <div className="info-connect-wrap">
            <h3 className="info-box-title" style={{ marginBottom: '14px' }}>CONNECT WITH US</h3>
            <div className="info-social-buttons">
              
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/infopace-management-pvt-ltd/" target="_blank" rel="noopener noreferrer" className="social-btn social-linkedin">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>

              {/* YouTube */}
              <a href="https://www.youtube.com/@infopace8174" target="_blank" rel="noopener noreferrer" className="social-btn social-youtube">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M23.498 6.163c-.272-.98-1.09-1.755-2.116-2.02C19.516 3.6 12 3.6 12 3.6s-7.516 0-9.382.543C1.59 4.408.773 5.184.5 6.163.076 7.727 0 12 0 12s.076 4.273.5 5.837c.272.98 1.09 1.755 2.116 2.02C4.484 20.4 12 20.4 12 20.4s7.516 0 9.382-.543c1.025-.265 1.843-1.04 2.116-2.02.424-1.564.5-5.837.5-5.837s-.076-4.273-.5-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                YouTube
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/infopace_india/" target="_blank" rel="noopener noreferrer" className="social-btn social-instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Instagram
              </a>

              {/* Facebook */}
              <a href="https://www.facebook.com/Infopace/" target="_blank" rel="noopener noreferrer" className="social-btn social-facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </a>

              {/* X / Twitter */}
              <a href="https://x.com/InfopaceL31094" target="_blank" rel="noopener noreferrer" className="social-btn social-x">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X (Twitter)
              </a>

            </div>
          </div>

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
