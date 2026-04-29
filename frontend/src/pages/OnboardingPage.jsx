import { useState } from 'react'
import { ChevronRight, ChevronLeft, Plus, Check, FileText, PenLine } from 'lucide-react'
import { PROGRAMS } from '../data/programs'
import CourseEntry from '../components/CourseEntry'
import APEntry from '../components/APEntry'
import TranscriptUploader from '../components/TranscriptUploader'

const STEPS = ['Program', 'HCC Courses', 'USF Courses', 'AP Scores']

const blankCourse = () => ({ id: Date.now() + Math.random(), course: '', credits: 3, grade: '' })
const blankAP    = () => ({ id: Date.now() + Math.random(), exam: '', score: '' })

function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex gap-1 bg-zinc-800/60 rounded-lg p-1 w-fit mb-5">
      {[
        { id: 'upload', icon: <FileText size={13} />, label: 'Upload PDF' },
        { id: 'manual', icon: <PenLine size={13} />,  label: 'Enter manually' },
      ].map(opt => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === opt.id
              ? 'bg-zinc-700 text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {opt.icon}{opt.label}
        </button>
      ))}
    </div>
  )
}

function CourseSection({ courses, setCourses, mode, setMode, label }) {
  const updateCourse = (id, updated) => setCourses(prev => prev.map(c => c.id === id ? updated : c))
  const removeCourse = id => setCourses(prev => prev.filter(c => c.id !== id))

  return (
    <div>
      <ModeToggle mode={mode} onChange={setMode} />

      {mode === 'upload' ? (
        <TranscriptUploader
          label={label}
          onParsed={parsed => {
            setCourses(parsed)
            setMode('manual') // switch to manual so user can review/edit
          }}
        />
      ) : (
        <>
          {courses.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center text-zinc-600 text-sm mb-2">
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
                    onChange={updated => updateCourse(c.id, updated)}
                    onRemove={() => removeCourse(c.id)}
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
      )}
    </div>
  )
}

export default function OnboardingPage({ initialProfile, onComplete }) {
  const [step, setStep] = useState(0)
  const [programId,  setProgramId]  = useState(initialProfile.programId || '')
  const [hccCourses, setHccCourses] = useState(
    initialProfile.hccCourses.length > 0
      ? initialProfile.hccCourses.map(c => ({ ...c, id: c.id || Date.now() + Math.random() }))
      : []
  )
  const [usfCourses, setUsfCourses] = useState(
    initialProfile.usfCourses.length > 0
      ? initialProfile.usfCourses.map(c => ({ ...c, id: c.id || Date.now() + Math.random() }))
      : []
  )
  const [apScores, setApScores] = useState(
    initialProfile.apScores.length > 0
      ? initialProfile.apScores.map(a => ({ ...a, id: a.id || Date.now() + Math.random() }))
      : []
  )
  const [hccMode, setHccMode] = useState('upload')
  const [usfMode, setUsfMode] = useState('upload')

  const canContinue = step !== 0 || !!programId

  const handleSubmit = () => {
    onComplete({
      programId,
      hccCourses: hccCourses.filter(c => c.course.trim()),
      usfCourses: usfCourses.filter(c => c.course.trim()),
      apScores:   apScores.filter(a => a.exam && a.score),
    })
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
            <span className="text-black font-bold text-xs">CC</span>
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">ClearCredit</span>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                i < step  ? 'bg-teal-500 text-black' :
                i === step ? 'bg-zinc-700 text-white ring-1 ring-teal-500' :
                             'bg-zinc-800 text-zinc-600'
              }`}>
                {i < step ? <Check size={11} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px ${i < step ? 'bg-teal-500' : 'bg-zinc-800'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center py-12 px-4">
        <div className="w-full max-w-lg">
          <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2">Step {step + 1} of {STEPS.length}</p>

          {/* Step 0: Program */}
          {step === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Select your program</h2>
              <p className="text-zinc-500 text-sm mb-6">We'll audit your credits against this program's requirements.</p>
              <div className="space-y-2">
                {PROGRAMS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProgramId(p.id)}
                    className={`w-full text-left border rounded-xl px-4 py-3.5 transition-all ${
                      programId === p.id
                        ? 'border-teal-500/60 bg-teal-500/10'
                        : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white text-sm">{p.name}</span>
                      <span className="text-zinc-600 text-xs">{p.totalCredits} cr</span>
                    </div>
                    {programId === p.id && (
                      <div className="mt-1 flex items-center gap-1 text-teal-400 text-xs">
                        <Check size={10} /> Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: HCC */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">HCC courses</h2>
              <p className="text-zinc-500 text-sm mb-5">
                Upload your HCC transcript PDF or enter courses manually.
              </p>
              <CourseSection
                courses={hccCourses}
                setCourses={setHccCourses}
                mode={hccMode}
                setMode={setHccMode}
                label="HCC transcript"
              />
            </div>
          )}

          {/* Step 2: USF */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">USF courses</h2>
              <p className="text-zinc-500 text-sm mb-5">
                Upload your USF transcript PDF or enter manually. Florida CCNS — same numbers transfer 1:1.
              </p>
              <CourseSection
                courses={usfCourses}
                setCourses={setUsfCourses}
                mode={usfMode}
                setMode={setUsfMode}
                label="USF transcript"
              />
            </div>
          )}

          {/* Step 3: AP */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">AP exam scores</h2>
              <p className="text-zinc-500 text-sm mb-5">
                Scores of 3–5 earn credit per Florida SBE Rule 6A-10.0315. Skip if none.
              </p>
              {apScores.length === 0 ? (
                <div className="border border-dashed border-zinc-800 rounded-xl p-8 text-center text-zinc-600 text-sm mb-3">
                  No AP scores yet
                </div>
              ) : (
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
                className="mt-3 flex items-center gap-1.5 text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors"
              >
                <Plus size={14} /> Add AP exam
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-zinc-800/60">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 disabled:opacity-0 text-sm font-medium transition-colors"
            >
              <ChevronLeft size={15} /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canContinue}
                className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 disabled:shadow-none"
              >
                Continue <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20"
              >
                See my audit <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
