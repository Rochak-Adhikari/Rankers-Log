import { useState } from 'react'

export function MarketplacePage() {
  const [activeTab, setActiveTab] = useState('featured')
  const [userCoins, setUserCoins] = useState(2500)

  const items = [
    { id: 1, name: 'Neon Frame', category: 'frames', price: 500, rarity: 'rare', icon: 'photo_frame', owned: false },
    { id: 2, name: 'Shadow Aura', category: 'auras', price: 1000, rarity: 'epic', icon: 'blur_on', owned: false },
    { id: 3, name: 'Golden Badge', category: 'badges', price: 750, rarity: 'rare', icon: 'military_tech', owned: true },
    { id: 4, name: 'Cyber Title', category: 'titles', price: 1500, rarity: 'legendary', icon: 'title', owned: false },
    { id: 5, name: 'Pixel Theme', category: 'themes', price: 2000, rarity: 'legendary', icon: 'palette', owned: false },
    { id: 6, name: 'Player Banner', category: 'banners', price: 300, rarity: 'common', icon: 'flag', owned: true }
  ]

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400/30 bg-gray-400/10'
      case 'rare': return 'text-primary border-primary/30 bg-primary/10'
      case 'epic': return 'text-purple-400 border-purple-400/30 bg-purple-400/10'
      case 'legendary': return 'text-rank-gold border-rank-gold/30 bg-rank-gold/10'
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10'
    }
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-rank-gold pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.3)' }}>
            Supply Depot
          </h1>
          <p className="text-rank-gold/80 font-mono text-sm tracking-widest mt-1">
            // MARKETPLACE // COSMETIC_SHOP
          </p>
        </div>
        <div className="flex items-center gap-2 bg-rank-gold/10 border border-rank-gold/30 px-4 py-2 rounded-lg">
          <span className="material-symbols-outlined text-rank-gold">paid</span>
          <span className="text-xl font-bold text-white">{userCoins.toLocaleString()}</span>
          <span className="text-sm text-gray-400">coins</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['featured', 'frames', 'auras', 'badges', 'titles', 'themes'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-rank-gold text-black'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Featured Banner */}
      {activeTab === 'featured' && (
        <div className="relative bg-gradient-to-r from-purple-900/50 to-primary/30 border border-purple-500/30 rounded-xl p-8 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <span className="text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-1 rounded mb-2 inline-block">LIMITED TIME</span>
            <h2 className="text-3xl font-black text-white mb-2">Player's Eclipse Bundle</h2>
            <p className="text-gray-400 mb-4 max-w-md">Get the exclusive frame, aura, and title combo at 40% off!</p>
            <div className="flex items-center gap-4">
              <span className="text-gray-500 line-through">3000 coins</span>
              <span className="text-2xl font-bold text-rank-gold">1800 coins</span>
            </div>
            <button className="mt-4 px-6 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors">
              Purchase Bundle
            </button>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items
          .filter(item => activeTab === 'featured' || item.category === activeTab)
          .map(item => (
            <div key={item.id} className="bg-[#0a1016] border border-white/10 rounded-lg overflow-hidden hover:border-primary/50 transition-all group">
              <div className="aspect-square bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center relative">
                <span className={`material-symbols-outlined text-6xl ${getRarityColor(item.rarity).split(' ')[0]}`}>{item.icon}</span>
                {item.owned && (
                  <div className="absolute top-2 right-2 bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">
                    OWNED
                  </div>
                )}
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getRarityColor(item.rarity)}`}>
                  {item.rarity}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-rank-gold text-sm">paid</span>
                    <span className="font-bold text-white">{item.price}</span>
                  </div>
                  {item.owned ? (
                    <button className="px-3 py-1 bg-white/5 text-gray-400 text-xs font-bold rounded" disabled>
                      Equipped
                    </button>
                  ) : (
                    <button 
                      disabled={userCoins < item.price}
                      className="px-3 py-1 bg-primary text-white text-xs font-bold rounded hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Buy
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Earn More Coins */}
      <div className="mt-8 bg-[#0a1016] border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-rank-gold">savings</span>
          Earn More Coins
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <span className="material-symbols-outlined text-2xl text-primary">local_fire_department</span>
            <div>
              <p className="font-bold text-white">Daily Check-in</p>
              <p className="text-xs text-gray-400">+10 coins per day</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <span className="material-symbols-outlined text-2xl text-green-400">assignment_turned_in</span>
            <div>
              <p className="font-bold text-white">Complete Quests</p>
              <p className="text-xs text-gray-400">+50-200 coins</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
            <span className="material-symbols-outlined text-2xl text-purple-400">trending_up</span>
            <div>
              <p className="font-bold text-white">Level Up</p>
              <p className="text-xs text-gray-400">+100 coins per level</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
