import { useState } from 'react'
import { Link } from 'react-router-dom'

export function AchievementsPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const achievements = [
    {
      id: 1,
      title: 'Legend of the Fall',
      description: 'Complete the entire autumn seasonal arc without skipping a single dialogue.',
      icon: 'military_tech',
      rarity: 'LEGENDARY',
      rarityColor: 'amber',
      date: 'Oct 24, 2023',
      xp: 500,
      unlocked: true
    },
    {
      id: 2,
      title: 'Binge Reader',
      description: 'Read 100 chapters of any manga within a 24-hour period.',
      icon: 'menu_book',
      rarity: 'RARE',
      rarityColor: 'primary',
      date: 'Sep 12, 2023',
      xp: 250,
      unlocked: true
    },
    {
      id: 3,
      title: 'Social Butterfly',
      description: 'Post 50 comments on community discussion threads.',
      icon: 'forum',
      rarity: 'COMMON',
      rarityColor: 'emerald',
      date: 'Aug 01, 2023',
      xp: 100,
      unlocked: true
    },
    {
      id: 4,
      title: '????????????',
      description: 'Unlock condition classified. Continue playing Story Mode to decrypt.',
      icon: 'lock',
      rarity: 'LOCKED',
      rarityColor: 'gray',
      progress: 20,
      unlocked: false
    },
    {
      id: 5,
      title: '????????????',
      description: 'Participate in 5 Guild Wars to reveal this achievement.',
      icon: 'lock',
      rarity: 'LOCKED',
      rarityColor: 'gray',
      progress: 0,
      unlocked: false
    },
    {
      id: 6,
      title: 'Eagle Eye',
      description: 'Spot 10 hidden easter eggs in the main dashboard background.',
      icon: 'visibility',
      rarity: 'EPIC',
      rarityColor: 'purple',
      date: 'Jul 15, 2023',
      xp: 350,
      unlocked: true
    }
  ]

  const getRarityStyles = (rarity) => {
    const styles = {
      LEGENDARY: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      RARE: 'bg-primary/20 text-primary border-primary/30',
      EPIC: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      COMMON: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      LOCKED: 'bg-gray-700 text-gray-400 border-gray-600'
    }
    return styles[rarity] || styles.COMMON
  }

  const getIconColor = (rarity) => {
    const colors = {
      LEGENDARY: 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]',
      RARE: 'text-primary drop-shadow-[0_0_5px_rgba(37,140,244,0.5)]',
      EPIC: 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.5)]',
      COMMON: 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]',
      LOCKED: 'text-slate-500'
    }
    return colors[rarity] || colors.COMMON
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Hero Banner */}
      <section className="relative w-full rounded-lg overflow-hidden min-h-[220px] flex flex-col justify-end group shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-b from-[#101922]/40 via-[#101922]/60 to-[#101922]/90 transition-transform duration-700 group-hover:scale-105" style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=2574')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>
        <div className="relative p-6 md:p-10 flex flex-col gap-2 z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-primary/20 border border-primary/50 text-primary text-[10px] font-bold uppercase tracking-wider">System Online</span>
            <span className="px-2 py-0.5 rounded bg-[#1a2736] border border-[#314d68] text-slate-400 text-[10px] font-bold uppercase tracking-wider">v.4.2.0</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase" style={{ textShadow: '0 0 20px rgba(37, 140, 244, 0.4)' }}>
            Achievement Database
          </h2>
          <p className="text-slate-400 max-w-2xl text-sm md:text-base">
            Track your milestones across the Rankers multiverse. Analyze unlock conditions and rarity.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 p-5 rounded-lg bg-[#1a2736] border border-[#314d68] relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="material-symbols-outlined text-4xl text-primary">trophy</span>
            </div>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Score</span>
            <span className="text-2xl font-bold text-white">12,450 <span className="text-primary text-sm">GP</span></span>
          </div>
          <div className="flex flex-col gap-1 p-5 rounded-lg bg-[#1a2736] border border-[#314d68] relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="material-symbols-outlined text-4xl text-emerald-400">pie_chart</span>
            </div>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Completion</span>
            <span className="text-2xl font-bold text-white">58<span className="text-sm">%</span></span>
          </div>
          <div className="flex flex-col gap-1 p-5 rounded-lg bg-[#1a2736] border border-[#314d68] relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="material-symbols-outlined text-4xl text-purple-400">public</span>
            </div>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Global Rank</span>
            <span className="text-2xl font-bold text-white">Top 5<span className="text-sm">%</span></span>
          </div>
          <div className="flex flex-col gap-1 p-5 rounded-lg bg-[#1a2736] border border-[#314d68] relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
              <span className="material-symbols-outlined text-4xl text-amber-400">diamond</span>
            </div>
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">Rarest Trophy</span>
            <span className="text-2xl font-bold text-white">0.1<span className="text-sm">%</span></span>
          </div>
        </div>
        <div className="lg:col-span-1 p-5 rounded-lg bg-[#1a2736] border border-[#314d68] flex flex-col justify-center gap-3 relative">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Current Tier</p>
              <p className="text-white text-lg font-bold">Elite Vanguard</p>
            </div>
            <div className="text-right">
              <p className="text-primary text-sm font-bold">1,250 / 2,500 XP</p>
            </div>
          </div>
          <div className="h-3 w-full bg-[#101922] rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-primary relative w-[50%] rounded-full shadow-[0_0_12px_#258cf4]">
              <div className="absolute top-0 right-0 h-full w-2 bg-white/50 animate-pulse"></div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            <span className="text-primary font-bold">NEXT REWARD:</span> "Void Walker" Profile Frame
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#314d68] pb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
              activeFilter === 'all' 
                ? 'bg-primary text-white shadow-[0_0_15px_rgba(37,140,244,0.4)]' 
                : 'bg-[#1a2736] hover:bg-[#253648] text-slate-400 hover:text-white border border-[#314d68]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            All Systems
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2736] hover:bg-[#253648] text-slate-400 hover:text-white border border-[#314d68] rounded-lg text-sm font-medium whitespace-nowrap transition-colors">
            <span className="material-symbols-outlined text-[18px]">auto_stories</span>
            Story Mode
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2736] hover:bg-[#253648] text-slate-400 hover:text-white border border-[#314d68] rounded-lg text-sm font-medium whitespace-nowrap transition-colors">
            <span className="material-symbols-outlined text-[18px]">swords</span>
            Combat Log
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2736] hover:bg-[#253648] text-slate-400 hover:text-white border border-[#314d68] rounded-lg text-sm font-medium whitespace-nowrap transition-colors">
            <span className="material-symbols-outlined text-[18px]">group</span>
            Social Uplink
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a2736] hover:bg-[#253648] text-slate-400 hover:text-white border border-[#314d68] rounded-lg text-sm font-medium whitespace-nowrap transition-colors">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            Hidden Data
          </button>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs text-slate-400 uppercase font-bold hidden md:inline">Sort By:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select bg-[#1a2736] border-[#314d68] text-white text-sm rounded-lg focus:ring-primary focus:border-primary w-full md:w-auto cursor-pointer"
          >
            <option value="newest">Date Unlocked (Newest)</option>
            <option value="rarity">Rarity (Highest)</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`group relative rounded-lg border p-1 overflow-hidden transition-all duration-300 ${
              achievement.unlocked 
                ? 'bg-[#1a2736] border-[#314d68] hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(37,140,244,0.15)]'
                : 'bg-[#1a2736]/40 border-dashed border-[#314d68]'
            } ${achievement.rarity === 'LEGENDARY' ? 'border-primary/40 shadow-[0_0_0_1px_rgba(37,140,244,0.1)] hover:shadow-[0_0_20px_rgba(37,140,244,0.25)]' : ''}`}
          >
            {achievement.rarity === 'LEGENDARY' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent rounded-tr-lg"></div>
            )}
            {!achievement.unlocked && (
              <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
            )}
            <div className={`h-full flex flex-row items-center gap-4 bg-[#151f2b] p-4 rounded-md relative z-10 ${!achievement.unlocked ? 'grayscale opacity-70 group-hover:opacity-100 transition-opacity' : ''}`}>
              <div className={`flex-shrink-0 size-16 bg-gradient-to-br from-[#2a3b4f] to-[#1a2532] rounded-lg border ${achievement.unlocked ? 'border-[#314d68] group-hover:border-primary/50' : 'border-[#314d68]'} flex items-center justify-center shadow-lg transition-colors`}>
                <span className={`material-symbols-outlined text-4xl ${getIconColor(achievement.rarity)}`}>{achievement.icon}</span>
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className={`font-bold text-lg truncate ${achievement.unlocked ? 'text-white group-hover:text-primary' : 'text-slate-500'} transition-colors`}>
                    {achievement.title}
                  </h3>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getRarityStyles(achievement.rarity)}`}>
                    {achievement.rarity}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed line-clamp-2 mt-1 ${achievement.unlocked ? 'text-slate-400' : 'text-slate-500/60'}`}>
                  {achievement.description}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  {achievement.unlocked ? (
                    <>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        <span>{achievement.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-primary">
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        <span>{achievement.xp} XP</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-1.5 w-24 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-500" style={{ width: `${achievement.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] text-slate-500">{achievement.progress}% {achievement.progress > 0 ? 'Decrypted' : 'Complete'}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
