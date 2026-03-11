import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function AccountSecurityPage() {
  const { user } = useAuth()
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-primary pl-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link to="/settings" className="hover:text-primary transition-colors">Settings</Link>
            <span>/</span>
            <span className="text-white">Account & Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(37, 140, 244, 0.3)' }}>
            Control Panel
          </h1>
          <p className="text-primary/80 font-mono text-sm tracking-widest mt-1">
            // ACCOUNT_SECURITY // ACCESS_CONTROLS
          </p>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Account Information
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <div>
              <p className="text-sm text-gray-400">Email Address</p>
              <p className="text-white font-mono">{user?.email || 'user@example.com'}</p>
            </div>
            <button className="text-primary text-sm font-bold hover:underline">Change</button>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <div>
              <p className="text-sm text-gray-400">Username</p>
              <p className="text-white font-mono">@{user?.user_metadata?.username || 'player'}</p>
            </div>
            <button className="text-primary text-sm font-bold hover:underline">Change</button>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="text-sm text-gray-400">Account Created</p>
              <p className="text-white font-mono">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">shield</span>
          Security
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <div>
              <p className="text-white font-bold">Password</p>
              <p className="text-sm text-gray-400">Last changed: Never</p>
            </div>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-bold rounded hover:bg-white/10 transition-colors"
            >
              Update Password
            </button>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <div>
              <p className="text-white font-bold">Two-Factor Authentication</p>
              <p className="text-sm text-gray-400">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 bg-primary/10 border border-primary/30 text-primary text-sm font-bold rounded hover:bg-primary/20 transition-colors">
              Enable 2FA
            </button>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="text-white font-bold">Active Sessions</p>
              <p className="text-sm text-gray-400">Manage your logged in devices</p>
            </div>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#0a1016] border border-red-500/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">warning</span>
          Danger Zone
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <div>
              <p className="text-white font-bold">Deactivate Account</p>
              <p className="text-sm text-gray-400">Temporarily disable your account</p>
            </div>
            <button className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-sm font-bold rounded hover:bg-yellow-500/20 transition-colors">
              Deactivate
            </button>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="text-white font-bold">Delete Account</p>
              <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold rounded hover:bg-red-500/20 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Update Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                <input type="password" className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">New Password</label>
                <input type="password" className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                <input type="password" className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-primary focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white font-bold rounded hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-white font-bold rounded hover:bg-primary/80 transition-colors">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
