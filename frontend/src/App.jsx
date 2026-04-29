import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useProfile } from './hooks/useProfile'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import OnboardingPage from './pages/OnboardingPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  const { user, loading, signOut } = useAuth()
  const { profile, saving, saveProfile } = useProfile(user)
  const [showAuth, setShowAuth] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    if (showAuth) return <AuthPage />
    return <LandingPage onGetStarted={() => setShowAuth(true)} />
  }

  if (!profile.programId) {
    return (
      <OnboardingPage
        initialProfile={profile}
        onComplete={saveProfile}
      />
    )
  }

  return (
    <DashboardPage
      profile={profile}
      user={user}
      onSignOut={signOut}
      saveProfile={saveProfile}
      saving={saving}
    />
  )
}
