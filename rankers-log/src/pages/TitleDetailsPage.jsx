import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function TitleDetailsPage() {
  const { titleId } = useParams()
  const { user } = useAuth()
  const [title, setTitle] = useState(null)
  const [userLogs, setUserLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProgress, setUserProgress] = useState({ current: 0, total: 179 })

  useEffect(() => {
    loadTitleDetails()
  }, [titleId])

  async function loadTitleDetails() {
    setLoading(true)
    // For MVP, we'll use mock data structure - can be wired to titles table later
    setTitle({
      id: titleId,
      name: 'Solo Leveling',
      japanese_name: 'ORE DAKE LEVEL UP NA KEN',
      type: 'MANHWA',
      status: 'ONGOING',
      score: 9.8,
      ranking: 1,
      genres: ['Action', 'Fantasy'],
      studio: 'Redice Studio',
      year: 2018,
      platform: 'Webtoon',
      synopsis: 'Ten years ago, "the Gate" appeared and connected the real world with the realm of magic and monsters. To combat these vile beasts, ordinary people received superhuman powers and became known as "Hunters." Twenty-year-old Sung Jin-Woo is one such Hunter, but he is known as the "World\'s Weakest," owing to his pathetic power compared to even a meager E-Rank. Still, he hunts monsters tirelessly in low-rank Gates to pay for his mother\'s medical bills.',
      cover_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaCFjtC8Z9SMEyFpIvp0w4QUVCToRIdXCg5KEVqRJ1y8N4D_UCYg5zAp4GXrnr3NR2SWE_NxTeZ4eAnVdcxhOIvVAiiz5AaZQb8-X1vaYGt_ZvuwpOnH1zsZ0SxW-0r09ZEAJXeGRpOp4cvrtkxrGzJgqFEfJK2_PCuo9AQoYC4fETmUXkvqWPZQUn_sYokIUTIXZfuPtQZq-KsusbLcsfDFsbE0vdjD3Q3nCxlA40iY52ABTmSeZdqc8H7aW7S_NPVYgknsKpNn4r'
    })

    // Load user logs for this title
    if (user) {
      const { data } = await supabase
        .from('posts')
        .select('*, profiles(username, avatar_url)')
        .eq('title_name', 'Solo Leveling')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (data) setUserLogs(data)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <p className="text-gray-400 font-mono text-sm">LOADING TITLE DATA...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Back Button */}
      <Link to="/feed" className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors w-fit group mb-6">
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span>Return to Database</span>
      </Link>

      <div className="flex flex-col xl:flex-row gap-10">
        {/* Cover Art Section */}
        <div className="w-full xl:w-80 shrink-0 flex flex-col gap-6">
          <div className="relative group mx-auto xl:mx-0 w-full max-w-[320px]">
            <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-primary opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-primary opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-primary opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-primary opacity-60 group-hover:opacity-100 transition-opacity"></div>
            <div className="overflow-hidden relative aspect-[2/3] w-full shadow-[0_0_30px_rgba(37,140,244,0.1)]" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                style={{ backgroundImage: `url('${title?.cover_url}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-40"></div>
              <div className="absolute top-6 left-0 bg-gradient-to-r from-rank-gold to-[#B8860B] text-black font-bold px-4 py-1 text-sm shadow-[0_0_15px_rgba(255,215,0,0.5)]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}>
                RANK S
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-[320px] mx-auto xl:mx-0 w-full">
            <button className="flex flex-col items-center justify-center p-3 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/50 transition-all group">
              <span className="material-symbols-outlined text-gray-400 mb-1 group-hover:text-primary group-hover:scale-110 transition-all">favorite</span>
              <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Favorite</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 rounded bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/50 transition-all group">
              <span className="material-symbols-outlined text-gray-400 mb-1 group-hover:text-primary group-hover:scale-110 transition-all">share</span>
              <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Share</span>
            </button>
          </div>
        </div>

        {/* Title Info Section */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="border-b border-white/10 pb-8 relative">
            <div className="absolute -bottom-[1px] left-0 w-1/3 h-[1px] bg-gradient-to-r from-primary to-transparent"></div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary border border-primary/30">{title?.type}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">• STATUS: {title?.status}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight uppercase" style={{ textShadow: '0 0 30px rgba(37,140,244,0.15)' }}>{title?.name}</h1>
                <h2 className="text-xl text-gray-500 font-display tracking-[0.2em] font-light">{title?.japanese_name}</h2>
              </div>
              <div className="flex items-center gap-6 bg-white/5 px-6 py-3 rounded-lg border border-white/5 backdrop-blur-sm">
                <div className="text-right">
                  <div className="text-3xl font-bold text-rank-cyan" style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}>{title?.score}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest text-right">Sys. Score</div>
                </div>
                <div className="h-8 w-[1px] bg-white/10"></div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">#{title?.ranking}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-widest text-right">Ranking</div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {title?.genres?.map((genre, i) => (
                <div key={i} className="px-4 py-1.5 bg-background-dark border border-primary/40 text-primary text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(37,140,244,0.15)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> {genre}
                </div>
              ))}
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">{title?.studio}</div>
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">{title?.year}</div>
              <div className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">{title?.platform}</div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-[rgba(20,25,30,0.7)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] p-6 md:p-8 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-9xl">radar</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary animate-pulse">target</span>
                  <span className="text-sm font-bold text-white tracking-[0.2em] uppercase">Synchronization Status</span>
                </div>
                <p className="text-xs text-gray-400">Tracking read progress across database</p>
              </div>
              <div className="text-right mt-4 md:mt-0 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white tabular-nums">{userProgress.current}</span>
                <span className="text-sm text-gray-500 font-bold">/ {userProgress.total} CH</span>
              </div>
            </div>
            <div className="h-6 bg-[#0a0f14] rounded overflow-hidden border border-white/10 relative z-10 mb-8 box-border p-[2px]">
              <div 
                className="h-full bg-gradient-to-r from-primary via-blue-500 to-rank-cyan shadow-[0_0_20px_rgba(37,140,244,0.4)] relative rounded-sm transition-all duration-1000 group-hover:brightness-110"
                style={{ width: `${(userProgress.current / userProgress.total) * 100}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_white]"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              <button className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold py-3.5 px-4 rounded hover:from-[#FFA500] hover:to-[#FFD700] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,215,0,0.3)] group/btn">
                <span className="material-symbols-outlined group-hover/btn:rotate-90 transition-transform">add_circle</span>
                <span className="tracking-wider text-sm">UPDATE PROGRESS</span>
              </button>
              <button className="bg-white/5 text-white font-bold py-3.5 px-4 rounded border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3 hover:border-rank-cyan/50 hover:text-rank-cyan group/btn">
                <span className="material-symbols-outlined">playlist_add</span>
                <span className="tracking-wider text-sm">ADD TO LIST</span>
              </button>
              <button className="bg-white/5 text-white font-bold py-3.5 px-4 rounded border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3 hover:border-rank-gold/50 hover:text-rank-gold group/btn">
                <span className="material-symbols-outlined">rate_review</span>
                <span className="tracking-wider text-sm">WRITE REVIEW</span>
              </button>
            </div>
          </div>

          {/* Synopsis */}
          <div className="bg-[#0a0f14] p-6 rounded-r-lg border-l-2 border-primary/50 relative">
            <h3 className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span> Data Log / Synopsis
            </h3>
            <p className="text-gray-300 leading-7 text-sm md:text-base font-light">
              {title?.synopsis}
            </p>
          </div>
        </div>
      </div>

      {/* User Logs Section */}
      <div className="mt-8 pt-8 border-t border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
            <span className="w-1 h-6 bg-rank-gold shadow-[0_0_10px_#FFD700]"></span>
            USER LOGS
          </h3>
          <div className="flex gap-2">
            <span className="text-xs font-bold text-white bg-white/5 px-3 py-1.5 rounded border border-white/10">TOP RATED</span>
            <span className="text-xs font-bold text-gray-500 bg-transparent px-3 py-1.5 rounded hover:text-white cursor-pointer transition-colors">NEWEST</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {userLogs.length > 0 ? userLogs.map((log, i) => (
            <div key={log.id} className="bg-[rgba(20,25,30,0.7)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] p-5 relative group hover:border-rank-gold/30 transition-all duration-300 hover:bg-[#151a20]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' }}>
              <div className="absolute top-0 right-0 w-8 h-8 bg-white/5 flex items-center justify-center text-[10px] font-bold text-rank-gold">S</div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-10 w-10 rounded-lg bg-gray-700 bg-cover bg-center border border-white/20"
                    style={{ backgroundImage: `url('${log.profiles?.avatar_url || ''}')` }}
                  ></div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{log.profiles?.username || 'Anonymous'}</p>
                    <div className="flex gap-0.5 text-rank-gold text-[10px] mt-0.5">
                      {[1,2,3,4,5].map(n => (
                        <span key={n} className="material-symbols-outlined text-[14px]">star</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-4 leading-relaxed">{log.content || 'Great content!'}</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-[10px] text-gray-500 font-mono">LOG_ID: #{log.id?.slice(0,4)}</span>
                <div className="flex gap-3 text-xs text-gray-500">
                  <button className="hover:text-primary flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-base">thumb_up</span> {log.likes_count || 0}
                  </button>
                  <button className="hover:text-white flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-base">forum</span> {log.comments_count || 0}
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">rate_review</span>
              <p className="text-gray-500">No user logs yet. Be the first to log!</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
