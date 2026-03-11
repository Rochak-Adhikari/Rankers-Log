import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export function LinkedAccountsPage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [accounts, setAccounts] = useState({
    steam: { linked: true, username: 'GhostRunner_99', enabled: true },
    discord: { linked: false, username: '', enabled: false },
    myanimelist: { linked: false, username: '', enabled: false },
    anilist: { linked: true, username: 'OtakuKing99', enabled: true },
    twitch: { linked: false, username: '', enabled: false, locked: true }
  })
  const [syncSettings, setSyncSettings] = useState({
    auto_import: true,
    share_achievements: false,
    public_visibility: true
  })

  useEffect(() => {
    if (user) loadSettings()
  }, [user])

  async function loadSettings() {
    const { data } = await supabase
      .from('profiles')
      .select('linked_accounts, sync_settings')
      .eq('id', user.id)
      .single()

    if (data?.linked_accounts) {
      setAccounts(prev => ({ ...prev, ...data.linked_accounts }))
    }
    if (data?.sync_settings) {
      setSyncSettings(prev => ({ ...prev, ...data.sync_settings }))
    }
  }

  function toggleAccount(key) {
    if (accounts[key].locked) return
    setAccounts(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled }
    }))
  }

  function toggleSyncSetting(key) {
    setSyncSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-8 text-center">
        <div className="flex items-center gap-2 text-xs text-primary tracking-widest uppercase font-bold justify-center mb-2">
          <span>Sys.Root</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span>Account.Settings</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-white">NEURAL LINK STATUS</h1>
      </div>

      {/* Main Content Area: Skill Tree */}
      <div className="relative flex flex-col items-center max-w-7xl mx-auto">
        {/* Central Spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2 z-0" style={{ boxShadow: '0 0 15px 2px rgba(37, 140, 244, 0.3)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-primary via-transparent to-primary opacity-50"></div>
        </div>

        {/* Node Group 1: Gaming (Left & Right) */}
        <div className="relative w-full flex flex-col md:flex-row justify-center items-center py-12 gap-8">
          {/* Left Node: Steam */}
          <div className="w-full md:w-80 group md:mr-8">
            <div className={`relative backdrop-blur-sm p-5 transition-all duration-300 transform hover:-translate-y-1 ${
              accounts.steam.linked
                ? 'bg-[rgba(255,255,255,0.03)] border border-primary shadow-[0_0_20px_rgba(37,140,244,0.15)]'
                : 'bg-[rgba(255,255,255,0.03)] border border-white/10 hover:bg-white/5 hover:border-white/30'
            }`} style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#171a21] flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-white">sports_esports</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-wide">STEAM</h3>
                    <p className={`text-xs ${accounts.steam.linked ? 'text-primary' : 'text-white/40'}`}>
                      {accounts.steam.linked ? 'LINKED' : 'NOT LINKED'}
                    </p>
                  </div>
                </div>
                {accounts.steam.linked && (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#258cf4]"></div>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <span className="text-xs text-white/50 font-mono">
                  {accounts.steam.linked ? `ID: ${accounts.steam.username}` : 'STATUS: OFFLINE'}
                </span>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={accounts.steam.enabled}
                      onChange={() => toggleAccount('steam')}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-white/5 border border-white/20 rounded-full transition-colors peer-checked:border-primary peer-checked:bg-primary/10"></div>
                    <div className={`absolute left-1 top-1 w-3 h-3 rounded-full transition-transform duration-300 ${
                      accounts.steam.enabled ? 'translate-x-5 bg-primary shadow-[0_0_10px_#258cf4]' : 'bg-white/50'
                    }`}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Central Connection Point on Spine */}
          <div className="hidden md:block w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_#258cf4] border-2 border-[#050505] relative z-10"></div>

          {/* Right Node: Discord */}
          <div className="w-full md:w-80 group md:ml-8">
            <div className={`relative backdrop-blur-sm p-5 transition-all duration-300 transform hover:-translate-y-1 ${
              accounts.discord.linked
                ? 'bg-[rgba(255,255,255,0.03)] border border-primary shadow-[0_0_20px_rgba(37,140,244,0.15)]'
                : 'bg-[rgba(255,255,255,0.03)] border border-white/10 hover:bg-white/5 hover:border-white/30'
            }`} style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#5865F2] flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-white">forum</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-wide text-white/90">DISCORD</h3>
                    <p className="text-xs text-white/40">NOT LINKED</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <span className="text-xs text-white/30 font-mono">STATUS: OFFLINE</span>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={accounts.discord.enabled}
                      onChange={() => toggleAccount('discord')}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-white/5 border border-white/20 rounded-full transition-colors peer-checked:border-primary peer-checked:bg-primary/10"></div>
                    <div className={`absolute left-1 top-1 w-3 h-3 rounded-full transition-transform duration-300 ${
                      accounts.discord.enabled ? 'translate-x-5 bg-primary shadow-[0_0_10px_#258cf4]' : 'bg-white/50'
                    }`}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Node Group 2: Anime/Manga (Left & Right) */}
        <div className="relative w-full flex flex-col md:flex-row justify-center items-center py-12 gap-8">
          {/* Left Node: MyAnimeList */}
          <div className="w-full md:w-80 group md:mr-8">
            <div className="relative bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-white/10 p-5 hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 hover:border-white/30" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#2e51a2] flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-white text-sm">tv</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-wide text-white/90">MYANIMELIST</h3>
                    <p className="text-xs text-white/40">NOT LINKED</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <span className="text-xs text-white/30 font-mono">STATUS: IDLE</span>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={accounts.myanimelist.enabled}
                      onChange={() => toggleAccount('myanimelist')}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-white/5 border border-white/20 rounded-full transition-colors peer-checked:border-primary peer-checked:bg-primary/10"></div>
                    <div className={`absolute left-1 top-1 w-3 h-3 rounded-full transition-transform duration-300 ${
                      accounts.myanimelist.enabled ? 'translate-x-5 bg-primary shadow-[0_0_10px_#258cf4]' : 'bg-white/50'
                    }`}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Central Connection Point */}
          <div className="hidden md:block w-3 h-3 bg-white/20 rounded-full border-2 border-[#050505] relative z-10"></div>

          {/* Right Node: AniList */}
          <div className="w-full md:w-80 group md:ml-8">
            <div className="relative bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-primary p-5 hover:bg-[rgba(37,140,244,0.1)] transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(37,140,244,0.15)]" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#02A9FF] flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-white">auto_stories</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-wide">ANILIST</h3>
                    <p className="text-xs text-primary">LINKED</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#258cf4]"></div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <span className="text-xs text-white/50 font-mono">SYNC: AUTO</span>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={accounts.anilist.enabled}
                      onChange={() => toggleAccount('anilist')}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-white/5 border border-white/20 rounded-full transition-colors peer-checked:border-primary peer-checked:bg-primary/10"></div>
                    <div className={`absolute left-1 top-1 w-3 h-3 rounded-full transition-transform duration-300 ${
                      accounts.anilist.enabled ? 'translate-x-5 bg-primary shadow-[0_0_10px_#258cf4]' : 'bg-white/50'
                    }`}></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Node Group 3: Streaming (Center) */}
        <div className="relative w-full flex justify-center items-center py-12">
          <div className="w-full md:w-80 opacity-60 hover:opacity-100 transition-opacity">
            <div className="relative bg-[rgba(255,255,255,0.03)] backdrop-blur-sm border border-white/10 p-5 transition-all duration-300" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#9146FF] flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-white">live_tv</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-wide text-white/90">TWITCH</h3>
                    <p className="text-xs text-white/40">COMING SOON</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2">
                <span className="text-xs text-white/20 font-mono">LOCKED NODE</span>
                <span className="material-symbols-outlined text-white/20 text-sm">lock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Sync Preferences (Large Bottom Node) */}
        <div className="relative mt-8 w-full max-w-2xl">
          <div className="absolute left-1/2 -top-12 bottom-1/2 w-0.5 bg-gradient-to-b from-primary/50 to-transparent -translate-x-1/2"></div>
          <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-md border-t border-b border-primary/30 p-8 relative overflow-hidden group" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-bold tracking-wider text-white">DATA SYNCHRONIZATION PROTOCOLS</h2>
                <p className="text-sm text-white/50 mt-1">Manage global read/write permissions for all linked nodes.</p>
              </div>
              <div className="mt-4 md:mt-0 px-3 py-1 border border-primary/30 rounded bg-primary/5 text-primary text-xs font-mono">
                GLOBAL_CONFIG_V2.0
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Setting 1 */}
              <div className="flex items-center justify-between p-3 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white/90">Auto-Import Progress</span>
                  <span className="text-xs text-white/40">Sync anime/manga chapters automatically</span>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={syncSettings.auto_import}
                      onChange={() => toggleSyncSetting('auto_import')}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-white/5 border border-white/20 rounded-full transition-colors peer-checked:border-primary peer-checked:bg-primary/10"></div>
                    <div className={`absolute left-1 top-1 w-3 h-3 rounded-full transition-transform duration-300 ${
                      syncSettings.auto_import ? 'translate-x-5 bg-primary shadow-[0_0_10px_#258cf4]' : 'bg-white/50'
                    }`}></div>
                  </div>
                </label>
              </div>
              
              {/* Setting 2 */}
              <div className="flex items-center justify-between p-3 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white/90">Share Achievements</span>
                  <span className="text-xs text-white/40">Post milestones to Rankers Log feed</span>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={syncSettings.share_achievements}
                      onChange={() => toggleSyncSetting('share_achievements')}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-white/5 border border-white/20 rounded-full transition-colors peer-checked:border-primary peer-checked:bg-primary/10"></div>
                    <div className={`absolute left-1 top-1 w-3 h-3 rounded-full transition-transform duration-300 ${
                      syncSettings.share_achievements ? 'translate-x-5 bg-primary shadow-[0_0_10px_#258cf4]' : 'bg-white/50'
                    }`}></div>
                  </div>
                </label>
              </div>
              
              {/* Setting 3 */}
              <div className="flex items-center justify-between p-3 rounded hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white/90">Public Visibility</span>
                  <span className="text-xs text-white/40">Show linked accounts on public profile</span>
                </div>
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={syncSettings.public_visibility}
                      onChange={() => toggleSyncSetting('public_visibility')}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-white/5 border border-white/20 rounded-full transition-colors peer-checked:border-primary peer-checked:bg-primary/10"></div>
                    <div className={`absolute left-1 top-1 w-3 h-3 rounded-full transition-transform duration-300 ${
                      syncSettings.public_visibility ? 'translate-x-5 bg-primary shadow-[0_0_10px_#258cf4]' : 'bg-white/50'
                    }`}></div>
                  </div>
                </label>
              </div>
              
              {/* Privacy Info Node */}
              <div className="group/privacy cursor-pointer flex items-center justify-between p-3 rounded bg-white/5 border border-white/10 hover:border-primary/50 transition-all">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary/70 text-sm">security</span>
                  <span className="text-sm font-semibold text-white/90">Privacy Implications</span>
                </div>
                <span className="material-symbols-outlined text-white/30 text-sm group-hover/privacy:text-white transition-colors">info</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
