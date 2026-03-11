import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export function NotificationSettingsPage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    global_notifications: true,
    followed_user_posts: false,
    comments_on_posts: true,
    rank_change_alerts: true,
    friend_progress: false,
    push_enabled: true,
    in_app_enabled: true,
    email_enabled: false,
    app_updates: true,
    weekly_digest: false
  })

  useEffect(() => {
    if (user) loadSettings()
  }, [user])

  async function loadSettings() {
    const { data } = await supabase
      .from('profiles')
      .select('notification_settings')
      .eq('id', user.id)
      .single()

    if (data?.notification_settings) {
      setSettings(prev => ({ ...prev, ...data.notification_settings }))
    }
  }

  async function saveSettings() {
    if (!user) return
    setSaving(true)

    await supabase
      .from('profiles')
      .update({ notification_settings: settings })
      .eq('id', user.id)

    setSaving(false)
  }

  function toggleSetting(key) {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      {/* Page Title Node */}
      <div className="mb-12 text-center relative group">
        <div className="absolute -inset-4 bg-primary/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-2 relative">
          NOTIFICATION <span className="text-primary" style={{ textShadow: '0 0 10px rgba(37, 140, 244, 0.5)' }}>PROTOCOLS</span>
        </h2>
        <p className="text-[#90adcb] font-mono text-sm tracking-widest uppercase">Configure Signal Reception Parameters</p>
      </div>

      {/* The Skill Tree Spine Structure */}
      <div className="relative w-full flex flex-col items-center max-w-4xl mx-auto">
        {/* Central Glowing Spine Line */}
        <div className="absolute left-1/2 top-0 bottom-12 w-0.5 bg-gradient-to-b from-transparent via-primary to-transparent -translate-x-1/2 shadow-[0_0_10px_rgba(37,140,244,0.3)] opacity-60"></div>

        {/* 1. Master Control Node (Top) */}
        <div className="relative mb-16 w-full max-w-xl">
          <div className="absolute left-1/2 -top-8 w-px h-8 bg-primary/50 -translate-x-1/2"></div>
          <div className="relative bg-[#101922] border border-primary/50 p-1 rounded-lg overflow-hidden group shadow-[0_0_15px_rgba(37,140,244,0.6)]">
            <div className="absolute top-0 right-0 p-2 opacity-50">
              <span className="text-[10px] font-mono text-primary">MS-NODE-01</span>
            </div>
            <div className="bg-[#0a0f14] p-6 flex items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded bg-primary/20 flex items-center justify-center border border-primary/30 text-primary shadow-[0_0_10px_rgba(37,140,244,0.3)]">
                  <span className="material-symbols-outlined text-3xl">power_settings_new</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">GLOBAL OVERRIDE</h3>
                  <p className="text-xs text-[#90adcb] font-mono">Master switch for all incoming signals</p>
                </div>
              </div>
              {/* Tech Toggle */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.global_notifications}
                  onChange={() => toggleSetting('global_notifications')}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-[#1c2a38] peer-focus:outline-none rounded-sm border border-[#314d68] peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-[#90adcb] after:border-gray-300 after:border after:rounded-sm after:h-6 after:w-6 after:transition-all peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:after:bg-primary peer-checked:after:shadow-[0_0_10px_rgba(37,140,244,0.3)]"></div>
              </label>
            </div>
            {/* Background grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(37,140,244,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,140,244,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
          </div>
        </div>

        {/* 2. Activity Cluster (Branching Left & Right) */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8 mb-16 relative">
          {/* Branch Connections */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-transparent -translate-x-1/2">
            <div className="absolute top-10 left-1/2 w-12 h-px bg-primary/40 -translate-x-full shadow-[0_0_10px_rgba(37,140,244,0.3)]"></div>
            <div className="absolute top-10 right-1/2 w-12 h-px bg-primary/40 translate-x-full shadow-[0_0_10px_rgba(37,140,244,0.3)]"></div>
            <div className="absolute top-32 left-1/2 w-12 h-px bg-primary/40 -translate-x-full shadow-[0_0_10px_rgba(37,140,244,0.3)]"></div>
            <div className="absolute top-32 right-1/2 w-12 h-px bg-primary/40 translate-x-full shadow-[0_0_10px_rgba(37,140,244,0.3)]"></div>
          </div>

          {/* Left Branch: Social Interaction */}
          <div className="flex flex-col gap-4 items-end text-right md:pr-12 relative group">
            <div className="absolute -right-3 top-10 size-2 bg-primary rounded-full shadow-[0_0_10px_rgba(37,140,244,0.3)] hidden md:block"></div>
            <h4 className="text-sm font-bold text-primary tracking-[0.2em] mb-2 uppercase flex items-center gap-2">
              Social Signals <span className="material-symbols-outlined text-sm">hub</span>
            </h4>
            {/* Item 1 */}
            <div className="w-full bg-[rgba(20,30,40,0.6)] border border-[#223649] hover:border-primary/50 hover:shadow-[0_0_10px_rgba(37,140,244,0.3)] transition-all duration-300 p-4 rounded-sm flex items-center justify-between group/item backdrop-blur-md">
              <div className="flex-1 pr-4">
                <p className="font-medium text-white group-hover/item:text-primary transition-colors">Followed User Posts</p>
                <p className="text-[10px] text-[#556d86] font-mono">ACT-01 // FREQ: HIGH</p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.followed_user_posts}
                  onChange={() => toggleSetting('followed_user_posts')}
                  className="w-5 h-5 rounded border-[#314d68] bg-[#101a23] text-primary focus:ring-offset-0 focus:ring-0 checked:bg-primary checked:border-primary transition-colors"
                />
              </label>
            </div>
            {/* Item 2 */}
            <div className="w-full bg-[rgba(20,30,40,0.6)] border border-[#223649] hover:border-primary/50 hover:shadow-[0_0_10px_rgba(37,140,244,0.3)] transition-all duration-300 p-4 rounded-sm flex items-center justify-between group/item backdrop-blur-md">
              <div className="flex-1 pr-4">
                <p className="font-medium text-white group-hover/item:text-primary transition-colors">Comments on Posts</p>
                <p className="text-[10px] text-[#556d86] font-mono">ACT-02 // FREQ: MED</p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.comments_on_posts}
                  onChange={() => toggleSetting('comments_on_posts')}
                  className="w-5 h-5 rounded border-[#314d68] bg-[#101a23] text-primary focus:ring-offset-0 focus:ring-0 checked:bg-primary checked:border-primary transition-colors"
                />
              </label>
            </div>
          </div>

          {/* Right Branch: Status Updates */}
          <div className="flex flex-col gap-4 items-start md:pl-12 relative group">
            <div className="absolute -left-3 top-10 size-2 bg-primary rounded-full shadow-[0_0_10px_rgba(37,140,244,0.3)] hidden md:block"></div>
            <h4 className="text-sm font-bold text-primary tracking-[0.2em] mb-2 uppercase flex items-center gap-2 flex-row-reverse md:flex-row">
              <span className="material-symbols-outlined text-sm">monitoring</span> Status Updates
            </h4>
            {/* Item 3 */}
            <div className="w-full bg-[rgba(20,30,40,0.6)] border border-[#223649] hover:border-primary/50 hover:shadow-[0_0_10px_rgba(37,140,244,0.3)] transition-all duration-300 p-4 rounded-sm flex items-center justify-between group/item backdrop-blur-md">
              <div className="flex-1 pr-4 order-2 md:order-1">
                <p className="font-medium text-white group-hover/item:text-primary transition-colors">Rank Change Alerts</p>
                <p className="text-[10px] text-[#556d86] font-mono">SYS-RK // PRIORITY: CRITICAL</p>
              </div>
              <label className="cursor-pointer order-1 md:order-2 mr-4 md:mr-0">
                <input
                  type="checkbox"
                  checked={settings.rank_change_alerts}
                  onChange={() => toggleSetting('rank_change_alerts')}
                  className="w-5 h-5 rounded border-[#314d68] bg-[#101a23] text-primary focus:ring-offset-0 focus:ring-0 checked:bg-primary checked:border-primary transition-colors"
                />
              </label>
            </div>
            {/* Item 4 */}
            <div className="w-full bg-[rgba(20,30,40,0.6)] border border-[#223649] hover:border-primary/50 hover:shadow-[0_0_10px_rgba(37,140,244,0.3)] transition-all duration-300 p-4 rounded-sm flex items-center justify-between group/item backdrop-blur-md">
              <div className="flex-1 pr-4 order-2 md:order-1">
                <p className="font-medium text-white group-hover/item:text-primary transition-colors">Friend Progress</p>
                <p className="text-[10px] text-[#556d86] font-mono">SOC-PR // FREQ: LOW</p>
              </div>
              <label className="cursor-pointer order-1 md:order-2 mr-4 md:mr-0">
                <input
                  type="checkbox"
                  checked={settings.friend_progress}
                  onChange={() => toggleSetting('friend_progress')}
                  className="w-5 h-5 rounded border-[#314d68] bg-[#101a23] text-primary focus:ring-offset-0 focus:ring-0 checked:bg-primary checked:border-primary transition-colors"
                />
              </label>
            </div>
          </div>
        </div>

        {/* 3. Method Selectors (Horizontal Hub) */}
        <div className="relative w-full max-w-2xl mb-16">
          <div className="absolute left-1/2 -top-8 w-px h-8 bg-gradient-to-b from-transparent to-primary/50 -translate-x-1/2"></div>
          <div className="bg-[#101922]/80 border-t border-b border-primary/20 backdrop-blur-sm py-6 px-8 relative">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h3 className="text-lg font-bold text-white tracking-widest uppercase">Delivery Channels</h3>
                <p className="text-xs text-[#90adcb] font-mono">Select active transmission mediums</p>
              </div>
              <div className="flex items-center gap-4">
                {/* Method 1: Push */}
                <label className="group cursor-pointer flex flex-col items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.push_enabled}
                    onChange={() => toggleSetting('push_enabled')}
                    className="hidden peer"
                  />
                  <div className="size-14 rounded-full bg-[#0a0f14] border border-[#314d68] flex items-center justify-center text-[#556d86] peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary peer-checked:shadow-[0_0_10px_rgba(37,140,244,0.3)] transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl">smartphone</span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider text-[#556d86] peer-checked:text-primary">PUSH</span>
                </label>
                <div className="w-8 h-px bg-[#223649]"></div>
                {/* Method 2: In-App */}
                <label className="group cursor-pointer flex flex-col items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.in_app_enabled}
                    onChange={() => toggleSetting('in_app_enabled')}
                    className="hidden peer"
                  />
                  <div className="size-14 rounded-full bg-[#0a0f14] border border-[#314d68] flex items-center justify-center text-[#556d86] peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary peer-checked:shadow-[0_0_10px_rgba(37,140,244,0.3)] transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl">notifications_active</span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider text-[#556d86] peer-checked:text-primary">IN-APP</span>
                </label>
                <div className="w-8 h-px bg-[#223649]"></div>
                {/* Method 3: Email */}
                <label className="group cursor-pointer flex flex-col items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.email_enabled}
                    onChange={() => toggleSetting('email_enabled')}
                    className="hidden peer"
                  />
                  <div className="size-14 rounded-full bg-[#0a0f14] border border-[#314d68] flex items-center justify-center text-[#556d86] peer-checked:bg-primary/10 peer-checked:border-primary peer-checked:text-primary peer-checked:shadow-[0_0_10px_rgba(37,140,244,0.3)] transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl">mail</span>
                  </div>
                  <span className="text-[10px] font-bold tracking-wider text-[#556d86] peer-checked:text-primary">EMAIL</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 4. System Cluster (Lower Branch) */}
        <div className="w-full max-w-3xl mb-16 relative">
          <div className="absolute left-1/2 -top-16 bottom-0 w-px bg-primary/20 -translate-x-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[rgba(20,30,40,0.6)] border border-[#223649] p-4 rounded flex items-center gap-3 hover:border-primary/40 transition-colors">
              <div className="p-2 bg-[#101a23] rounded text-[#90adcb]">
                <span className="material-symbols-outlined">system_update</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">App Updates</p>
                <p className="text-xs text-[#556d86]">Patch notes & maintenance</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.app_updates}
                  onChange={() => toggleSetting('app_updates')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#1c2a38] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="bg-[rgba(20,30,40,0.6)] border border-[#223649] p-4 rounded flex items-center gap-3 hover:border-primary/40 transition-colors">
              <div className="p-2 bg-[#101a23] rounded text-[#90adcb]">
                <span className="material-symbols-outlined">newspaper</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Weekly Digest</p>
                <p className="text-xs text-[#556d86]">Summary of stats</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.weekly_digest}
                  onChange={() => toggleSetting('weekly_digest')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#1c2a38] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 5. Terminal Node (Save Action) */}
        <div className="relative w-full max-w-sm">
          <div className="absolute left-1/2 -top-8 h-8 w-0.5 bg-primary shadow-[0_0_10px_rgba(37,140,244,0.3)] -translate-x-1/2"></div>
          <div className="absolute left-1/2 top-0 size-3 bg-primary rounded-full shadow-[0_0_10px_rgba(37,140,244,0.3)] -translate-x-1/2 -translate-y-1/2 z-20"></div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="group relative w-full overflow-hidden bg-[#101922] p-0 border-0 focus:outline-none disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 z-0"></div>
            <div className="relative z-10 m-[1px] bg-[#0a0f14] hover:bg-[#15202b] transition-colors p-6 flex flex-col items-center justify-center gap-2 border border-primary/40 group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(37,140,244,0.6)]">
              <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">save</span>
              <span className="text-lg font-black tracking-[0.2em] text-white group-hover:text-primary transition-colors" style={{ textShadow: '0 0 10px rgba(37, 140, 244, 0.5)' }}>
                {saving ? 'SAVING...' : 'INITIALIZE CHANGES'}
              </span>
              <span className="text-[10px] font-mono text-[#556d86]">COMMIT TO DATABASE</span>
            </div>
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary"></div>
          </button>
        </div>
      </div>
    </>
  )
}
