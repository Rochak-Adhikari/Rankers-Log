import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function GuildChatPage() {
  const { guildId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [guild, setGuild] = useState(null)
  const [memberCount, setMemberCount] = useState(0)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadGuildAndMessages()
    
    // Subscribe to new messages
    const subscription = supabase
      .channel(`guild_chat:${guildId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'guild_messages',
        filter: `guild_id=eq.${guildId}`
      }, async (payload) => {
        // Fetch the sender profile for the new message
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', payload.new.sender_id)
          .single()
        
        setMessages(prev => [...prev, { ...payload.new, profiles: profile }])
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [guildId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadGuildAndMessages() {
    setLoading(true)
    
    // Load guild info
    const { data: guildData } = await supabase
      .from('guilds')
      .select('*')
      .eq('id', guildId)
      .single()
    
    if (guildData) {
      setGuild(guildData)
      setMemberCount(guildData.member_count || 0)
    }

    // Load messages
    const { data } = await supabase
      .from('guild_messages')
      .select('*, profiles:sender_id(username, avatar_url)')
      .eq('guild_id', guildId)
      .order('created_at', { ascending: true })
      .limit(100)

    setMessages(data || [])
    setLoading(false)
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!newMessage.trim()) return

    const tempMessage = {
      id: `temp-${Date.now()}`,
      content: newMessage,
      created_at: new Date().toISOString(),
      user_id: user.id,
      profiles: { username: user.user_metadata?.username || 'You', avatar_url: '' }
    }

    setMessages(prev => [...prev, tempMessage])
    setNewMessage('')

    await supabase.from('guild_messages').insert({
      guild_id: guildId,
      user_id: user.id,
      content: newMessage
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] -mx-4 md:mx-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a1016] border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link to={`/guilds/${guildId}`} className="p-2 hover:bg-white/10 rounded transition-colors">
            <span className="material-symbols-outlined text-gray-400">arrow_back</span>
          </Link>
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">shield</span>
          </div>
          <div>
            <h2 className="font-bold text-white">{guild?.name || 'Guild Chat'}</h2>
            <p className="text-xs text-gray-400">Guild Chat • {memberCount} members</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded transition-colors">
            <span className="material-symbols-outlined text-gray-400">search</span>
          </button>
          <button className="p-2 hover:bg-white/10 rounded transition-colors">
            <span className="material-symbols-outlined text-gray-400">more_vert</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-dark">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const isOwn = msg.user_id === user?.id
              const showAvatar = index === 0 || messages[index - 1]?.profiles?.username !== msg.profiles?.username

              return (
                <div key={msg.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                  {showAvatar ? (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-sm">person</span>
                    </div>
                  ) : (
                    <div className="w-8 shrink-0"></div>
                  )}
                  <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                    {showAvatar && (
                      <p className={`text-xs text-gray-400 mb-1 ${isOwn ? 'text-right' : ''}`}>
                        {msg.profiles?.username}
                      </p>
                    )}
                    <div className={`px-4 py-2 rounded-lg ${
                      isOwn 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white/10 text-white rounded-tl-none'
                    }`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                    <p className={`text-[10px] text-gray-500 mt-1 ${isOwn ? 'text-right' : ''}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-[#0a1016] border-t border-white/10">
        <div className="flex gap-3">
          <button type="button" className="p-2 hover:bg-white/10 rounded transition-colors">
            <span className="material-symbols-outlined text-gray-400">add_circle</span>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black rounded-lg font-bold hover:from-[#FFA500] hover:to-[#FFD700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(255,215,0,0.3)]"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </form>
    </div>
  )
}
