export function AchievementsPage() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Hero Banner */}
      <section className="relative w-full rounded-lg overflow-hidden min-h-[160px] flex flex-col justify-end bg-[#0d1a27] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <div className="relative p-6 md:p-10 flex flex-col gap-2 z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
            Achievement Database
          </h2>
          <p className="text-slate-400 max-w-2xl text-sm md:text-base">
            Track your milestones. Achievements will appear here once the system is active.
          </p>
        </div>
      </section>

      {/* Empty State — no fake stats */}
      <section className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="glass-panel border border-white/10 rounded-2xl p-12 max-w-lg w-full">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-6 block">military_tech</span>
          <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">
            No Achievements Yet
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            The achievement engine is being built. Once live, your earned trophies, 
            completion stats, and rarity rankings will appear here automatically.
          </p>
        </div>
      </section>
    </div>
  )
}
