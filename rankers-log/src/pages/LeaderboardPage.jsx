import { Link } from 'react-router-dom'

export function LeaderboardPage() {
  const rankings = [
    { rank: 1, username: 'ShadowMonarch', level: 99, xp: '2.4M', badge: 'S', badgeColor: 'text-[#ff0055]', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPVSjNV0oXnUcGqfGUiSDRDGE5-M4Us_5KN12MPte8FDsJ6k7vyc9nKPClDCleWvSEuKhDmVLhg4MKUJFOeBxbczRec_6X7kHI0zRUiOa_iIIYkbBnYHUnud4H1cWSmfrvd_9QtQR1fEZoC2o2eiBVfX32KN_v4q2700SVFWLbtA3R226M2n0jDQmre-DJQxJJOJz5GSKkLSGZyy8ietSRrRhtzAKR2UYWKUxtjScLISoOhC00Vxzenbafr0uAxrTKty5Kd-W4U6wm' },
    { rank: 2, username: 'VoidWalker', level: 95, xp: '2.1M', badge: 'S', badgeColor: 'text-[#ff0055]', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMcHtjl3lxPQ1Uj1ap64hzyxeDE0WSFg6gSFN1zb7o7znY2Y_bcarfYpxlwkzgpHjgB9fRUKNccwWJaPnQRmwq1F90-Iuu3VMSiULrogQA9336aqQPGWrjXDNCkXy8PhRa3oSo-EiR7A0n_JryLdLYOGdM08euTvcAtsir_PdjHTBE0cfIdIaI-Zr2lBzZWvnql3xLNut6h_pc2c46t_GhUs5ZMrOJAn9Q62tpmfJK7Zek_WljWoF3eugucExzBrOxOQczJTr78Bi4' },
    { rank: 3, username: 'CyberNinja', level: 89, xp: '1.8M', badge: 'A', badgeColor: 'text-[#FFD700]', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfUoTMunv85bjZCPiqQ9Rdl_aL8mqmkZXpSeiyuXMoCrORR_U9ox-ooHI7rFacMHsqCe4VklaUGmaQzb-3esc_GFSWepmDkeIloqUyfO3ZX9tTo-G-4Y9VZcYv0reTa2aKc-MTxh5wv1vNnlMY4UpODlquwzbt4MLnfJ5HoBC7-affUPaOj53-i4uhZwwuUtwQgOF3jitDO_M1mOVlmYX6L0AIoLFY72Uul8ljfHNa6mhOeeTv4N0jLF8oBw8_Ge-y03Dt3Y1DKvbX' },
    { rank: 4, username: 'Kairos', level: 42, xp: '850K', badge: 'A', badgeColor: 'text-[#FFD700]', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdaWmABVJXA2jsgAaK0-A6KfaQdF1oWID-5yztCv3l5U4qlYJDSTECr6S60s6aBycW6BghIvBQ1xOa8-DhAwvTEzDPpjRcZd0K45p4r0ZfOwdKum9Qnyac1EEnvjyeO_Kq60P6BMi4UkW9vs35XyjWPzLq4wVuhV3rWwCt6UUEUAj6mnAT-RhULGMZ8cxGGp7Uc_F5TTib0U2w_QW5cFL4wkdzQUMu-AH7iLWkIVuNlTrz5B5RRSt_BDGQakh-x3VtiqhU72W8jV3j', isCurrentUser: true },
    { rank: 5, username: 'MangaMaster', level: 38, xp: '720K', badge: 'B', badgeColor: 'text-primary', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSeqPQGnePMF2ulYvnQK__GKSjQjoNWEpDiKrw8NMuHZHs8y4Z5IB_AExmLy_2DLfw0qn_PtZBb45u7z8FMv5JNHr5Zla7Niz1HymVYZK1jWTroBK7Vmt1LFTa5L77r37mAKhEq8OWXMebMOLdgXIl5SxzdNgV3cYMqHDSrzE7iwzTercwMayqZqFMN58c1x8tlRBx_5FtlQdhG0UpNvHUxpdpoqt2CnxhPejNEQHWlbddOvakTosUWtjwz57Oou7rDPJI07nteGVG' },
  ]

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-[#FFD700] pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white neon-text-gold">
            Rankings
          </h1>
          <p className="text-[#FFD700]/80 font-mono text-sm tracking-widest mt-1">
            // GLOBAL LEADERBOARD // SEASON 4
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#FFD700]/10 border border-[#FFD700]/30 px-4 py-2 rounded text-xs font-bold text-[#FFD700] uppercase tracking-wider shadow-[0_0_10px_rgba(255,215,0,0.3)]">
            Global
          </button>
          <button className="bg-white/5 border border-white/10 px-4 py-2 rounded text-xs font-bold text-gray-400 uppercase tracking-wider hover:bg-primary/10 hover:border-primary/30 hover:text-primary hover:shadow-[0_0_10px_rgba(37,140,244,0.3)] transition-all">
            Friends
          </button>
          <button className="bg-white/5 border border-white/10 px-4 py-2 rounded text-xs font-bold text-gray-400 uppercase tracking-wider hover:bg-primary/10 hover:border-primary/30 hover:text-primary hover:shadow-[0_0_10px_rgba(37,140,244,0.3)] transition-all">
            Guild
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* 2nd Place */}
        <div className="glass-panel p-4 rounded-lg text-center order-1 self-end">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-400 to-transparent rounded-full opacity-50"></div>
            <div className="hexagon-mask w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${rankings[1].avatar}')` }}></div>
          </div>
          <div className="text-2xl font-bold text-gray-400 mb-1">2</div>
          <h3 className="font-bold text-white text-sm truncate">{rankings[1].username}</h3>
          <p className="text-xs text-gray-500">Lvl {rankings[1].level}</p>
          <p className="text-xs text-primary font-mono mt-1">{rankings[1].xp} XP</p>
        </div>

        {/* 1st Place */}
        <div className="glass-panel p-6 rounded-lg text-center order-2 border border-[#FFD700]/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent"></div>
          <div className="relative w-20 h-20 mx-auto mb-3">
            <div className="absolute inset-[-4px] bg-gradient-to-b from-[#FFD700] to-transparent rounded-full animate-pulse opacity-50"></div>
            <div className="hexagon-mask w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${rankings[0].avatar}')` }}></div>
            <div className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-xs font-bold px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-sm">emoji_events</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-[#FFD700] neon-text-gold mb-1">1</div>
          <h3 className="font-bold text-white text-base">{rankings[0].username}</h3>
          <p className="text-xs text-gray-400">Lvl {rankings[0].level}</p>
          <p className="text-sm text-[#FFD700] font-mono mt-1">{rankings[0].xp} XP</p>
        </div>

        {/* 3rd Place */}
        <div className="glass-panel p-4 rounded-lg text-center order-3 self-end">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-700 to-transparent rounded-full opacity-50"></div>
            <div className="hexagon-mask w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${rankings[2].avatar}')` }}></div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mb-1">3</div>
          <h3 className="font-bold text-white text-sm truncate">{rankings[2].username}</h3>
          <p className="text-xs text-gray-500">Lvl {rankings[2].level}</p>
          <p className="text-xs text-primary font-mono mt-1">{rankings[2].xp} XP</p>
        </div>
      </div>

      {/* Rankings List */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="divide-y divide-white/5">
          {rankings.map((user) => (
            <Link
              to={`/u/${user.username}`}
              key={user.rank}
              className={`flex items-center gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer ${user.isCurrentUser ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}
            >
              {/* Rank */}
              <div className={`w-10 text-center font-bold text-lg ${user.rank <= 3 ? 'text-[#FFD700]' : 'text-gray-500'}`}>
                #{user.rank}
              </div>

              {/* Avatar */}
              <div className="hexagon-mask size-12 bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${user.avatar}')` }}></div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white truncate hover:text-primary transition-colors">{user.username}</h3>
                  {user.isCurrentUser && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">YOU</span>}
                </div>
                <p className="text-xs text-gray-500">Level {user.level}</p>
              </div>

              {/* Badge */}
              <div className={`text-2xl font-black ${user.badgeColor}`}>
                {user.badge}
              </div>

              {/* XP */}
              <div className="text-right">
                <p className="text-sm font-bold text-white">{user.xp}</p>
                <p className="text-[10px] text-gray-500 uppercase">XP</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
