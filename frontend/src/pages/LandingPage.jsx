import { CheckCircle, ArrowRight, BookOpen, Award, TrendingUp } from 'lucide-react'

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CC</span>
          </div>
          <span className="font-semibold text-slate-800 text-lg">ClearCredit</span>
        </div>
        <button
          onClick={onGetStarted}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
          <span>Built for Florida dual enrollment students</span>
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
          See exactly where you stand<br />
          <span className="text-teal-500">toward your HCC degree</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Combine your HCC courses, USF credits, and AP exam scores into one unified
          degree audit. Know what counts, what's missing, and what to take next.
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors shadow-lg shadow-teal-200"
        >
          Check my credits free
          <ArrowRight size={20} />
        </button>
        <p className="text-sm text-slate-400 mt-3">No credit card. Sign in with Google.</p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <BookOpen className="text-teal-500" size={24} />,
              title: "All your credits, one place",
              desc: "Enter HCC courses, USF transfers, and AP scores. We match them against your program requirements automatically.",
            },
            {
              icon: <TrendingUp className="text-teal-500" size={24} />,
              title: "Real-time completion %",
              desc: "See progress bars for every category — General Education, Program Core, Electives — updated instantly.",
            },
            {
              icon: <Award className="text-teal-500" size={24} />,
              title: "Clear next steps",
              desc: "Get a specific list of remaining courses and which AP exams could knock them out before you ever register.",
            },
          ].map((f, i) => (
            <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                {f.icon}
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="bg-teal-500 py-16 px-6 text-center text-white">
        <p className="text-2xl font-semibold mb-2">"I wish this existed when I started dual enrollment."</p>
        <p className="text-teal-100 text-sm">Built by a Middleton High School CS/IT Magnet junior — dual enrolled at HCC &amp; USF.</p>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Common questions</h2>
        {[
          ["Do USF courses count toward my HCC degree?", "In most cases yes — Florida's Common Course Numbering System means the same course number transfers 1:1 between state schools."],
          ["Which AP scores count?", "Any score of 3, 4, or 5. We follow Florida SBE Rule 6A-10.0315, the official AP credit policy for all Florida state colleges."],
          ["Which programs are supported?", "Currently: AS Computer Science, AA General Studies, AS Business Administration, and AS Engineering Technology. More coming soon."],
          ["Is my data private?", "Yes. Your course data is saved to your account only, never shared or sold."],
        ].map(([q, a], i) => (
          <div key={i} className="border-b border-slate-100 py-5">
            <p className="font-medium text-slate-800 mb-1">{q}</p>
            <p className="text-slate-500 text-sm">{a}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center pb-20 px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to see where you stand?</h2>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
        >
          Get started — it's free
          <ArrowRight size={20} />
        </button>
      </section>

      <footer className="border-t border-slate-100 py-6 px-6 text-center text-slate-400 text-sm">
        © 2025 ClearCredit · Built for Hillsborough County dual enrollment students · Not affiliated with HCC or USF
      </footer>
    </div>
  )
}
