import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function SkillTreePage() {
  const { user } = useAuth()
  const [unlockedNodes, setUnlockedNodes] = useState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [userXP, setUserXP] = useState(5000)

  const skillNodes = [
    // Tier 1 - Core Skills
    { id: 'core_1', name: 'Novice Logger', tier: 1, x: 50, y: 80, cost: 0, unlocked: true, icon: 'edit', description: 'Start your journey. Log your first content.' },
    
    // Tier 2 - Branching
    { id: 'anime_1', name: 'Anime Enthusiast', tier: 2, x: 25, y: 60, cost: 500, parent: 'core_1', icon: 'movie', description: 'Watch 10 anime series.' },
    { id: 'manga_1', name: 'Manga Reader', tier: 2, x: 50, y: 60, cost: 500, parent: 'core_1', icon: 'auto_stories', description: 'Read 20 manga volumes.' },
    { id: 'game_1', name: 'Gamer', tier: 2, x: 75, y: 60, cost: 500, parent: 'core_1', icon: 'sports_esports', description: 'Complete 5 games.' },
    
    // Tier 3 - Specialization
    { id: 'anime_2', name: 'Otaku', tier: 3, x: 15, y: 40, cost: 1500, parent: 'anime_1', icon: 'star', description: 'Watch 50 anime series.' },
    { id: 'social_1', name: 'Social Butterfly', tier: 3, x: 35, y: 40, cost: 1000, parent: 'anime_1', icon: 'group', description: 'Gain 100 followers.' },
    { id: 'manga_2', name: 'Bookworm', tier: 3, x: 50, y: 40, cost: 1500, parent: 'manga_1', icon: 'menu_book', description: 'Read 100 manga volumes.' },
    { id: 'game_2', name: 'Completionist', tier: 3, x: 65, y: 40, cost: 1500, parent: 'game_1', icon: 'trophy', description: '100% complete 10 games.' },
    { id: 'streak_1', name: 'Consistent', tier: 3, x: 85, y: 40, cost: 1000, parent: 'game_1', icon: 'local_fire_department', description: 'Maintain 30-day streak.' },
    
    // Tier 4 - Mastery
    { id: 'anime_3', name: 'Weeb Lord', tier: 4, x: 15, y: 20, cost: 3000, parent: 'anime_2', icon: 'workspace_premium', description: 'Watch 200 anime series.' },
    { id: 'critic_1', name: 'Critic', tier: 4, x: 35, y: 20, cost: 2500, parent: 'social_1', icon: 'rate_review', description: 'Write 50 detailed reviews.' },
    { id: 'manga_3', name: 'Sage', tier: 4, x: 50, y: 20, cost: 3000, parent: 'manga_2', icon: 'local_library', description: 'Read 500 manga volumes.' },
    { id: 'game_3', name: 'Legend', tier: 4, x: 65, y: 20, cost: 3000, parent: 'game_2', icon: 'military_tech', description: 'Platinum 25 games.' },
    { id: 'streak_2', name: 'Immortal', tier: 4, x: 85, y: 20, cost: 5000, parent: 'streak_1', icon: 'auto_awesome', description: 'Maintain 365-day streak.' }
  ]

  useEffect(() => {
    loadProgress()
  }, [user])

  async function loadProgress() {
    const { data } = await supabase
      .from('profiles')
      .select('unlocked_skills, xp')
      .eq('id', user?.id)
      .single()

    if (data) {
      setUnlockedNodes(data.unlocked_skills || ['core_1'])
      setUserXP(data.xp || 5000)
    } else {
      setUnlockedNodes(['core_1', 'anime_1', 'manga_1'])
    }
  }

  async function handleUnlock(node) {
    if (userXP < node.cost) return
    if (!node.parent || !unlockedNodes.includes(node.parent)) return

    const newUnlocked = [...unlockedNodes, node.id]
    setUnlockedNodes(newUnlocked)
    setUserXP(prev => prev - node.cost)

    await supabase.from('profiles').update({
      unlocked_skills: newUnlocked,
      xp: userXP - node.cost
    }).eq('id', user.id)

    setSelectedNode(null)
  }

  const isUnlocked = (nodeId) => unlockedNodes.includes(nodeId)
  const canUnlock = (node) => {
    if (isUnlocked(node.id)) return false
    if (!node.parent) return true
    return isUnlocked(node.parent) && userXP >= node.cost
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-purple-500 pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(168, 85, 247, 0.3)' }}>
            Skill Tree
          </h1>
          <p className="text-purple-400/80 font-mono text-sm tracking-widest mt-1">
            // PROGRESSION // COSMETIC_UNLOCKS
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded">
          <span className="material-symbols-outlined text-primary">bolt</span>
          <span className="text-lg font-bold text-white">{userXP.toLocaleString()}</span>
          <span className="text-sm text-gray-400">XP</span>
        </div>
      </div>

      {/* Skill Tree Visualization */}
      <div className="relative bg-[#0a1016] border border-white/10 rounded-xl p-8 min-h-[500px] overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {skillNodes.filter(n => n.parent).map(node => {
            const parent = skillNodes.find(p => p.id === node.parent)
            if (!parent) return null
            const unlocked = isUnlocked(node.id)
            return (
              <line
                key={`line-${node.id}`}
                x1={`${parent.x}%`}
                y1={`${parent.y}%`}
                x2={`${node.x}%`}
                y2={`${node.y}%`}
                stroke={unlocked ? '#a855f7' : '#333'}
                strokeWidth="2"
                strokeDasharray={unlocked ? '0' : '5,5'}
              />
            )
          })}
        </svg>

        {/* Skill Nodes */}
        <div className="relative z-10 h-[400px]">
          {skillNodes.map(node => {
            const unlocked = isUnlocked(node.id)
            const available = canUnlock(node)
            
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all hover:scale-110 ${
                  unlocked 
                    ? 'bg-purple-500/30 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                    : available
                      ? 'bg-white/10 border-primary text-primary hover:bg-primary/20'
                      : 'bg-white/5 border-white/20 text-gray-600'
                }`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <span className="material-symbols-outlined text-2xl">{node.icon}</span>
                {unlocked && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-xs">check</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Tier Labels */}
        <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-around text-xs text-gray-500 font-mono">
          <span>TIER 4</span>
          <span>TIER 3</span>
          <span>TIER 2</span>
          <span>TIER 1</span>
        </div>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedNode(null)}>
          <div className="bg-[#0a1016] border border-purple-500/30 rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                isUnlocked(selectedNode.id) ? 'bg-purple-500/30 border-2 border-purple-500' : 'bg-white/10 border border-white/20'
              }`}>
                <span className="material-symbols-outlined text-3xl text-purple-400">{selectedNode.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{selectedNode.name}</h3>
                <p className="text-sm text-gray-400">Tier {selectedNode.tier}</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-4">{selectedNode.description}</p>
            
            {!isUnlocked(selectedNode.id) && (
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg mb-4">
                <span className="text-sm text-gray-400">Cost:</span>
                <span className={`font-bold ${userXP >= selectedNode.cost ? 'text-primary' : 'text-red-400'}`}>
                  {selectedNode.cost.toLocaleString()} XP
                </span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedNode(null)}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-white font-bold rounded hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              {!isUnlocked(selectedNode.id) && canUnlock(selectedNode) && (
                <button
                  onClick={() => handleUnlock(selectedNode)}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white font-bold rounded hover:bg-purple-600 transition-colors"
                >
                  Unlock
                </button>
              )}
            </div>

            {!isUnlocked(selectedNode.id) && !canUnlock(selectedNode) && (
              <p className="text-xs text-red-400 text-center mt-3">
                {selectedNode.parent && !isUnlocked(selectedNode.parent)
                  ? 'Unlock the parent skill first'
                  : 'Not enough XP'
                }
              </p>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-500/30 border border-purple-500"></div>
          <span className="text-gray-400">Unlocked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/10 border border-primary"></div>
          <span className="text-gray-400">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-white/5 border border-white/20"></div>
          <span className="text-gray-400">Locked</span>
        </div>
      </div>
    </>
  )
}
