import { useState } from 'react'
import { Link } from 'react-router-dom'

export function LibraryPage() {
  const [activeTab, setActiveTab] = useState('all')

  const items = [
    { id: 1, title: 'Solo Leveling', type: 'MANHWA', progress: 85, cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaCFjtC8Z9SMEyFpIvp0w4QUVCToRIdXCg5KEVqRJ1y8N4D_UCYg5zAp4GXrnr3NR2SWE_NxTeZ4eAnVdcxhOIvVAiiz5AaZQb8-X1vaYGt_ZvuwpOnH1zsZ0SxW-0r09ZEAJXeGRpOp4cvrtkxrGzJgqFEfJK2_PCuo9AQoYC4fETmUXkvqWPZQUn_sYokIUTIXZfuPtQZq-KsusbLcsfDFsbE0vdjD3Q3nCxlA40iY52ABTmSeZdqc8H7aW7S_NPVYgknsKpNn4r', status: 'reading' },
    { id: 2, title: 'Cyberpunk: Edgerunners', type: 'ANIME', progress: 60, cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBduUClT67EH4qznbqtRZ-gqkTWTWAxy_qfVxSIqOIkVLc9bSUAOJ_WxB_9dL7eyRgOyj8evIhI8wg0JmyRwTly6tr9pV8945HD0MzLBBgbAJSE8NPAxEfqthPiE1NOIAWfno0Y5uzgdcUOW3qLF_Ocdl4v51kW3eVHtIE2PtQzK4xGu8VYuvNp56WE_6Pobw9Cq1grOuxQxaOetFBNy6nWyBiJDtBZ6Oi6g99-AEHZ_rR11ehaprahjCqp0GPLjUAQ1L9jci2ZKXiI', status: 'watching' },
    { id: 3, title: 'Elden Ring', type: 'GAME', progress: 100, cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAi4ZbxtugArFInHpaVdDjMiOEnyWNESJzmY9JS3gneOdDS_qnpHbmkx-xWvezRBmeWEjOr96ZrWq8CoO8mxJOxAt52d9V7ZI4kupQLsJRZ-iOs6EPMFIWKU80G0bJ98oNq9swZn34mpaB-XgYk-VX4N5orI-yEfTX_q3UizJjViKLPY2u4-MXWLx4qZr2KXiqH_UC8blJtdCGIHUv987B5QfefhFQANfW28xnU_wYgee2m8F8j6Md9UsQXIS2F36TJnHd5EDo-wEQ3', status: 'completed' },
    { id: 4, title: 'Attack on Titan', type: 'ANIME', progress: 100, cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxNqrQq_1cG3Ho50pbWgA71G6lSd5TGaPiOURrgQUZa4ioS9HGSotD4ScDHGKDtzwTfQqAxiJtUMLsYW-SoMT8AIpWIWvkfRVKiOrFF4PIOFziEPunAqJ-web5JW-v4Wj1QSHeHpidUbMMp7qIaK7UJYxjQQR-lfPfE8a2rBevqHBV7SCzkq7TM36wY9Pso0OauHx3gCUgjSq4_GukK4XqN2RjlR9Tv4vIo6RoktAjU5MMKac21cCi2q2FV_tjG7Ln2jaqBMoXbHMk', status: 'completed' },
    { id: 5, title: 'One Piece', type: 'MANGA', progress: 45, cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbZFCri93NCuEqpwAA_Q6hM1OP5arvBZp4V_tfv7zz758-BZ-1OoA4Wz_qSykQyDgOtk2XQtGekTLa4CYhvs-3An0_PUEH5AMzMbTDEuzXZTiiipPA77ilvfVwNJf_0lnmEOnTtqn4MFINvAcMqr3apExp6DyyTKVj4qZHaUjH85YBiHoMJeM8EfUZSF1CmidgpEjVIZk2GNWjgRpZlhNNk4snJegJLZbN9arXrlm8P9JKjvMfpRz8LQRmLaPtbM4V21KiQaek8XFg', status: 'reading' },
    { id: 6, title: 'Dune: Part Two', type: 'MOVIE', progress: 0, cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnUM1cITw_tZxevBN3hVfv224WmEoVqmEVSFuHiKuV6yciRa8h_AICDJMh2t9Tbww3QCg7xGaYAVaItQVwicUA66R0vO0YlqKvrV33BkDVQD8FTjSPjpSeAtc1tMexXU2jDS--j_3kpzN-5_G8XFa0-XSMGw9WyVjaIgE4kcZMxJ_79n74itOP_vVChN7gOjShTw5HkiPga6_TZZ4Lu6uUkv612nZthdsgbIcHpV9FOwIbPlg2VV6rdX482o00l8IBzuhqziLE28rR', status: 'backlog' },
  ]

  const tabs = [
    { id: 'all', label: 'All', count: items.length },
    { id: 'reading', label: 'Reading', count: items.filter(i => i.status === 'reading').length },
    { id: 'watching', label: 'Watching', count: items.filter(i => i.status === 'watching').length },
    { id: 'completed', label: 'Completed', count: items.filter(i => i.status === 'completed').length },
    { id: 'backlog', label: 'Backlog', count: items.filter(i => i.status === 'backlog').length },
  ]

  const filteredItems = activeTab === 'all' ? items : items.filter(i => i.status === activeTab)

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-primary pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white text-glow">
            My Library
          </h1>
          <p className="text-primary/80 font-mono text-sm tracking-widest mt-1">
            // INVENTORY // {items.length} ITEMS TRACKED
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-primary/10 border border-primary/30 px-4 py-2 rounded text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2 hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(37,140,244,0.4)] transition-all">
            <span className="material-symbols-outlined text-sm">add</span>
            Add New
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Link to="/collections" className="glass-panel p-4 rounded-lg flex items-center gap-3 hover:border-primary/50 transition-colors group">
          <span className="material-symbols-outlined text-primary text-2xl">folder_special</span>
          <div>
            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Collections</p>
            <p className="text-xs text-gray-500">Custom shelves</p>
          </div>
        </Link>
        <Link to="/saved" className="glass-panel p-4 rounded-lg flex items-center gap-3 hover:border-primary/50 transition-colors group">
          <span className="material-symbols-outlined text-primary text-2xl">bookmark</span>
          <div>
            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Saved</p>
            <p className="text-xs text-gray-500">Bookmarked content</p>
          </div>
        </Link>
        <Link to="/drafts" className="glass-panel p-4 rounded-lg flex items-center gap-3 hover:border-primary/50 transition-colors group">
          <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
          <div>
            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Drafts</p>
            <p className="text-xs text-gray-500">Unfinished logs</p>
          </div>
        </Link>
        <Link to="/activity" className="glass-panel p-4 rounded-lg flex items-center gap-3 hover:border-primary/50 transition-colors group">
          <span className="material-symbols-outlined text-primary text-2xl">history</span>
          <div>
            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">Activity</p>
            <p className="text-xs text-gray-500">Your timeline</p>
          </div>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            {tab.label} <span className="ml-1 opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2 border border-white/10 group-hover:border-primary/50 transition-colors">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                style={{ backgroundImage: `url('${item.cover}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div
                  className={`h-full ${item.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>

              {/* Type Badge */}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold text-primary">
                {item.type}
              </div>

              {/* Completed Badge */}
              {item.progress === 100 && (
                <div className="absolute top-2 left-2 bg-emerald-500/20 backdrop-blur p-1 rounded">
                  <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
                </div>
              )}
            </div>
            <h3 className="font-bold text-white text-sm truncate group-hover:text-primary transition-colors">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.progress}% Complete</p>
          </div>
        ))}
      </div>
    </>
  )
}
