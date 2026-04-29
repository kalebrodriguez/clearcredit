import { useState, useEffect } from 'react'
import { Edit2, LogOut, BookOpen, CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react'
import { runAudit } from '../lib/audit'
import RequirementRow from '../components/RequirementRow'

export default function DashboardPage({ profile, user, onEdit, onSignOut }) {
  const [audit, setAudit] = useState(null)

  useEffect(() => {
    if (!profile.programId) return
    const result = runAudit(
      profile.programId,
      profile.hccCourses,
      profile.usfCourses,
      profile.apScores,
    )
    setAudit(result)
  }, [profile])

  if (!profile.programId) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4 text-sm">No program selected yet.</p>
          <button onClick={onEdit} className="bg-teal-500 text-black font-medium px-4 py-2 rounded-lg text-sm">
            Set up my audit
          </button>
        </div>
      </div>
    )
  }

  if (!audit) return null

  const { program, requirements, totalCreditsEarned, totalCreditsRequired, completionPct, summary } = audit

  const satisfied = requirements.filter(r => r.status === 'satisfied')
  const partial    = requirements.filter(r => r.status === 'partial')
  const missing    = requirements.filter(r => r.status === 'missing')
  const remaining  = [...missing, ...partial]

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* Topbar */}
      <nav className="border-b border-zinc-800/60 px-4 py-3 flex items-center justify-between sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
            <span className="text-black font-bold text-xs">CC</span>
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">ClearCredit</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-600 hidden sm:block">{user?.email}</span>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-all"
          >
            <Edit2 size={12} /> Edit credits
          </button>
          <button
            onClick={onSignOut}
            className="p-1.5 text-zinc-600 hover:text-zinc-400 transition-colors"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* Hero card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Degree Audit</p>
              <h1 className="text-xl font-bold text-white tracking-tight">{program.name}</h1>
              <p className="text-zinc-500 text-sm mt-0.5">{totalCreditsEarned} of {totalCreditsRequired} credits</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent tabular-nums">
                {completionPct}%
              </div>
              <div className="text-xs text-zinc-600 mt-0.5">complete</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-zinc-800 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-700 shadow-sm shadow-teal-500/40"
              style={{ width: `${completionPct}%` }}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { icon: <CheckCircle2 size={14} />, val: satisfied.length, label: 'Satisfied', color: 'text-teal-400' },
              { icon: <Clock size={14} />,        val: partial.length,   label: 'In progress', color: 'text-amber-400' },
              { icon: <XCircle size={14} />,      val: missing.length,   label: 'Needed',     color: 'text-zinc-500' },
            ].map((s, i) => (
              <div key={i} className="bg-zinc-800/50 rounded-xl p-3 text-center border border-zinc-800">
                <div className={`flex items-center justify-center gap-1 font-semibold text-lg ${s.color}`}>
                  {s.icon}{s.val}
                </div>
                <div className="text-xs text-zinc-600 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
            <p className="text-zinc-300 text-sm leading-relaxed">{summary}</p>
          </div>
        </div>

        {/* Credit source legend */}
        <div className="flex gap-2 text-xs">
          {[
            ['HCC', 'text-blue-400 bg-blue-500/10 border-blue-500/20'],
            ['USF', 'text-purple-400 bg-purple-500/10 border-purple-500/20'],
            ['AP',  'text-amber-400 bg-amber-500/10 border-amber-500/20'],
          ].map(([label, cls]) => (
            <span key={label} className={`px-2.5 py-1 rounded-md border font-medium ${cls}`}>
              {label}
            </span>
          ))}
          <span className="text-zinc-700 self-center text-xs ml-1">credit source</span>
        </div>

        {/* Requirements */}
        <div>
          <h2 className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Requirements</h2>
          <div className="space-y-2">
            {[...missing, ...partial, ...satisfied].map(req => (
              <RequirementRow key={req.id} req={req} />
            ))}
          </div>
        </div>

        {/* Next steps */}
        {remaining.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen size={15} className="text-teal-400" />
              Recommended next steps
            </h2>
            <div className="space-y-1">
              {remaining.slice(0, 6).map((req, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b border-zinc-800/60 last:border-0">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-500 text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-zinc-200 font-medium">{req.category.split('— ').pop()}</div>
                    {req.missing.length > 0 && (
                      <div className="text-xs text-zinc-600 mt-0.5 font-mono">
                        {req.missing.join(', ')}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={14} className="text-zinc-700 flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Done state */}
        {completionPct === 100 && (
          <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">🎓</div>
            <h2 className="text-lg font-bold text-white mb-1">All requirements satisfied</h2>
            <p className="text-zinc-400 text-sm">You're ready to apply for graduation.</p>
          </div>
        )}

        <p className="text-xs text-zinc-700 text-center pb-4">
          For planning only — verify requirements with an official HCC advisor.
        </p>
      </div>
    </div>
  )
}
