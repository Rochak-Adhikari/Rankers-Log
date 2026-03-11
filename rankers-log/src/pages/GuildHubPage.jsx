import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function GuildHubPage() {
  const { guildId } = useParams()
  const { user } = useAuth()
  const [guild, setGuild] = useState(null)
  const [members, setMembers] = useState([])
  const [activeQuests, setActiveQuests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGuildData()
  }, [guildId])

  async function loadGuildData() {
    setLoading(true)
    
    // Fetch guild info
    const { data: guildData } = await supabase
      .from('guilds')
      .select('*')
      .eq('id', guildId)
      .single()
    
    if (guildData) {
      setGuild(guildData)
    }

    // Fetch real guild members
    const { data: membersData } = await supabase
      .from('guild_members')
      .select('*, profiles:user_id(id, username, avatar_url, level)')
      .eq('guild_id', guildId)
    
    if (membersData) {
      setMembers(membersData.map(m => ({
        id: m.profiles?.id,
        username: m.profiles?.username,
        role: m.role,
        level: m.profiles?.level || 1,
        avatar_url: m.profiles?.avatar_url,
        online: false
      })))
    } else {
      setMembers([])
    }

    // Note: guild_quests table may not exist yet, handle gracefully
    try {
      const { data: questsData } = await supabase
        .from('guild_quests')
        .select('*')
        .eq('guild_id', guildId)
        .eq('status', 'active')
      
      setActiveQuests(questsData || [])
    } catch {
      setActiveQuests([])
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    )
  }

  return (
    <>
      {/* Header with Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/guilds/${guildId}`} className="p-2 hover:bg-white/10 rounded transition-colors">
          <span className="material-symbols-outlined text-gray-400">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase">{guild?.name || 'Guild Hub'}</h1>
          <p className="text-xs text-primary font-mono">CORE OPERATIONS // GUILD HUB</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Link to={`/guilds/${guildId}/chat`} className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center hover:border-primary/50 transition-all group">
          <span className="material-symbols-outlined text-2xl text-primary mb-2">forum</span>
          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Guild Chat</p>
        </Link>
        <Link to={`/guilds/${guildId}`} className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center hover:border-primary/50 transition-all group">
          <span className="material-symbols-outlined text-2xl text-primary mb-2">group</span>
          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Members</p>
        </Link>
        <button className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center hover:border-primary/50 transition-all group">
          <span className="material-symbols-outlined text-2xl text-primary mb-2">leaderboard</span>
          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Rankings</p>
        </button>
        <Link to={`/guilds/${guildId}/settings`} className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center hover:border-primary/50 transition-all group">
          <span className="material-symbols-outlined text-2xl text-primary mb-2">settings</span>
          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Settings</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Quests */}
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">assignment</span>
            Active Guild Quests
          </h3>
          <div className="space-y-4">
            {activeQuests.map(quest => (
              <div key={quest.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white">{quest.name}</h4>
                  <span className="text-xs text-gray-400">{quest.deadline} left</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{quest.progress}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${quest.progress >= 90 ? 'bg-green-500' : 'bg-primary'}`}
                      style={{ width: `${quest.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-rank-gold">
                  <span className="material-symbols-outlined text-sm">paid</span>
                  {quest.reward} coins
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Online Members */}
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-green-400">circle</span>
            Online Members ({members.filter(m => m.online).length})
          </h3>
          <div className="space-y-3">
            {members.filter(m => m.online).map(member => (
              <div key={member.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-sm">person</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a1016]"></div>
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

        {/* Guild Stats */}
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">analytics</span>
            Guild Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg text-center">
              <p className="text-2xl font-black text-white">{guild?.member_count || members.length}</p>
              <p className="text-xs text-gray-400">Total Members</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg text-center">
              <p className="text-2xl font-black text-primary">{(guild?.xp || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-400">Total XP</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg text-center">
              <p className="text-2xl font-black text-rank-gold">LVL {guild?.level || 1}</p>
              <p className="text-xs text-gray-400">Guild Level</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg text-center">
              <p className="text-2xl font-black text-green-400">{activeQuests.length}</p>
              <p className="text-xs text-gray-400">Active Quests</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-green-400 text-base">person_add</span>
              <span className="text-gray-400"><span className="text-white">NewMember</span> joined the guild</span>
              <span className="text-xs text-gray-500 ml-auto">2h ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-primary text-base">emoji_events</span>
              <span className="text-gray-400">Guild reached <span className="text-white">Level 45</span></span>
              <span className="text-xs text-gray-500 ml-auto">1d ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="material-symbols-outlined text-rank-gold text-base">assignment_turned_in</span>
              <span className="text-gray-400">Completed quest: <span className="text-white">Weekly Raid</span></span>
              <span className="text-xs text-gray-500 ml-auto">2d ago</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
