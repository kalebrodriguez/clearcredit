import { ArrowRight, BookOpen, Award, TrendingUp, Zap } from 'lucide-react'

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 backdrop-blur-sm sticky top-0 z-50 bg-[#09090b]/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <span className="text-black font-bold text-sm">CC</span>
          </div>
          <span className="font-semibold text-white tracking-tight">ClearCredit</span>
        </div>
        <button
          onClick={onGetStarted}
          className="text-sm font-medium text-zinc-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-zinc-800"
        >
          Sign in →
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 px-3 py-1.5 rounded-full text-xs font-medium mb-8 tracking-wide uppercase">
          <Zap size={11} />
          Built for Florida dual enrollment students
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
          Know exactly where you{' '}
          <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            stand
          </span>
        </h1>

        <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
          Combine your HCC courses, USF credits, and AP scores into one
          degree audit. No more guessing, no waiting on a counselor.
        </p>

        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5"
        >
          Check my credits free
          <ArrowRight size={16} />
        </button>
        <p className="text-xs text-zinc-600 mt-3">Sign in with Google · No credit card</p>
      </section>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: <BookOpen size={18} className="text-teal-400" />,
              title: 'All your credits, one place',
              desc: 'HCC courses, USF transfers, and AP scores matched against your program requirements automatically.',
            },
            {
              icon: <TrendingUp size={18} className="text-cyan-400" />,
              title: 'Real-time completion %',
              desc: 'Progress bars per category — General Ed, Program Core, Electives — updated the moment you enter a course.',
            },
            {
              icon: <Award size={18} className="text-sky-400" />,
              title: 'Clear next steps',
              desc: 'A specific list of what you still need, and which AP exams could satisfy requirements before you register.',
            },
          ].map((f, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
              <div className="w-9 h-9 bg-zinc-800 rounded-xl flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2 text-sm">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="border-y border-zinc-800 py-16 px-6 text-center">
        <p className="text-2xl font-semibold text-white mb-3 tracking-tight">
          "I wish this existed when I started dual enrollment."
        </p>
        <p className="text-zinc-500 text-sm">
          Built by a Middleton High School CS/IT Magnet junior — dual enrolled at HCC &amp; USF.
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-20">
        <h2 className="text-xl font-semibold text-white text-center mb-10 tracking-tight">Common questions</h2>
        <div className="space-y-0 divide-y divide-zinc-800/60">
          {[
            ['Do USF courses count toward my HCC degree?', "Yes — Florida's Common Course Numbering System means the same course number transfers 1:1 between state schools."],
            ['Which AP scores count?', 'Any score of 3, 4, or 5. We follow Florida SBE Rule 6A-10.0315, the official AP credit policy for all Florida state colleges.'],
            ['Which programs are supported?', 'AS Computer Science, AA General Studies, AS Business Administration, and AS Engineering Technology. More coming soon.'],
            ['Is my data private?', 'Your course data is saved to your account only — never shared or sold.'],
          ].map(([q, a], i) => (
            <div key={i} className="py-5">
              <p className="font-medium text-zinc-200 mb-1.5 text-sm">{q}</p>
              <p className="text-zinc-500 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center pb-24 px-6">
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Ready to see where you stand?</h2>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-black font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-teal-500/25"
        >
          Get started — it's free <ArrowRight size={16} />
        </button>
      </section>

      <footer className="border-t border-zinc-800/60 py-6 px-6 text-center text-zinc-600 text-xs">
        © 2025 ClearCredit · Not affiliated with HCC or USF
      </footer>
    </div>
  )
}
