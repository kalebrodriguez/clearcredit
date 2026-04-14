import { useState } from 'react'
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react'
import { PROGRAMS } from '../data/programs'
import CourseEntry from '../components/CourseEntry'
import APEntry from '../components/APEntry'

const STEPS = ['Program', 'HCC Courses', 'USF Courses', 'AP Scores']

const blankCourse = () => ({ id: Date.now() + Math.random(), course: '', credits: 3, grade: '' })
const blankAP = () => ({ id: Date.now() + Math.random(), exam: '', score: '' })

export default function OnboardingPage({ initialProfile, onComplete }) {
  const [step, setStep] = useState(0)
  const [programId, setProgramId] = useState(initialProfile.programId || '')
  const [hccCourses, setHccCourses] = useState(
    initialProfile.hccCourses.length > 0 ? initialProfile.hccCourses.map(c => ({ ...c, id: c.id || Date.now() + Math.random() })) : [blankCourse()]
  )
  const [usfCourses, setUsfCourses] = useState(
    initialProfile.usfCourses.length > 0 ? initialProfile.usfCourses.map(c => ({ ...c, id: c.id || Date.now() + Math.random() })) : []
  )
  const [apScores, setApScores] = useState(
    initialProfile.apScores.length > 0 ? initialProfile.apScores.map(a => ({ ...a, id: a.id || Date.now() + Math.random() })) : []
  )

  const updateCourse = (setter, id, updated) =>
    setter(prev => prev.map(c => c.id === id ? updated : c))

  const removeCourse = (setter, id) =>
    setter(prev => prev.filter(c => c.id !== id))

  const canProceed = () => {
    if (step === 0) return !!programId
    return true
  }

  const handleSubmit = () => {
    onComplete({
      programId,
      hccCourses: hccCourses.filter(c => c.course.trim()),
      usfCourses: usfCourses.filter(c => c.course.trim()),
      apScores: apScores.filter(a => a.exam && a.score),
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CC</span>
          </div>
          <span className="font-semibold text-slate-800">ClearCredit</span>
        </div>
        <span className="text-sm text-slate-400">Step {step + 1} of {STEPS.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-full bg-teal-500 transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start py-10 px-4">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-sm p-8">

          {/* Step 0: Program selection */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">Select your HCC program</h2>
              <p className="text-slate-500 text-sm mb-6">We'll check your credits against this program's requirements.</p>
              <div className="space-y-3">
                {PROGRAMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProgramId(p.id)}
                    className={`w-full text-left border rounded-xl px-4 py-3 transition-all ${
                      programId === p.id
                        ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500'
                        : 'border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="font-medium text-slate-800 text-sm">{p.name}</div>
                    <div className="text-slate-400 text-xs mt-0.5">{p.totalCredits} credits required</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: HCC courses */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">HCC courses completed</h2>
              <p className="text-slate-500 text-sm mb-2">Enter course codes exactly as they appear on your transcript (e.g. MAC 2311).</p>
              <div className="flex gap-1 text-xs text-slate-400 mb-3 px-1">
                <span className="flex-1">Course code</span>
                <span className="w-20">Credits</span>
                <span className="w-24">Grade</span>
                <span className="w-8"></span>
              </div>
              <div className="space-y-2">
                {hccCourses.map(c => (
                  <CourseEntry
                    key={c.id}
                    course={c}
                    onChange={updated => updateCourse(setHccCourses, c.id, updated)}
                    onRemove={() => removeCourse(setHccCourses, c.id)}
                  />
                ))}
              </div>
              <button
                onClick={() => setHccCourses(prev => [...prev, blankCourse()])}
                className="mt-3 flex items-center gap-1 text-teal-600 text-sm font-medium hover:text-teal-700"
              >
                <Plus size={16} /> Add course
              </button>
            </div>
          )}

          {/* Step 2: USF courses */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">USF courses completed</h2>
              <p className="text-slate-500 text-sm mb-2">
                Florida CCNS means USF course numbers are identical to HCC — they transfer 1:1. Leave blank if none.
              </p>
              {usfCourses.length === 0 && (
                <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-sm mb-3">
                  No USF courses yet
                </div>
              )}
              {usfCourses.length > 0 && (
                <>
                  <div className="flex gap-1 text-xs text-slate-400 mb-3 px-1">
                    <span className="flex-1">Course code</span>
                    <span className="w-20">Credits</span>
                    <span className="w-24">Grade</span>
                    <span className="w-8"></span>
                  </div>
                  <div className="space-y-2">
                    {usfCourses.map(c => (
                      <CourseEntry
                        key={c.id}
                        course={c}
                        onChange={updated => updateCourse(setUsfCourses, c.id, updated)}
                        onRemove={() => removeCourse(setUsfCourses, c.id)}
                      />
                    ))}
                  </div>
                </>
              )}
              <button
                onClick={() => setUsfCourses(prev => [...prev, blankCourse()])}
                className="mt-3 flex items-center gap-1 text-teal-600 text-sm font-medium hover:text-teal-700"
              >
                <Plus size={16} /> Add USF course
              </button>
            </div>
          )}

          {/* Step 3: AP scores */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">AP exam scores</h2>
              <p className="text-slate-500 text-sm mb-2">
                Scores of 3, 4, or 5 earn college credit per Florida SBE Rule 6A-10.0315. Leave blank if none.
              </p>
              {apScores.length === 0 && (
                <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-sm mb-3">
                  No AP scores yet
                </div>
              )}
              {apScores.length > 0 && (
                <div className="space-y-2 mb-2">
                  {apScores.map(a => (
                    <APEntry
                      key={a.id}
                      entry={a}
                      onChange={updated => setApScores(prev => prev.map(x => x.id === a.id ? updated : x))}
                      onRemove={() => setApScores(prev => prev.filter(x => x.id !== a.id))}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => setApScores(prev => [...prev, blankAP()])}
                className="mt-3 flex items-center gap-1 text-teal-600 text-sm font-medium hover:text-teal-700"
              >
                <Plus size={16} /> Add AP exam
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-700 disabled:opacity-0 text-sm font-medium transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-200 disabled:text-slate-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                See my audit <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
