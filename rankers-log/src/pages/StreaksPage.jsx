import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function StreaksPage() {
  const { user } = useAuth()
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastCheckIn: null })
  const [loading, setLoading] = useState(true)
  const [checkedIn, setCheckedIn] = useState(false)
  const [weekDays, setWeekDays] = useState([])

  useEffect(() => {
    if (user) loadStreakData()
  }, [user])

  async function loadStreakData() {
    setLoading(true)
    
    const { data } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setStreak({
        current: data.current_streak || 0,
        longest: data.longest_streak || 0,
        lastCheckIn: data.last_check_in
      })
      const today = new Date().toDateString()
      const lastCheckIn = data.last_check_in ? new Date(data.last_check_in).toDateString() : null
      setCheckedIn(today === lastCheckIn)
    } else {
      setStreak({ current: 7, longest: 42, lastCheckIn: null })
    }

    // Generate week days
    const days = []
    const today = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        date: date.getDate(),
        completed: i > 0, // Mock: all past days completed
        isToday: i === 0
      })
    }
    setWeekDays(days)

    setLoading(false)
  }

  async function handleCheckIn() {
    if (checkedIn) return

    const { error } = await supabase
      .from('streaks')
      .upsert({
        user_id: user.id,
        current_streak: streak.current + 1,
        longest_streak: Math.max(streak.longest, streak.current + 1),
        last_check_in: new Date().toISOString()
      })

    if (!error) {
      setStreak(prev => ({
        ...prev,
        current: prev.current + 1,
        longest: Math.max(prev.longest, prev.current + 1)
      }))
      setCheckedIn(true)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <p className="text-gray-400 font-mono text-sm">LOADING STREAK DATA...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-8 flex flex-wrap justify-between items-end gap-4 border-l-4 border-primary pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(37, 140, 244, 0.3)' }}>
            Daily Ritual
          </h1>
          <p className="text-primary/80 font-mono text-sm tracking-widest mt-1">
            // CHECK-IN // STREAK_MAINTENANCE
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded text-sm font-mono text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">local_fire_department</span>
            STREAK: {streak.current} DAYS
          </div>
        </div>
      </div>

      {/* Main Streak Card */}
      <div className="bg-[#101922] border border-primary/30 rounded-xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          {/* Streak Counter */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_0_40px_rgba(249,115,22,0.4)] mb-4">
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-5xl text-white">local_fire_department</span>
              </div>
            </div>
            <h2 className="text-6xl font-black text-white mb-2">{streak.current}</h2>
            <p className="text-text-secondary font-mono text-sm uppercase tracking-widest">Day Streak</p>
          </div>

          {/* Week Progress */}
          <div className="flex justify-center gap-3 mb-8">
            {weekDays.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-[10px] text-text-secondary font-mono">{day.day}</span>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all ${
                  day.completed 
                    ? 'bg-orange-500/20 border-orange-500 text-orange-500' 
                    : day.isToday 
                      ? checkedIn 
                        ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                        : 'bg-primary/20 border-primary text-primary animate-pulse'
                      : 'bg-white/5 border-white/10 text-gray-500'
                }`}>
                  {day.completed || (day.isToday && checkedIn) ? (
                    <span className="material-symbols-outlined">check</span>
                  ) : (
                    <span className="text-sm font-bold">{day.date}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Check-in Button */}
          <div className="flex justify-center">
            <button
              onClick={handleCheckIn}
              disabled={checkedIn}
              className={`px-8 py-4 rounded-lg font-bold text-lg tracking-wider transition-all flex items-center gap-3 ${
                checkedIn
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                  : 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:scale-105'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">
                {checkedIn ? 'check_circle' : 'touch_app'}
              </span>
              {checkedIn ? 'RITUAL COMPLETE' : 'CHECK IN NOW'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-orange-500">local_fire_department</span>
            <span className="text-text-secondary text-xs font-mono uppercase tracking-widest">Current Streak</span>
          </div>
          <p className="text-4xl font-black text-white">{streak.current} <span className="text-lg text-text-secondary">days</span></p>
        </div>
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-rank-gold">emoji_events</span>
            <span className="text-text-secondary text-xs font-mono uppercase tracking-widest">Longest Streak</span>
          </div>
          <p className="text-4xl font-black text-white">{streak.longest} <span className="text-lg text-text-secondary">days</span></p>
        </div>
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 hover:border-primary/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-primary">bolt</span>
            <span className="text-text-secondary text-xs font-mono uppercase tracking-widest">Bonus XP</span>
          </div>
          <p className="text-4xl font-black text-white">+{streak.current * 10} <span className="text-lg text-text-secondary">XP/day</span></p>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-rank-gold">redeem</span>
          Streak Rewards
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { days: 7, reward: 'Bronze Frame', icon: 'photo_frame', unlocked: streak.current >= 7 },
            { days: 30, reward: 'Silver Badge', icon: 'military_tech', unlocked: streak.current >= 30 },
            { days: 60, reward: 'Gold Title', icon: 'workspace_premium', unlocked: streak.current >= 60 },
            { days: 100, reward: 'Legendary Aura', icon: 'auto_awesome', unlocked: streak.current >= 100 }
          ].map((tier, i) => (
            <div key={i} className={`p-4 rounded-lg border text-center transition-all ${
              tier.unlocked 
                ? 'bg-rank-gold/10 border-rank-gold/30' 
                : 'bg-white/5 border-white/10 opacity-50'
            }`}>
              <span className={`material-symbols-outlined text-3xl mb-2 ${tier.unlocked ? 'text-rank-gold' : 'text-gray-500'}`}>{tier.icon}</span>
              <p className="text-xs font-bold text-white">{tier.reward}</p>
              <p className="text-[10px] text-text-secondary font-mono">{tier.days} Days</p>
              {tier.unlocked && (
                <span className="inline-block mt-2 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">UNLOCKED</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
