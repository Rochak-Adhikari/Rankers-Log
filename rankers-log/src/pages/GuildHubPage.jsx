import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function GuildHubPage() {
  const { guildId } = useParams()
  const { user } = useAuth()
  const [guild, setGuild] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGuildData()
  }, [guildId])

  async function loadGuildData() {
    setLoading(true)

    const { data: guildData } = await supabase
      .from('guilds')
      .select('*')
      .eq('id', guildId)
      .single()

    if (guildData) {
      setGuild(guildData)
    }

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
        avatar_url: m.profiles?.avatar_url
      })))
    } else {
      setMembers([])
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

  // Determine if current user is an owner or admin for showing the settings link
  const myRole = members.find(m => m.id === user?.id)?.role
  const canManage = myRole === 'owner' || myRole === 'admin'

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
        <Link
          to={`/guilds/${guildId}/chat`}
          className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center hover:border-primary/50 transition-all group"
        >
          <span className="material-symbols-outlined text-2xl text-primary mb-2 block">forum</span>
          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Guild Chat</p>
        </Link>
        <Link
          to={`/guilds/${guildId}`}
          className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center hover:border-primary/50 transition-all group"
        >
          <span className="material-symbols-outlined text-2xl text-primary mb-2 block">group</span>
          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Members</p>
        </Link>
        {/* Rankings not yet implemented — show disabled */}
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center opacity-40 cursor-not-allowed">
          <span className="material-symbols-outlined text-2xl text-gray-500 mb-2 block">leaderboard</span>
          <p className="text-sm font-bold text-gray-500">Rankings</p>
          <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Soon</span>
        </div>
        {canManage ? (
          <Link
            to={`/guilds/${guildId}/settings`}
            className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center hover:border-primary/50 transition-all group"
          >
            <span className="material-symbols-outlined text-2xl text-primary mb-2 block">settings</span>
            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Settings</p>
          </Link>
        ) : (
          <div className="bg-[#0a1016] border border-white/10 rounded-lg p-4 text-center opacity-40 cursor-not-allowed">
            <span className="material-symbols-outlined text-2xl text-gray-500 mb-2 block">settings</span>
            <p className="text-sm font-bold text-gray-500">Settings</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Quests — not yet implemented */}
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">assignment</span>
            Active Guild Quests
          </h3>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="material-symbols-outlined text-gray-600 text-5xl mb-3">assignment</span>
            <p className="text-gray-500 text-sm">Guild quests are coming soon.</p>
            <p className="text-gray-600 text-xs mt-1">Check back after the Quest Board is live.</p>
          </div>
        </div>

        {/* Real Members List */}
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">group</span>
            Members ({members.length})
          </h3>
          {members.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="material-symbols-outlined text-gray-600 text-4xl mb-2">person_off</span>
              <p className="text-gray-500 text-sm">No members yet.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto no-scrollbar">
              {members.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="material-symbols-outlined text-primary text-sm">person</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{member.username}</p>
                    <p className="text-xs text-gray-400">LVL {member.level}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    member.role === 'owner'
                      ? 'bg-rank-gold/20 text-rank-gold'
                      : member.role === 'admin'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {member.role?.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guild Stats — only real values */}
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">analytics</span>
            Guild Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg text-center">
              <p className="text-2xl font-black text-white">{guild?.member_count ?? members.length}</p>
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
            {/* Active quests count not yet available */}
            <div className="p-4 bg-white/5 rounded-lg text-center opacity-50">
              <p className="text-2xl font-black text-gray-500">—</p>
              <p className="text-xs text-gray-400">Active Quests</p>
            </div>
          </div>
        </div>

        {/* Recent Activity — not yet implemented, show honest empty state */}
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Recent Activity
          </h3>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="material-symbols-outlined text-gray-600 text-4xl mb-3">history_toggle_off</span>
            <p className="text-gray-500 text-sm">Activity log is coming soon.</p>
          </div>
        </div>
      </div>
    </>
  )
}
