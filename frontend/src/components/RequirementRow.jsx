import { CheckCircle2, XCircle, Clock } from 'lucide-react'

const SOURCE_BADGE = {
  HCC: 'bg-blue-50 text-blue-700',
  USF: 'bg-purple-50 text-purple-700',
  AP: 'bg-amber-50 text-amber-700',
}

export default function RequirementRow({ req }) {
  const { status, category, creditsRequired, creditsEarned, satisfied, missing, notes } = req

  const icon = status === 'satisfied'
    ? <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
    : status === 'partial'
    ? <Clock size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
    : <XCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />

  const pct = Math.min(100, Math.round((creditsEarned / creditsRequired) * 100))

  return (
    <div className={`rounded-xl border p-4 ${
      status === 'satisfied' ? 'border-emerald-100 bg-emerald-50/30' :
      status === 'partial' ? 'border-amber-100 bg-amber-50/30' :
      'border-red-100 bg-red-50/20'
    }`}>
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-medium text-slate-700">{category}</span>
            <span className="text-xs text-slate-400 whitespace-nowrap">{creditsEarned}/{creditsRequired} cr</span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-slate-100 rounded-full mb-2">
            <div
              className={`h-full rounded-full transition-all ${
                status === 'satisfied' ? 'bg-emerald-400' :
                status === 'partial' ? 'bg-amber-400' : 'bg-red-300'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Satisfied courses */}
          {satisfied.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {satisfied.map((c, i) => (
                <span key={i} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-mono ${SOURCE_BADGE[c.source] || 'bg-slate-100 text-slate-600'}`}>
                  {c.course}
                  <span className="font-sans opacity-70">{c.source}</span>
                </span>
              ))}
            </div>
          )}

          {/* Missing courses */}
          {missing.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {missing.map((c, i) => (
                <span key={i} className="inline-flex items-center text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono">
                  {c} <span className="font-sans ml-1 opacity-60">needed</span>
                </span>
              ))}
            </div>
          )}

          {notes && status !== 'satisfied' && (
            <p className="text-xs text-slate-400 mt-1">{notes}</p>
          )}
        </div>
      </div>
    </div>
  )
}
