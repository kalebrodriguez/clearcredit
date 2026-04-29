import { useState, useEffect } from 'react'
import { LayoutDashboard, ListChecks, BookOpen, Compass, Settings } from 'lucide-react'
import { runAudit } from '../lib/audit'
import OverviewTab     from './tabs/OverviewTab'
import RequirementsTab from './tabs/RequirementsTab'
import MyCreditsTab    from './tabs/MyCreditsTab'
import NextStepsTab    from './tabs/NextStepsTab'
import SettingsTab     from './tabs/SettingsTab'

const TABS = [
  { id: 'overview',      label: 'Overview',      icon: LayoutDashboard },
  { id: 'requirements',  label: 'Requirements',  icon: ListChecks },
  { id: 'my-credits',    label: 'My Credits',    icon: BookOpen },
  { id: 'next-steps',    label: 'Next Steps',    icon: Compass },
  { id: 'settings',      label: 'Settings',      icon: Settings },
]

export default function DashboardPage({ profile, user, onSignOut, saveProfile, saving }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [audit, setAudit] = useState(null)

  useEffect(() => {
    if (!profile.programId) return
    const result = runAudit(
      profile.programId,
      profile.hccCourses,
      profile.usfCourses,
      profile.apScores,
    )
    setAudit(result)
  }, [profile])

  if (!profile.programId) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 mb-4 text-sm">No program selected yet.</p>
          <button
            onClick={() => saveProfile({ programId: '' })}
            className="bg-teal-500 text-black font-medium px-4 py-2 rounded-lg text-sm"
          >
            Set up my audit
          </button>
        </div>
      </div>
    )
  }

  if (!audit) return null

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      {/* Topbar */}
      <nav className="border-b border-zinc-800/60 px-4 py-3 flex items-center justify-between sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
            <span className="text-black font-bold text-xs">CC</span>
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">ClearCredit</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-600 hidden sm:block">{user?.email}</span>
          <div className="w-px h-4 bg-zinc-800 hidden sm:block" />
          <span className="text-xs text-zinc-500 hidden sm:block">{audit.completionPct}% complete</span>
        </div>
      </nav>

      {/* Tab bar */}
      <div className="border-b border-zinc-800/60 bg-[#09090b] sticky top-[53px] z-40 px-4">
        <div className="max-w-3xl mx-auto flex gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map(tab => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-xs font-medium border-b-2 whitespace-nowrap transition-all ${
                  active
                    ? 'border-teal-500 text-teal-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <OverviewTab audit={audit} onEditCredits={() => setActiveTab('my-credits')} />
        )}
        {activeTab === 'requirements' && (
          <RequirementsTab audit={audit} />
        )}
        {activeTab === 'my-credits' && (
          <MyCreditsTab profile={profile} onSave={saveProfile} saving={saving} />
        )}
        {activeTab === 'next-steps' && (
          <NextStepsTab audit={audit} />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            profile={profile}
            user={user}
            onSave={saveProfile}
            onSignOut={onSignOut}
            saving={saving}
          />
        )}

        <p className="text-xs text-zinc-700 text-center pt-8 pb-4">
          For planning only — verify requirements with an official HCC advisor.
        </p>
      </div>
    </div>
  )
}
