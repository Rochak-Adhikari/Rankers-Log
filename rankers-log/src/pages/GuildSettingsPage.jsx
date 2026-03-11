import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function GuildSettingsPage() {
  const { guildId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [guild, setGuild] = useState({
    name: '',
    description: '',
    isPublic: true,
    allowInvites: true,
    minLevel: 1
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadGuild()
  }, [guildId])

  async function loadGuild() {
    setLoading(true)
    const { data } = await supabase
      .from('guilds')
      .select('*')
      .eq('id', guildId)
      .single()
    
    if (data) {
      setGuild({
        name: data.name || '',
        description: data.description || '',
        isPublic: data.is_public !== false,
        allowInvites: data.allow_invites !== false,
        minLevel: data.min_level || 1
      })
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('guilds').update({
      name: guild.name,
      description: guild.description,
      is_public: guild.isPublic,
      allow_invites: guild.allowInvites,
      min_level: guild.minLevel
    }).eq('id', guildId)
    setSaving(false)
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this guild? This action cannot be undone.')) {
      await supabase.from('guilds').delete().eq('id', guildId)
      navigate('/guilds')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to={`/guilds/${guildId}/hub`} className="p-2 hover:bg-white/10 rounded transition-colors">
          <span className="material-symbols-outlined text-gray-400">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white uppercase">{guild.name}</h1>
          <p className="text-xs text-primary font-mono">MANAGEMENT CONSOLE // SETTINGS</p>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">tune</span>
          General Settings
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-white mb-2">Guild Name</label>
            <input
              type="text"
              value={guild.name}
              onChange={(e) => setGuild(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-white mb-2">Description</label>
            <textarea
              value={guild.description}
              onChange={(e) => setGuild(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-white mb-2">Minimum Level to Join</label>
            <input
              type="number"
              min="1"
              max="100"
              value={guild.minLevel}
              onChange={(e) => setGuild(prev => ({ ...prev, minLevel: parseInt(e.target.value) }))}
              className="w-32 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">lock</span>
          Privacy Settings
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-white/5">
            <div>
              <p className="text-white font-bold">Public Guild</p>
              <p className="text-sm text-gray-400">Anyone can find and join this guild</p>
            </div>
            <button
              onClick={() => setGuild(prev => ({ ...prev, isPublic: !prev.isPublic }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${guild.isPublic ? 'bg-primary' : 'bg-white/20'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${guild.isPublic ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="text-white font-bold">Allow Member Invites</p>
              <p className="text-sm text-gray-400">Members can invite other users</p>
            </div>
            <button
              onClick={() => setGuild(prev => ({ ...prev, allowInvites: !prev.allowInvites }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${guild.allowInvites ? 'bg-primary' : 'bg-white/20'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${guild.allowInvites ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Member Management */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">group</span>
          Member Management
        </h3>
        <div className="space-y-3">
          <Link to={`/guilds/${guildId}`} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">people</span>
              <span className="text-white font-bold">View All Members</span>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </Link>
          <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-yellow-400">admin_panel_settings</span>
              <span className="text-white font-bold">Manage Roles</span>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-400">block</span>
              <span className="text-white font-bold">Banned Members</span>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-lg hover:from-[#FFA500] hover:to-[#FFD700] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-6 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
      >
        {saving ? (
          <>
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            Saving...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">save</span>
            Save Changes
          </>
        )}
      </button>

      {/* Danger Zone */}
      <div className="bg-[#0a1016] border border-red-500/20 rounded-lg p-6">
        <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">warning</span>
          Danger Zone
        </h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-bold">Delete Guild</p>
            <p className="text-sm text-gray-400">Permanently delete this guild and all its data</p>
          </div>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold rounded hover:bg-red-500/20 transition-colors"
          >
            Delete Guild
          </button>
        </div>
      </div>
    </>
  )
}
