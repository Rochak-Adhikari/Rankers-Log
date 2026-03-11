import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function DMInboxPage() {
  const { user } = useAuth()
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchThreads()
  }, [user])

  async function fetchThreads() {
    setLoading(true)
    
    // Get DM threads where user is a member
    const { data: memberData } = await supabase
      .from('dm_members')
      .select('thread_id')
      .eq('user_id', user.id)

    if (!memberData || memberData.length === 0) {
      setThreads([])
      setLoading(false)
      return
    }

    const threadIds = memberData.map(m => m.thread_id)

    // Get thread details with other participant info
    const threadList = []
    for (const threadId of threadIds) {
      // Get thread status
      const { data: threadData } = await supabase
        .from('dm_threads')
        .select('status, updated_at')
        .eq('id', threadId)
        .single()

      // Only show accepted threads in inbox
      if (threadData?.status !== 'accepted') continue

      // Get other participants
      const { data: members } = await supabase
        .from('dm_members')
        .select('user_id, profiles:user_id(username, avatar_url, display_name)')
        .eq('thread_id', threadId)
        .neq('user_id', user.id)

      // Get last message
      const { data: lastMsg } = await supabase
        .from('dm_messages')
        .select('content, created_at, sender_id, read_at')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Count unread messages
      const { count: unreadCount } = await supabase
        .from('dm_messages')
        .select('*', { count: 'exact', head: true })
        .eq('thread_id', threadId)
        .neq('sender_id', user.id)
        .is('read_at', null)

      if (members && members.length > 0) {
        const otherUser = members[0].profiles
        threadList.push({
          id: threadId,
          username: otherUser?.username || 'Unknown',
          avatar: otherUser?.avatar_url || null,
          display_name: otherUser?.display_name || otherUser?.username || 'Unknown',
          message: lastMsg?.content || 'No messages yet',
          time: lastMsg?.created_at || threadData?.updated_at || null,
          unread: unreadCount > 0,
          unreadCount: unreadCount || 0
        })
      }
    }

    // Sort by last message time
    threadList.sort((a, b) => {
      if (!a.time) return 1
      if (!b.time) return -1
      return new Date(b.time) - new Date(a.time)
    })

    setThreads(threadList)
    setLoading(false)
  }

  function formatTimeAgo(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const unreadTotal = threads.filter(t => t.unread).length

  return (
    <>
      {/* Page Heading & Stats */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-primary pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white text-glow">
            Comms_Log
          </h1>
          <p className="text-primary/80 font-mono text-sm tracking-widest mt-1">
            // ENCRYPTED CHANNEL // DIRECT_LINK ESTABLISHED
          </p>
        </div>
        <div className="flex gap-4">
          <Link to="/messages/requests" className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded text-xs font-mono text-yellow-400 hover:bg-yellow-500/20 transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">mark_email_unread</span>
            REQUESTS
          </Link>
          <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded text-xs font-mono text-primary">
            UNREAD: {String(unreadTotal).padStart(2, '0')}
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs font-mono text-text-secondary">
            THREADS: {String(threads.length).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Central Glass Panel */}
      <div className="w-full flex-1 flex flex-col glass-panel border border-white/10 rounded-xl backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(37,140,244,0.25)] overflow-hidden">
        {/* Action Bar */}
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-text-secondary group-focus-within:text-primary transition-colors">search</span>
            </div>
            <input
              className="w-full bg-[#0f161e] border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-primary focus:border-primary block pl-10 p-3 placeholder-text-secondary/50 font-mono transition-all"
              placeholder="SCAN_FREQUENCIES..."
              type="text"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-[10px] text-text-secondary font-mono border border-white/10 px-1 rounded">CTRL+K</span>
            </div>
          </div>
          {/* Action Button */}
          <Link to="/search" className="relative overflow-hidden group bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]">
            <span className="material-symbols-outlined text-[20px]">send</span>
            <span className="tracking-widest text-sm">NEW_MESSAGE</span>
          </Link>
        </div>

        {/* Messages List */}
        <div data-testid="dm-inbox" className="flex-1 overflow-y-auto p-2 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="material-symbols-outlined text-primary text-3xl animate-pulse">sync</span>
            </div>
          ) : threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="material-symbols-outlined text-gray-600 text-5xl mb-3">forum</span>
              <p className="text-gray-500 text-sm">No conversations yet</p>
              <p className="text-gray-600 text-xs mt-1">Start a conversation from someone's profile</p>
            </div>
          ) : (
            threads.map((thread) => (
              <Link
                key={thread.id}
                data-testid="dm-thread-item"
                to={`/messages/${thread.id}`}
                className={`group relative flex items-center gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                  thread.unread
                    ? 'bg-primary/5 border border-primary/30 hover:bg-primary/10'
                    : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                }`}
              >
                {/* Unread Indicator Line */}
                {thread.unread && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r shadow-[0_0_10px_#258cf4]"></div>
                )}
                
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className={`hexagon-mask size-14 bg-gray-800 bg-cover bg-center border border-white/20 flex items-center justify-center ${!thread.unread ? 'grayscale group-hover:grayscale-0 transition-all' : ''}`}
                    style={thread.avatar ? { backgroundImage: `url("${thread.avatar}")` } : {}}
                  >
                    {!thread.avatar && (
                      <span className="material-symbols-outlined text-gray-600 text-2xl">person</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`font-bold text-base truncate group-hover:text-primary transition-colors ${thread.unread ? 'text-white' : 'text-text-secondary'}`}>
                      {thread.display_name}
                    </h3>
                    <span className={`text-xs font-mono ${thread.unread ? 'text-primary' : 'text-text-secondary'}`}>
                      {formatTimeAgo(thread.time)}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${thread.unread ? 'text-gray-300 font-medium' : 'text-text-secondary/60 group-hover:text-text-secondary'}`}>
                    {thread.message}
                  </p>
                </div>

                {/* Unread Badge */}
                {thread.unreadCount > 0 && (
                  <div className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                    {thread.unreadCount}
                  </div>
                )}

                {/* Right Icon */}
                <div className="hidden md:block text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">chevron_right</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  )
}
