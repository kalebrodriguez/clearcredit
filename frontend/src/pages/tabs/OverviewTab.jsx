import { CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react'

export default function OverviewTab({ audit, onEditCredits }) {
  const { program, requirements, totalCreditsEarned, totalCreditsRequired, completionPct, summary } = audit

  const satisfied = requirements.filter(r => r.status === 'satisfied')
  const partial   = requirements.filter(r => r.status === 'partial')
  const missing   = requirements.filter(r => r.status === 'missing')
  const creditsRemaining = Math.max(0, totalCreditsRequired - totalCreditsEarned)
  const estSemesters = creditsRemaining > 0 ? Math.ceil(creditsRemaining / 15) : 0

  return (
    <div className="space-y-5">

      {/* Hero card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-1">Degree Audit</p>
            <h1 className="text-xl font-bold text-white tracking-tight">{program.name}</h1>
            {program.hccUrl && (
              <a
                href={program.hccUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-teal-500 hover:text-teal-400 mt-0.5 transition-colors"
              >
                View on HCC website <ExternalLink size={10} />
              </a>
            )}
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent tabular-nums">
              {completionPct}%
            </div>
            <div className="text-xs text-zinc-600 mt-0.5">complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-zinc-800 rounded-full mt-5 mb-5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-700 shadow-sm shadow-teal-500/40"
            style={{ width: `${completionPct}%` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { val: `${totalCreditsEarned}`, label: 'Credits earned', color: 'text-teal-400' },
            { val: `${creditsRemaining}`, label: 'Credits remaining', color: 'text-zinc-300' },
            { val: `${satisfied.length}`, label: 'Requirements met', color: 'text-teal-400' },
            { val: estSemesters > 0 ? `~${estSemesters}` : '🎓', label: estSemesters > 0 ? 'Semesters left' : 'Done!', color: 'text-cyan-400' },
          ].map((s, i) => (
            <div key={i} className="bg-zinc-800/50 rounded-xl p-3 text-center border border-zinc-800">
              <div className={`font-bold text-xl ${s.color}`}>{s.val}</div>
              <div className="text-xs text-zinc-600 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-zinc-800/40 border border-zinc-700/50 rounded-xl px-4 py-3">
          <p className="text-zinc-300 text-sm leading-relaxed">{summary}</p>
        </div>
      </div>

      {/* Quick category snapshot */}
      <div>
        <h2 className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Requirements snapshot</h2>
        <div className="space-y-2">
          {requirements.map(req => {
            const pct = Math.min(100, Math.round((req.creditsEarned / req.creditsRequired) * 100))
            return (
              <div key={req.id} className="flex items-center gap-3 py-2 border-b border-zinc-800/40 last:border-0">
                {req.status === 'satisfied'
                  ? <CheckCircle2 size={14} className="text-teal-400 flex-shrink-0" />
                  : req.status === 'partial'
                  ? <Clock size={14} className="text-amber-400 flex-shrink-0" />
                  : <XCircle size={14} className="text-zinc-600 flex-shrink-0" />}
                <span className="text-sm text-zinc-300 flex-1 truncate">{req.category}</span>
                <span className="text-xs text-zinc-600 tabular-nums">{req.creditsEarned}/{req.creditsRequired} cr</span>
                <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${req.status === 'satisfied' ? 'bg-teal-500' : req.status === 'partial' ? 'bg-amber-400' : 'bg-zinc-700'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {completionPct === 100 && (
        <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">🎓</div>
          <h2 className="text-lg font-bold text-white mb-1">All requirements satisfied</h2>
          <p className="text-zinc-400 text-sm">You're ready to apply for graduation.</p>
        </div>
      )}
    </div>
  )
}
