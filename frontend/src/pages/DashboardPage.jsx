import { useState, useEffect } from 'react'
import { Edit2, LogOut, BookOpen, CheckCircle2, XCircle, Clock } from 'lucide-react'
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">No program selected.</p>
          <button onClick={onEdit} className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm">
            Set up my audit
          </button>
        </div>
      </div>
    )
  }

  if (!audit) return null

  const { program, requirements, totalCreditsEarned, totalCreditsRequired, completionPct, summary } = audit

  // Group by status
  const satisfied = requirements.filter(r => r.status === 'satisfied')
  const partial = requirements.filter(r => r.status === 'partial')
  const missing = requirements.filter(r => r.status === 'missing')

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <nav className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CC</span>
          </div>
          <span className="font-semibold text-slate-800">ClearCredit</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500 hidden sm:block">{user?.email}</span>
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-sm text-slate-600 hover:text-teal-600 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Edit2 size={14} /> Edit credits
          </button>
          <button
            onClick={onSignOut}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors p-1.5"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Program + overall progress */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">{program.name}</h1>
              <p className="text-slate-500 text-sm">{totalCreditsEarned} of {totalCreditsRequired} credits</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-teal-500">{completionPct}%</div>
              <div className="text-xs text-slate-400">complete</div>
            </div>
          </div>

          {/* Main progress bar */}
          <div className="h-3 bg-slate-100 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-700"
              style={{ width: `${completionPct}%` }}
            />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-emerald-50 rounded-xl p-3">
              <div className="flex items-center justify-center gap-1 text-emerald-600 font-semibold text-lg">
                <CheckCircle2 size={16} /> {satisfied.length}
              </div>
              <div className="text-xs text-emerald-600/70">Satisfied</div>
            </div>
            <div className="text-center bg-amber-50 rounded-xl p-3">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-semibold text-lg">
                <Clock size={16} /> {partial.length}
              </div>
              <div className="text-xs text-amber-500/70">In progress</div>
            </div>
            <div className="text-center bg-red-50 rounded-xl p-3">
              <div className="flex items-center justify-center gap-1 text-red-400 font-semibold text-lg">
                <XCircle size={16} /> {missing.length}
              </div>
              <div className="text-xs text-red-400/70">Still needed</div>
            </div>
          </div>

          {/* Plain-English summary */}
          <div className="mt-4 bg-teal-50 rounded-xl p-4 border border-teal-100">
            <p className="text-teal-800 text-sm font-medium">{summary}</p>
          </div>
        </div>

        {/* Credit source legend */}
        <div className="flex flex-wrap gap-3 text-xs">
          {[['HCC', 'bg-blue-100 text-blue-700'], ['USF', 'bg-purple-100 text-purple-700'], ['AP', 'bg-amber-100 text-amber-700']].map(([label, cls]) => (
            <div key={label} className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium ${cls}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
              {label} credit
            </div>
          ))}
        </div>

        {/* Requirements breakdown */}
        <div>
          <h2 className="font-semibold text-slate-700 mb-3 text-sm uppercase tracking-wide">Requirements Breakdown</h2>
          <div className="space-y-3">
            {/* Show missing/partial first */}
            {[...missing, ...partial, ...satisfied].map(req => (
              <RequirementRow key={req.id} req={req} />
            ))}
          </div>
        </div>

        {/* Next steps */}
        {(missing.length > 0 || partial.length > 0) && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-teal-500" />
              Recommended next steps
            </h2>
            <div className="space-y-2">
              {[...missing, ...partial].slice(0, 6).map((req, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-slate-700">{req.category.split('— ').pop()}</div>
                    {req.missing.length > 0 && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        Need: <span className="font-mono">{req.missing.join(', ')}</span>
                      </div>
                    )}
                    {req.notes && <div className="text-xs text-slate-400 mt-0.5">{req.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completion celebration */}
        {completionPct === 100 && (
          <div className="bg-emerald-500 rounded-2xl p-6 text-center text-white">
            <div className="text-4xl mb-2">🎓</div>
            <h2 className="text-xl font-bold mb-1">You're done!</h2>
            <p className="text-emerald-100 text-sm">All requirements are satisfied. Congrats — apply for graduation!</p>
          </div>
        )}

        <p className="text-xs text-slate-400 text-center pb-4">
          ClearCredit is a student-built tool for planning purposes only. Always verify requirements with an official HCC advisor.
        </p>
      </div>
    </div>
  )
}
