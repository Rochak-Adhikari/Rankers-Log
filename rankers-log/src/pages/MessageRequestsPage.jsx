import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function MessageRequestsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadRequests()
  }, [user])

  async function loadRequests() {
    setLoading(true)
    
    // Load pending DM threads where user is a member but not the creator
    const { data: memberData } = await supabase
      .from('dm_members')
      .select('thread_id')
      .eq('user_id', user.id)

    if (!memberData || memberData.length === 0) {
      setRequests([])
      setLoading(false)
      return
    }

    const threadIds = memberData.map(m => m.thread_id)
    const requestList = []

    for (const threadId of threadIds) {
      // Get thread info
      const { data: thread } = await supabase
        .from('dm_threads')
        .select('id, status, created_by, created_at')
        .eq('id', threadId)
        .eq('status', 'pending')
        .neq('created_by', user.id)
        .single()

      if (!thread) continue

      // Get the sender (other member who created thread)
      const { data: senderProfile } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, display_name, level')
        .eq('id', thread.created_by)
        .single()

      // Get first message
      const { data: firstMsg } = await supabase
        .from('dm_messages')
        .select('content')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })
        .limit(1)
        .single()

      requestList.push({
        id: threadId,
        from_user_id: thread.created_by,
        message: firstMsg?.content || 'No message',
        created_at: thread.created_at,
        profiles: senderProfile
      })
    }

    setRequests(requestList)
    setLoading(false)
  }

  async function handleAccept(threadId) {
    // Update thread status to accepted
    await supabase
      .from('dm_threads')
      .update({ status: 'accepted' })
      .eq('id', threadId)
    
    setRequests(prev => prev.filter(r => r.id !== threadId))
    
    // Navigate to conversation
    navigate(`/messages/${threadId}`)
  }

  async function handleDecline(threadId) {
    // Delete the thread (or set to blocked)
    await supabase
      .from('dm_threads')
      .update({ status: 'blocked' })
      .eq('id', threadId)
    
    setRequests(prev => prev.filter(r => r.id !== threadId))
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-primary pl-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <Link to="/messages" className="hover:text-primary transition-colors">Messages</Link>
            <span>/</span>
            <span className="text-white">Requests</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(37, 140, 244, 0.3)' }}>
            Comms Filter
          </h1>
          <p className="text-primary/80 font-mono text-sm tracking-widest mt-1">
            // MESSAGE_REQUESTS // PENDING_APPROVAL
          </p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded text-xs font-mono text-yellow-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">hourglass_top</span>
          PENDING: {requests.length}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-4 mb-6 flex items-start gap-4">
        <span className="material-symbols-outlined text-primary text-xl">info</span>
        <div>
          <p className="text-sm text-gray-400">
            Message requests are from users you don't follow. Accept to start a conversation, or decline to remove the request.
          </p>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center bg-[#0a1016] border border-white/10 rounded-lg p-8">
          <span className="material-symbols-outlined text-5xl text-gray-600 mb-4">mark_email_read</span>
          <h3 className="text-xl font-bold text-white mb-2">No Pending Requests</h3>
          <p className="text-gray-400">You're all caught up!</p>
          <Link to="/messages" className="mt-4 text-primary hover:underline">
            Back to Messages
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(request => (
            <div key={request.id} className="bg-[#0a1016] border border-white/10 rounded-lg p-4 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  {request.profiles?.avatar_url ? (
                    <img src={request.profiles.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-primary">person</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">{request.profiles?.username}</span>
                    <span className="text-xs text-gray-500">LVL {request.profiles?.level}</span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{request.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary/80 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDecline(request.id)}
                    className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 text-sm font-bold rounded hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
