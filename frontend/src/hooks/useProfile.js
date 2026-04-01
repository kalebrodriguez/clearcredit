import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const DEFAULT_PROFILE = {
  programId: '',
  hccCourses: [],
  usfCourses: [],
  apScores: [],
}

export function useProfile(user) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadProfile = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (data) {
        setProfile({
          programId: data.program_id || '',
          hccCourses: data.hcc_courses || [],
          usfCourses: data.usf_courses || [],
          apScores: data.ap_scores || [],
        })
      }
    } catch {
      // No profile yet — use defaults
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const saveProfile = async (updates) => {
    if (!user) return
    setSaving(true)
    const merged = { ...profile, ...updates }
    setProfile(merged)
    try {
      await supabase.from('profiles').upsert({
        user_id: user.id,
        program_id: merged.programId,
        hcc_courses: merged.hccCourses,
        usf_courses: merged.usfCourses,
        ap_scores: merged.apScores,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
    } finally {
      setSaving(false)
    }
  }

  return { profile, loading, saving, saveProfile, setProfile }
}
