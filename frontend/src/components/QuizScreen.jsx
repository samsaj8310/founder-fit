import { useState, useMemo } from 'react'
import { QUESTIONS, CATEGORIES } from '../data/questions'

function shuffleArray(array) {
  let shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function QuizScreen({ appState, onComplete, isWaiting }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})

  const shuffledQuestions = useMemo(() => shuffleArray(QUESTIONS), [])

  const q = shuffledQuestions[currentQ]
  const cat = CATEGORIES[q?.cat] || CATEGORIES['Roles']
  const isA = appState.role === 'A'
  const pct = Math.round(((currentQ + 1) / QUESTIONS.length) * 100)
  const letters = ['A', 'B', 'C', 'D']

  const handleSelect = (optIdx) => {
    const newAnswers = { ...answers, [q.id]: optIdx }
    setAnswers(newAnswers)
    setTimeout(() => {
      if (currentQ < shuffledQuestions.length - 1) {
        setCurrentQ(i => i + 1)
      } else {
        onComplete(newAnswers)
      }
    }, 280)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
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
              {isWaiting ? 'Assessment Complete!' : `Dimension: ${q.cat}`}
            </h1>

            <p className="sidebar-desc">
              {isWaiting
                ? 'Your responses have been saved securely. Syncing with your co-founder in real-time...'
                : 'Evaluate your operational alignment across key strategic criteria.'}
            </p>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px', marginTop: '20px' }}>
              <div style={{ fontSize: '11px', color: '#00BFFF', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>ACTIVE RESPONDENT</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{isA ? '🚀' : '🤝'}</span>
                <span>{appState.name || (isA ? 'Founder A' : 'Co-Founder B')} ({isA ? 'Founder A' : 'Co-Founder B'})</span>
              </div>
            </div>
          </div>

          <div className="sidebar-stats">
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-number">{currentQ + 1} / {shuffledQuestions.length}</span>
              <span className="sidebar-stat-label">Questions completed</span>
            </div>
            <div className="sidebar-stat-item">
              <span className="sidebar-stat-number">{pct}%</span>
              <span className="sidebar-stat-label">Overall progress</span>
            </div>
          </div>
        </aside>

        {/* ── RIGHT MAIN WORKSPACE ── */}
        <main className="app-main-workspace">
          {/* Geometric Vector Background */}
          <svg className="workspace-decor-bg" width="320" height="320" viewBox="0 0 100 100" fill="none" stroke="#00A9D6">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" strokeWidth="0.5" />
            <polygon points="50,20 75,35 75,65 50,80 25,65 25,35" strokeWidth="0.5" />
            <line x1="50" y1="5" x2="50" y2="95" strokeWidth="0.5" />
          </svg>

          {/* ── STEP INDICATOR BAR ── */}
          <div className="step-indicator-bar">
            <div className="step-item step-inactive">
              <div className="step-number" style={{ background: '#10B981', color: '#fff' }}>✓</div>
              <span className="step-label" style={{ color: '#0F172A' }}>Personal details</span>
            </div>
            <div className="step-line" style={{ background: '#10B981' }} />
            <div className="step-item step-active">
              <div className="step-number">2</div>
              <span className="step-label">Compatibility quiz</span>
            </div>
            <span className="step-counter-text">{currentQ + 1} / {shuffledQuestions.length}</span>
          </div>

          {/* ── WAITING STATE CARD OR QUESTION CARD ── */}
          {isWaiting ? (
            <div className="form-card-wrapper" style={{ textAlign: 'center', padding: '60px 40px' }}>
              <div className="waiting-pulse" style={{ margin: '0 auto 24px' }} />
              <h2 className="form-card-title">Assessment Complete! 🎉</h2>
              <p className="form-card-sub" style={{ marginBottom: '24px' }}>Your data is secured. Waiting for your co-founder to finish...</p>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0066FF', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '32px' }}>Checking database every 5 seconds...</div>
              <button
                className="btn-submit-action"
                style={{ background: '#0F172A', color: '#fff' }}
                onClick={() => onComplete(answers, true)}
              >
                👁 View My Individual Results
              </button>
            </div>
          ) : (
            <div className="form-card-wrapper" style={{ maxWidth: '760px' }}>
              {/* Progress Bar inside Card */}
              <div style={{ width: '100%', background: '#E2E8F0', height: '6px', borderRadius: '10px', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#0066FF', transition: 'width 0.3s ease' }} />
              </div>

              {/* Card Header: Category & Step */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '8px', background: cat.color + '15', color: cat.color, border: `1px solid ${cat.color}30`, fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  <span>{cat.icon}</span>
                  <span>{q.cat}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0066FF', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Question {currentQ + 1} of {shuffledQuestions.length}
                </span>
              </div>

              {/* Question Text */}
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '24px', fontWeight: 700, color: '#0F172A', lineHeight: 1.35, marginBottom: '28px' }}>
                {q.text}
              </h2>

              {/* Options Grid */}
              <div className="options-grid" style={{ marginBottom: '32px' }}>
                {q.opts.map((opt, i) => (
                  <button
                    key={i}
                    className={`option-btn ${answers[q.id] === i ? (isA ? 'selected-a' : 'selected-b') : ''}`}
                    onClick={() => handleSelect(i)}
                  >
                    <div className="option-letter">{letters[i]}</div>
                    <div style={{ flex: 1 }}>{opt}</div>
                  </button>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
                <button
                  onClick={() => setCurrentQ(i => Math.max(0, i - 1))}
                  disabled={currentQ === 0}
                  style={{ padding: '10px 24px', borderRadius: '8px', background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0F172A', fontWeight: 700, fontSize: '13px', cursor: currentQ === 0 ? 'not-allowed' : 'pointer', opacity: currentQ === 0 ? 0.4 : 1 }}
                >
                  ← Back
                </button>
                <button
                  disabled={answers[q.id] === undefined}
                  onClick={() => {
                    if (currentQ < shuffledQuestions.length - 1) setCurrentQ(i => i + 1)
                    else onComplete(answers)
                  }}
                  style={{ padding: '10px 28px', borderRadius: '8px', background: '#0066FF', border: 'none', color: '#ffffff', fontWeight: 700, fontSize: '13px', cursor: answers[q.id] === undefined ? 'not-allowed' : 'pointer', opacity: answers[q.id] === undefined ? 0.4 : 1 }}
                >
                  {currentQ === shuffledQuestions.length - 1 ? 'Finish Assessment ✓' : 'Next Question →'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

