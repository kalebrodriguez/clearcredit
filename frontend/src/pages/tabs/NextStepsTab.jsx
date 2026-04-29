import { ExternalLink, BookOpen, Award, AlertCircle } from 'lucide-react'
import { AP_CREDITS } from '../../data/apCredits'

export default function NextStepsTab({ audit }) {
  const { requirements, program, totalCreditsEarned, totalCreditsRequired } = audit

  const incomplete = requirements.filter(r => r.status !== 'satisfied')
  const creditsRemaining = Math.max(0, totalCreditsRequired - totalCreditsEarned)
  const estSemesters = creditsRemaining > 0 ? Math.ceil(creditsRemaining / 15) : 0

  // For each incomplete requirement, find AP exams that could satisfy it
  function apExamsForReq(req) {
    if (!req.courses?.length) return []
    const matches = []
    for (const ap of AP_CREDITS) {
      const allCourses = [
        ...(ap.score3 || []),
        ...(ap.score4 || []),
        ...(ap.score5 || []),
      ]
      if (allCourses.some(c => req.courses.includes(c.course))) {
        matches.push(ap.exam)
      }
    }
    return matches
  }

  if (incomplete.length === 0) {
    return (
      <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">🎓</div>
        <h2 className="text-xl font-bold text-white mb-2">All done!</h2>
        <p className="text-zinc-400 text-sm">You've satisfied every requirement for the {program.name}.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Summary banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
          <BookOpen size={18} className="text-teal-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{creditsRemaining} credits remaining</p>
          <p className="text-zinc-500 text-xs mt-0.5">
            ~{estSemesters} semester{estSemesters !== 1 ? 's' : ''} at 15 credits/semester · {incomplete.length} requirement{incomplete.length !== 1 ? 's' : ''} left
          </p>
        </div>
        {program.hccUrl && (
          <a
            href={program.hccUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 text-xs text-teal-500 hover:text-teal-400 transition-colors whitespace-nowrap"
          >
            HCC program page <ExternalLink size={10} />
          </a>
        )}
      </div>

      {/* What you still need */}
      <div>
        <h2 className="text-xs text-zinc-600 uppercase tracking-widest mb-3">What you still need</h2>
        <div className="space-y-3">
          {incomplete.map((req, i) => {
            const apOptions = apExamsForReq(req)
            return (
              <div key={req.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-500 text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 font-medium">{req.category}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {req.creditsRequired - req.creditsEarned} more credit{req.creditsRequired - req.creditsEarned !== 1 ? 's' : ''} needed
                      {req.status === 'partial' && ` · ${req.creditsEarned} earned so far`}
                    </p>

                    {req.missing.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {req.missing.map((c, j) => (
                          <span key={j} className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                            {c}
                          </span>
                        ))}
                      </div>
                    )}

                    {apOptions.length > 0 && (
                      <div className="mt-2 flex items-start gap-1.5">
                        <Award size={12} className="text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-400/80">
                          AP option: {apOptions.join(', ')} (score 3+)
                        </p>
                      </div>
                    )}

                    {req.notes && (
                      <p className="text-xs text-zinc-600 mt-1.5">{req.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-3 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
        <AlertCircle size={14} className="text-zinc-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-600 leading-relaxed">
          Course availability changes each semester. Confirm with an HCC advisor before registering.
          {program.hccUrl && <> <a href={program.hccUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-500">View full program requirements →</a></>}
        </p>
      </div>
    </div>
  )
}
