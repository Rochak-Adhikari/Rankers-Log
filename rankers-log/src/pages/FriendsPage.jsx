import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function FriendsPage() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabFromUrl === 'followers' ? 'followers' : tabFromUrl === 'mutuals' ? 'mutuals' : 'following')
  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)
  const [counts, setCounts] = useState({ following: 0, followers: 0, mutuals: 0 })

  useEffect(() => {
    if (user) loadFriends()
  }, [user, activeTab])

  async function loadFriends() {
    setLoading(true)
    
    // Get counts
    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', user.id)

    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', user.id)

    setCounts({
      following: followingCount || 0,
      followers: followersCount || 0,
      mutuals: 0
    })

    // Load friends list based on active tab
    let query
    if (activeTab === 'following') {
      query = supabase
        .from('follows')
        .select('following_id, profiles!follows_following_id_fkey(id, username, display_name, avatar_url, title, level)')
        .eq('follower_id', user.id)
    } else {
      query = supabase
        .from('follows')
        .select('follower_id, profiles!follows_follower_id_fkey(id, username, display_name, avatar_url, title, level)')
        .eq('following_id', user.id)
    }

    const { data } = await query.limit(20)
    
    if (data) {
      const profiles = data.map(d => d.profiles).filter(Boolean)
      setFriends(profiles)
    } else {
      setFriends([])
    }

    setLoading(false)
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 'S': return 'text-primary border-primary/40 bg-primary/10'
      case 'A': return 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10'
      case 'B': return 'text-red-400 border-red-400/40 bg-red-400/10'
      case 'C': return 'text-gray-400 border-gray-400/40 bg-gray-400/10'
      default: return 'text-gray-400 border-gray-400/40 bg-gray-400/10'
    }
  }

  return (
    <>
      {/* Scanlines Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.15]" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1))', backgroundSize: '100% 4px' }}></div>
      
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="size-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              <p className="text-primary text-sm font-bold tracking-widest">NETWORK STATUS: ONLINE</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase" style={{ textShadow: '0 0 20px rgba(37, 140, 244, 0.3)' }}>
              Social Grid
            </h2>
            <p className="text-text-secondary mt-2 max-w-lg">Manage your alliances, track rival progress, and expand your network.</p>
          </div>
          
          {/* Search */}
          <div className="w-full md:w-auto min-w-[320px]">
            <label className="relative group block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-primary group-focus-within:text-white transition-colors">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-3 border border-primary/30 rounded bg-[#0a1016] text-white placeholder-text-secondary focus:outline-none focus:border-primary focus:shadow-[0_0_5px_theme(colors.primary),0_0_20px_rgba(37,140,244,0.5)] focus:bg-[#101a23] transition-all font-display tracking-wide" 
                placeholder="SCAN DATABASE FOR USERS..." 
                type="text"
              />
              <div className="absolute bottom-0 right-0 h-[2px] w-4 bg-primary"></div>
              <div className="absolute top-0 right-0 h-2 w-[2px] bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-end border-b border-primary/30 gap-8 mt-8">
          <button 
            onClick={() => setActiveTab('following')}
            className={`relative pb-4 px-2 group ${activeTab === 'following' ? '' : ''}`}
          >
            <span className={`text-lg font-bold tracking-wide transition-colors ${activeTab === 'following' ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}>FOLLOWING</span>
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded border ${activeTab === 'following' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-[#1a2332] text-text-secondary border-white/10'}`}>{counts.following}</span>
            <div className={`absolute bottom-0 left-0 w-full h-[3px] transition-colors ${activeTab === 'following' ? 'bg-primary shadow-[0_0_5px_theme(colors.primary),0_0_20px_rgba(37,140,244,0.5)]' : 'bg-transparent group-hover:bg-primary/50'}`}></div>
          </button>
          <button 
            onClick={() => setActiveTab('followers')}
            className="relative pb-4 px-2 group"
          >
            <span className={`text-lg font-bold tracking-wide transition-colors ${activeTab === 'followers' ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}>FOLLOWERS</span>
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded border ${activeTab === 'followers' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-[#1a2332] text-text-secondary border-white/10'}`}>{counts.followers}</span>
            <div className={`absolute bottom-0 left-0 w-full h-[3px] transition-colors ${activeTab === 'followers' ? 'bg-primary shadow-[0_0_5px_theme(colors.primary),0_0_20px_rgba(37,140,244,0.5)]' : 'bg-transparent group-hover:bg-primary/50'}`}></div>
          </button>
          <button 
            onClick={() => setActiveTab('mutuals')}
            className="relative pb-4 px-2 group"
          >
            <span className={`text-lg font-bold tracking-wide transition-colors ${activeTab === 'mutuals' ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}>MUTUALS</span>
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded border ${activeTab === 'mutuals' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-[#1a2332] text-text-secondary border-white/10'}`}>{counts.mutuals}</span>
            <div className={`absolute bottom-0 left-0 w-full h-[3px] transition-colors ${activeTab === 'mutuals' ? 'bg-primary shadow-[0_0_5px_theme(colors.primary),0_0_20px_rgba(37,140,244,0.5)]' : 'bg-transparent group-hover:bg-primary/50'}`}></div>
          </button>
        </div>
      </div>

      {/* Friends Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-gray-400 font-mono text-sm">SCANNING NETWORK...</p>
          </div>
        </div>
      ) : friends.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-[#0a1016]/50 rounded-lg border border-white/10">
          <span className="material-symbols-outlined text-5xl text-gray-600 mb-4">group_off</span>
          <p className="text-gray-400 text-lg font-bold mb-2">
            {activeTab === 'following' ? 'Not following anyone yet' : activeTab === 'followers' ? 'No followers yet' : 'No mutual connections'}
          </p>
          <p className="text-gray-500 text-sm mb-4">Use the search to find and connect with other users</p>
          <Link to="/search" className="px-6 py-2 bg-primary/20 border border-primary/30 text-primary rounded hover:bg-primary hover:text-white transition-all font-bold">
            Find Users
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-24">
          {friends.map((friend) => (
            <div key={friend.id} className="group relative bg-[#0a1016]/80 border border-primary/20 hover:border-primary transition-all duration-300 rounded p-4 flex items-center gap-4 hover:shadow-[0_0_2px_theme(colors.primary)] hover:bg-[#0f1721]">
              {/* Hex Avatar */}
              <div className="relative shrink-0">
                <div className="size-20 bg-primary/20 flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                  <div 
                    className="size-[74px] bg-cover bg-center flex items-center justify-center bg-gray-800"
                    style={{ 
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                      backgroundImage: friend.avatar_url ? `url('${friend.avatar_url}')` : 'none'
                    }}
                  >
                    {!friend.avatar_url && <span className="material-symbols-outlined text-gray-500 text-2xl">person</span>}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-primary">
                  <div className={`size-3 rounded-full ${friend.online ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-bold text-white truncate">{friend.username}</h3>
                  <span className={`text-[10px] font-mono px-1 rounded border ${getRankColor(friend.rank)}`}>{friend.rank}-RANK</span>
                </div>
                <p className="text-xs text-text-secondary mb-3 truncate">{friend.status}</p>
                <div className="flex gap-2">
                  <Link 
                    to={`/u/${friend.username}`}
                    className="flex-1 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/50 hover:border-primary rounded px-3 py-1.5 text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    VIEW
                  </Link>
                  <Link 
                    to="/messages"
                    className="size-8 flex items-center justify-center rounded border border-white/10 text-text-secondary hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </Link>
                </div>
              </div>
              
              {/* Decorative Corners */}
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary opacity-50 group-hover:opacity-100"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary opacity-50 group-hover:opacity-100"></div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
