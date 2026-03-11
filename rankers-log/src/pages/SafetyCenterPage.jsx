import { Link } from 'react-router-dom'

export function SafetyCenterPage() {
  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-8 flex flex-wrap justify-between items-end gap-4 border-l-4 border-green-500 pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}>
            Guardian Hub
          </h1>
          <p className="text-green-400/80 font-mono text-sm tracking-widest mt-1">
            // SAFETY_CENTER // COMMUNITY_PROTECTION
          </p>
        </div>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8 flex items-start gap-4">
        <span className="material-symbols-outlined text-red-400 text-2xl">emergency</span>
        <div>
          <h3 className="font-bold text-white mb-1">Need Immediate Help?</h3>
          <p className="text-sm text-gray-400 mb-3">
            If you or someone you know is in immediate danger, please contact local emergency services or a crisis helpline.
          </p>
          <a href="tel:911" className="inline-flex items-center gap-2 text-red-400 font-bold text-sm hover:underline">
            <span className="material-symbols-outlined text-sm">phone</span>
            Emergency Services
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/reports" className="bg-[#0a1016] border border-white/10 rounded-lg p-6 hover:border-red-500/50 transition-all group">
          <span className="material-symbols-outlined text-3xl text-red-400 mb-4">flag</span>
          <h3 className="font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Report Content</h3>
          <p className="text-sm text-gray-400">Report inappropriate content or behavior</p>
        </Link>
        <Link to="/settings/blocked" className="bg-[#0a1016] border border-white/10 rounded-lg p-6 hover:border-yellow-500/50 transition-all group">
          <span className="material-symbols-outlined text-3xl text-yellow-400 mb-4">block</span>
          <h3 className="font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">Blocked Users</h3>
          <p className="text-sm text-gray-400">Manage your blocked users list</p>
        </Link>
        <Link to="/settings/privacy" className="bg-[#0a1016] border border-white/10 rounded-lg p-6 hover:border-primary/50 transition-all group">
          <span className="material-symbols-outlined text-3xl text-primary mb-4">shield</span>
          <h3 className="font-bold text-white mb-2 group-hover:text-primary transition-colors">Privacy Settings</h3>
          <p className="text-sm text-gray-400">Control your privacy and visibility</p>
        </Link>
      </div>

      {/* Safety Resources */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-green-400">local_library</span>
          Safety Resources
        </h3>
        <div className="space-y-4">
          <Link to="/legal/guidelines" className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
            <span className="material-symbols-outlined text-primary">gavel</span>
            <div className="flex-1">
              <h4 className="font-bold text-white group-hover:text-primary transition-colors">Community Guidelines</h4>
              <p className="text-sm text-gray-400">Learn about our community standards</p>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </Link>
          <Link to="/legal/terms" className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
            <span className="material-symbols-outlined text-primary">description</span>
            <div className="flex-1">
              <h4 className="font-bold text-white group-hover:text-primary transition-colors">Terms of Service</h4>
              <p className="text-sm text-gray-400">Read our terms and conditions</p>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </Link>
          <Link to="/legal/privacy" className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
            <span className="material-symbols-outlined text-primary">privacy_tip</span>
            <div className="flex-1">
              <h4 className="font-bold text-white group-hover:text-primary transition-colors">Privacy Policy</h4>
              <p className="text-sm text-gray-400">How we protect your data</p>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </Link>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-green-400">tips_and_updates</span>
          Safety Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <div>
              <h4 className="font-bold text-white text-sm">Protect Your Personal Info</h4>
              <p className="text-xs text-gray-400">Never share passwords or sensitive information</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <div>
              <h4 className="font-bold text-white text-sm">Report Suspicious Activity</h4>
              <p className="text-xs text-gray-400">Help keep our community safe by reporting issues</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <div>
              <h4 className="font-bold text-white text-sm">Use Strong Passwords</h4>
              <p className="text-xs text-gray-400">Enable 2FA for extra security</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-green-400">check_circle</span>
            <div>
              <h4 className="font-bold text-white text-sm">Be Respectful</h4>
              <p className="text-xs text-gray-400">Treat others the way you want to be treated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 mb-4">Still need help?</p>
        <a 
          href="mailto:support@rankerslog.com" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined">mail</span>
          Contact Support
        </a>
      </div>
    </>
  )
}
