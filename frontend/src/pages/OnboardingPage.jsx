import { useState, useRef, useEffect } from 'react'
import { ChevronRight, ChevronLeft, Plus, Check, Search, Sparkles, X } from 'lucide-react'
import { PROGRAMS } from '../data/programs'
import { getTopPrograms } from '../lib/audit'
import CourseEntry from '../components/CourseEntry'
import APEntry from '../components/APEntry'

const STEPS = ['Program', 'HCC Courses', 'USF Courses', 'AP Scores']

const blankCourse = () => ({ id: Date.now() + Math.random(), course: '', credits: 3, grade: '' })
const blankAP    = () => ({ id: Date.now() + Math.random(), exam: '', score: '' })

// ─── Typeahead program search ──────────────────────────────────────────────
function ProgramSearch({ programId, onSelect }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selectedProgram = PROGRAMS.find(p => p.id === programId)

  const filtered = query.trim().length === 0
    ? PROGRAMS
    : PROGRAMS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.type?.toLowerCase().includes(query.toLowerCase())
      )

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(p) {
    onSelect(p.id)
    setQuery('')
    setOpen(false)
  }

  function handleClear() {
    onSelect('')
    setQuery('')
    setOpen(true)
  }

  return (
    <div ref={ref} className="relative">
      {selectedProgram ? (
        <div className="flex items-center justify-between border border-teal-500/60 bg-teal-500/10 rounded-xl px-4 py-3.5">
          <div>
            <span className="text-sm font-medium text-white">{selectedProgram.name}</span>
            <div className="flex items-center gap-1 mt-0.5 text-teal-400 text-xs">
              <Check size={10} /> Selected · {selectedProgram.totalCredits} cr
            </div>
          </div>
          <button onClick={handleClear} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X size={15} />
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              placeholder='Search programs — e.g. "business", "AS", "nursing"'
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors"
            />
          </div>

          {open && (
            <div className="absolute z-10 w-full mt-1.5 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-sm text-zinc-600">No programs match "{query}"</div>
              ) : (
                filtered.map(p => (
                  <button
                    key={p.id}
                    onMouseDown={() => handleSelect(p)}
                    className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors flex items-center justify-between group border-b border-zinc-800/60 last:border-0"
                  >
                    <span className="text-sm text-zinc-200 group-hover:text-white">{p.name}</span>
                    <span className="text-xs text-zinc-600 ml-2 shrink-0">{p.totalCredits} cr</span>
                  </button>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Best-fit picker ───────────────────────────────────────────────────────
function BestFitSection({ onSelect }) {
  const [courses, setCourses] = useState([])
  const [apScores, setApScores] = useState([])
  const [results, setResults] = useState(null)
  const [ran, setRan] = useState(false)

  function handleFind() {
    const cleaned = courses.filter(c => c.course.trim())
    const cleanedAP = apScores.filter(a => a.exam && a.score)
    const top = getTopPrograms(cleaned, [], cleanedAP, 5)
    setResults(top)
    setRan(true)
  }

  function handlePick(result) {
    // Pass back the program id AND the courses so they pre-fill the HCC step
    onSelect(result.programId, courses.filter(c => c.course.trim()))
  }

  const updateCourse = (id, updated) => setCourses(prev => prev.map(c => c.id === id ? updated : c))
  const removeCourse = id => setCourses(prev => prev.filter(c => c.id !== id))
  const updateAP = (id, updated) => setApScores(prev => prev.map(a => a.id === id ? updated : a))
  const removeAP = id => setApScores(prev => prev.filter(a => a.id !== id))

  return (
    <div className="mt-6 border border-zinc-800 rounded-2xl p-5 bg-zinc-900/40">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={14} className="text-teal-400" />
        <span className="text-sm font-semibold text-white">Pick my best fit</span>
      </div>
      <p className="text-xs text-zinc-500 mb-5">
        Enter the courses you've already taken — we'll score every HCC program and show your top matches. Great if you're a sophomore or junior who wants to maximize credits already earned.
      </p>

      {/* Course entry */}
      <p className="text-xs font-medium text-zinc-400 mb-2">Courses taken (any institution)</p>
      {courses.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-xl p-5 text-center text-zinc-600 text-xs mb-2">
          No courses yet
        </div>
      ) : (
        <>
          <div className="flex gap-2 text-xs text-zinc-600 mb-1.5 px-0.5">
            <span className="flex-1">Course code</span>
            <span className="w-16">Credits</span>
            <span className="w-28">Grade</span>
            <span className="w-7" />
          </div>
          <div className="space-y-2 mb-1">
            {courses.map(c => (
              <CourseEntry key={c.id} course={c} onChange={u => updateCourse(c.id, u)} onRemove={() => removeCourse(c.id)} />
            ))}
          </div>
        </>
      )}
      <button
        onClick={() => setCourses(prev => [...prev, blankCourse()])}
        className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 text-xs font-medium transition-colors mb-5"
      >
        <Plus size={12} /> Add course
      </button>

      {/* AP scores */}
      <p className="text-xs font-medium text-zinc-400 mb-2">AP scores (optional)</p>
      {apScores.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-xl p-5 text-center text-zinc-600 text-xs mb-2">
          No AP scores
        </div>
      ) : (
        <div className="space-y-2 mb-1">
          {apScores.map(a => (
            <APEntry key={a.id} entry={a} onChange={u => updateAP(a.id, u)} onRemove={() => removeAP(a.id)} />
          ))}
        </div>
      )}
      <button
        onClick={() => setApScores(prev => [...prev, blankAP()])}
        className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 text-xs font-medium transition-colors mb-5"
      >
        <Plus size={12} /> Add AP exam
      </button>

      <button
        onClick={handleFind}
        disabled={courses.filter(c => c.course.trim()).length === 0}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:from-zinc-700 disabled:to-zinc-700 disabled:text-zinc-500 text-black font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-teal-500/20 disabled:shadow-none"
      >
        <Sparkles size={14} /> Find my best match
      </button>

      {/* Results */}
      {ran && results && (
        <div className="mt-5 space-y-2">
          <p className="text-xs text-zinc-500 mb-3">
            Based on {courses.filter(c => c.course.trim()).length} course{courses.filter(c => c.course.trim()).length !== 1 ? 's' : ''} across {PROGRAMS.length} programs:
          </p>
          {results.map((r, i) => (
            <div key={r.programId} className={`border rounded-xl p-4 ${i === 0 ? 'border-teal-500/40 bg-teal-500/5' : 'border-zinc-800 bg-zinc-900/40'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {i === 0 && <span className="text-[10px] font-semibold text-teal-400 uppercase tracking-wider">Best match</span>}
                  </div>
                  <p className="text-sm font-medium text-white leading-snug">{r.programName}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {r.totalCreditsEarned} of {r.totalCreditsRequired} credits apply · {r.completionPct}% complete
                  </p>
                  {/* Mini progress bar */}
                  <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden w-full">
                    <div
                      className={`h-full rounded-full ${i === 0 ? 'bg-teal-500' : 'bg-zinc-600'}`}
                      style={{ width: `${r.completionPct}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => handlePick(r)}
                  className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    i === 0
                      ? 'bg-teal-500 hover:bg-teal-400 text-black'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                  }`}
                >
                  Choose →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Course list (manual entry only) ──────────────────────────────────────
function CourseList({ courses, setCourses }) {
  const updateCourse = (id, updated) => setCourses(prev => prev.map(c => c.id === id ? updated : c))
  const removeCourse = id => setCourses(prev => prev.filter(c => c.id !== id))

  return (
    <div>
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
              <CourseEntry key={c.id} course={c} onChange={u => updateCourse(c.id, u)} onRemove={() => removeCourse(c.id)} />
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
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────
export default function OnboardingPage({ initialProfile, onComplete }) {
  const [step, setStep] = useState(0)
  const [showBestFit, setShowBestFit] = useState(false)
  const [programId, setProgramId] = useState(initialProfile.programId || '')
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

  const canContinue = step !== 0 || !!programId

  function handleBestFitSelect(id, prefillCourses) {
    setProgramId(id)
    if (prefillCourses && prefillCourses.length > 0) {
      setHccCourses(prefillCourses.map(c => ({ ...c, id: c.id || Date.now() + Math.random() })))
    }
    setShowBestFit(false)
  }

  function handleSubmit() {
    onComplete({
      programId,
      hccCourses: hccCourses.filter(c => c.course.trim()),
      usfCourses: usfCourses.filter(c => c.course.trim()),
      apScores: apScores.filter(a => a.exam && a.score),
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
              <p className="text-zinc-500 text-sm mb-6">
                Search for your HCC program track, or let us find the best fit based on credits you've already earned.
              </p>

              <ProgramSearch programId={programId} onSelect={id => { setProgramId(id); setShowBestFit(false) }} />

              {/* Divider */}
              {!programId && (
                <>
                  <div className="flex items-center gap-3 my-5">
                    <div className="flex-1 h-px bg-zinc-800" />
                    <span className="text-xs text-zinc-600">or</span>
                    <div className="flex-1 h-px bg-zinc-800" />
                  </div>

                  <button
                    onClick={() => setShowBestFit(v => !v)}
                    className={`w-full flex items-center justify-center gap-2 border rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      showBestFit
                        ? 'border-teal-500/40 bg-teal-500/10 text-teal-300'
                        : 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Sparkles size={14} />
                    Not sure? Pick my best fit based on my credits
                  </button>

                  {showBestFit && (
                    <BestFitSection onSelect={handleBestFitSelect} />
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 1: HCC */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">HCC courses</h2>
              <p className="text-zinc-500 text-sm mb-5">
                Enter your HCC courses. Use the exact course code (e.g. ENC 1101).
              </p>
              <CourseList courses={hccCourses} setCourses={setHccCourses} />
            </div>
          )}

          {/* Step 2: USF */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">USF courses</h2>
              <p className="text-zinc-500 text-sm mb-5">
                Optional. Florida's Common Course Numbering System means the same course number transfers 1:1 between state schools.
              </p>
              <CourseList courses={usfCourses} setCourses={setUsfCourses} />
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
