export function QuestsPage() {
  const quests = {
    daily: [
      { id: 1, title: 'Read 3 chapters', xp: 50, progress: 2, total: 3, type: 'reading' },
      { id: 2, title: 'Watch 1 episode', xp: 30, progress: 1, total: 1, type: 'watching', completed: true },
      { id: 3, title: 'Log any activity', xp: 20, progress: 0, total: 1, type: 'logging' },
    ],
    weekly: [
      { id: 4, title: 'Complete a series', xp: 200, progress: 0, total: 1, type: 'completion' },
      { id: 5, title: 'Earn 500 XP', xp: 100, progress: 350, total: 500, type: 'xp' },
      { id: 6, title: 'Join a guild event', xp: 150, progress: 0, total: 1, type: 'social' },
    ],
    special: [
      { id: 7, title: 'The First Awakening', xp: 500, progress: 75, total: 100, type: 'story', description: 'Complete the introductory quest line' },
    ]
  }

  const QuestCard = ({ quest }) => {
    const progressPercent = (quest.progress / quest.total) * 100

    return (
      <div className={`glass-panel p-4 rounded-lg ${quest.completed ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-primary'}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className={`font-bold text-sm ${quest.completed ? 'text-emerald-400 line-through' : 'text-white'}`}>{quest.title}</h4>
            {quest.description && <p className="text-xs text-gray-500 mt-1">{quest.description}</p>}
          </div>
          <div className="text-right">
            <span className={`text-xs font-bold ${quest.completed ? 'text-emerald-400' : 'text-primary'}`}>+{quest.xp} XP</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${quest.completed ? 'bg-emerald-500' : 'bg-primary'} transition-all`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {quest.progress}/{quest.total}
          </span>
        </div>
      </div>
    )
  }

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
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-4 py-2 rounded">
          <span className="material-symbols-outlined text-yellow-500">local_fire_department</span>
          <span className="text-sm font-bold text-yellow-500">24 Day Streak</span>
        </div>
      </div>

      {/* Special Quest */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
          Featured Quest
        </h2>
        <div className="glass-panel p-6 rounded-xl border border-yellow-500/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
          {quests.special.map((quest) => (
            <div key={quest.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{quest.title}</h3>
                  <p className="text-sm text-gray-400">{quest.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-yellow-500">+{quest.xp} XP</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                    style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-yellow-500 font-bold">{quest.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Quests */}
      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm">today</span>
          Daily Quests
          <span className="ml-auto text-primary">Resets in 4h 23m</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quests.daily.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>

      {/* Weekly Quests */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#BF00FF] text-sm">date_range</span>
          Weekly Quests
          <span className="ml-auto text-[#BF00FF]">Resets in 3d 12h</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quests.weekly.map((quest) => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>
    </>
  )
}
