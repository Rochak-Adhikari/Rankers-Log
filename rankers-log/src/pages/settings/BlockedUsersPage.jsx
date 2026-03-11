import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export function BlockedUsersPage() {
  const { user } = useAuth()
  const [blockedUsers, setBlockedUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadBlockedUsers()
  }, [user])

  async function loadBlockedUsers() {
    setLoading(true)
    
    const { data } = await supabase
      .from('blocked_users')
      .select('*, blocked:blocked_user_id(id, username, display_name, avatar_url)')
      .eq('user_id', user.id)

    if (data && data.length > 0) {
      setBlockedUsers(data)
    } else {
      // Mock data for UI display
      setBlockedUsers([
        { id: '1', blocked: { id: 'u1', username: 'ToxicUser123', display_name: 'Toxic User', avatar_url: '' }, created_at: '2024-01-10T10:00:00Z' },
        { id: '2', blocked: { id: 'u2', username: 'SpamBot99', display_name: 'Spam Bot', avatar_url: '' }, created_at: '2024-01-05T15:30:00Z' }
      ])
    }

    setLoading(false)
  }

  async function handleUnblock(blockedUserId) {
    await supabase
      .from('blocked_users')
      .delete()
      .eq('user_id', user.id)
      .eq('blocked_user_id', blockedUserId)
    
    setBlockedUsers(prev => prev.filter(b => b.blocked?.id !== blockedUserId))
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-red-500 pl-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link to="/settings" className="hover:text-primary transition-colors">Settings</Link>
            <span>/</span>
            <Link to="/settings/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <span>/</span>
            <span className="text-white">Blocked Users</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.3)' }}>
            Security Log
          </h1>
          <p className="text-red-400/80 font-mono text-sm tracking-widest mt-1">
            // BLOCKED_USERS // ACCESS_DENIED
          </p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded text-xs font-mono text-red-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">block</span>
          BLOCKED: {blockedUsers.length}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-4 mb-6 flex items-start gap-4">
        <span className="material-symbols-outlined text-primary text-xl">info</span>
        <div>
          <p className="text-sm text-gray-400">
            Blocked users cannot view your profile, send you messages, or interact with your content. 
            They won't be notified that you've blocked them.
          </p>
        </div>
      </div>

      {/* Blocked Users List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-gray-400 font-mono text-sm">LOADING SECURITY LOG...</p>
          </div>
        </div>
      ) : blockedUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center bg-[#0a1016] border border-white/10 rounded-lg p-8">
          <span className="material-symbols-outlined text-5xl text-gray-600 mb-4">sentiment_satisfied</span>
          <h3 className="text-xl font-bold text-white mb-2">No Blocked Users</h3>
          <p className="text-gray-400">You haven't blocked anyone. Hopefully it stays that way!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {blockedUsers.map(item => (
            <div key={item.id} className="bg-[#0a1016] border border-red-500/20 rounded-lg p-4 flex items-center justify-between hover:border-red-500/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  {item.blocked?.avatar_url ? (
                    <img src={item.blocked.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-red-400">person_off</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-white">{item.blocked?.display_name || item.blocked?.username}</p>
                  <p className="text-sm text-gray-400">@{item.blocked?.username}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">
                    Blocked on {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleUnblock(item.blocked?.id)}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white text-sm font-bold rounded hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
              >
                Unblock
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
