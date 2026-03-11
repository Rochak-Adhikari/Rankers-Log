import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function ProfileEditPage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const avatarInputRef = useRef(null)
  const bannerInputRef = useRef(null)
  const [profile, setProfile] = useState({
    username: '',
    display_name: '',
    bio: '',
    discord: '',
    twitter: '',
    twitch: '',
    profile_visibility: true,
    online_status: true,
    avatar_url: '',
    banner_url: ''
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  async function fetchProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error && data) {
      setProfile({
        username: data.username || '',
        display_name: data.display_name || '',
        bio: data.bio || '',
        discord: data.discord || '',
        twitter: data.twitter || '',
        twitch: data.twitch || '',
        profile_visibility: data.profile_visibility ?? true,
        online_status: data.online_status ?? true,
        avatar_url: data.avatar_url || '',
        banner_url: data.banner_url || ''
      })
    }
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        discord: profile.discord,
        twitter: profile.twitter,
        twitch: profile.twitch,
        profile_visibility: profile.profile_visibility,
        online_status: profile.online_status
      })
      .eq('id', user.id)

    if (!error) {
      alert('Profile updated successfully!')
    }
    setSaving(false)
  }

  function handleReset() {
    fetchProfile()
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setUploadingAvatar(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true })

      if (uploadError) {
        alert(`Upload failed: ${uploadError.message}`)
        setUploadingAvatar(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
      alert('Avatar updated successfully!')
    } catch (err) {
      alert('Failed to upload avatar')
    }

    setUploadingAvatar(false)
  }

  async function handleBannerUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Banner size must be less than 10MB')
      return
    }

    setUploadingBanner(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-banner-${Date.now()}.${fileExt}`
      const filePath = `banners/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true })

      if (uploadError) {
        alert(`Upload failed: ${uploadError.message}`)
        setUploadingBanner(false)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      await supabase.from('profiles').update({ banner_url: publicUrl }).eq('id', user.id)
      setProfile(prev => ({ ...prev, banner_url: publicUrl }))
      alert('Banner updated successfully!')
    } catch (err) {
      alert('Failed to upload banner')
    }

    setUploadingBanner(false)
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[calc(100vh-200px)]">
      {/* Left Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="glass-panel rounded-lg p-1 sticky top-24">
          <div className="bg-[#16202a]/50 rounded p-4 mb-1 border-b border-[#314d68]">
            <h2 className="text-xs font-bold text-slate-400 tracking-widest mb-1">SYSTEM CONFIG</h2>
            <p className="text-white font-bold text-lg">SETTINGS</p>
          </div>
          <nav className="flex flex-col gap-1 p-2">
            <Link to="/profile/edit" className="group flex items-center gap-3 px-4 py-3 rounded bg-primary/10 border-l-2 border-primary text-white shadow-[0_0_10px_rgba(37,140,244,0.3)] transition-all">
              <span className="material-symbols-outlined text-[20px] group-hover:animate-pulse">manage_accounts</span>
              <span className="text-sm font-medium tracking-wide">EDIT IDENTITY</span>
            </Link>
            <Link to="/settings/account-security" className="group flex items-center gap-3 px-4 py-3 rounded hover:bg-[#16202a] border-l-2 border-transparent hover:border-slate-600 text-slate-400 hover:text-white transition-all">
              <span className="material-symbols-outlined text-[20px]">lock_reset</span>
              <span className="text-sm font-medium tracking-wide">SECURITY KEY</span>
            </Link>
            <Link to="/settings/linked-accounts" className="group flex items-center gap-3 px-4 py-3 rounded hover:bg-[#16202a] border-l-2 border-transparent hover:border-slate-600 text-slate-400 hover:text-white transition-all">
              <span className="material-symbols-outlined text-[20px]">link</span>
              <span className="text-sm font-medium tracking-wide">NEURAL LINKS</span>
            </Link>
            <Link to="/settings/privacy" className="group flex items-center gap-3 px-4 py-3 rounded hover:bg-[#16202a] border-l-2 border-transparent hover:border-slate-600 text-slate-400 hover:text-white transition-all">
              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
              <span className="text-sm font-medium tracking-wide">PRIVACY PROTOCOLS</span>
            </Link>
            <Link to="/settings/notifications" className="group flex items-center gap-3 px-4 py-3 rounded hover:bg-[#16202a] border-l-2 border-transparent hover:border-slate-600 text-slate-400 hover:text-white transition-all">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
              <span className="text-sm font-medium tracking-wide">SIGNALS</span>
            </Link>
          </nav>
          <div className="mt-4 p-4 border-t border-[#314d68]/50">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>SYS.STATUS</span>
              <span className="text-green-400">ONLINE</span>
            </div>
            <div className="w-full bg-[#314d68] h-1 mt-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[85%] shadow-[0_0_10px_#258cf4]"></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2 border-b border-[#314d68] pb-4">
          <div className="flex items-center gap-2 text-primary text-xs font-bold tracking-[0.2em] uppercase">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Access Level: Operator
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">Profile Configuration</h2>
          <p className="text-slate-400 max-w-2xl">Customize your public operator identity and system preferences. Changes will be synchronized across the network immediately.</p>
        </div>

        {/* Visual Identity Module */}
        <section className="glass-panel rounded-lg p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-50">
            <span className="material-symbols-outlined text-6xl text-[#314d68]">id_card</span>
          </div>
          <h3 className="text-white text-lg font-bold tracking-wide mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">badge</span>
            VISUAL IDENTITY MODULE
          </h3>
          
          {/* Hidden File Inputs */}
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            className="hidden"
          />

          {/* Banner & Avatar */}
          <div className="relative">
            <div 
              className="w-full h-48 md:h-64 rounded-lg bg-gradient-to-r from-[#1a2736] to-[#101922] relative overflow-hidden border border-[#314d68] group/banner"
              style={profile.banner_url ? { backgroundImage: `url('${profile.banner_url}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/banner:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <button 
                onClick={() => bannerInputRef.current?.click()}
                disabled={uploadingBanner}
                className="absolute top-4 right-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black text-xs font-bold py-2 px-4 rounded shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">{uploadingBanner ? 'sync' : 'upload_file'}</span>
                {uploadingBanner ? 'UPLOADING...' : 'UPDATE BANNER'}
              </button>
            </div>
            
            {/* Avatar */}
            <div className="absolute -bottom-10 left-6 md:left-10 flex items-end">
              <div className="relative group/avatar">
                <div 
                  className="size-24 md:size-32 rounded-xl border-4 border-[#0b1219] bg-[#16202a] overflow-hidden relative shadow-lg cursor-pointer"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-slate-600">person</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                    <span className="material-symbols-outlined text-white text-3xl">{uploadingAvatar ? 'sync' : 'photo_camera'}</span>
                  </div>
                </div>
                <button 
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black p-1.5 rounded-lg border-2 border-[#0b1219] cursor-pointer hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,215,0,0.3)] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px] block">edit</span>
                </button>
              </div>
            </div>
          </div>
          <div className="h-12 w-full"></div>
        </section>

        {/* Form Sections */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Core Data */}
          <div className="glass-panel rounded-lg p-6 flex flex-col gap-6 h-full">
            <h3 className="text-white text-lg font-bold tracking-wide flex items-center gap-2 border-b border-[#314d68] pb-3">
              <span className="material-symbols-outlined text-primary">person</span>
              CORE DATA
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operator Handle (Username)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                  <input 
                    className="w-full pl-7 pr-4 py-3 rounded bg-[#0d141c] border border-[#314d68] text-white focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 font-mono text-sm shadow-inner"
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                  />
                </div>
                <p className="text-[10px] text-slate-400">Unique identifier on the network.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
                <input 
                  className="w-full px-4 py-3 rounded bg-[#0d141c] border border-[#314d68] text-white focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 font-mono text-sm shadow-inner"
                  type="text"
                  value={profile.display_name}
                  onChange={(e) => setProfile({...profile, display_name: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mission Statement (Bio)</label>
                <textarea 
                  className="w-full px-4 py-3 rounded bg-[#0d141c] border border-[#314d68] text-white focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 font-mono text-sm shadow-inner resize-none"
                  rows="4"
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Publicly visible</span>
                  <span>{profile.bio.length}/150 CHARS</span>
                </div>
              </div>
            </div>
          </div>

          {/* External Uplinks & System Preferences */}
          <div className="flex flex-col gap-6">
            {/* Social Links */}
            <div className="glass-panel rounded-lg p-6">
              <h3 className="text-white text-lg font-bold tracking-wide flex items-center gap-2 border-b border-[#314d68] pb-3 mb-4">
                <span className="material-symbols-outlined text-primary">share</span>
                EXTERNAL UPLINKS
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="size-10 rounded bg-[#16202a] flex items-center justify-center border border-[#314d68] group-hover:border-[#5865F2] group-hover:text-[#5865F2] transition-colors">
                    <span className="material-symbols-outlined">captive_portal</span>
                  </div>
                  <div className="flex-1">
                    <input 
                      className="w-full px-4 py-2 rounded bg-[#0d141c] border border-[#314d68] text-white focus:border-[#5865F2] focus:ring-0 text-sm h-10"
                      placeholder="Discord Username"
                      type="text"
                      value={profile.discord}
                      onChange={(e) => setProfile({...profile, discord: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="size-10 rounded bg-[#16202a] flex items-center justify-center border border-[#314d68] group-hover:border-[#1DA1F2] group-hover:text-[#1DA1F2] transition-colors">
                    <span className="material-symbols-outlined">public</span>
                  </div>
                  <div className="flex-1">
                    <input 
                      className="w-full px-4 py-2 rounded bg-[#0d141c] border border-[#314d68] text-white focus:border-[#1DA1F2] focus:ring-0 text-sm h-10"
                      placeholder="Twitter / X Handle"
                      type="text"
                      value={profile.twitter}
                      onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="size-10 rounded bg-[#16202a] flex items-center justify-center border border-[#314d68] group-hover:border-[#6441a5] group-hover:text-[#6441a5] transition-colors">
                    <span className="material-symbols-outlined">videogame_asset</span>
                  </div>
                  <div className="flex-1">
                    <input 
                      className="w-full px-4 py-2 rounded bg-[#0d141c] border border-[#314d68] text-white focus:border-[#6441a5] focus:ring-0 text-sm h-10"
                      placeholder="Twitch Channel"
                      type="text"
                      value={profile.twitch}
                      onChange={(e) => setProfile({...profile, twitch: e.target.value})}
                    />
                  </div>
                </div>
                <button className="w-full py-2 border border-dashed border-slate-600/40 rounded text-slate-500 text-xs font-bold hover:bg-[#16202a] hover:text-white transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  ADD CONNECTION SLOT
                </button>
              </div>
            </div>

            {/* System Preferences */}
            <div className="glass-panel rounded-lg p-6 flex-1">
              <h3 className="text-white text-lg font-bold tracking-wide flex items-center gap-2 border-b border-[#314d68] pb-3 mb-4">
                <span className="material-symbols-outlined text-primary">tune</span>
                SYSTEM PREFERENCES
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded border border-[#314d68] bg-[#0d141c]">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">Profile Visibility</span>
                    <span className="text-[10px] text-slate-400">Allow other operators to scan your logs.</span>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      className="sr-only peer"
                      checked={profile.profile_visibility}
                      onChange={(e) => setProfile({...profile, profile_visibility: e.target.checked})}
                    />
                    <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-sm peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-3 rounded border border-[#314d68] bg-[#0d141c]">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">Online Status</span>
                    <span className="text-[10px] text-slate-400">Broadcast active signal.</span>
                  </div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      className="sr-only peer"
                      checked={profile.online_status}
                      onChange={(e) => setProfile({...profile, online_status: e.target.checked})}
                    />
                    <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-sm peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-sm after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Bar */}
        <div className="sticky bottom-4 z-40">
          <div className="glass-panel p-4 rounded-lg flex items-center justify-between shadow-2xl border-t border-primary/30">
            <div className="flex items-center gap-2 text-slate-400 text-xs hidden sm:flex">
              <span className="material-symbols-outlined text-yellow-500 text-[18px]">warning</span>
              <span>Unsaved changes will be lost upon system exit.</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button 
                onClick={handleReset}
                className="px-6 py-2.5 rounded bg-transparent border border-[#314d68] text-slate-400 font-bold text-sm hover:text-white hover:bg-[#16202a] transition-colors"
              >
                RESET
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-2.5 rounded bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold text-sm shadow-[0_0_10px_rgba(255,215,0,0.3)] hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                {saving ? 'SAVING...' : 'SAVE CONFIGURATION'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
