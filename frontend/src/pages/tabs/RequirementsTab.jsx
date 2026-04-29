import RequirementRow from '../../components/RequirementRow'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'

export default function RequirementsTab({ audit }) {
  const { requirements } = audit

  const satisfied = requirements.filter(r => r.status === 'satisfied')
  const partial   = requirements.filter(r => r.status === 'partial')
  const missing   = requirements.filter(r => r.status === 'missing')

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-teal-400" /> Satisfied</span>
        <span className="flex items-center gap-1.5"><Clock size={12} className="text-amber-400" /> In progress</span>
        <span className="flex items-center gap-1.5"><XCircle size={12} className="text-zinc-600" /> Needed</span>
        <span className="ml-auto flex gap-2">
          {[
            ['HCC', 'text-blue-400 bg-blue-500/10 border-blue-500/20'],
            ['USF', 'text-purple-400 bg-purple-500/10 border-purple-500/20'],
            ['AP',  'text-amber-400 bg-amber-500/10 border-amber-500/20'],
          ].map(([label, cls]) => (
            <span key={label} className={`px-2 py-0.5 rounded border font-medium ${cls}`}>{label}</span>
          ))}
        </span>
      </div>

      {missing.length > 0 && (
        <section>
          <h2 className="text-xs text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
            <XCircle size={12} className="text-zinc-600" /> Still needed ({missing.length})
          </h2>
          <div className="space-y-2">
            {missing.map(req => <RequirementRow key={req.id} req={req} />)}
          </div>
        </section>
      )}

      {partial.length > 0 && (
        <section>
          <h2 className="text-xs text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Clock size={12} className="text-amber-400" /> In progress ({partial.length})
          </h2>
          <div className="space-y-2">
            {partial.map(req => <RequirementRow key={req.id} req={req} />)}
          </div>
        </section>
      )}

      {satisfied.length > 0 && (
        <section>
          <h2 className="text-xs text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-2">
            <CheckCircle2 size={12} className="text-teal-400" /> Satisfied ({satisfied.length})
          </h2>
          <div className="space-y-2">
            {satisfied.map(req => <RequirementRow key={req.id} req={req} />)}
          </div>
        </section>
      )}

      <p className="text-xs text-zinc-700 text-center pb-2">
        Verify requirements with an official HCC advisor before registering.
      </p>
    </div>
  )
}
