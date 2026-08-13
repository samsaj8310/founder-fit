import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { computeScores } from '../utils/scoring'

export default function ProfileScreen({ appState, setAppState, shareLink, onStart, history = [], onSelectHistory }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', roleType: 'Founder' })
  const [copied, setCopied] = useState(false)

  const isB = appState.role === 'B'

  // Sync form state if appState profile is loaded (e.g. from Google auth)
  useEffect(() => {
    if (appState.profile?.email || appState.profile?.name) {
      setForm(f => ({
        ...f,
        name: appState.profile.name || f.name,
        email: appState.profile.email || f.email
      }))
    }
  }, [appState.profile])

  // Automatically fetch history when user types manually or syncs their email address
  useEffect(() => {
    if (form.email && form.email.includes('@')) {
      const delayDebounce = setTimeout(async () => {
        try {
          const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .or(`founder_a->profile->>email.eq.${form.email},founder_b->profile->>email.eq.${form.email}`)
            .order('created_at', { ascending: false })
          
          if (!error && data) {
            setAppState(s => ({ ...s, history: data }))
          }
        } catch (e) {
          console.error("Failed to load history for email:", e)
        }
      }, 600) // debounce 600ms
      return () => clearTimeout(delayDebounce)
    } else {
      setAppState(s => ({ ...s, history: [] }))
    }
  }, [form.email])

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.href
        }
      })
      if (error) throw error
    } catch (e) {
      alert(`Google Sign-In failed: ${e.message || e}`)
    }
  }

  const getCompatibilityScore = (session) => {
    if (session.founder_a?.answers && session.founder_b?.answers) {
      const { overall } = computeScores(session.founder_a.answers, session.founder_b.answers)
      return `${overall}% Match`
    }
    return 'Pending Partner'
  }

  // Extract clean digits for phone counter
  const digitsStr = form.phone.replace(/\D/g, '')
  const displayDigits = digitsStr.startsWith('91') && digitsStr.length === 12
    ? digitsStr.substring(2)
    : (digitsStr.startsWith('0') && digitsStr.length === 11 ? digitsStr.substring(1) : digitsStr)
  const phoneDigitCount = Math.min(displayDigits.length, 10)

  const handleStart = () => {
    if (!form.name.trim()) { alert('Please enter your full name.'); return }
    
    if (!form.email || !form.email.includes('@')) {
      alert('Please enter a valid email address containing an "@" symbol.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(displayDigits)) {
      alert('Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9.');
      return;
    }

    onStart({ name: form.name, profile: form })
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* ── TOP NAV HEADER ── */}
      <header className="app-top-header">
        <div className="top-header-left">
          <div className="top-logo-badge">
            <img src="/logo.png" alt="Infopace" className="top-logo-img" />
          </div>
          <span className="top-header-title">INFOPACE MANAGEMENT PVT LTD</span>
          <span className="top-header-sub">FOUNDER COMPATIBILITY ASSESSMENT</span>
        </div>
        <div className="top-header-right">
          <div className="live-badge">
            <div className="live-dot" />
            LIVE ANALYSIS
          </div>
        </div>
      </header>

      {/* ── SPLIT LAYOUT ── */}
      <div className="app-split-layout">
        {/* ── INCREASED WIDTH DARK SIDEBAR (420px) ── */}
        <aside className="app-sidebar">
          <div>
            <div className="sidebar-brand-card">
              <img src="/logo.png" alt="Infopace" className="sidebar-logo-img" />
            </div>

            <div className="sidebar-tag">FOUNDER COMPATIBILITY ASSESSMENT</div>
            
            <h1 className="sidebar-headline">
              Know your founder fit before you build together.
            </h1>

            <p className="sidebar-desc">
              Our engine maps your vision, leadership, resilience, and equity alignment — then surfaces a personalized intelligence brief within minutes.
            </p>

            <div className="sidebar-features-list">
              <div className="sidebar-feature-item">
                <span className="sidebar-feature-icon">🔍</span>
                <div className="sidebar-feature-text">
                  <strong>Identify Partnership Risks</strong>
                  <p>Pinpoint potential gaps and conflicts before they affect your business.</p>
                </div>
              </div>
              <div className="sidebar-feature-item">
                <span className="sidebar-feature-icon">⚡</span>
                <div className="sidebar-feature-text">
                  <strong>Co-Founder Sync</strong>
                  <p>Work together in real-time to compare answers and view live analytics.</p>
                </div>
              </div>
              <div className="sidebar-feature-item">
                <span className="sidebar-feature-icon">🛡️</span>
                <div className="sidebar-feature-text">
                  <strong>Secure & Confidential</strong>
                  <p>Your data and profiles are protected and only shared with your co-founder.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-stats">
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-number">3×</span>
              <span className="sidebar-stat-label">Faster than traditional co-founder alignment</span>
            </div>
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-number">50+</span>
              <span className="sidebar-stat-label">Data points analysed per assessment</span>
            </div>
          </div>
        </aside>

        {/* ── RIGHT MAIN WORKSPACE ── */}
        <main className="app-main-workspace">
          {/* Subtle Geometric Vector Background */}
          <svg className="workspace-decor-bg" width="320" height="320" viewBox="0 0 100 100" fill="none" stroke="#00A9D6">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" strokeWidth="0.5" />
            <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" strokeWidth="0.5" />
            <line x1="50" y1="5" x2="50" y2="95" strokeWidth="0.5" />
            <line x1="10" y1="25" x2="90" y2="75" strokeWidth="0.5" />
            <line x1="10" y1="75" x2="90" y2="25" strokeWidth="0.5" />
          </svg>

          {/* ── STEP INDICATOR BAR ── */}
          <div className="step-indicator-bar">
            <div className="step-item step-active">
              <div className="step-number">1</div>
              <span className="step-label">Personal details</span>
            </div>
            <div className="step-line" />
            <div className="step-item step-inactive">
              <div className="step-number">2</div>
              <span className="step-label">Compatibility quiz</span>
            </div>
            <span className="step-counter-text">1 / 2</span>
          </div>

          {/* ── FORM CARD ── */}
          <div className="form-card-wrapper">
            <div className="form-card-header">
              <h2 className="form-card-title">Personal details</h2>
              <p className="form-card-sub">Stored securely. Never shared.</p>
            </div>

            <div className="google-auth-section">
              <button className="google-auth-btn" onClick={handleGoogleLogin}>
                <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
              <div className="auth-divider">
                <span>or enter manually</span>
              </div>
            </div>

            <div className="aligned-form-grid">
              {/* Row 1: Full Name & Email */}
              <div className="form-field-row">
                <div className="aligned-field">
                  <label>FULL NAME *</label>
                  <input
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="aligned-field">
                  <label>EMAIL *</label>
                  <input
                    type="email"
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

              {/* Row 2: Organization & Role */}
              <div className="form-field-row">
                <div className="aligned-field">
                  <label>ORGANIZATION *</label>
                  <input
                    placeholder="Acme Technologies"
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  />
                </div>
                <div className="aligned-field">
                  <label>DESIGNATION / ROLE *</label>
                  <select
                    value={form.roleType}
                    onChange={e => setForm(f => ({ ...f, roleType: e.target.value }))}
                  >
                    <option value="Founder">Co-Founder / CEO</option>
                    <option value="CTO">CTO / Tech Lead</option>
                    <option value="COO">COO / Operations Lead</option>
                    <option value="CPO">CPO / Product Lead</option>
                    <option value="Other">Other / Advisor</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Phone Number with Country Dropdown & 0/10 Counter */}
              <div className="aligned-field">
                <label>PHONE *</label>
                <div className="phone-input-wrap">
                  <div className="country-select-box">
                    <span className="country-flag">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    className="phone-native-input"
                    placeholder="9876543210"
                    maxLength={14}
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                  <span className={`phone-digit-counter ${phoneDigitCount === 10 ? 'complete' : ''}`}>
                    {phoneDigitCount}/10
                  </span>
                </div>
                <span className="field-help-text">India: 10 digits, starts 6–9</span>
              </div>

              {/* Row 4: Number of Users Taking Assessment */}
              <div className="aligned-field" style={{ marginTop: '8px' }}>
                <label>NUMBER OF USERS TAKING ASSESSMENT *</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginTop: '6px' }}>
                  <select
                    value={appState.numFounders || 2}
                    onChange={e => {
                      const count = parseInt(e.target.value, 10)
                      setAppState(s => ({ ...s, numFounders: count }))
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '2px solid #0066FF',
                      background: '#F0F7FF',
                      color: '#0066FF',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: 'pointer',
                      minWidth: '160px',
                      outline: 'none'
                    }}
                  >
                    <option value={2}>👥 2 Users (Founders)</option>
                    <option value={3}>👥 3 Users (Founders)</option>
                    <option value={4}>👥 4 Users (Founders)</option>
                    <option value={5}>👥 5 Users (Founders)</option>
                  </select>

                  <div style={{ display: 'flex', gap: '8px', flex: 1, flexWrap: 'wrap' }}>
                    {[2, 3, 4, 5].map((count) => {
                      const activeCount = appState.numFounders || 2
                      const isSelected = activeCount === count
                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setAppState(s => ({ ...s, numFounders: count }))}
                          style={{
                            flex: 1,
                            minWidth: '60px',
                            padding: '10px 8px',
                            borderRadius: '10px',
                            border: isSelected ? '2px solid #0066FF' : '1px solid #E2E8F0',
                            background: isSelected ? '#0066FF' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : '#475569',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontSize: '13px'
                          }}
                        >
                          {count} Users
                        </button>
                      )
                    })}
                  </div>
                </div>
                <span className="field-help-text">Select how many founders/co-founders are taking this assessment together (2 to 5 users).</span>
              </div>

              {/* Row 5: Founder Role Selector Cards */}
              <div className="aligned-field" style={{ marginTop: '8px' }}>
                <label>YOUR SESSION ROLE</label>
                <div className="role-cards-grid">
                  {[
                    { id: 'A', label: 'Founder A', icon: '🚀', hint: 'Start assessment' },
                    { id: 'B', label: 'Co-Founder B', icon: '🤝', hint: 'Join session' },
                    { id: 'C', label: 'Co-Founder C', icon: '⚡', hint: 'Join session' },
                    { id: 'D', label: 'Co-Founder D', icon: '🎯', hint: 'Join session' },
                    { id: 'E', label: 'Co-Founder E', icon: '🌟', hint: 'Join session' },
                  ].slice(0, appState.numFounders || 2).map((r) => (
                    <div
                      key={r.id}
                      className={`founder-role-card ${appState.role === r.id ? 'selected-a' : ''}`}
                      onClick={() => setAppState(s => ({ ...s, role: r.id }))}
                    >
                      <div className="role-card-icon-wrap">{r.icon}</div>
                      <div className="role-card-info">
                        <span className="role-card-name">{r.label}</span>
                        <span className="role-card-hint">{r.hint}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Co-Founder Shareable Link if Co-Founder B/C/D/E */}
              {appState.role !== 'A' ? (
                <div className="session-joined-badge" style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '14px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>🤝</span>
                  <span>Joining session as <strong>Co-Founder {appState.role}</strong> (Linked with {appState.otherData?.name ? <strong>{appState.otherData.name}</strong> : 'Founder A'})</span>
                </div>
              ) : (
                <div className="share-box" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '16px', borderRadius: '12px' }}>
                  <label style={{ color: '#0066FF', fontWeight: 800 }}>📎 INVITE LINKS — SHARE WITH YOUR TEAM ({appState.numFounders || 2} MEMBERS)</label>
                  
                  {/* Master Link */}
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>MASTER LINK (Auto-assigns joining co-founders):</div>
                    <div className="share-row">
                      <input readOnly value={shareLink} />
                      <button onClick={copyLink}>{copied ? '✓ Copied!' : 'Copy Master Link'}</button>
                    </div>
                  </div>

                  {/* Individual Role Links */}
                  {(appState.numFounders || 2) >= 2 && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>OR SHARE INDIVIDUAL ROLE LINKS:</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['B', 'C', 'D', 'E'].slice(0, (appState.numFounders || 2) - 1).map((roleChar) => {
                          const roleUrl = `${shareLink}&role=${roleChar}`
                          return (
                            <button
                              key={roleChar}
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(roleUrl)
                                alert(`Copied invite link for Co-Founder ${roleChar}!`)
                              }}
                              style={{
                                flex: 1,
                                minWidth: '120px',
                                padding: '8px 12px',
                                background: '#FFFFFF',
                                border: '1px solid #CBD5E1',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#334155',
                                cursor: 'pointer'
                              }}
                            >
                              📋 Co-Founder {roleChar} Link
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button className="btn-submit-action" onClick={handleStart}>
                Continue →
              </button>
            </div>
          </div>

          {!isB && history.length > 0 && (
            <div className="history-card-wrapper" style={{ marginTop: '24px' }}>
              <div className="form-card-header">
                <h2 className="form-card-title">Your Past Assessments</h2>
                <p className="form-card-sub">Access your existing synergy dashboards and pending reports.</p>
              </div>

              <div className="history-list">
                {history.map((session) => {
                  const isA = session.founder_a?.profile?.email === appState.profile?.email
                  const other = isA ? session.founder_b : session.founder_a
                  
                  const dateStr = new Date(session.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                  
                  const partnerName = other?.name || 'Pending Co-Founder'
                  const isComplete = !!(session.founder_a && session.founder_b)
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
        </main>
      </div>
    </div>
  )
}

