import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function DevQAPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    profileExists: false,
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    dmThreadsCount: 0,
    guildMembershipsCount: 0,
    guildsOwnedCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (user) loadStats()
  }, [user])

  async function loadStats() {
    setLoading(true)

    // Check profile exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, privacy_settings')
      .eq('id', user.id)
      .single()

    // Count posts
    const { count: postsCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Count followers
    const { count: followersCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', user.id)

    // Count following
    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', user.id)

    // Count DM threads
    const { count: dmThreadsCount } = await supabase
      .from('dm_members')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Count guild memberships
    const { count: guildMembershipsCount } = await supabase
      .from('guild_members')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // Count guilds owned
    const { count: guildsOwnedCount } = await supabase
      .from('guilds')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)

    setStats({
      profileExists: !!profile,
      privacySettings: profile?.privacy_settings || null,
      postsCount: postsCount || 0,
      followersCount: followersCount || 0,
      followingCount: followingCount || 0,
      dmThreadsCount: dmThreadsCount || 0,
      guildMembershipsCount: guildMembershipsCount || 0,
      guildsOwnedCount: guildsOwnedCount || 0
    })

    setLoading(false)
  }

  async function createTestGuild() {
    setCreating(true)
    const guildName = `Test Guild ${Date.now().toString().slice(-6)}`
    
    const { data: guild, error } = await supabase
      .from('guilds')
      .insert({
        name: guildName,
        description: 'A test guild created from Dev QA page',
        owner_id: user.id,
        is_public: true
      })
      .select('id')
      .single()

    if (!error && guild) {
      // Add owner as member
      await supabase.from('guild_members').insert({
        guild_id: guild.id,
        user_id: user.id,
        role: 'owner'
      })
      alert(`Created guild: ${guildName}`)
      loadStats()
    } else {
      alert(`Error: ${error?.message}`)
    }
    setCreating(false)
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
      <div className="w-full mb-6 border-l-4 border-yellow-500 pl-4">
        <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded w-fit mb-2">
          <span className="material-symbols-outlined text-sm">bug_report</span>
          DEV ONLY
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
          QA Dashboard
        </h1>
        <p className="text-yellow-400/80 font-mono text-sm tracking-widest mt-1">
          // SYSTEM_DIAGNOSTICS // DATA_VERIFICATION
        </p>
      </div>

      {/* User Info */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">person</span>
          Current User
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Auth UID:</span>
            <p className="text-white font-mono text-xs break-all">{user?.id}</p>
          </div>
          <div>
            <span className="text-gray-400">Email:</span>
            <p className="text-white">{user?.email}</p>
          </div>
          <div>
            <span className="text-gray-400">Profile Exists:</span>
            <p className={stats.profileExists ? 'text-green-400' : 'text-red-400'}>
              {stats.profileExists ? '✓ Yes' : '✗ No'}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Privacy Settings:</span>
            <p className="text-white font-mono text-xs">
              {stats.privacySettings ? JSON.stringify(stats.privacySettings) : 'Not set'}
            </p>
          </div>
        </div>
      </div>

      {/* Data Counts */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">analytics</span>
          Data Counts
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-white">{stats.postsCount}</p>
            <p className="text-xs text-gray-400">Posts</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-white">{stats.followersCount}</p>
            <p className="text-xs text-gray-400">Followers</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-white">{stats.followingCount}</p>
            <p className="text-xs text-gray-400">Following</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-white">{stats.dmThreadsCount}</p>
            <p className="text-xs text-gray-400">DM Threads</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-white">{stats.guildMembershipsCount}</p>
            <p className="text-xs text-gray-400">Guild Memberships</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-white">{stats.guildsOwnedCount}</p>
            <p className="text-xs text-gray-400">Guilds Owned</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">bolt</span>
          Quick Actions (Dev Only)
        </h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={createTestGuild}
            disabled={creating}
            className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded hover:bg-purple-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create Test Guild
          </button>
          <button
            onClick={loadStats}
            className="px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded hover:bg-primary/30 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh Stats
          </button>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">checklist</span>
          QA Checklist
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <span className={`material-symbols-outlined ${stats.profileExists ? 'text-green-400' : 'text-red-400'}`}>
              {stats.profileExists ? 'check_circle' : 'cancel'}
            </span>
            <span className="text-gray-300">Profile created on signup</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-500">radio_button_unchecked</span>
            <span className="text-gray-300">Can follow/unfollow other users</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-500">radio_button_unchecked</span>
            <span className="text-gray-300">Mutual follow enables direct DM</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-500">radio_button_unchecked</span>
            <span className="text-gray-300">Non-mutual sends message request</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-500">radio_button_unchecked</span>
            <span className="text-gray-300">Guild creation adds owner as member</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-500">radio_button_unchecked</span>
            <span className="text-gray-300">Guild chat shows real guild name</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-500">radio_button_unchecked</span>
            <span className="text-gray-300">No "Shadow Legion" in production UI</span>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-sm text-yellow-400">
          <strong>Note:</strong> This page is only visible in development mode.
          Use it to verify data integrity and test features.
        </p>
      </div>
    </>
  )
}
