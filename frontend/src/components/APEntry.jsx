import { Trash2 } from 'lucide-react'
import { AP_CREDITS } from '../data/apCredits'

export default function APEntry({ entry, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-center">
      <select
        value={entry.exam}
        onChange={e => onChange({ ...entry, exam: e.target.value })}
        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
      >
        <option value="">Select AP exam…</option>
        {AP_CREDITS.map(ap => (
          <option key={ap.exam} value={ap.exam}>{ap.exam}</option>
        ))}
      </select>
      <select
        value={entry.score}
        onChange={e => onChange({ ...entry, score: Number(e.target.value) })}
        className="w-24 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
      >
        <option value="">Score</option>
        {[1, 2, 3, 4, 5].map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <button
        onClick={onRemove}
        className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}
