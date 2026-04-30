import { PROGRAMS, PROGRAM_MAP } from '../data/programs'
import { getAPCredits } from '../data/apCredits'

/**
 * Build a flat list of all courses the student has credit for,
 * combining HCC, USF, and AP sources.
 * Returns: [{ course: "MAC 2311", credits: 4, source: "HCC" | "USF" | "AP", grade?, exam?, score? }]
 */
export function buildCreditPool(hccCourses, usfCourses, apScores) {
  const pool = []

  for (const c of hccCourses) {
    if (c.course && isPassingGrade(c.grade)) {
      pool.push({ course: c.course.trim().toUpperCase(), credits: c.credits || 3, source: 'HCC', grade: c.grade })
    }
  }

  for (const c of usfCourses) {
    // Florida CCNS: same course number = same course; transfers 1:1
    if (c.course && isPassingGrade(c.grade)) {
      pool.push({ course: c.course.trim().toUpperCase(), credits: c.credits || 3, source: 'USF', grade: c.grade })
    }
  }

  for (const ap of apScores) {
    const earned = getAPCredits(ap.exam, ap.score)
    for (const e of earned) {
      pool.push({ course: e.course.trim().toUpperCase(), credits: e.credits, source: 'AP', exam: ap.exam, score: ap.score })
    }
  }

  return pool
}

function isPassingGrade(grade) {
  if (!grade) return true // unknown grade — assume completed
  const upper = grade.toUpperCase()
  // D and above is passing at HCC for gen-ed; for program courses you often need C+
  return !['F', 'W', 'WF', 'I', 'X'].includes(upper)
}

/**
 * Run a degree audit for the given program.
 * Returns { requirements: RequirementResult[], totalCreditsEarned, totalCreditsRequired, completionPct, summary }
 */
export function runAudit(programId, hccCourses, usfCourses, apScores) {
  const program = PROGRAM_MAP[programId]
  if (!program) return null

  const pool = buildCreditPool(hccCourses, usfCourses, apScores)
  const usedCourses = new Set() // prevent double-counting a credit toward multiple reqs

  const requirementResults = program.requirements.map(req => {
    if (req.allRequired) {
      // Every course in the list is required
      const satisfied = []
      const missing = []
      for (const needed of req.courses) {
        const match = pool.find(c => c.course === needed && !usedCourses.has(c.course + c.source))
        if (match) {
          usedCourses.add(match.course + match.source)
          satisfied.push(match)
        } else {
          missing.push(needed)
        }
      }
      const creditsEarned = satisfied.reduce((sum, c) => sum + (c.credits || 3), 0)
      const status = missing.length === 0 ? 'satisfied' : creditsEarned > 0 ? 'partial' : 'missing'
      return { ...req, satisfied, missing, creditsEarned, status }
    } else {
      // Choose-one or choose-N (accumulate up to creditsRequired)
      const satisfied = []
      let creditsEarned = 0

      // Prioritize matching courses in the listed order; if courses list is empty, any course counts
      const candidates = req.courses.length > 0
        ? pool.filter(c => req.courses.includes(c.course) && !usedCourses.has(c.course + c.source))
        : pool.filter(c => !usedCourses.has(c.course + c.source))

      for (const match of candidates) {
        if (creditsEarned >= req.creditsRequired) break
        usedCourses.add(match.course + match.source)
        satisfied.push(match)
        creditsEarned += match.credits || 3
      }

      const missing = creditsEarned < req.creditsRequired ? req.courses.slice(0, 1) : []
      const status = creditsEarned >= req.creditsRequired ? 'satisfied' : creditsEarned > 0 ? 'partial' : 'missing'
      return { ...req, satisfied, missing, creditsEarned, status }
    }
  })

  const totalCreditsEarned = requirementResults.reduce((sum, r) => sum + r.creditsEarned, 0)
  const totalCreditsRequired = program.totalCredits
  const completionPct = Math.min(100, Math.round((totalCreditsEarned / totalCreditsRequired) * 100))

  const satisfied = requirementResults.filter(r => r.status === 'satisfied').length
  const partial = requirementResults.filter(r => r.status === 'partial').length
  const missing = requirementResults.filter(r => r.status === 'missing').length

  const summary = buildSummary(program.name, completionPct, requirementResults)

  return {
    program,
    requirements: requirementResults,
    totalCreditsEarned,
    totalCreditsRequired,
    completionPct,
    satisfied,
    partial,
    missing: missing + partial,
    summary,
    pool,
  }
}

function buildSummary(programName, pct, reqs) {
  const stillNeeded = reqs
    .filter(r => r.status !== 'satisfied')
    .map(r => r.category.replace(/^.*— /, ''))
    .slice(0, 3)

  if (pct === 100) {
    return `Congratulations! You've satisfied all requirements for the ${programName}. You're ready to graduate!`
  }
  if (stillNeeded.length === 0) {
    return `You're ${pct}% through the ${programName}.`
  }
  const needsList = stillNeeded.length === 1
    ? stillNeeded[0]
    : stillNeeded.slice(0, -1).join(', ') + ' and ' + stillNeeded[stillNeeded.length - 1]
  return `You're ${pct}% through the ${programName}. You still need ${needsList}${reqs.filter(r => r.status !== 'satisfied').length > 3 ? ', and more' : ''}.`
}

/**
 * Auto-detect the best-fit program based on which program has the highest completion %.
 */
export function detectBestFitProgram(hccCourses, usfCourses, apScores) {
  let best = null
  let bestPct = -1
  for (const prog of PROGRAMS) {
    const result = runAudit(prog.id, hccCourses, usfCourses, apScores)
    if (result && result.completionPct > bestPct) {
      bestPct = result.completionPct
      best = prog.id
    }
  }
  return best
}

/**
 * Return the top N programs by completion %, for the "pick my best fit" feature.
 * Ties broken by absolute credits earned.
 */
export function getTopPrograms(hccCourses, usfCourses, apScores, n = 3) {
  return PROGRAMS
    .map(prog => {
      const result = runAudit(prog.id, hccCourses, usfCourses, apScores)
      return { programId: prog.id, programName: prog.name, programType: prog.type, ...result }
    })
    .sort((a, b) => b.completionPct - a.completionPct || b.totalCreditsEarned - a.totalCreditsEarned)
    .slice(0, n)
}
