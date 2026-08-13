// Infopace Founder Fit - Multi-User Assessment (2 to 5 Founders)
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
  const [backupState, setBackupState] = useState(null)
  const [appState, setAppState] = useState({
    role: 'A',
    numFounders: 2,
    name: '',
    profile: {},
    sessionId: '',
    answers: {},
    foundersData: {},
    otherData: null,
    history: [],
    paid: false
  })

  // 1. Detect co-founders and hydrate state from Supabase / localStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlSession = params.get('session')
    const urlRole = (params.get('role') || '').toUpperCase()
    
    if (urlSession) {
      const loadSession = async () => {
        try {
          const { data, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('id', urlSession)
            .maybeSingle()

          if (!error && data) {
            const numFounders = data.num_founders || 2
            let role = urlRole && ['A','B','C','D','E'].includes(urlRole) ? urlRole : null

            if (!role) {
              // Auto-assign first available empty slot
              const keys = ['founder_a', 'founder_b', 'founder_c', 'founder_d', 'founder_e']
              const emptyIdx = keys.slice(0, numFounders).findIndex(k => !data[k])
              role = emptyIdx !== -1 ? String.fromCharCode(65 + emptyIdx) : 'B'
            }

            const meKey = `founder_${role.toLowerCase()}`
            const foundersData = {
              founder_a: data.founder_a || null,
              founder_b: data.founder_b || null,
              founder_c: data.founder_c || null,
              founder_d: data.founder_d || null,
              founder_e: data.founder_e || null,
            }

            // Fallback for legacy otherData
            const otherKey = role === 'A' ? 'founder_b' : 'founder_a'

            setAppState(s => ({
              ...s,
              role: role,
              numFounders: numFounders,
              sessionId: urlSession,
              name: data[meKey]?.name || s.name,
              profile: data[meKey]?.profile || s.profile,
              answers: data[meKey]?.answers || s.answers || {},
              foundersData: foundersData,
              otherData: data[otherKey] || null,
              paid: !!(data.founder_a?.paid || data.founder_b?.paid)
            }))

            const requiredKeys = ['founder_a', 'founder_b', 'founder_c', 'founder_d', 'founder_e'].slice(0, numFounders)
            const allAnswered = requiredKeys.every(k => data[k]?.answers && Object.keys(data[k].answers).length > 0)

            if (allAnswered) {
              setScreen(SCREENS.DASHBOARD)
            } else if (data[meKey]?.answers) {
              setScreen(SCREENS.WAITING)
            } else {
              setScreen(SCREENS.PROFILE)
            }
            return
          }
        } catch (e) {
          console.error("Failed to fetch session on mount:", e)
        }

        const validRole = urlRole && ['A','B','C','D','E'].includes(urlRole) ? urlRole : 'B'
        setAppState(s => ({ ...s, role: validRole, sessionId: urlSession }))
      }

      loadSession()
    } else {
      const newSession = generateSessionId()
      setAppState(s => ({ ...s, role: 'A', numFounders: 2, sessionId: newSession }))
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

  const handleGoBackFromHistory = () => {
    if (backupState) {
      setAppState({
        ...backupState.appState,
        isViewingHistory: false
      })
      setScreen(backupState.screen)
      setBackupState(null)
    }
  }

  const handleSelectHistorySession = (sessionData) => {
    const myEmail = appState.profile?.email
    if (!myEmail) return

    // Determine role and datasets
    const isA = sessionData.founder_a?.profile?.email === myEmail
    const me = isA ? sessionData.founder_a : sessionData.founder_b
    const other = isA ? sessionData.founder_b : sessionData.founder_a

    // Back up current state if we are not already viewing history
    if (!appState.isViewingHistory) {
      setBackupState({
        appState: { ...appState },
        screen: screen
      })
    }

    setAppState(s => ({
      ...s,
      role: isA ? 'A' : 'B',
      sessionId: sessionData.id,
      name: me?.name || s.name,
      answers: me?.answers || {},
      profile: me?.profile || {},
      otherData: other || null,
      paid: !!(me?.paid || other?.paid),
      isViewingHistory: true
    }))

    // both or self must have answers to show dashboard
    const hasMyAnswers = me?.answers && Object.keys(me.answers).length > 0
    const hasOtherAnswers = other?.answers && Object.keys(other.answers).length > 0
    
    if (hasMyAnswers || hasOtherAnswers) {
      setScreen(SCREENS.DASHBOARD)
    } else {
      setScreen(SCREENS.QUIZ)
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
            .maybeSingle()

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
                  newState.paid = true
                  if (updates.founder_b) newState.otherData = updates.founder_b
                } else if (updates.founder_b && s.role === 'B') {
                  newState.answers = updates.founder_b.answers
                  newState.profile = updates.founder_b.profile
                  newState.paid = true
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
          .maybeSingle()

        if (pollError) return
        if (data) {
          const numFounders = data.num_founders || appState.numFounders || 2
          const meKey = `founder_${appState.role.toLowerCase()}`
          
          const newFoundersData = {
            founder_a: data.founder_a || null,
            founder_b: data.founder_b || null,
            founder_c: data.founder_c || null,
            founder_d: data.founder_d || null,
            founder_e: data.founder_e || null,
          }

          setAppState(s => ({
            ...s,
            numFounders: numFounders,
            answers: data[meKey]?.answers || s.answers,
            profile: data[meKey]?.profile || s.profile,
            foundersData: newFoundersData,
            otherData: data[s.role === 'A' ? 'founder_b' : 'founder_a'] || s.otherData,
            paid: !!(data.founder_a?.paid || data.founder_b?.paid)
          }))

          const requiredKeys = ['founder_a', 'founder_b', 'founder_c', 'founder_d', 'founder_e'].slice(0, numFounders)
          const allAnswered = requiredKeys.every(k => data[k]?.answers && Object.keys(data[k].answers).length > 0)

          if (screen === SCREENS.WAITING && allAnswered) {
            setScreen(SCREENS.DASHBOARD)
          }
        }
      } catch (e) {
        console.error("Poll error:", e)
      }
    }

    poll()
    const interval = setInterval(poll, 4000)
    return () => clearInterval(interval)
  }, [appState.sessionId, screen, appState.role])

  // 4.5 Safety check: ensure dashboard is shown if user has completed answers
  useEffect(() => {
    if (screen === SCREENS.DASHBOARD) {
      const hasMyAnswers = appState.answers && Object.keys(appState.answers).length > 0
      const hasAnyFoundersData = Object.values(appState.foundersData || {}).some(f => f?.answers && Object.keys(f.answers).length > 0)
      
      if (!hasMyAnswers && !hasAnyFoundersData && !appState.otherData?.answers) {
        setScreen(SCREENS.QUIZ)
      }
    }
  }, [screen, appState.answers, appState.foundersData, appState.otherData])

  const handleSimulateCoFounder = () => {
    const numFounders = appState.numFounders || 2
    const keys = ['founder_a', 'founder_b', 'founder_c', 'founder_d', 'founder_e'].slice(0, numFounders)
    const roleLabels = { A: 'Founder A', B: 'Co-Founder B', C: 'Co-Founder C', D: 'Co-Founder D', E: 'Co-Founder E' }
    
    const updatedFounders = { ...appState.foundersData }
    const myKey = `founder_${appState.role.toLowerCase()}`

    // Ensure my current data is in foundersData
    if (!updatedFounders[myKey] || !updatedFounders[myKey].answers) {
      updatedFounders[myKey] = {
        name: appState.name || roleLabels[appState.role],
        answers: appState.answers && Object.keys(appState.answers).length > 0 ? appState.answers : generateDemoAnswers(),
        profile: appState.profile || {}
      }
    }

    // Fill remaining missing spots with simulated data
    keys.forEach(k => {
      if (!updatedFounders[k] || !updatedFounders[k].answers) {
        const letter = k.split('_')[1].toUpperCase()
        updatedFounders[k] = {
          name: `${roleLabels[letter]} (Simulated)`,
          answers: generateDemoAnswers(),
          profile: { email: `simulated_${letter.toLowerCase()}@demo.com` }
        }
      }
    })

    const otherKey = appState.role === 'A' ? 'founder_b' : 'founder_a'

    setAppState(s => ({
      ...s,
      foundersData: updatedFounders,
      otherData: updatedFounders[otherKey] || null
    }))
    setScreen(SCREENS.DASHBOARD)
  }

  const handleStartAssessment = (profileData) => {
    setAppState(s => ({ ...s, ...profileData }))
    setScreen(SCREENS.QUIZ)
  }

  const handleQuizComplete = async (answers) => {
    const updated = { ...appState, answers }
    setAppState(updated)

    // Save to Supabase
    const key = `founder_${updated.role.toLowerCase()}`
    const payload = { name: updated.name, answers, profile: updated.profile }
    
    try {
      const { error: upsertError } = await supabase
        .from('sessions')
        .upsert({ 
          id: updated.sessionId, 
          num_founders: updated.numFounders || 2,
          [key]: payload 
        }, { onConflict: 'id' })

      if (upsertError) throw upsertError

      const numFounders = updated.numFounders || 2
      const requiredKeys = ['founder_a', 'founder_b', 'founder_c', 'founder_d', 'founder_e'].slice(0, numFounders)
      const currentFounders = { ...updated.foundersData, [key]: payload }
      
      const allAnswered = requiredKeys.every(k => currentFounders[k]?.answers && Object.keys(currentFounders[k].answers).length > 0)

      if (allAnswered) {
        setScreen(SCREENS.DASHBOARD)
      } else {
        setScreen(SCREENS.WAITING)
      }
    } catch (err) {
      setError(`Database Error: ${err.message || 'Verification failed. Please try again.'}`)
      setScreen(SCREENS.WAITING)
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
      {(screen === SCREENS.QUIZ || screen === SCREENS.WAITING) && (
        <QuizScreen 
          appState={appState} 
          onComplete={handleQuizComplete} 
          isWaiting={screen === SCREENS.WAITING} 
          onViewDashboard={() => setScreen(SCREENS.DASHBOARD)}
          onSimulateCoFounder={handleSimulateCoFounder}
        />
      )}
      {screen === SCREENS.DASHBOARD && <Dashboard appState={appState} shareLink={shareLink} onGoBack={handleGoBackFromHistory} />}

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

