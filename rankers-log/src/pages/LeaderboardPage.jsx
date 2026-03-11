import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { RANKS } from '../constants'

export function LeaderboardPage() {
  const { user } = useAuth()
  const [rankers, setRankers] = useState([])
  const [loading, setLoading] = useState(true)
  // 'friends' and 'guild' tabs are placeholders for Sprint 2
  const [activeTab] = useState('global')

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  async function fetchLeaderboard() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, level, xp, rank')
      .order('xp', { ascending: false })
      .limit(50)

    if (!error && data) {
      setRankers(data)
    }
    setLoading(false)
  }

  // Derive badge color from rank string
  function rankColor(rank) {
    const colors = {
      S: 'text-[#ff0055]',
      A: 'text-[#FFD700]',
      B: 'text-primary',
      C: 'text-emerald-400',
      D: 'text-gray-400',
      E: 'text-gray-500',
    }
    return colors[rank] || 'text-gray-500'
  }

  function formatXP(xp) {
    if (xp == null) return '—'
    if (xp >= 1_000_000) return `${(xp / 1_000_000).toFixed(1)}M`
    if (xp >= 1_000) return `${(xp / 1_000).toFixed(1)}K`
    return xp.toString()
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-[#FFD700] pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white neon-text-gold">
            Rankings
          </h1>
          <p className="text-[#FFD700]/80 font-mono text-sm tracking-widest mt-1">
            // GLOBAL LEADERBOARD // LIVE DATA
          </p>
        </div>
        <div className="flex gap-2">
          {/* Global — active */}
          <button className="bg-[#FFD700]/10 border border-[#FFD700]/30 px-4 py-2 rounded text-xs font-bold text-[#FFD700] uppercase tracking-wider shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            Global
          </button>
          {/* Friends & Guild — not yet implemented */}
          <button
            title="Friends leaderboard coming soon"
            className="bg-white/5 border border-white/10 px-4 py-2 rounded text-xs font-bold text-gray-600 uppercase tracking-wider cursor-not-allowed opacity-50"
            disabled
          >
            Friends
          </button>
          <button
            title="Guild leaderboard coming soon"
            className="bg-white/5 border border-white/10 px-4 py-2 rounded text-xs font-bold text-gray-600 uppercase tracking-wider cursor-not-allowed opacity-50"
            disabled
          >
            Guild
          </button>
        </div>
      </div>

      {/* Rankings List */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
          </div>
        ) : rankers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-gray-600 text-5xl mb-3">leaderboard</span>
            <p className="text-gray-400">No rankers yet.</p>
            <p className="text-gray-600 text-sm mt-1">Rankings will appear as users earn XP.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {rankers.map((ranker, index) => {
              const position = index + 1
              const isMe = ranker.id === user?.id
              return (
                <Link
                  to={`/u/${ranker.username}`}
                  key={ranker.id}
                  className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors ${
                    isMe ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                  }`}
                >
                  {/* Rank Position */}
                  <div className={`w-10 text-center font-bold text-lg ${
                    position <= 3 ? 'text-[#FFD700]' : 'text-gray-500'
                  }`}>
                    #{position}
                  </div>

                  {/* Avatar */}
                  <div
                    className="hexagon-mask size-12 bg-gray-800 bg-cover bg-center shrink-0 flex items-center justify-center"
                    style={ranker.avatar_url ? { backgroundImage: `url('${ranker.avatar_url}')` } : {}}
                  >
                    {!ranker.avatar_url && (
                      <span className="material-symbols-outlined text-gray-600">person</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white truncate hover:text-primary transition-colors">
                        {ranker.display_name || ranker.username}
                      </h3>
                      {isMe && (
                        <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded shrink-0">YOU</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">@{ranker.username} · Level {ranker.level ?? '—'}</p>
                  </div>

                  {/* Rank Badge */}
                  {ranker.rank && (
                    <div className={`text-2xl font-black ${rankColor(ranker.rank)}`}>
                      {ranker.rank}
                    </div>
                  )}

                  {/* XP */}
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-white">{formatXP(ranker.xp)}</p>
                    <p className="text-[10px] text-gray-500 uppercase">XP</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
