import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function NewMessagePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const targetUserId = searchParams.get('user')

  const [recipient, setRecipient] = useState(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [canDirectMessage, setCanDirectMessage] = useState(false)
  const [followStatus, setFollowStatus] = useState({ iFollow: false, theyFollow: false })

  useEffect(() => {
    if (targetUserId && user) {
      loadRecipient()
      checkFollowStatus()
    }
  }, [targetUserId, user])

  async function loadRecipient() {
    const { data } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .eq('id', targetUserId)
      .single()

    if (data) setRecipient(data)
  }

  async function checkFollowStatus() {
    // Check if current user follows recipient
    const { data: iFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single()

    // Check if recipient follows current user
    const { data: theyFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', targetUserId)
      .eq('following_id', user.id)
      .single()

    const status = {
      iFollow: !!iFollow,
      theyFollow: !!theyFollow
    }

    setFollowStatus(status)
    
    // Can direct message if mutual follow
    setCanDirectMessage(status.iFollow && status.theyFollow)
  }

  async function handleSend() {
    if (!message.trim() || !recipient) return

    setSending(true)

    try {
      if (canDirectMessage) {
        // Mutual follow - create/get DM thread and send message
        const { data: threadId, error: threadError } = await supabase
          .rpc('get_or_create_dm_thread', {
            user1: user.id,
            user2: recipient.id
          })

        if (threadError) throw threadError

        const { error: msgError } = await supabase
          .from('dm_messages')
          .insert({
            thread_id: threadId,
            sender_id: user.id,
            content: message
          })

        if (msgError) throw msgError

        navigate(`/messages/${threadId}`)
      } else {
        // Not mutual follow - create pending DM thread as message request
        // Create thread with pending status
        const { data: newThread, error: threadError } = await supabase
          .from('dm_threads')
          .insert({ status: 'pending', created_by: user.id })
          .select('id')
          .single()

        if (threadError) throw threadError

        // Add both members
        await supabase.from('dm_members').insert([
          { thread_id: newThread.id, user_id: user.id },
          { thread_id: newThread.id, user_id: recipient.id }
        ])

        // Send the initial message
        await supabase.from('dm_messages').insert({
          thread_id: newThread.id,
          sender_id: user.id,
          content: message
        })

        alert('Message request sent!')
        navigate('/messages')
      }
    } catch (error) {
      console.error('Send error:', error)
      alert('Failed to send message')
    }

    setSending(false)
  }

  if (!recipient) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-primary text-4xl animate-pulse">sync</span>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-sm font-medium">Back</span>
        </button>

        <h1 className="text-3xl font-bold text-white mb-2">New Message</h1>
        <p className="text-gray-400 text-sm">
          {canDirectMessage 
            ? 'You and this user follow each other - you can message directly'
            : 'Send a message request to start a conversation'
          }
        </p>
      </div>

      {/* Recipient Card */}
      <div className="bg-[#0a1016] border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-primary/30"
            style={{ backgroundImage: recipient.avatar_url ? `url('${recipient.avatar_url}')` : 'none', backgroundColor: '#1a1a1a' }}
          >
            {!recipient.avatar_url && (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-600 text-2xl">person</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{recipient.display_name || recipient.username}</h3>
            <p className="text-sm text-gray-400">@{recipient.username}</p>
          </div>
          <div className="text-right">
            {followStatus.iFollow && followStatus.theyFollow && (
              <div className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/30">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Mutual Follow
              </div>
            )}
            {followStatus.iFollow && !followStatus.theyFollow && (
              <div className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                You follow them
              </div>
            )}
            {!followStatus.iFollow && followStatus.theyFollow && (
              <div className="text-xs text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/30">
                They follow you
              </div>
            )}
            {!followStatus.iFollow && !followStatus.theyFollow && (
              <div className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                No connection
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-[#0a1016] border border-white/10 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          {canDirectMessage ? 'Your Message' : 'Message Request'}
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={canDirectMessage ? 'Type your message...' : 'Introduce yourself...'}
          rows={6}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none resize-none"
        />

        {!canDirectMessage && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-yellow-400 text-xl">info</span>
              <div className="text-sm text-yellow-200">
                <p className="font-medium mb-1">Message Request</p>
                <p className="text-yellow-200/80">
                  Since you don't mutually follow each other, this will be sent as a message request. 
                  They can accept or decline your request.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-lg hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
          >
            {sending ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                Sending...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">send</span>
                {canDirectMessage ? 'Send Message' : 'Send Request'}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
