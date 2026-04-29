import * as pdfjsLib from 'pdfjs-dist'

// Use the local worker bundled with pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

// Florida course code pattern: 2-4 uppercase letters, space, 4 digits, optional C/L suffix
const COURSE_RE = /\b([A-Z]{2,4})\s{1,3}(\d{4}[A-Z]?)\b/g

// Grade patterns we recognize
const GRADE_RE = /\b(A\+?|A-|B\+|B|B-|C\+|C|C-|D\+|D|D-|F|W|WF|I|IP|S|U|AU)\b/

// Credit hour patterns: "3.00", "4.00", "3", "4"
const CREDIT_RE = /\b([1-6])(?:\.0{1,2})?\b/

/**
 * Extract raw text from every page of a PDF file.
 * Returns a single string with lines separated by newlines.
 */
async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    // Group items by approximate Y position to reconstruct rows
    const rows = {}
    for (const item of content.items) {
      if (!item.str?.trim()) continue
      const y = Math.round(item.transform[5] / 4) * 4 // snap to 4pt grid
      if (!rows[y]) rows[y] = []
      rows[y].push({ x: item.transform[4], text: item.str.trim() })
    }

    // Sort rows top→bottom, items left→right within each row
    const sortedRows = Object.entries(rows)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([, items]) =>
        items.sort((a, b) => a.x - b.x).map(i => i.text).join('  ')
      )

    pages.push(sortedRows.join('\n'))
  }

  return pages.join('\n')
}

/**
 * Parse lines of transcript text into course records.
 * Strategy: find lines that contain a Florida course code,
 * then look on the same line (or adjacent lines) for credits and grade.
 */
function parseCourses(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const results = []
  const seen = new Set()

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let match

    COURSE_RE.lastIndex = 0
    while ((match = COURSE_RE.exec(line)) !== null) {
      const courseCode = `${match[1]} ${match[2]}`

      // Avoid duplicates (some transcripts repeat courses in summaries)
      if (seen.has(courseCode)) continue

      // Search the line + next 2 lines for credits and grade
      const context = [line, lines[i + 1] || '', lines[i + 2] || ''].join(' ')

      const gradeMatch = GRADE_RE.exec(context)
      const grade = gradeMatch ? gradeMatch[1] : ''

      // Find credit hours — prefer numbers right after the course code
      const afterCode = context.slice(context.indexOf(courseCode) + courseCode.length)
      const creditMatch = CREDIT_RE.exec(afterCode)
      const credits = creditMatch ? parseInt(creditMatch[1]) : 3

      // Skip obviously bogus results (test prep artifacts, page headers)
      if (courseCode.startsWith('SP ') || courseCode.startsWith('FA ') || courseCode.startsWith('SU ')) continue

      seen.add(courseCode)
      results.push({
        id: Date.now() + Math.random(),
        course: courseCode,
        credits,
        grade,
      })
    }
  }

  return results
}

/**
 * Main export: parse a PDF File object into an array of course records.
 * Returns { courses, rawText } so the caller can debug if needed.
 */
export async function parseTranscriptPDF(file) {
  const rawText = await extractTextFromPDF(file)
  const courses = parseCourses(rawText)
  return { courses, rawText }
}
