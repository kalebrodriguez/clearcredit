import { Trash2 } from 'lucide-react'

const GRADES = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'W', 'IP']

export default function CourseEntry({ course, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Course code (e.g. MAC 2311)"
          value={course.course}
          onChange={e => onChange({ ...course, course: e.target.value.toUpperCase() })}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 font-mono uppercase placeholder:normal-case placeholder:font-sans"
        />
      </div>
      <div className="w-20">
        <input
          type="number"
          min="1"
          max="6"
          placeholder="Cr"
          value={course.credits}
          onChange={e => onChange({ ...course, credits: Number(e.target.value) })}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
        />
      </div>
      <div className="w-24">
        <select
          value={course.grade || ''}
          onChange={e => onChange({ ...course, grade: e.target.value })}
          className="w-full border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 bg-white"
        >
          <option value="">Grade</option>
          {GRADES.map(g => <option key={g} value={g}>{g === 'IP' ? 'In Progress' : g}</option>)}
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
