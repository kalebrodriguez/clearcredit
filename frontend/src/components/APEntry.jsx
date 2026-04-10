import { Trash2 } from 'lucide-react'
import { AP_CREDITS } from '../data/apCredits'

export default function APEntry({ entry, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1">
        <select
          value={entry.exam}
          onChange={e => onChange({ ...entry, exam: e.target.value })}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"
        >
          <option value="">Select AP exam…</option>
          {AP_CREDITS.map(ap => (
            <option key={ap.exam} value={ap.exam}>{ap.exam}</option>
          ))}
        </select>
      </div>
      <div className="w-28">
        <select
          value={entry.score}
          onChange={e => onChange({ ...entry, score: Number(e.target.value) })}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"
        >
          <option value="">Score</option>
          {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <button
        onClick={onRemove}
        className="p-2 text-slate-400 hover:text-red-400 transition-colors mt-0.5"
        title="Remove"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
