import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ users: 0, posts: 0, reports: 0, guilds: 0 })

  useEffect(() => {
    checkAdminAccess()
  }, [user])

  async function checkAdminAccess() {
    // Check if user has admin role
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single()

    // For development, allow access if role is admin or if running locally
    const isDev = window.location.hostname === 'localhost'
    setIsAdmin(data?.role === 'admin' || isDev)
    
    if (data?.role === 'admin' || isDev) {
      loadStats()
    }
    
    setLoading(false)
  }

  async function loadStats() {
    const [users, posts, reports, guilds] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('guilds').select('*', { count: 'exact', head: true })
    ])

    setStats({
      users: users.count || 0,
      posts: posts.count || 0,
      reports: reports.count || 0,
      guilds: guilds.count || 0
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-red-400">block</span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Access Denied</h2>
        <p className="text-gray-400 max-w-md mb-6">
          You don't have permission to access the admin panel.
        </p>
        <button 
          onClick={() => navigate('/feed')}
          className="px-6 py-2 bg-primary text-white rounded font-bold hover:bg-primary/80 transition-colors"
        >
          Return to Feed
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-purple-500 pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.3)' }}>
            Debug Console
          </h1>
          <p className="text-purple-400/80 font-mono text-sm tracking-widest mt-1">
            // DEV_PANEL // ADMIN_ACCESS
          </p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded text-xs font-mono text-purple-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
          ADMIN MODE
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">group</span>
            <span className="text-xs text-gray-400 font-mono uppercase">Total Users</span>
          </div>
          <p className="text-3xl font-black text-white">{stats.users.toLocaleString()}</p>
        </div>
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">article</span>
            <span className="text-xs text-gray-400 font-mono uppercase">Total Posts</span>
          </div>
          <p className="text-3xl font-black text-white">{stats.posts.toLocaleString()}</p>
        </div>
        <div className="bg-[#0a1016] border border-red-500/30 rounded-lg p-6 hover:border-red-500/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-red-400">flag</span>
            <span className="text-xs text-gray-400 font-mono uppercase">Pending Reports</span>
          </div>
          <p className="text-3xl font-black text-red-400">{stats.reports}</p>
        </div>
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">shield</span>
            <span className="text-xs text-gray-400 font-mono uppercase">Guilds</span>
          </div>
          <p className="text-3xl font-black text-white">{stats.guilds}</p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">bolt</span>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-left hover:bg-white/10 transition-colors flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">cached</span>
              <span className="text-white font-bold">Clear Cache</span>
            </button>
            <button className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-left hover:bg-white/10 transition-colors flex items-center gap-3">
              <span className="material-symbols-outlined text-yellow-400">sync</span>
              <span className="text-white font-bold">Sync Database</span>
            </button>
            <button className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-left hover:bg-white/10 transition-colors flex items-center gap-3">
              <span className="material-symbols-outlined text-green-400">backup</span>
              <span className="text-white font-bold">Create Backup</span>
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-red-400">flag</span>
            Recent Reports
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-white font-bold text-sm">Spam Report</p>
                <p className="text-xs text-gray-400">User: @spammer123</p>
              </div>
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">PENDING</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-white font-bold text-sm">Harassment</p>
                <p className="text-xs text-gray-400">User: @toxic_user</p>
              </div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">RESOLVED</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="mt-6 bg-[#0a1016] border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">terminal</span>
          System Information
        </h3>
        <div className="font-mono text-sm text-gray-400 space-y-1">
          <p>Version: <span className="text-white">2.4.0-beta</span></p>
          <p>Environment: <span className="text-green-400">Development</span></p>
          <p>Database: <span className="text-white">Supabase PostgreSQL</span></p>
          <p>Last Deploy: <span className="text-white">{new Date().toLocaleDateString()}</span></p>
        </div>
      </div>
    </>
  )
}
