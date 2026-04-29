import { useState, useRef } from 'react'
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { parseTranscriptPDF } from '../lib/parseTranscript'

export default function TranscriptUploader({ onParsed, label = 'transcript' }) {
  const [state, setState] = useState('idle') // idle | loading | done | error
  const [filename, setFilename] = useState('')
  const [count, setCount] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  async function handleFile(file) {
    if (!file || file.type !== 'application/pdf') {
      setErrorMsg('Please upload a PDF file.')
      setState('error')
      return
    }

    setFilename(file.name)
    setState('loading')
    setErrorMsg('')

    try {
      const { courses } = await parseTranscriptPDF(file)
      if (courses.length === 0) {
        setErrorMsg("Couldn't find any course codes. Try entering courses manually.")
        setState('error')
        return
      }
      setCount(courses.length)
      setState('done')
      onParsed(courses)
    } catch (e) {
      setErrorMsg('Failed to read PDF. Try a different file or enter manually.')
      setState('error')
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function reset() {
    setState('idle')
    setFilename('')
    setCount(0)
    setErrorMsg('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {state === 'idle' && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragging
              ? 'border-teal-500 bg-teal-500/10'
              : 'border-zinc-700 hover:border-zinc-600 bg-zinc-900/40 hover:bg-zinc-900/60'
          }`}
        >
          <Upload size={22} className="text-zinc-500 mx-auto mb-3" />
          <p className="text-sm text-zinc-300 font-medium">Drop your {label} PDF here</p>
          <p className="text-xs text-zinc-600 mt-1">or click to browse</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={e => handleFile(e.target.files?.[0])}
          />
        </div>
      )}

      {state === 'loading' && (
        <div className="border border-zinc-800 rounded-xl p-8 text-center bg-zinc-900/40">
          <Loader2 size={22} className="text-teal-400 mx-auto mb-3 animate-spin" />
          <p className="text-sm text-zinc-300 font-medium">Reading {filename}…</p>
          <p className="text-xs text-zinc-600 mt-1">Scanning for course codes</p>
        </div>
      )}

      {state === 'done' && (
        <div className="border border-teal-500/30 rounded-xl p-4 bg-teal-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={18} className="text-teal-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-white font-medium">
                Found {count} course{count !== 1 ? 's' : ''} in {filename}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Review and edit below</p>
            </div>
          </div>
          <button onClick={reset} className="text-zinc-600 hover:text-zinc-400 transition-colors p-1">
            <X size={15} />
          </button>
        </div>
      )}

      {state === 'error' && (
        <div className="border border-red-500/20 rounded-xl p-4 bg-red-500/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{errorMsg}</p>
          </div>
          <button onClick={reset} className="text-zinc-600 hover:text-zinc-400 transition-colors p-1">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
