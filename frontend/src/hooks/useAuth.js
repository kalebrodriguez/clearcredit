import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
const DEV_USER = IS_LOCAL ? { id: 'dev-local', email: 'dev@local' } : null

export function useAuth() {
  const [user, setUser] = useState(DEV_USER)
  const [loading, setLoading] = useState(!IS_LOCAL)

  useEffect(() => {
    if (IS_LOCAL) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })

  const signOut = () => IS_LOCAL ? window.location.reload() : supabase.auth.signOut()

  return { user, loading, signInWithGoogle, signOut }
}
