import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function FollowButton({ targetUserId, initialIsFollowing = false, onFollowChange }) {
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleFollowToggle = async () => {
    if (!user || loading) return
    
    setLoading(true)

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId)

        if (!error) {
          setIsFollowing(false)
          onFollowChange?.(-1)
        }
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId,
            created_at: new Date().toISOString()
          })

        if (!error) {
          setIsFollowing(true)
          onFollowChange?.(1)
          // Note: Notification is created automatically by database trigger
        } else {
          console.error('Follow failed:', error)
          alert('Failed to follow user. Please try again.')
        }
      }
    } catch (err) {
      console.error('Follow error:', err)
    }

    setLoading(false)
  }

  if (user?.id === targetUserId) return null

  return (
    <button
      onClick={handleFollowToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={loading}
      className={`px-4 py-1.5 rounded text-xs font-bold transition-all disabled:opacity-50 ${
        isFollowing
          ? isHovered
            ? 'bg-red-500/20 border border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
            : 'bg-white/10 border border-white/20 text-white'
          : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black shadow-[0_0_8px_rgba(255,215,0,0.5)] hover:shadow-[0_0_15px_rgba(255,215,0,0.7)]'
      }`}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-sm">sync</span>
      ) : isFollowing ? (
        isHovered ? 'Unfollow' : 'Following'
      ) : (
        'Follow'
      )}
    </button>
  )
}

export function FollowBackButton({ targetUserId, isFollowingYou, initialIsFollowing = false, onFollowChange }) {
  const { user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)

  const handleFollowToggle = async () => {
    if (!user || loading) return
    
    setLoading(true)

    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', targetUserId)

        if (!error) {
          setIsFollowing(false)
          onFollowChange?.(-1)
        }
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetUserId,
            created_at: new Date().toISOString()
          })

        if (!error) {
          setIsFollowing(true)
          onFollowChange?.(1)
        }
      }
    } catch (err) {
      console.error('Follow error:', err)
    }

    setLoading(false)
  }

  if (user?.id === targetUserId) return null

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`px-4 py-1.5 rounded text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1 ${
        isFollowing
          ? 'bg-white/10 border border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400'
          : 'bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black shadow-[0_0_8px_rgba(255,215,0,0.5)]'
      }`}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-sm">sync</span>
      ) : (
        <>
          {!isFollowing && isFollowingYou && (
            <span className="material-symbols-outlined text-sm">person_add</span>
          )}
          {isFollowing ? 'Following' : isFollowingYou ? 'Follow Back' : 'Follow'}
        </>
      )}
    </button>
  )
}
