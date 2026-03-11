import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function GuildProfilePage() {
  const { guildId } = useParams()
  const { user } = useAuth()
  const [guild, setGuild] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    loadGuild()
  }, [guildId])

  async function loadGuild() {
    setLoading(true)
    
    const { data: guildData } = await supabase
      .from('guilds')
      .select('*')
      .eq('id', guildId)
      .single()

    if (guildData) {
      setGuild(guildData)
      
      // Load real guild members
      const { data: membersData } = await supabase
        .from('guild_members')
        .select('*, profiles:user_id(id, username, avatar_url, level)')
        .eq('guild_id', guildId)
      
      if (membersData) {
        setMembers(membersData.map(m => ({
          id: m.profiles.id,
          username: m.profiles.username,
          role: m.role,
          level: m.profiles.level,
          avatar_url: m.profiles.avatar_url
        })))
      }
    } else {
      setNotFound(true)
    }

    setLoading(false)
  }

  async function handleJoinLeave() {
    if (isMember) {
      await supabase.from('guild_members').delete().eq('user_id', user.id).eq('guild_id', guildId)
    } else {
      await supabase.from('guild_members').insert({ user_id: user.id, guild_id: guildId, role: 'member' })
    }
    setIsMember(!isMember)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <p className="text-gray-400 font-mono text-sm">LOADING GUILD DATA...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="material-symbols-outlined text-gray-600 text-6xl mb-4">groups_off</span>
        <h2 className="text-2xl font-bold text-white mb-2">Guild Not Found</h2>
        <p className="text-gray-500 mb-6">This guild doesn't exist or has been disbanded.</p>
        <Link to="/guilds" className="text-primary hover:text-white transition-colors">
          ← Browse Guilds
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Guild Banner */}
      <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-6 -mx-4 md:mx-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${guild?.banner_url}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent"></div>
        <div className="absolute bottom-4 left-4 md:left-6 flex items-end gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-primary/20 border-2 border-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl md:text-5xl text-primary">shield</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-rank-gold/20 text-rank-gold text-xs font-bold rounded border border-rank-gold/30">RANK {guild?.rank}</span>
              <span className="text-xs text-gray-400">LVL {guild?.level}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">{guild?.name}</h1>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleJoinLeave}
          className={`px-6 py-2 rounded font-bold transition-all flex items-center gap-2 ${
            isMember 
              ? 'bg-white/5 border border-white/10 text-white hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400'
              : 'bg-primary text-white hover:bg-primary/80'
          }`}
        >
          <span className="material-symbols-outlined">{isMember ? 'logout' : 'group_add'}</span>
          {isMember ? 'Leave Guild' : 'Join Guild'}
        </button>
        <Link to={`/guilds/${guildId}/hub`} className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded font-bold hover:bg-white/10 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">hub</span>
          Guild Hub
        </Link>
        <Link to={`/guilds/${guildId}/chat`} className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded font-bold hover:bg-white/10 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined">forum</span>
          Guild Chat
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-black text-white">{guild?.member_count}</p>
          <p className="text-xs text-gray-400 font-mono uppercase">Members</p>
        </div>
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-black text-primary">{guild?.xp?.toLocaleString()}</p>
          <p className="text-xs text-gray-400 font-mono uppercase">Total XP</p>
        </div>
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-black text-rank-gold">#12</p>
          <p className="text-xs text-gray-400 font-mono uppercase">Ranking</p>
        </div>
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center">
          <p className="text-2xl font-black text-white">156</p>
          <p className="text-xs text-gray-400 font-mono uppercase">Quests Done</p>
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">description</span>
          About
        </h3>
        <p className="text-gray-400">{guild?.description}</p>
        <p className="text-xs text-gray-500 font-mono mt-4">
          Founded: {new Date(guild?.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Members Preview */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">group</span>
            Members
          </h3>
          <Link to={`/guilds/${guildId}/hub`} className="text-sm text-primary hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {members.map(member => (
            <div key={member.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-white">{member.username}</p>
                <p className="text-xs text-gray-400">LVL {member.level}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                member.role === 'owner' ? 'bg-rank-gold/20 text-rank-gold' :
                member.role === 'admin' ? 'bg-primary/20 text-primary' :
                'bg-white/10 text-gray-400'
              }`}>
                {member.role.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
