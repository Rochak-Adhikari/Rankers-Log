import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function SettingsPage() {
  const { signOut } = useAuth()

  return (
    <>
      {/* Page Title & Intro */}
      <div className="w-full max-w-[900px] mx-auto mb-12 text-center md:text-left relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent hidden md:block"></div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2 uppercase">System Configuration</h1>
        <p className="text-[#90adcb] font-mono text-sm md:text-base max-w-2xl">
          &gt; Initializing skill tree protocols...<br />
          &gt; Configure neural link, interface preferences, and privacy nodes below.
        </p>
      </div>

      {/* The Skill Tree Container */}
      <div className="relative w-full max-w-[1000px] mx-auto flex flex-col items-center">
        {/* Central Spine Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-[#223649] md:-translate-x-1/2 z-0">
          <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-primary via-primary/50 to-transparent shadow-[0_0_10px_rgba(37,140,244,0.5)]"></div>
        </div>

        {/* TREE NODE 1: Account Core (Left Branch Desktop) */}
        <section className="w-full flex flex-col md:flex-row items-start md:justify-end md:pr-[50%] relative mb-16 group">
          <div className="absolute left-[13px] md:left-1/2 md:-translate-x-1/2 top-8 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#258cf4] z-10 ring-4 ring-[#050505]"></div>
          <div className="absolute left-[15px] md:left-auto md:right-[50%] top-9 w-[30px] md:w-[60px] h-[1px] bg-primary group-hover:shadow-[0_0_8px_#258cf4] transition-all duration-300"></div>
          <div className="ml-12 md:ml-0 md:mr-16 w-[calc(100%-3rem)] md:w-[400px]">
            <div className="relative bg-[#101a23]/90 backdrop-blur-sm border border-[#314d68] rounded-xl p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_0_15px_rgba(37,140,244,0.15)] group-hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#223649]">
                <div className="p-2 bg-primary/20 rounded text-primary">
                  <span className="material-symbols-outlined">shield_person</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-wide">ACCOUNT CORE</h3>
                  <p className="text-xs text-[#90adcb] font-mono">ID: USER_PROFILE // SECURITY_LEVEL_5</p>
                </div>
              </div>
              <div className="space-y-3">
                <Link to="/profile/edit" className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0a1118] border border-transparent hover:border-primary/50 hover:bg-[#15202b] group/btn transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#90adcb] group-hover/btn:text-white text-[20px]">edit_square</span>
                    <span className="text-sm font-medium text-gray-300 group-hover/btn:text-white">Edit Identity Profile</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 group-hover/btn:text-primary text-[16px]">arrow_forward_ios</span>
                </Link>
                <Link to="/settings/account" className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0a1118] border border-transparent hover:border-primary/50 hover:bg-[#15202b] group/btn transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#90adcb] group-hover/btn:text-white text-[20px]">lock</span>
                    <span className="text-sm font-medium text-gray-300 group-hover/btn:text-white">Security &amp; Password</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 group-hover/btn:text-primary text-[16px]">arrow_forward_ios</span>
                </Link>
                <Link to="/settings/linked-accounts" className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0a1118] border border-transparent hover:border-primary/50 hover:bg-[#15202b] group/btn transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#90adcb] group-hover/btn:text-white text-[20px]">link</span>
                    <span className="text-sm font-medium text-gray-300 group-hover/btn:text-white">Neural Links (Connected Apps)</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 group-hover/btn:text-primary text-[16px]">arrow_forward_ios</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TREE NODE 2: System Preferences (Right Branch Desktop) */}
        <section className="w-full flex flex-col md:flex-row items-start md:justify-start md:pl-[50%] relative mb-16 group">
          <div className="absolute left-[13px] md:left-1/2 md:-translate-x-1/2 top-8 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#258cf4] z-10 ring-4 ring-[#050505]"></div>
          <div className="absolute left-[15px] md:left-[50%] top-9 w-[30px] md:w-[60px] h-[1px] bg-primary group-hover:shadow-[0_0_8px_#258cf4] transition-all duration-300"></div>
          <div className="ml-12 md:ml-16 w-[calc(100%-3rem)] md:w-[400px]">
            <div className="relative bg-[#101a23]/90 backdrop-blur-sm border border-[#314d68] rounded-xl p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_0_15px_rgba(37,140,244,0.15)] group-hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#223649]">
                <div className="p-2 bg-primary/20 rounded text-primary">
                  <span className="material-symbols-outlined">tune</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-wide">SYSTEM PREFERENCES</h3>
                  <p className="text-xs text-[#90adcb] font-mono">UI_VER: 4.2.0 // INTERFACE_MODS</p>
                </div>
              </div>
              <div className="space-y-3">
                <Link to="/settings/notifications" className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0a1118] border border-transparent hover:border-primary/50 hover:bg-[#15202b] group/btn transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#90adcb] group-hover/btn:text-white text-[20px]">notifications_active</span>
                    <span className="text-sm font-medium text-gray-300 group-hover/btn:text-white">Notification Settings</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 group-hover/btn:text-primary text-[16px]">arrow_forward_ios</span>
                </Link>
                <Link to="/settings/privacy" className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0a1118] border border-transparent hover:border-primary/50 hover:bg-[#15202b] group/btn transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#90adcb] group-hover/btn:text-white text-[20px]">shield</span>
                    <span className="text-sm font-medium text-gray-300 group-hover/btn:text-white">Privacy Controls</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 group-hover/btn:text-primary text-[16px]">arrow_forward_ios</span>
                </Link>
                <div className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0a1118] border border-transparent opacity-70 cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#90adcb] text-[20px]">dark_mode</span>
                    <span className="text-sm font-medium text-gray-300">Theme: Dark Mode</span>
                  </div>
                  <span className="text-[10px] font-mono text-primary border border-primary/30 px-1 rounded">LOCKED</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TREE NODE 3: Gamification (Left Branch Desktop) */}
        <section className="w-full flex flex-col md:flex-row items-start md:justify-end md:pr-[50%] relative mb-16 group">
          <div className="absolute left-[13px] md:left-1/2 md:-translate-x-1/2 top-8 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#258cf4] z-10 ring-4 ring-[#050505]"></div>
          <div className="absolute left-[15px] md:left-auto md:right-[50%] top-9 w-[30px] md:w-[60px] h-[1px] bg-primary group-hover:shadow-[0_0_8px_#258cf4] transition-all duration-300"></div>
          <div className="ml-12 md:ml-0 md:mr-16 w-[calc(100%-3rem)] md:w-[400px]">
            <div className="relative bg-[#101a23]/90 backdrop-blur-sm border border-[#314d68] rounded-xl p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_0_15px_rgba(37,140,244,0.15)] group-hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#223649]">
                <div className="p-2 bg-primary/20 rounded text-primary">
                  <span className="material-symbols-outlined">military_tech</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-wide">GAMIFICATION</h3>
                  <p className="text-xs text-[#90adcb] font-mono">XP_LOGS // BADGE_DISPLAY_MATRIX</p>
                </div>
              </div>
              <div className="space-y-3">
                <Link to="/skill-tree" className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0a1118] border border-transparent hover:border-primary/50 hover:bg-[#15202b] group/btn transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#90adcb] group-hover/btn:text-white text-[20px]">visibility</span>
                    <span className="text-sm font-medium text-gray-300 group-hover/btn:text-white">View Skill Tree</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 group-hover/btn:text-primary text-[16px]">arrow_forward_ios</span>
                </Link>
                <Link to="/streaks" className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0a1118] border border-transparent hover:border-primary/50 hover:bg-[#15202b] group/btn transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#90adcb] group-hover/btn:text-white text-[20px]">local_fire_department</span>
                    <span className="text-sm font-medium text-gray-300 group-hover/btn:text-white">Streaks &amp; Check-in</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 group-hover/btn:text-primary text-[16px]">arrow_forward_ios</span>
                </Link>
                <Link to="/settings/blocked" className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0a1118] border border-transparent hover:border-primary/50 hover:bg-[#15202b] group/btn transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#90adcb] group-hover/btn:text-white text-[20px]">block</span>
                    <span className="text-sm font-medium text-gray-300 group-hover/btn:text-white">Blocked Users</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 group-hover/btn:text-primary text-[16px]">arrow_forward_ios</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TREE NODE 4: Support Uplink (Right Branch Desktop) */}
        <section className="w-full flex flex-col md:flex-row items-start md:justify-start md:pl-[50%] relative mb-24 group">
          <div className="absolute left-[13px] md:left-1/2 md:-translate-x-1/2 top-8 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#258cf4] z-10 ring-4 ring-[#050505]"></div>
          <div className="absolute left-[15px] md:left-[50%] top-9 w-[30px] md:w-[60px] h-[1px] bg-primary group-hover:shadow-[0_0_8px_#258cf4] transition-all duration-300"></div>
          <div className="ml-12 md:ml-16 w-[calc(100%-3rem)] md:w-[400px]">
            <div className="relative bg-[#101a23]/90 backdrop-blur-sm border border-[#314d68] rounded-xl p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_0_15px_rgba(37,140,244,0.15)] group-hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#223649]">
                <div className="p-2 bg-primary/20 rounded text-primary">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-wide">SUPPORT UPLINK</h3>
                  <p className="text-xs text-[#90adcb] font-mono">FAQ // DIRECT_LINE // VERSION_LOG</p>
                </div>
              </div>
              <div className="space-y-3">
                <Link to="/safety" className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0a1118] border border-transparent hover:border-primary/50 hover:bg-[#15202b] group/btn transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#90adcb] group-hover/btn:text-white text-[20px]">help_center</span>
                    <span className="text-sm font-medium text-gray-300 group-hover/btn:text-white">Safety Center</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 group-hover/btn:text-primary text-[16px]">arrow_forward_ios</span>
                </Link>
                <Link to="/reports" className="w-full flex items-center justify-between p-3 rounded-lg bg-[#0a1118] border border-transparent hover:border-primary/50 hover:bg-[#15202b] group/btn transition-all">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#90adcb] group-hover/btn:text-white text-[20px]">mail</span>
                    <span className="text-sm font-medium text-gray-300 group-hover/btn:text-white">Report a Problem</span>
                  </div>
                  <span className="material-symbols-outlined text-gray-500 group-hover/btn:text-primary text-[16px]">arrow_forward_ios</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* TERMINAL NODE: Danger Zone */}
        <section className="w-full flex flex-col items-center relative z-10 pb-20">
          <div className="absolute top-[-96px] bottom-1/2 w-[2px] bg-gradient-to-b from-[#223649] to-red-500/50 left-[16px] md:left-1/2 md:-translate-x-1/2 z-[-1]"></div>
          <div className="relative w-full max-w-md px-6 flex flex-col gap-4">
            <div className="flex items-center gap-4 text-red-500/80 mb-2 justify-center">
              <span className="h-[1px] w-12 bg-red-500/40"></span>
              <span className="text-xs font-mono tracking-widest uppercase">System Termination</span>
              <span className="h-[1px] w-12 bg-red-500/40"></span>
            </div>
            <button
              onClick={signOut}
              className="relative w-full group overflow-hidden rounded-lg bg-transparent border border-[#314d68] hover:border-primary/80 transition-all p-4"
            >
              <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="flex items-center justify-center gap-3 relative z-10">
                <span className="material-symbols-outlined text-white">logout</span>
                <span className="font-bold text-white tracking-wider">LOGOUT SESSION</span>
              </div>
            </button>
            <Link
              to="/settings/data"
              className="relative w-full group overflow-hidden rounded-lg bg-transparent border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 transition-all p-4 text-center"
            >
              <div className="flex items-center justify-center gap-3 relative z-10">
                <span className="material-symbols-outlined text-red-500">delete_forever</span>
                <span className="font-bold text-red-500 tracking-wider">DELETE ACCOUNT DATA</span>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
