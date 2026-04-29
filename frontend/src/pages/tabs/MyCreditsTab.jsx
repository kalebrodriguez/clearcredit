import { useState } from 'react'
import { Plus, Save, Check } from 'lucide-react'
import CourseEntry from '../../components/CourseEntry'
import APEntry from '../../components/APEntry'

const blankCourse = () => ({ id: Date.now() + Math.random(), course: '', credits: 3, grade: '' })
const blankAP     = () => ({ id: Date.now() + Math.random(), exam: '', score: '' })

function Section({ title, subtitle, children }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-zinc-600 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default function MyCreditsTab({ profile, onSave, saving }) {
  const [hcc, setHcc] = useState(
    profile.hccCourses.map(c => ({ ...c, id: c.id ?? Date.now() + Math.random() }))
  )
  const [usf, setUsf] = useState(
    profile.usfCourses.map(c => ({ ...c, id: c.id ?? Date.now() + Math.random() }))
  )
  const [ap, setAp] = useState(
    profile.apScores.map(a => ({ ...a, id: a.id ?? Date.now() + Math.random() }))
  )
  const [saved, setSaved] = useState(false)

  function updateCourse(list, setList, id, updated) {
    setList(list.map(c => c.id === id ? updated : c))
  }
  function removeCourse(list, setList, id) {
    setList(list.filter(c => c.id !== id))
  }

  async function handleSave() {
    await onSave({
      hccCourses: hcc.filter(c => c.course.trim()),
      usfCourses: usf.filter(c => c.course.trim()),
      apScores:   ap.filter(a => a.exam && a.score),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function CourseList({ courses, setCourses, placeholder }) {
    return (
      <>
        {courses.length === 0 ? (
          <div className="border border-dashed border-zinc-800 rounded-xl p-6 text-center text-zinc-600 text-sm mb-2">
            No courses yet
          </div>
        ) : (
          <>
            <div className="flex gap-2 text-xs text-zinc-600 mb-2 px-0.5">
              <span className="flex-1">Course code</span>
              <span className="w-16">Credits</span>
              <span className="w-28">Grade</span>
              <span className="w-7" />
            </div>
            <div className="space-y-2">
              {courses.map(c => (
                <CourseEntry
                  key={c.id}
                  course={c}
                  onChange={updated => updateCourse(courses, setCourses, c.id, updated)}
                  onRemove={() => removeCourse(courses, setCourses, c.id)}
                />
              ))}
            </div>
          </>
        )}
        <button
          onClick={() => setCourses(prev => [...prev, blankCourse()])}
          className="mt-3 flex items-center gap-1.5 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
        >
          <Plus size={14} /> Add course
        </button>
      </>
    )
  }

  return (
    <div className="space-y-4">
      <Section title="HCC Courses" subtitle="Courses taken at Hillsborough Community College">
        <CourseList courses={hcc} setCourses={setHcc} />
      </Section>

      <Section title="USF Courses" subtitle="Same course numbers transfer 1:1 under Florida CCNS">
        <CourseList courses={usf} setCourses={setUsf} />
      </Section>

      <Section title="AP Exam Scores" subtitle="Scores of 3–5 earn credit per Florida SBE Rule 6A-10.0315">
        {ap.length === 0 ? (
          <div className="border border-dashed border-zinc-800 rounded-xl p-6 text-center text-zinc-600 text-sm mb-2">
            No AP scores yet
          </div>
        ) : (
          <div className="space-y-2 mb-2">
            {ap.map(a => (
              <APEntry
                key={a.id}
                entry={a}
                onChange={updated => setAp(prev => prev.map(x => x.id === a.id ? updated : x))}
                onRemove={() => setAp(prev => prev.filter(x => x.id !== a.id))}
              />
            ))}
          </div>
        )}
        <button
          onClick={() => setAp(prev => [...prev, blankAP()])}
          className="mt-3 flex items-center gap-1.5 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
        >
          <Plus size={14} /> Add AP exam
        </button>
      </Section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 text-black font-semibold py-3 rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 disabled:shadow-none"
      >
        {saved ? <><Check size={15} /> Saved!</> : saving ? 'Saving…' : <><Save size={15} /> Save changes</>}
      </button>
    </div>
  )
}
