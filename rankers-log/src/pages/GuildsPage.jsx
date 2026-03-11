import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function GuildsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [guilds, setGuilds] = useState([])
  const [myGuildIds, setMyGuildIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGuilds()
  }, [user])

  async function loadGuilds() {
    setLoading(true)
    
    // Fetch all public guilds
    const { data: guildsData } = await supabase
      .from('guilds')
      .select('*')
      .eq('is_public', true)
      .order('member_count', { ascending: false })
    
    setGuilds(guildsData || [])

    // Check which guilds user is a member of
    if (user) {
      const { data: memberships } = await supabase
        .from('guild_members')
        .select('guild_id')
        .eq('user_id', user.id)
      
      if (memberships) {
        setMyGuildIds(new Set(memberships.map(m => m.guild_id)))
      }
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
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-[#BF00FF] pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white neon-text-purple">
            Guild Hub
          </h1>
          <p className="text-[#BF00FF]/80 font-mono text-sm tracking-widest mt-1">
            // FACTION DIRECTORY // JOIN THE RANKS
          </p>
        </div>
        <button 
          onClick={() => navigate('/guilds/create')}
          className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] px-4 py-2 rounded text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Create Guild
        </button>
      </div>

      {/* Guild Cards */}
      {guilds.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-16 bg-[#0a1016] border border-white/10 rounded-xl">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">groups</span>
          <h3 className="text-xl font-bold text-white mb-2">No Guilds Yet</h3>
          <p className="text-gray-500 mb-6">Be the first to create a guild!</p>
          <button
            onClick={() => navigate('/guilds/create')}
            className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] px-6 py-2 rounded font-bold text-black"
          >
            Create Guild
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guilds.map((guild) => {
            const isJoined = myGuildIds.has(guild.id)
            return (
              <Link key={guild.id} to={`/guilds/${guild.id}`} className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:border-[#BF00FF]/50 transition-colors block">
                {/* Banner */}
                <div className="relative h-32 overflow-hidden">
                  {guild.banner_url ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url('${guild.banner_url}')` }}
                    ></div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#BF00FF]/20 to-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-5xl text-white/20">shield</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14] to-transparent"></div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-[#BF00FF]">
                    RANK {guild.rank || 'E'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-white text-lg mb-1 group-hover:text-[#BF00FF] transition-colors">{guild.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{guild.description || 'No description'}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="material-symbols-outlined text-sm">group</span>
                      {(guild.member_count || 0).toLocaleString()} members
                    </div>
                    {isJoined ? (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        JOINED
                      </span>
                    ) : (
                      <span className="bg-[#BF00FF]/10 border border-[#BF00FF]/30 px-3 py-1 rounded text-xs font-bold text-[#BF00FF] group-hover:bg-[#BF00FF] group-hover:text-white transition-all">
                        VIEW
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
