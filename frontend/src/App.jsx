import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { useAuth } from './hooks/useAuth'
import { useProfile } from './hooks/useProfile'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'

// DEV ONLY: bypass Google OAuth to preview all screens locally
// Set VITE_DEV_BYPASS=true in .env to enable
function DevApp() {
  const mockUser = { id: 'dev', email: 'dev@test.com' }
  const [profile, setProfile] = useState({ programId: '', hccCourses: [], usfCourses: [], apScores: [] })
  const [editing, setEditing] = useState(true)

  if (!profile.programId || editing) {
    return (
      <>
        <OnboardingPage
          initialProfile={profile}
          onComplete={updates => { setProfile(updates); setEditing(false) }}
        />
        <Analytics />
      </>
    )
  }
  return (
    <>
      <DashboardPage
        profile={profile}
        user={mockUser}
        onEdit={() => setEditing(true)}
        onSignOut={() => { setProfile({ programId: '', hccCourses: [], usfCourses: [], apScores: [] }); setEditing(true) }}
      />
      <Analytics />
    </>
  )
}

export default function App() {
  const { user, loading, signOut } = useAuth()
  const { profile, saveProfile } = useProfile(user)
  const [showAuth, setShowAuth] = useState(false)
  const [editing, setEditing] = useState(false)

  if (import.meta.env.VITE_DEV_BYPASS === 'true') return <DevApp />

  if (loading) {
    return (
      <>
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <Analytics />
      </>
    )
  }

  if (!user) {
    if (showAuth) return (
      <>
        <AuthPage />
        <Analytics />
      </>
    )
    return (
      <>
        <LandingPage onGetStarted={() => setShowAuth(true)} />
        <Analytics />
      </>
    )
  }

  if (!profile.programId || editing) {
    return (
      <>
        <OnboardingPage
          initialProfile={profile}
          onComplete={async (updates) => {
            await saveProfile(updates)
            setEditing(false)
          }}
        />
        <Analytics />
      </>
    )
  }

  return (
    <>
      <DashboardPage
        profile={profile}
        user={user}
        onEdit={() => setEditing(true)}
        onSignOut={signOut}
      />
      <Analytics />
    </>
  )
}
