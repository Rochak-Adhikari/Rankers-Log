import { Link } from 'react-router-dom'

export function QuestsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-yellow-500 pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white neon-text-gold">
            Quest Board
          </h1>
          <p className="text-yellow-500/80 font-mono text-sm tracking-widest mt-1">
            // MISSION LOG // EARN REWARDS
          </p>
        </div>
      </div>

      {/* Coming Soon State */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-panel border border-yellow-500/20 rounded-2xl p-12 max-w-lg w-full">
          <span className="material-symbols-outlined text-6xl text-yellow-500/50 mb-6 block">assignment</span>
          <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">
            Quest Board Offline
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Daily, weekly, and special quests are still being configured. 
            This board will go live once the quest engine is connected.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/streaks"
              className="px-6 py-3 bg-primary/10 border border-primary/30 text-primary rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors flex items-center gap-2 justify-center"
            >
              <span className="material-symbols-outlined text-base">local_fire_department</span>
              View Daily Streak
            </Link>
            <Link
              to="/feed"
              className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-lg text-sm font-bold hover:bg-white/10 transition-colors flex items-center gap-2 justify-center"
            >
              <span className="material-symbols-outlined text-base">home</span>
              Back to Feed
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
