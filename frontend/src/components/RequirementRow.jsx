import { CheckCircle2, XCircle, Clock } from 'lucide-react'

const SOURCE_COLORS = {
  HCC: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  USF: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  AP:  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
}

export default function RequirementRow({ req }) {
  const { status, category, creditsRequired, creditsEarned, satisfied, missing, notes } = req
  const pct = Math.min(100, Math.round((creditsEarned / creditsRequired) * 100))

  const icon = status === 'satisfied'
    ? <CheckCircle2 size={15} className="text-teal-400 flex-shrink-0" />
    : status === 'partial'
    ? <Clock size={15} className="text-amber-400 flex-shrink-0" />
    : <XCircle size={15} className="text-zinc-600 flex-shrink-0" />

  return (
    <div className={`rounded-xl border px-4 py-3.5 transition-colors ${
      status === 'satisfied' ? 'border-zinc-800 bg-zinc-900/40' :
      status === 'partial'   ? 'border-amber-500/20 bg-amber-500/5' :
                               'border-zinc-800 bg-zinc-900/20'
    }`}>
      <div className="flex items-center gap-3">
        {icon}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`text-sm font-medium truncate ${status === 'satisfied' ? 'text-zinc-300' : 'text-zinc-200'}`}>
              {category}
            </span>
            <span className="text-xs text-zinc-600 whitespace-nowrap tabular-nums">
              {creditsEarned}/{creditsRequired} cr
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-zinc-800 rounded-full mb-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                status === 'satisfied' ? 'bg-teal-500' :
                status === 'partial'   ? 'bg-amber-400' : 'bg-zinc-700'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {satisfied.map((c, i) => (
              <span key={i} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-mono ${SOURCE_COLORS[c.source] || 'bg-zinc-800 text-zinc-400'}`}>
                {c.course}
                <span className="font-sans opacity-50 text-[10px]">{c.source}</span>
              </span>
            ))}
            {missing.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-zinc-800/60 text-zinc-600 font-mono border border-zinc-700/50">
                {c}
                <span className="font-sans opacity-50 text-[10px]">needed</span>
              </span>
            ))}
          </div>

          {notes && status !== 'satisfied' && (
            <p className="text-xs text-zinc-600 mt-1.5">{notes}</p>
          )}
        </div>
      </div>
    </div>
  )
}
