import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function ConversationPage() {
  const { conversationId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [otherUser, setOtherUser] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (conversationId && user) {
      loadThread()
      loadMessages()
      
      // Subscribe to new messages
      const subscription = supabase
        .channel(`dm_thread:${conversationId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'dm_messages',
          filter: `thread_id=eq.${conversationId}`
        }, async (payload) => {
          // Fetch sender info for the new message
          const { data: sender } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', payload.new.sender_id)
            .single()
          
          setMessages(prev => [...prev, { ...payload.new, sender }])
          scrollToBottom()
        })
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [conversationId, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function loadThread() {
    // Get other participant
    const { data: members } = await supabase
      .from('dm_members')
      .select('user_id, profiles:user_id(id, username, display_name, avatar_url)')
      .eq('thread_id', conversationId)
      .neq('user_id', user.id)

    if (members && members.length > 0) {
      setOtherUser(members[0].profiles)
    }
  }

  async function loadMessages() {
    setLoading(true)

    const { data } = await supabase
      .from('dm_messages')
      .select('*, sender:sender_id(username, avatar_url)')
      .eq('thread_id', conversationId)
      .order('created_at', { ascending: true })

    setMessages(data || [])
    
    // Mark messages as read
    await supabase
      .from('dm_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('thread_id', conversationId)
      .neq('sender_id', user.id)
      .is('read_at', null)

    setLoading(false)
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)

    const { error } = await supabase
      .from('dm_messages')
      .insert({
        thread_id: conversationId,
        sender_id: user.id,
        content: newMessage.trim()
      })

    if (!error) {
      setNewMessage('')
    } else {
      alert('Failed to send message')
    }

    setSending(false)
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function formatTime(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else if (hours < 48) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-primary text-4xl animate-pulse">sync</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="bg-[#0a1016] border-b border-white/10 p-4 flex items-center gap-4">
        <button 
          onClick={() => navigate('/messages')}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        
        {otherUser && (
          <>
            <div 
              className="w-10 h-10 rounded-full bg-cover bg-center border border-white/20"
              style={{ backgroundImage: otherUser.avatar_url ? `url('${otherUser.avatar_url}')` : 'none', backgroundColor: '#1a1a1a' }}
            >
              {!otherUser.avatar_url && (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-600">person</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-white">{otherUser.display_name || otherUser.username}</h2>
              <p className="text-xs text-gray-400">@{otherUser.username}</p>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <span className="material-symbols-outlined text-gray-600 text-5xl mb-3">chat_bubble</span>
            <p className="text-gray-500">No messages yet</p>
            <p className="text-gray-600 text-sm mt-1">Send a message to start the conversation</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn = msg.sender_id === user.id
            const showAvatar = index === 0 || messages[index - 1].sender_id !== msg.sender_id

            return (
              <div key={msg.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                {showAvatar ? (
                  <div 
                    className="w-8 h-8 rounded-full bg-cover bg-center border border-white/20 shrink-0"
                    style={{ backgroundImage: msg.sender?.avatar_url ? `url('${msg.sender.avatar_url}')` : 'none', backgroundColor: '#1a1a1a' }}
                  >
                    {!msg.sender?.avatar_url && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-gray-600 text-sm">person</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-8 shrink-0"></div>
                )}
                
                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  <div className={`px-4 py-2 rounded-2xl ${
                    isOwn 
                      ? 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black' 
                      : 'bg-white/5 border border-white/10 text-white'
                  }`}>
                    <p className="text-sm break-words">{msg.content}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 px-2">{formatTime(msg.created_at)}</span>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="bg-[#0a1016] border-t border-white/10 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold px-6 py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
          >
            {sending ? (
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            ) : (
              <span className="material-symbols-outlined text-sm">send</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
