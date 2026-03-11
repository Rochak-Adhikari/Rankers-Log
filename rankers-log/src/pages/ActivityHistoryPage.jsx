import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function ActivityHistoryPage() {
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState({ rank: 'S-CLASS', xp: 45200, achievements: 142 })

  useEffect(() => {
    if (user) loadActivities()
  }, [user, filter])

  async function loadActivities() {
    setLoading(true)
    
    let query = supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (filter !== 'all') {
      query = query.eq('media_type', filter)
    }

    const { data } = await query

    if (data && data.length > 0) {
      setActivities(data.map(post => ({
        id: post.id,
        type: post.media_type || 'anime',
        title: post.title_name || 'Unknown Title',
        subtitle: post.content || '',
        progress: `${post.media_type?.toUpperCase() || 'EPISODE'} ${post.progress || 0}`,
        xp: post.xp_earned || 50,
        date: new Date(post.created_at).toLocaleString(),
        rating: post.rating
      })))
    } else {
      // Mock data for UI display
      setActivities([
        { id: 1, type: 'anime', title: 'Attack on Titan: Final Season', subtitle: 'Rated 5/5 • Completed', progress: 'EPISODE 28/28', xp: 500, date: '2023.10.27 - 14:00', rating: 5 },
        { id: 2, type: 'game', title: 'Boss Defeated: Malenia', subtitle: 'Elden Ring • Hard Mode', progress: 'Blade of Miquella', xp: 2000, date: '2023.10.26 - 22:45' },
        { id: 3, type: 'manga', title: 'Solo Leveling', subtitle: 'Manhwa • Reading', progress: 'CHAPTER 150', xp: 50, date: '2023.10.25 - 09:15' },
        { id: 4, type: 'quest', title: 'Weekly Review Challenge', subtitle: 'System Reward • Recurring', progress: 'COMPLETE', xp: 150, date: '2023.10.24 - 18:00' }
      ])
    }

    setLoading(false)
  }

  const getTypeStyles = (type) => {
    switch (type) {
      case 'anime': return { border: 'border-primary', bg: 'bg-primary', text: 'text-primary', icon: 'play_circle' }
      case 'game': return { border: 'border-red-500', bg: 'bg-red-500', text: 'text-red-500', icon: 'swords' }
      case 'manga': return { border: 'border-green-500', bg: 'bg-green-500', text: 'text-green-500', icon: 'auto_stories' }
      case 'quest': return { border: 'border-purple-500', bg: 'bg-purple-500', text: 'text-purple-500', icon: 'assignment_turned_in' }
      default: return { border: 'border-primary', bg: 'bg-primary', text: 'text-primary', icon: 'play_circle' }
    }
  }

  return (
    <>
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(rgba(37, 140, 244, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 140, 244, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Header Section */}
      <section className="flex flex-col gap-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-l-2 border-primary pl-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">ACTIVITY LOG</h1>
            <p className="text-primary/60 font-mono text-sm tracking-widest uppercase">Synchronizing Data Stream...</p>
          </div>
          <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1 rounded border border-green-500/20">
            <span className="material-symbols-outlined text-sm">wifi</span>
            <span className="text-xs font-bold tracking-widest">ONLINE</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="relative group bg-[#0f161e]/60 backdrop-blur-sm border border-white/10 rounded-lg p-5 overflow-hidden hover:border-primary/50 transition-all duration-300">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity text-primary">
              <span className="material-symbols-outlined text-3xl">military_tech</span>
            </div>
            <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-1">Current Rank</p>
            <p className="text-3xl font-bold text-white group-hover:text-primary transition-colors">{stats.rank}</p>
            <div className="w-full bg-white/5 h-1 mt-4 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[85%] shadow-[0_0_8px_rgba(37,140,244,0.4)]"></div>
            </div>
          </div>
          <div className="relative group bg-[#0f161e]/60 backdrop-blur-sm border border-white/10 rounded-lg p-5 overflow-hidden hover:border-primary/50 transition-all duration-300">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity text-primary">
              <span className="material-symbols-outlined text-3xl">bolt</span>
            </div>
            <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-1">Total XP</p>
            <p className="text-3xl font-bold text-white group-hover:text-primary transition-colors">{stats.xp.toLocaleString()}</p>
            <p className="text-xs text-primary/70 mt-3 font-mono">+1,240 this week</p>
          </div>
          <div className="relative group bg-[#0f161e]/60 backdrop-blur-sm border border-white/10 rounded-lg p-5 overflow-hidden hover:border-primary/50 transition-all duration-300">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity text-primary">
              <span className="material-symbols-outlined text-3xl">trophy</span>
            </div>
            <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-1">Achievements</p>
            <p className="text-3xl font-bold text-white group-hover:text-primary transition-colors">{stats.achievements}</p>
            <p className="text-xs text-gray-500 mt-3 font-mono">Latest: God Slayer</p>
          </div>
        </div>
      </section>

      {/* Filter Matrix */}
      <section className="flex flex-wrap justify-center gap-3 md:gap-6 py-4 sticky top-0 z-30 bg-background-dark/90 backdrop-blur-lg border-y border-white/5 my-6 -mx-4 px-4 md:mx-0 md:rounded-xl md:border md:bg-[#0f161e]/50">
        <button 
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 px-5 py-2 rounded border transition-transform active:scale-95 ${filter === 'all' ? 'bg-primary text-white border-primary shadow-[0_0_8px_rgba(37,140,244,0.4)]' : 'bg-white/5 text-gray-400 border-transparent hover:text-white hover:bg-white/10 hover:border-white/20'}`}
        >
          <span className="material-symbols-outlined text-sm">grid_view</span>
          <span className="text-sm font-bold tracking-wide">ALL LOGS</span>
        </button>
        <button 
          onClick={() => setFilter('anime')}
          className={`flex items-center gap-2 px-5 py-2 rounded border transition-all active:scale-95 group ${filter === 'anime' ? 'bg-primary text-white border-primary' : 'bg-white/5 text-gray-400 border-transparent hover:text-white hover:bg-white/10 hover:border-white/20'}`}
        >
          <span className="material-symbols-outlined text-sm group-hover:text-primary">movie</span>
          <span className="text-sm font-medium tracking-wide">ANIME</span>
        </button>
        <button 
          onClick={() => setFilter('manga')}
          className={`flex items-center gap-2 px-5 py-2 rounded border transition-all active:scale-95 group ${filter === 'manga' ? 'bg-primary text-white border-primary' : 'bg-white/5 text-gray-400 border-transparent hover:text-white hover:bg-white/10 hover:border-white/20'}`}
        >
          <span className="material-symbols-outlined text-sm group-hover:text-primary">auto_stories</span>
          <span className="text-sm font-medium tracking-wide">MANGA</span>
        </button>
        <button 
          onClick={() => setFilter('game')}
          className={`flex items-center gap-2 px-5 py-2 rounded border transition-all active:scale-95 group ${filter === 'game' ? 'bg-primary text-white border-primary' : 'bg-white/5 text-gray-400 border-transparent hover:text-white hover:bg-white/10 hover:border-white/20'}`}
        >
          <span className="material-symbols-outlined text-sm group-hover:text-primary">sports_esports</span>
          <span className="text-sm font-medium tracking-wide">GAMES</span>
        </button>
        <button 
          onClick={() => setFilter('quest')}
          className={`flex items-center gap-2 px-5 py-2 rounded border transition-all active:scale-95 group ${filter === 'quest' ? 'bg-primary text-white border-primary' : 'bg-white/5 text-gray-400 border-transparent hover:text-white hover:bg-white/10 hover:border-white/20'}`}
        >
          <span className="material-symbols-outlined text-sm group-hover:text-primary">assignment_late</span>
          <span className="text-sm font-medium tracking-wide">QUESTS</span>
        </button>
      </section>

      {/* Timeline */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-gray-400 font-mono text-sm">LOADING ACTIVITY LOG...</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full mt-4 pb-20">
          {/* Central Spine */}
          <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary/40 to-transparent shadow-[0_0_8px_rgba(37,140,244,0.6)] z-0"></div>

          {/* Timeline Entries */}
          <div className="flex flex-col gap-12 relative z-10">
            {activities.map((activity, index) => {
              const styles = getTypeStyles(activity.type)
              const isLeft = index % 2 === 1

              return (
                <div key={activity.id} className={`flex flex-col md:flex-row ${isLeft ? 'md:flex-row-reverse' : ''} items-center w-full group`}>
                  <div className="w-full md:w-[45%] hidden md:block"></div>
                  
                  {/* Center Icon Node */}
                  <div className={`absolute left-8 md:left-1/2 md:-translate-x-1/2 w-10 h-10 -translate-x-1/2 flex items-center justify-center bg-[#050505] border-2 ${styles.border} rounded-lg z-20 shadow-[0_0_15px_rgba(37,140,244,0.4)] group-hover:scale-110 transition-transform duration-300`}>
                    <span className={`material-symbols-outlined ${styles.text} text-sm`}>{styles.icon}</span>
                  </div>

                  {/* Card Content */}
                  <div className={`w-full md:w-[45%] pl-20 ${isLeft ? 'md:pr-10 md:pl-0' : 'md:pl-10'}`}>
                    <div className={`relative bg-[#0f161e]/80 backdrop-blur-md border ${styles.border}/30 p-5 ${isLeft ? 'rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm' : 'rounded-tr-xl rounded-bl-xl rounded-tl-sm rounded-br-sm'} hover:${styles.border} transition-colors duration-300 shadow-lg group-hover:shadow-[0_0_15px_rgba(37,140,244,0.2)]`}>
                      {/* Connector Line */}
                      <div className={`absolute top-1/2 ${isLeft ? '-left-12 md:left-auto md:-right-10' : '-left-12 md:-left-10'} w-8 md:w-10 h-[2px] ${styles.bg}/50 group-hover:${styles.bg} transition-colors`}></div>
                      <div className={`absolute top-1/2 ${isLeft ? '-left-[5px] md:left-auto md:-right-[5px]' : '-left-[5px]'} w-1.5 h-1.5 ${styles.bg} rotate-45`}></div>
                      
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-mono ${styles.text} border ${styles.border}/30 px-2 py-0.5 rounded ${styles.bg}/10`}>{activity.type.toUpperCase()}</span>
                        <span className="text-xs font-mono text-gray-500">{activity.date}</span>
                      </div>
                      <h3 className={`text-xl font-bold text-white mb-1 group-hover:${styles.text} transition-colors`}>{activity.title}</h3>
                      <div className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                        {activity.rating && (
                          <>
                            <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                            <span>Rated {activity.rating}/5</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                          </>
                        )}
                        <span>{activity.subtitle}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                        <span className="text-xs text-gray-500 font-mono">{activity.progress}</span>
                        <div className={`${styles.text} font-bold font-mono text-sm shadow-[0_0_10px_rgba(37,140,244,0.4)] flex items-center gap-1`}>
                          <span className="material-symbols-outlined text-base">add</span> {activity.xp} XP
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* End Marker */}
          <div className="relative flex flex-col items-center justify-center gap-2 mt-8 opacity-60">
            <div className="w-3 h-3 bg-primary/50 rotate-45 shadow-[0_0_15px_rgba(37,140,244,0.3)]"></div>
            <p className="text-xs font-mono text-primary/70 tracking-[0.3em] uppercase">End of Transmission</p>
          </div>
        </div>
      )}
    </>
  )
}
