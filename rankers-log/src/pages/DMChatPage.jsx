import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function DMChatPage() {
  const { threadId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [otherUser, setOtherUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (user && threadId) {
      fetchThread()
      markMessagesAsRead()
    }
  }, [user, threadId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  async function fetchThread() {
    setLoading(true)

    // Get other user in thread
    const { data: members } = await supabase
      .from('dm_members')
      .select(`
        user_id,
        profiles:user_id (username, avatar_url, display_name)
      `)
      .eq('thread_id', threadId)
      .neq('user_id', user.id)

    if (members && members.length > 0) {
      setOtherUser(members[0].profiles)
    }

    // Get messages
    const { data: msgs } = await supabase
      .from('dm_messages')
      .select(`
        *,
        sender:sender_id (username, avatar_url, display_name)
      `)
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true })

    if (msgs) setMessages(msgs)
    setLoading(false)
  }

  async function markMessagesAsRead() {
    await supabase
      .from('dm_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('thread_id', threadId)
      .neq('sender_id', user.id)
      .is('read_at', null)
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const messageContent = newMessage.trim()
    setNewMessage('')

    // Optimistic update
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      thread_id: threadId,
      sender_id: user.id,
      content: messageContent,
      created_at: new Date().toISOString(),
      sender: {
        username: user.user_metadata?.username || 'You',
        avatar_url: null,
        display_name: user.user_metadata?.username || 'You'
      }
    }
    setMessages(prev => [...prev, optimisticMsg])

    const { data, error } = await supabase
      .from('dm_messages')
      .insert({
        thread_id: threadId,
        sender_id: user.id,
        content: messageContent
      })
      .select(`
        *,
        sender:sender_id (username, avatar_url, display_name)
      `)
      .single()

    if (error) {
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id))
      console.error('Error sending message:', error)
    } else if (data) {
      setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? data : m))
    }

    setSending(false)
  }

  function formatTime(dateString) {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function formatDate(dateString) {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  // Group messages by date
  function groupMessagesByDate(msgs) {
    const groups = []
    let currentDate = null

    msgs.forEach(msg => {
      const msgDate = new Date(msg.created_at).toDateString()
      if (msgDate !== currentDate) {
        currentDate = msgDate
        groups.push({ type: 'date', date: msg.created_at })
      }
      groups.push({ type: 'message', ...msg })
    })

    return groups
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-primary text-4xl animate-pulse">sync</span>
      </div>
    )
  }

  const groupedMessages = groupMessagesByDate(messages)

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="glass-panel rounded-t-xl p-4 border-b border-white/10 flex items-center gap-4">
        <Link to="/messages" className="text-gray-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div
          className="hexagon-mask size-10 bg-gray-800 bg-cover bg-center flex items-center justify-center"
          style={otherUser?.avatar_url ? { backgroundImage: `url("${otherUser.avatar_url}")` } : {}}
        >
          {!otherUser?.avatar_url && (
            <span className="material-symbols-outlined text-gray-600">person</span>
          )}
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-white">{otherUser?.display_name || otherUser?.username || 'Unknown'}</h2>
          <p className="text-xs text-gray-500">@{otherUser?.username || 'unknown'}</p>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 glass-panel">
        {groupedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="material-symbols-outlined text-gray-600 text-5xl mb-3">chat</span>
            <p className="text-gray-500 text-sm">No messages yet</p>
            <p className="text-gray-600 text-xs">Send a message to start the conversation</p>
          </div>
        ) : (
          groupedMessages.map((item, index) => {
            if (item.type === 'date') {
              return (
                <div key={`date-${index}`} className="flex justify-center">
                  <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                    {formatDate(item.date)}
                  </span>
                </div>
              )
            }

            const isOwn = item.sender_id === user.id

            return (
              <div
                key={item.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isOwn ? 'order-2' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-white/10 text-white rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{item.content}</p>
                  </div>
                  <p className={`text-[10px] text-gray-500 mt-1 ${isOwn ? 'text-right' : ''}`}>
                    {formatTime(item.created_at)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="glass-panel rounded-b-xl p-4 border-t border-white/10">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold px-6 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </form>
    </div>
  )
}
