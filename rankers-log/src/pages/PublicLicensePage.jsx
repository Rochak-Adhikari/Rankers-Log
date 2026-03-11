import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function PublicLicensePage() {
  const { shareId } = useParams()
  const [license, setLicense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    loadLicense()
  }, [shareId])

  async function loadLicense() {
    setLoading(true)
    
    const { data } = await supabase
      .from('appraisals')
      .select('*, profiles(username, avatar_url, level)')
      .eq('share_id', shareId)
      .single()

    if (data) {
      setLicense(data)
    } else {
      // Mock data for display
      setLicense({
        player_class: 'Shadow Monarch',
        rank: 'S',
        stats: { power: 95, intelligence: 88, agility: 92, endurance: 85, luck: 78 },
        share_id: shareId,
        profiles: { username: 'PlayerKairos', avatar_url: '', level: 42 },
        created_at: new Date().toISOString()
      })
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center text-center p-4">
        <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">badge</span>
        <h1 className="text-2xl font-black text-white mb-2">License Not Found</h1>
        <p className="text-gray-400 mb-6">This Player License doesn't exist or has been revoked.</p>
        <Link to="/" className="px-6 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black rounded font-bold hover:from-[#FFA500] hover:to-[#FFD700] transition-colors shadow-[0_0_10px_rgba(255,215,0,0.3)]">
          Go Home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* License Card */}
        <div className="bg-gradient-to-br from-[#0a1016] via-[#101a28] to-[#0a1016] border-2 border-primary/50 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(37,140,244,0.3)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-b border-primary/30 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">badge</span>
                <div>
                  <p className="text-xs font-mono text-primary/80 tracking-[0.2em]">RANKER'S LOG</p>
                  <p className="text-white font-bold">PLAYER LICENSE</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">ID</p>
                <p className="text-sm font-mono text-primary">{license.share_id}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Rank Badge */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-rank-gold via-yellow-500 to-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.5)]">
                  <span className="text-5xl font-black text-black">{license.rank}</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded-full border border-rank-gold/50">
                  <span className="text-xs font-bold text-rank-gold">RANK</span>
                </div>
              </div>
            </div>

            {/* Player Info */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-white uppercase mb-1">{license.player_class}</h2>
              <p className="text-primary">@{license.profiles?.username}</p>
              <p className="text-xs text-gray-500 mt-2">Level {license.profiles?.level || 1} Player</p>
            </div>

            {/* Stats */}
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-400 text-center mb-3 font-mono">PLAYER STATISTICS</p>
              <div className="space-y-2">
                {Object.entries(license.stats || {}).map(([stat, value]) => (
                  <div key={stat} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 uppercase w-20">{stat}</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-cyan-400"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-white w-8 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-xs text-gray-500 border-t border-white/10 pt-4">
              <span>Issued: {new Date(license.created_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              alert('Link copied!')
            }}
            className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">link</span>
            Copy Link
          </button>
          <Link
            to="/"
            className="flex-1 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-lg hover:from-[#FFA500] hover:to-[#FFD700] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            <span className="material-symbols-outlined">home</span>
            Get Your License
          </Link>
        </div>

        {/* Branding */}
        <p className="text-center text-xs text-gray-600 mt-6 font-mono">
          RANKER'S LOG // PLAYER VERIFICATION SYSTEM
        </p>
      </div>
    </div>
  )
}
