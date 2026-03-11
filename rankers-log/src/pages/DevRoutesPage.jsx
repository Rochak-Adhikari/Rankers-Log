import { Link } from 'react-router-dom'

export function DevRoutesPage() {
  const routes = {
    'Core': [
      { path: '/feed', name: 'Home Feed' },
      { path: '/profile', name: 'Profile' },
      { path: '/profile/edit', name: 'Edit Profile' },
      { path: '/search', name: 'Search' },
      { path: '/notifications', name: 'Notifications' },
      { path: '/leaderboard', name: 'Leaderboard' },
      { path: '/quests', name: 'Quests' },
      { path: '/achievements', name: 'Achievements' },
    ],
    'Library': [
      { path: '/library', name: 'Library' },
      { path: '/collections', name: 'Collections' },
      { path: '/saved', name: 'Saved Content' },
      { path: '/drafts', name: 'Drafts' },
    ],
    'Content': [
      { path: '/title/test-123', name: 'Title Details' },
      { path: '/post/test-123', name: 'Post / Comments' },
      { path: '/marketplace', name: 'Marketplace' },
    ],
    'Social': [
      { path: '/friends', name: 'Friends' },
      { path: '/activity', name: 'Activity History' },
      { path: '/u/testuser', name: 'Public Profile' },
    ],
    'Messaging': [
      { path: '/messages', name: 'DM Inbox' },
      { path: '/messages/requests', name: 'Message Requests' },
      { path: '/messages/thread-123', name: 'DM Chat' },
    ],
    'Guilds': [
      { path: '/guilds', name: 'Guild List' },
      { path: '/guilds/create', name: 'Create Guild' },
      { path: '/guilds/guild-123', name: 'Guild Profile' },
      { path: '/guilds/guild-123/hub', name: 'Guild Hub' },
      { path: '/guilds/guild-123/chat', name: 'Guild Chat' },
      { path: '/guilds/guild-123/settings', name: 'Guild Settings' },
    ],
    'Progression': [
      { path: '/streaks', name: 'Streaks' },
      { path: '/skill-tree', name: 'Skill Tree' },
      { path: '/appraisal', name: 'System Appraisal' },
    ],
    'Settings': [
      { path: '/settings', name: 'Settings Hub' },
      { path: '/settings/account', name: 'Account Security' },
      { path: '/settings/privacy', name: 'Privacy Controls' },
      { path: '/settings/blocked', name: 'Blocked Users' },
    ],
    'Safety': [
      { path: '/safety', name: 'Safety Center' },
      { path: '/reports', name: 'Reports' },
      { path: '/appeal', name: 'Appeal' },
      { path: '/takedown', name: 'Takedown Request' },
    ],
    'Legal (Public)': [
      { path: '/legal/terms', name: 'Terms of Service' },
      { path: '/legal/privacy', name: 'Privacy Policy' },
      { path: '/legal/guidelines', name: 'Community Guidelines' },
      { path: '/legal/copyright', name: 'Copyright / DMCA' },
    ],
    'Auth (Public)': [
      { path: '/', name: 'Landing Page' },
      { path: '/auth/login', name: 'Login' },
      { path: '/auth/signup', name: 'Signup' },
      { path: '/auth/forgot', name: 'Forgot Password' },
      { path: '/onboarding', name: 'Onboarding' },
    ],
    'Admin': [
      { path: '/admin', name: 'Admin Panel' },
    ],
    'Dev Tools': [
      { path: '/dev/routes', name: 'Route Index (this page)' },
      { path: '/dev/qa', name: 'QA Dashboard' },
    ],
    'Shareable': [
      { path: '/license/HL-TEST123', name: 'Hunter License (Public)' },
    ],
  }

  return (
    <>
      <div className="w-full mb-6 border-l-4 border-yellow-500 pl-4">
        <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded w-fit mb-2">
          <span className="material-symbols-outlined text-sm">construction</span>
          DEV ONLY
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
          Route Index
        </h1>
        <p className="text-yellow-400/80 font-mono text-sm tracking-widest mt-1">
          // ALL_ROUTES // QA_TESTING
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(routes).map(([category, categoryRoutes]) => (
          <div key={category} className="bg-[#0a1016] border border-white/10 rounded-lg p-4">
            <h3 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider">{category}</h3>
            <div className="space-y-1">
              {categoryRoutes.map(route => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors group"
                >
                  <span className="text-white group-hover:text-primary transition-colors">{route.name}</span>
                  <span className="text-xs text-gray-500 font-mono">{route.path}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-sm text-yellow-400">
          <strong>Note:</strong> This page is only visible in development mode. 
          Use it to test all routes render correctly without console errors.
        </p>
      </div>
    </>
  )
}
