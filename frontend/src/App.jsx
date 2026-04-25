import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useProfile } from './hooks/useProfile'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  const { user, loading, signOut } = useAuth()
  const { profile, saveProfile } = useProfile(user)
  const [showAuth, setShowAuth] = useState(false)
  const [editing, setEditing] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    if (showAuth) return <AuthPage />
    return <LandingPage onGetStarted={() => setShowAuth(true)} />
  }

  if (!profile.programId || editing) {
    return (
      <OnboardingPage
        initialProfile={profile}
        onComplete={async (updates) => {
          await saveProfile(updates)
          setEditing(false)
        }}
      />
    )
  }

  return (
    <DashboardPage
      profile={profile}
      user={user}
      onEdit={() => setEditing(true)}
      onSignOut={signOut}
    />
  )
}
