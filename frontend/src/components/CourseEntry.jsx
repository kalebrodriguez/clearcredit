import { Trash2 } from 'lucide-react'

const GRADES = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'W', 'IP']

export default function CourseEntry({ course, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="e.g. MAC 2311"
        value={course.course}
        onChange={e => onChange({ ...course, course: e.target.value.toUpperCase() })}
        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 font-mono uppercase placeholder:normal-case placeholder:font-sans transition-colors"
      />
      <input
        type="number"
        min="1"
        max="6"
        placeholder="Cr"
        value={course.credits}
        onChange={e => onChange({ ...course, credits: Number(e.target.value) })}
        className="w-16 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 transition-colors"
      />
      <select
        value={course.grade || ''}
        onChange={e => onChange({ ...course, grade: e.target.value })}
        className="w-28 bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-2 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
      >
        <option value="">Grade</option>
        {GRADES.map(g => <option key={g} value={g}>{g === 'IP' ? 'In Progress' : g}</option>)}
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
