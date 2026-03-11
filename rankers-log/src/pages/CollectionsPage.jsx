import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function CollectionsPage() {
  const { user } = useAuth()
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCollection, setExpandedCollection] = useState(null)
  const [stats, setStats] = useState({ total: 12, completion: 68, items: 1402, publicLinks: 3 })

  useEffect(() => {
    if (user) loadCollections()
  }, [user])

  async function loadCollections() {
    setLoading(true)
    
    const { data } = await supabase
      .from('collections')
      .select('*, collection_items(count)')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (data && data.length > 0) {
      setCollections(data)
    } else {
      // Mock data for UI display
      setCollections([
        { id: '1', name: 'JRPG GRIND', description: 'Current playthroughs & backlog.', progress: 12, is_public: false, item_count: 12, updated_at: '2H AGO', expanded: true },
        { id: '2', name: 'PEAK FICTION', description: 'Top rated narrative experiences.', progress: 85, is_public: false, item_count: 32, updated_at: '2D AGO' },
        { id: '3', name: 'WINTER 2024', description: 'Seasonal watchlist.', progress: 0, is_public: true, item_count: 5, updated_at: '5M AGO' }
      ])
      setExpandedCollection('1')
    }

    setLoading(false)
  }

  return (
    <>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-repeat" style={{ backgroundImage: "url('https://placeholder.pics/svg/1920x1080/050505/0A0F14/grid-pattern')" }}></div>
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 4px, 3px 100%' }}></div>

      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-end gap-4 border-b border-[#223649] pb-6 mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary text-sm font-mono mb-1">
            <span className="material-symbols-outlined text-[16px]">folder_open</span>
            <span>ROOT / COLLECTIONS / VAULTS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
            DATA <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-white">VAULTS</span>
          </h2>
          <p className="text-text-secondary max-w-lg mt-2">Manage your curated archives and trophies. Access secure folders for specific genres and tracking lists.</p>
        </div>
        <button className="group relative flex items-center gap-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black h-12 px-6 font-bold tracking-wider transition-all shadow-[0_0_10px_rgba(255,215,0,0.5)] hover:shadow-[0_0_20px_rgba(255,215,0,0.7)]" style={{ clipPath: 'polygon(100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 0)' }}>
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
          INITIALIZE NEW VAULT
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#101a23]/50 backdrop-blur border border-[#223649] p-5 rounded relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white">inventory_2</span>
          </div>
          <p className="text-text-secondary text-xs font-bold tracking-widest uppercase mb-1">Total Vaults</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.total}</span>
            <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded">+1 New</span>
          </div>
          <div className="w-full bg-[#223649] h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[40%]"></div>
          </div>
        </div>
        <div className="bg-[#101a23]/50 backdrop-blur border border-[#223649] p-5 rounded relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white">pie_chart</span>
          </div>
          <p className="text-text-secondary text-xs font-bold tracking-widest uppercase mb-1">Completion Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.completion}%</span>
            <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded">+2.4%</span>
          </div>
          <div className="w-full bg-[#223649] h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full" style={{ width: `${stats.completion}%` }}></div>
          </div>
        </div>
        <div className="bg-[#101a23]/50 backdrop-blur border border-[#223649] p-5 rounded relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white">database</span>
          </div>
          <p className="text-text-secondary text-xs font-bold tracking-widest uppercase mb-1">Archived Items</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.items.toLocaleString()}</span>
            <span className="text-primary text-xs font-bold bg-primary/10 px-1.5 py-0.5 rounded">Stable</span>
          </div>
          <div className="w-full bg-[#223649] h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-white h-full w-[80%] opacity-50"></div>
          </div>
        </div>
        <div className="bg-[#101a23]/50 backdrop-blur border border-[#223649] p-5 rounded relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white">share</span>
          </div>
          <p className="text-text-secondary text-xs font-bold tracking-widest uppercase mb-1">Public Signals</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.publicLinks}</span>
            <span className="text-text-secondary text-xs font-medium">Active Links</span>
          </div>
          <div className="w-full bg-[#223649] h-1 mt-4 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full w-[20%]"></div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-[#101a23]/80 p-3 rounded border border-[#223649] mb-6">
        <div className="flex gap-2">
          <button className="flex items-center justify-center size-10 bg-[#223649] hover:bg-primary text-white rounded transition-colors" title="Sort">
            <span className="material-symbols-outlined">sort</span>
          </button>
          <button className="flex items-center justify-center size-10 bg-[#223649] hover:bg-primary text-white rounded transition-colors" title="Filter">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
          <div className="h-10 border-r border-[#223649] mx-2"></div>
          <button className="px-4 h-10 bg-[#223649] hover:bg-[#314d68] text-white rounded text-sm font-bold tracking-wide transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            ALL
          </button>
          <button className="px-4 h-10 bg-transparent hover:bg-[#223649] text-text-secondary rounded text-sm font-bold tracking-wide transition-colors">
            COMPLETED
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 h-10 border border-primary/50 text-primary hover:bg-primary/10 rounded text-sm font-bold tracking-wider transition-all uppercase">
          <span className="material-symbols-outlined text-[18px]">rss_feed</span>
          Broadcast Signal
        </button>
      </div>

      {/* Collections Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-gray-400 font-mono text-sm">LOADING VAULTS...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div 
                key={collection.id}
                onClick={() => setExpandedCollection(expandedCollection === collection.id ? null : collection.id)}
                className={`relative group cursor-pointer ${expandedCollection === collection.id ? '' : 'hover:-translate-y-1'} transition-transform duration-300`}
              >
                {expandedCollection === collection.id && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-75 animate-pulse group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                )}
                <div className={`relative h-full ${expandedCollection === collection.id ? 'bg-[#101922] border-primary' : 'bg-[#101a23]/60 backdrop-blur border-[#223649] group-hover:border-text-secondary'} border rounded-lg p-5 flex flex-col justify-between overflow-hidden`} style={{ clipPath: 'polygon(0 0, 10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)' }}>
                  {expandedCollection === collection.id && (
                    <div className="absolute top-0 right-0 p-3">
                      <div className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded border border-primary/30">EXPANDED</div>
                    </div>
                  )}
                  <div>
                    <h3 className={`text-xl font-bold text-white mb-1 ${expandedCollection !== collection.id ? 'group-hover:text-primary' : ''} transition-colors`}>{collection.name}</h3>
                    <p className="text-text-secondary text-sm mb-4">{collection.description}</p>
                    <div className="grid grid-cols-4 gap-1 mb-4 opacity-50 grayscale group-hover:grayscale-0 transition-all duration-300">
                      {[1,2,3].map(i => (
                        <div key={i} className="aspect-[2/3] bg-gray-700 rounded-sm"></div>
                      ))}
                      <div className="aspect-[2/3] bg-gray-800 rounded-sm flex items-center justify-center text-[10px] text-white font-mono">+{collection.item_count}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-text-secondary">
                      <span>PROGRESS</span>
                      <span className={collection.progress >= 80 ? 'text-emerald-400' : 'text-white'}>{collection.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#050505] rounded-full overflow-hidden border border-[#223649]">
                      <div className={`h-full ${collection.progress >= 80 ? 'bg-emerald-400' : 'bg-primary'} shadow-[0_0_10px_#258cf4]`} style={{ width: `${collection.progress}%` }}></div>
                    </div>
                    <div className="text-[10px] text-[#58738e] font-mono mt-2">LAST UPDATED: {collection.updated_at}</div>
                  </div>
                </div>
                {expandedCollection === collection.id && (
                  <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-primary z-20"></div>
                )}
              </div>
            ))}
          </div>

          {/* Expanded Content Area */}
          {expandedCollection && (
            <div className="mt-4 p-6 border border-primary/30 bg-[#101a23]/90 rounded-xl relative shadow-[0_0_10px_rgba(37,140,244,0.5)] overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="flex justify-between items-center mb-6 border-b border-[#223649] pb-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl animate-spin" style={{ animationDuration: '3s' }}>data_usage</span>
                  <h3 className="text-2xl font-black text-white tracking-wide">VAULT CONTENTS: {collections.find(c => c.id === expandedCollection)?.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:text-white text-text-secondary transition-colors"><span className="material-symbols-outlined">edit</span></button>
                  <button className="p-2 hover:text-white text-text-secondary transition-colors"><span className="material-symbols-outlined">delete</span></button>
                  <button onClick={() => setExpandedCollection(null)} className="p-2 hover:text-white text-text-secondary transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="group relative flex flex-col gap-2 cursor-pointer">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden border border-[#223649] group-hover:border-primary transition-all shadow-lg group-hover:shadow-[0_0_10px_rgba(37,140,244,0.5)]">
                      <div className="absolute inset-0 bg-gray-700 transition-transform duration-500 group-hover:scale-110"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute top-2 right-2 size-8 bg-[#101a23]/90 border border-primary text-primary flex items-center justify-center font-black text-sm backdrop-blur-sm shadow-lg" style={{ clipPath: 'polygon(100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 0)' }}>S</div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden mb-1">
                          <div className="bg-primary w-[45%] h-full"></div>
                        </div>
                        <p className="text-[10px] text-gray-300 font-mono">IN PROGRESS</p>
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate px-1 group-hover:text-primary transition-colors">Item {i}</h4>
                  </div>
                ))}
                <div className="group relative flex flex-col gap-2 cursor-pointer h-full">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden border-2 border-dashed border-[#223649] group-hover:border-primary transition-all flex flex-col items-center justify-center bg-[#101a23]/30 hover:bg-[#101a23]/80">
                    <span className="material-symbols-outlined text-4xl text-[#223649] group-hover:text-primary transition-colors">add_circle</span>
                    <p className="text-xs font-bold text-text-secondary mt-2 group-hover:text-white">ADD ITEM</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
