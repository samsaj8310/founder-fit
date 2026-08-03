import { useState, useEffect } from 'react'
import ProfileScreen from './components/ProfileScreen'
import QuizScreen from './components/QuizScreen'
import Dashboard from './components/Dashboard'
import CustomCursor from './components/CustomCursor'
import InfoModal from './components/InfoModal'
import { generateSessionId, generateDemoAnswers } from './utils/scoring'
import { supabase } from './utils/supabase'

const SCREENS = { PROFILE: 'profile', QUIZ: 'quiz', WAITING: 'waiting', DASHBOARD: 'dashboard' }

export default function App() {
  const [screen, setScreen] = useState(SCREENS.PROFILE)
  const [error, setError] = useState(null)
  const [infoOpen, setInfoOpen] = useState(false)
  const [appState, setAppState] = useState({
    role: 'A',
    name: '',
    profile: {},
    sessionId: '',
    answers: {},
    otherData: null,
    history: []
  })

  // 1. Detect co-founder B and hydrate state from localStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlSession = params.get('session')
    
    if (urlSession) {
      const saved = localStorage.getItem(`foundersync_${urlSession}`)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setAppState(parsed.appState)
          setScreen(parsed.screen)
          return
        } catch (e) {
          console.error("Failed to parse saved state", e)
        }
      }
      setAppState(s => ({ ...s, role: 'B', sessionId: urlSession }))
    } else {
      const newSession = generateSessionId()
      setAppState(s => ({ ...s, role: 'A', sessionId: newSession }))
    }
  }, [])

  const fetchUserHistory = async (email) => {
    if (!email) return
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .or(`founder_a->profile->>email.eq.${email},founder_b->profile->>email.eq.${email}`)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) {
        setAppState(s => ({ ...s, history: data }))
      }
    } catch (e) {
      console.error("Failed to fetch assessment history:", e)
    }
  }

  const handleSelectHistorySession = (sessionData) => {
    const myEmail = appState.profile?.email
    if (!myEmail) return

    // Determine role and datasets
    const isA = sessionData.founder_a?.profile?.email === myEmail
    const me = isA ? sessionData.founder_a : sessionData.founder_b
    const other = isA ? sessionData.founder_b : sessionData.founder_a

    setAppState(s => ({
      ...s,
      role: isA ? 'A' : 'B',
      sessionId: sessionData.id,
      name: me?.name || s.name,
      answers: me?.answers || {},
      profile: me?.profile || {},
      otherData: other || null
    }))

    if (me && other) {
      setScreen(SCREENS.DASHBOARD)
    } else {
      setScreen(SCREENS.WAITING)
    }
  }

  // 1.5 Get current active Supabase Auth user (e.g. returning from Google login)
  useEffect(() => {
    const handleAuthSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const user = session.user
          const name = user.user_metadata?.full_name || user.user_metadata?.name || ''
          const email = user.email || ''
          setAppState(s => ({
            ...s,
            name: s.name || name,
            profile: {
              ...s.profile,
              name: s.profile.name || name,
              email: s.profile.email || email
            }
          }))
          fetchUserHistory(email)
        }
      } catch (e) {
        console.error("Auth session fetch error:", e)
      }
    }

    handleAuthSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user = session.user
        const name = user.user_metadata?.full_name || user.user_metadata?.name || ''
        const email = user.email || ''
        setAppState(s => ({
          ...s,
          name: s.name || name,
          profile: {
            ...s.profile,
            name: s.profile.name || name,
            email: s.profile.email || email
          }
        }))
        fetchUserHistory(email)
      } else {
        setAppState(s => ({ ...s, history: [] }))
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2. Persist state changes to localStorage
  useEffect(() => {
    if (appState.sessionId) {
      localStorage.setItem(`foundersync_${appState.sessionId}`, JSON.stringify({
        appState,
        screen
      }))
    }
  }, [appState, screen])

  // 3. Detect payment success and update Supabase database
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paymentSuccess = params.get('payment') === 'success'
    const sessionId = params.get('session') || appState.sessionId

    if (sessionId && paymentSuccess) {
      const updatePaymentInDb = async () => {
        try {
          const { data, error: fetchErr } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', sessionId)
            .single()

          if (fetchErr) throw fetchErr
          if (data) {
            const updates = {}
            if (data.founder_a) {
              updates.founder_a = { ...data.founder_a, paid: true }
            }
            if (data.founder_b) {
              updates.founder_b = { ...data.founder_b, paid: true }
            }
            
            if (Object.keys(updates).length > 0) {
              const { error: updateErr } = await supabase
                .from('sessions')
                .update(updates)
                .eq('id', sessionId)

              if (updateErr) throw updateErr
              console.log('Successfully updated paid status in DB.')
              
              // Force state updates so the dashboard updates immediately
              setAppState(s => {
                const newState = { ...s }
                if (updates.founder_a && s.role === 'A') {
                  newState.answers = updates.founder_a.answers
                  newState.profile = updates.founder_a.profile
                  if (updates.founder_b) newState.otherData = updates.founder_b
                } else if (updates.founder_b && s.role === 'B') {
                  newState.answers = updates.founder_b.answers
                  newState.profile = updates.founder_b.profile
                  if (updates.founder_a) newState.otherData = updates.founder_a
                }
                return newState
              })
            }
          }
        } catch (err) {
          console.error('Error setting paid status:', err)
          setError(`Failed to process payment validation: ${err.message || err}`)
        } finally {
          // Remove query param from url
          const newParams = new URLSearchParams(window.location.search)
          newParams.delete('payment')
          const newUrl = window.location.pathname + (newParams.toString() ? '?' + newParams.toString() : '')
          window.history.replaceState({}, document.title, newUrl)
        }
      }
      updatePaymentInDb()
    }
  }, [appState.sessionId])

  // 4. Declarative session polling
  useEffect(() => {
    if (!appState.sessionId || screen === SCREENS.PROFILE || screen === SCREENS.QUIZ) return

    const poll = async () => {
      try {
        const { data, error: pollError } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', appState.sessionId)
          .single()

        if (pollError) return
        if (data) {
          const isA = appState.role === 'A'
          const meKey = isA ? 'founder_a' : 'founder_b'
          const otherKey = isA ? 'founder_b' : 'founder_a'

          if (data[otherKey] && data[otherKey].answers) {
            setAppState(s => {
              const otherChanged = JSON.stringify(s.otherData) !== JSON.stringify(data[otherKey])
              const meChanged = JSON.stringify(s.answers) !== JSON.stringify(data[meKey]?.answers)
              if (otherChanged || meChanged) {
                return { 
                  ...s, 
                  answers: data[meKey]?.answers || s.answers,
                  profile: data[meKey]?.profile || s.profile,
                  otherData: data[otherKey] 
                }
              }
              return s
            })

            if (screen === SCREENS.WAITING && data[meKey]?.answers && data[otherKey]?.answers) {
              setScreen(SCREENS.DASHBOARD)
            }
          }
        }
      } catch (e) {
        console.error("Poll error:", e)
      }
    }

    poll()
    const interval = setInterval(poll, 5000)
    return () => clearInterval(interval)
  }, [appState.sessionId, screen, appState.role])

  // 4.5 Safety check: ensure dashboard is only shown when both users have completed the test
  useEffect(() => {
    if (screen === SCREENS.DASHBOARD) {
      const hasMyAnswers = appState.answers && Object.keys(appState.answers).length > 0
      const hasOtherAnswers = appState.otherData?.answers && Object.keys(appState.otherData.answers).length > 0
      
      if (!hasMyAnswers) {
        setScreen(SCREENS.QUIZ)
      } else if (!hasOtherAnswers) {
        setScreen(SCREENS.WAITING)
      }
    }
  }, [screen, appState.answers, appState.otherData])


  const handleStartAssessment = (profileData) => {
    setAppState(s => ({ ...s, ...profileData }))
    setScreen(SCREENS.QUIZ)
  }

  const handleQuizComplete = async (answers, forceDashboard = false) => {
    const updated = { ...appState, answers }
    setAppState(updated)

    if (forceDashboard) {
      setScreen(SCREENS.DASHBOARD)
    }

    // Save to Supabase
    const key = updated.role === 'A' ? 'founder_a' : 'founder_b'
    const payload = { name: updated.name, answers, profile: updated.profile }
    
    try {
      const { error: upsertError } = await supabase.from('sessions').upsert({ id: updated.sessionId, [key]: payload }, { onConflict: 'id' })
      if (upsertError) throw upsertError
      
      if (!forceDashboard) {
        setScreen(SCREENS.WAITING)
      }
    } catch (err) {
      setError(`Database Error: ${err.message || 'Verification failed. Please try again.'}`)
    }
  }

  const shareLink = `${window.location.origin}${window.location.pathname}?session=${appState.sessionId}`

  return (
    <>
      <CustomCursor />
      <div className="app-bg-glow" />
      {error && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, background: '#ef4444', color: '#fff',
          padding: '12px 24px', textAlign: 'center', zIndex: 9999, fontWeight: 700,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          ⚠️ {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '16px', background: 'transparent', border: '1px solid #fff', color: '#fff', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px' }}>Dismiss</button>
        </div>
      )}
      {screen === SCREENS.PROFILE && (
        <ProfileScreen 
          appState={appState} 
          setAppState={setAppState} 
          shareLink={shareLink} 
          onStart={handleStartAssessment} 
          history={appState.history || []}
          onSelectHistory={handleSelectHistorySession}
        />
      )}
      {(screen === SCREENS.QUIZ || screen === SCREENS.WAITING) && <QuizScreen appState={appState} onComplete={handleQuizComplete} isWaiting={screen === SCREENS.WAITING} />}
      {screen === SCREENS.DASHBOARD && <Dashboard appState={appState} shareLink={shareLink} />}

      {screen !== SCREENS.PROFILE && (
        <button className="global-menu-btn" onClick={() => setInfoOpen(true)} aria-label="Open Information Menu">
          <div className="menu-bar" />
          <div className="menu-bar" />
          <div className="menu-bar" />
        </button>
      )}

      {infoOpen && (
        <InfoModal 
          onClose={() => setInfoOpen(false)} 
          history={appState.history || []}
          onSelectHistory={(session) => {
            handleSelectHistorySession(session)
            setInfoOpen(false)
          }}
          appState={appState}
        />
      )}
    </>
  )
}

