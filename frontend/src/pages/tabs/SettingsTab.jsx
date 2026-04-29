import { useState } from 'react'
import { LogOut, Trash2, RefreshCw, Check } from 'lucide-react'
import { PROGRAMS } from '../../data/programs'
import { supabase } from '../../lib/supabase'

export default function SettingsTab({ profile, user, onSave, onSignOut, saving }) {
  const [programId, setProgramId] = useState(profile.programId)
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleSaveProgram() {
    await onSave({ programId })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      await supabase.from('profiles').delete().eq('user_id', user.id)
    } finally {
      await onSignOut()
    }
  }

  return (
    <div className="space-y-4 max-w-lg">

      {/* Account info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Account</h2>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-semibold text-zinc-300">
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="text-sm text-zinc-200">{user?.email}</p>
            <p className="text-xs text-zinc-600 mt-0.5">Signed in with Google</p>
          </div>
        </div>
      </div>

      {/* Change program */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-1">Program track</h2>
        <p className="text-xs text-zinc-600 mb-4">Changing your program re-runs the audit against new requirements.</p>
        <div className="space-y-2 mb-4">
          {PROGRAMS.map(p => (
            <button
              key={p.id}
              onClick={() => setProgramId(p.id)}
              className={`w-full text-left border rounded-xl px-4 py-3 transition-all text-sm ${
                programId === p.id
                  ? 'border-teal-500/60 bg-teal-500/10 text-white'
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-800/30 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{p.name}</span>
                <span className="text-zinc-600 text-xs">{p.totalCredits} cr</span>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={handleSaveProgram}
          disabled={saving || programId === profile.programId}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-all"
        >
          {saved ? <><Check size={14} /> Saved</> : <><RefreshCw size={14} /> Update program</>}
        </button>
      </div>

      {/* Sign out */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-3">Session</h2>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-lg transition-all"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>

      {/* Delete account */}
      <div className="bg-zinc-900 border border-red-900/30 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-white mb-1">Danger zone</h2>
        <p className="text-xs text-zinc-600 mb-4">Deletes all your course data. This cannot be undone.</p>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-800/60 px-4 py-2 rounded-lg transition-all"
          >
            <Trash2 size={14} /> Delete my data
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-500 disabled:bg-zinc-700 text-white font-semibold px-4 py-2 rounded-lg transition-all"
            >
              <Trash2 size={14} /> {deleting ? 'Deleting…' : 'Yes, delete everything'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
