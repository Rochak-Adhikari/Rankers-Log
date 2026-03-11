import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

export function PrivacyControlsPage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    activityLog: 'guild',
    allowDMs: false,
    allowComments: true,
    shareStats: false,
    personalizedContent: true
  })

  async function updateSetting(key, value) {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  async function saveSettings() {
    if (!user) return
    setSaving(true)
    await supabase
      .from('profiles')
      .update({ privacy_settings: settings })
      .eq('id', user.id)
    setSaving(false)
  }

  return (
    <>
      {/* Page Title */}
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight" style={{ textShadow: '0 0 15px rgba(255,255,255,0.1)' }}>
          PRIVACY MATRIX
        </h1>
        <p className="text-[#90adcb] mt-2 font-mono text-sm">Configuring data emission levels and social visibility parameters.</p>
      </div>

      <div className="w-full max-w-5xl mx-auto relative pb-32">
        {/* The Vertical Spine */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-24 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent shadow-[0_0_10px_rgba(37,140,244,0.5)]"></div>

        {/* Node 1: Profile Visibility (Left Branch) */}
        <div className="relative w-full flex justify-start mb-12 group">
          <div className="hidden md:block absolute left-1/2 w-1/2 h-px bg-gradient-to-r from-primary/40 to-transparent top-12 -translate-y-1/2 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-12 -translate-y-1/2 w-2 h-2 bg-[#050505] border-2 border-primary rounded-full shadow-[0_0_8px_#258cf4] z-10 group-hover:bg-primary transition-colors duration-300"></div>
          <div className="w-full md:w-[45%] md:mr-auto pr-0 md:pr-12 relative">
            <div className="hidden md:block absolute right-0 top-12 w-12 h-px bg-primary/30 group-hover:bg-primary group-hover:shadow-[0_0_8px_#258cf4] transition-all duration-300"></div>
            <div className="backdrop-blur-sm bg-gradient-to-br from-[rgba(16,26,35,0.8)] to-[rgba(5,5,5,0.9)] border border-[rgba(37,140,244,0.2)] p-6 transition-all duration-300 hover:border-[rgba(37,140,244,0.6)] hover:shadow-[0_0_20px_rgba(37,140,244,0.15)] hover:-translate-y-0.5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <div className="absolute top-0 right-0 p-2 text-primary/30">
                <span className="material-symbols-outlined text-4xl">visibility</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 tracking-wide">PROFILE VISIBILITY</h3>
              <p className="text-xs text-slate-400 mb-6 font-mono">Control who can access your stats and skill tree.</p>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer group/option">
                  <input
                    type="radio"
                    name="profile_vis"
                    value="public"
                    checked={settings.profileVisibility === 'public'}
                    onChange={() => updateSetting('profileVisibility', 'public')}
                    className="hidden peer"
                  />
                  <div className="flex items-center justify-between p-3 rounded bg-[#101a23] border border-[#223649] text-slate-400 peer-checked:bg-primary/15 peer-checked:border-primary peer-checked:text-primary peer-checked:shadow-[0_0_10px_rgba(37,140,244,0.2)_inset] group-hover/option:border-primary/50 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-sm">public</span>
                      <span className="text-sm font-bold uppercase tracking-wider">Public Network</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-current opacity-50 group-hover/option:opacity-100"></div>
                  </div>
                </label>
                <label className="cursor-pointer group/option">
                  <input
                    type="radio"
                    name="profile_vis"
                    value="friends"
                    checked={settings.profileVisibility === 'friends'}
                    onChange={() => updateSetting('profileVisibility', 'friends')}
                    className="hidden peer"
                  />
                  <div className="flex items-center justify-between p-3 rounded bg-[#101a23] border border-[#223649] text-slate-400 peer-checked:bg-primary/15 peer-checked:border-primary peer-checked:text-primary peer-checked:shadow-[0_0_10px_rgba(37,140,244,0.2)_inset] group-hover/option:border-primary/50 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-sm">group</span>
                      <span className="text-sm font-bold uppercase tracking-wider">Allies Only</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-current opacity-50 group-hover/option:opacity-100"></div>
                  </div>
                </label>
                <label className="cursor-pointer group/option">
                  <input
                    type="radio"
                    name="profile_vis"
                    value="private"
                    checked={settings.profileVisibility === 'private'}
                    onChange={() => updateSetting('profileVisibility', 'private')}
                    className="hidden peer"
                  />
                  <div className="flex items-center justify-between p-3 rounded bg-[#101a23] border border-[#223649] text-slate-400 peer-checked:bg-primary/15 peer-checked:border-primary peer-checked:text-primary peer-checked:shadow-[0_0_10px_rgba(37,140,244,0.2)_inset] group-hover/option:border-primary/50 transition-all">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-sm">lock</span>
                      <span className="text-sm font-bold uppercase tracking-wider">Stealth Mode</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-current opacity-50 group-hover/option:opacity-100"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Node 2: Activity Log (Right Branch) */}
        <div className="relative w-full flex justify-end mb-12 group">
          <div className="hidden md:block absolute right-1/2 w-1/2 h-px bg-gradient-to-l from-primary/40 to-transparent top-12 -translate-y-1/2 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-12 -translate-y-1/2 w-2 h-2 bg-[#050505] border-2 border-primary rounded-full shadow-[0_0_8px_#258cf4] z-10 group-hover:bg-primary transition-colors duration-300"></div>
          <div className="w-full md:w-[45%] md:ml-auto pl-0 md:pl-12 relative">
            <div className="hidden md:block absolute left-0 top-12 w-12 h-px bg-primary/30 group-hover:bg-primary group-hover:shadow-[0_0_8px_#258cf4] transition-all duration-300"></div>
            <div className="backdrop-blur-sm bg-gradient-to-br from-[rgba(16,26,35,0.8)] to-[rgba(5,5,5,0.9)] border border-[rgba(37,140,244,0.2)] p-6 transition-all duration-300 hover:border-[rgba(37,140,244,0.6)] hover:shadow-[0_0_20px_rgba(37,140,244,0.15)] hover:-translate-y-0.5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <div className="absolute top-0 right-0 p-2 text-primary/30">
                <span className="material-symbols-outlined text-4xl">history</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 tracking-wide">ACTIVITY LOG</h3>
              <p className="text-xs text-slate-400 mb-6 font-mono">Broadcast range for your achievements and logs.</p>
              <div className="flex p-1 bg-[#101a23] rounded-lg border border-[#223649]">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="activity_log"
                    value="everyone"
                    checked={settings.activityLog === 'everyone'}
                    onChange={() => updateSetting('activityLog', 'everyone')}
                    className="peer hidden"
                  />
                  <div className="h-9 flex items-center justify-center rounded text-xs font-bold uppercase text-slate-500 peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-[0_0_10px_rgba(37,140,244,0.4)] transition-all">
                    Global
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="activity_log"
                    value="guild"
                    checked={settings.activityLog === 'guild'}
                    onChange={() => updateSetting('activityLog', 'guild')}
                    className="peer hidden"
                  />
                  <div className="h-9 flex items-center justify-center rounded text-xs font-bold uppercase text-slate-500 peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-[0_0_10px_rgba(37,140,244,0.4)] transition-all">
                    Guild
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="activity_log"
                    value="none"
                    checked={settings.activityLog === 'none'}
                    onChange={() => updateSetting('activityLog', 'none')}
                    className="peer hidden"
                  />
                  <div className="h-9 flex items-center justify-center rounded text-xs font-bold uppercase text-slate-500 peer-checked:bg-primary peer-checked:text-white peer-checked:shadow-[0_0_10px_rgba(37,140,244,0.4)] transition-all">
                    None
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Node 3: Comms Permissions (Left Branch) */}
        <div className="relative w-full flex justify-start mb-12 group">
          <div className="hidden md:block absolute left-1/2 w-1/2 h-px bg-gradient-to-r from-primary/40 to-transparent top-12 -translate-y-1/2 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-12 -translate-y-1/2 w-2 h-2 bg-[#050505] border-2 border-primary rounded-full shadow-[0_0_8px_#258cf4] z-10 group-hover:bg-primary transition-colors duration-300"></div>
          <div className="w-full md:w-[45%] md:mr-auto pr-0 md:pr-12 relative">
            <div className="hidden md:block absolute right-0 top-12 w-12 h-px bg-primary/30 group-hover:bg-primary group-hover:shadow-[0_0_8px_#258cf4] transition-all duration-300"></div>
            <div className="backdrop-blur-sm bg-gradient-to-br from-[rgba(16,26,35,0.8)] to-[rgba(5,5,5,0.9)] border border-[rgba(37,140,244,0.2)] p-6 transition-all duration-300 hover:border-[rgba(37,140,244,0.6)] hover:shadow-[0_0_20px_rgba(37,140,244,0.15)] hover:-translate-y-0.5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <div className="absolute top-0 right-0 p-2 text-primary/30">
                <span className="material-symbols-outlined text-4xl">chat</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 tracking-wide">COMMS PERMISSIONS</h3>
              <p className="text-xs text-slate-400 mb-6 font-mono">Incoming transmission filtering protocols.</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between group/switch">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-300 group-hover/switch:text-primary transition-colors">Direct Messages</span>
                    <span className="text-[10px] text-slate-500">Allow strangers to open channels</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowDMs}
                      onChange={() => updateSetting('allowDMs', !settings.allowDMs)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#101a23] peer-focus:outline-none rounded-full peer border border-[#223649] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-slate-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:after:bg-primary peer-checked:shadow-[0_0_10px_rgba(37,140,244,0.3)]"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between group/switch">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-300 group-hover/switch:text-primary transition-colors">Comment Access</span>
                    <span className="text-[10px] text-slate-500">Public comments on your logs</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowComments}
                      onChange={() => updateSetting('allowComments', !settings.allowComments)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#101a23] peer-focus:outline-none rounded-full peer border border-[#223649] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-slate-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:after:bg-primary peer-checked:shadow-[0_0_10px_rgba(37,140,244,0.3)]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Node 4: Data Telemetry (Right Branch) */}
        <div className="relative w-full flex justify-end mb-16 group">
          <div className="hidden md:block absolute right-1/2 w-1/2 h-px bg-gradient-to-l from-primary/40 to-transparent top-12 -translate-y-1/2 origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-12 -translate-y-1/2 w-2 h-2 bg-[#050505] border-2 border-primary rounded-full shadow-[0_0_8px_#258cf4] z-10 group-hover:bg-primary transition-colors duration-300"></div>
          <div className="w-full md:w-[45%] md:ml-auto pl-0 md:pl-12 relative">
            <div className="hidden md:block absolute left-0 top-12 w-12 h-px bg-primary/30 group-hover:bg-primary group-hover:shadow-[0_0_8px_#258cf4] transition-all duration-300"></div>
            <div className="backdrop-blur-sm bg-gradient-to-br from-[rgba(16,26,35,0.8)] to-[rgba(5,5,5,0.9)] border border-[rgba(37,140,244,0.2)] p-6 transition-all duration-300 hover:border-[rgba(37,140,244,0.6)] hover:shadow-[0_0_20px_rgba(37,140,244,0.15)] hover:-translate-y-0.5" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
              <div className="absolute top-0 right-0 p-2 text-primary/30">
                <span className="material-symbols-outlined text-4xl">share</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 tracking-wide">DATA TELEMETRY</h3>
              <p className="text-xs text-slate-400 mb-6 font-mono">External data sharing preferences.</p>
              <div className="space-y-3">
                <label className="flex items-center p-2 rounded cursor-pointer hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/30">
                  <input
                    type="checkbox"
                    checked={settings.shareStats}
                    onChange={() => updateSetting('shareStats', !settings.shareStats)}
                    className="w-4 h-4 rounded border-slate-600 text-primary focus:ring-primary bg-[#101a23]"
                  />
                  <span className="ml-3 text-sm text-slate-300">Share usage statistics</span>
                </label>
                <label className="flex items-center p-2 rounded cursor-pointer hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/30">
                  <input
                    type="checkbox"
                    checked={settings.personalizedContent}
                    onChange={() => updateSetting('personalizedContent', !settings.personalizedContent)}
                    className="w-4 h-4 rounded border-slate-600 text-primary focus:ring-primary bg-[#101a23]"
                  />
                  <span className="ml-3 text-sm text-slate-300">Allow personalized content</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal Node: Save Button */}
        <div className="relative z-20 flex justify-center mt-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full h-16 w-px bg-gradient-to-b from-primary to-primary/20"></div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="relative group overflow-hidden bg-[#050505] rounded-xl px-12 py-5 border-2 border-primary text-white font-bold text-lg tracking-[0.2em] shadow-[0_0_20px_rgba(37,140,244,0.3)] hover:shadow-[0_0_40px_rgba(37,140,244,0.6)] transition-all duration-300 active:scale-95 disabled:opacity-50"
          >
            <div className="absolute inset-0 w-full h-full bg-primary opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-primary"></div>
            <span className="relative z-10 flex items-center gap-3">
              <span className="material-symbols-outlined animate-pulse">memory</span>
              {saving ? 'SAVING...' : 'INITIALIZE PROTOCOLS'}
            </span>
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white opacity-50"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white opacity-50"></div>
          </button>
        </div>
        <div className="text-center mt-6">
          <p className="text-[10px] text-[#223649] font-mono">SYSTEM INTEGRITY: 100% // NO VULNERABILITIES DETECTED</p>
        </div>
      </div>
    </>
  )
}
