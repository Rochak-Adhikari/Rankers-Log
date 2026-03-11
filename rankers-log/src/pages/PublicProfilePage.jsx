import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { FollowButton } from '../components/FollowButton'
import { ProfileMenu } from '../components/ProfileMenu'

export function PublicProfilePage() {
  const { username } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    if (username) {
      fetchPublicProfile()
    }
  }, [username])

  async function fetchPublicProfile() {
    setLoading(true)
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !profileData) {
      setNotFound(true)
      setLoading(false)
      return
    }

    setProfile(profileData)

    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', profileData.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (postsData) {
      setPosts(postsData)
      
      // Fetch user's likes
      if (user) {
        const { data: likesData } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id)
        
        if (likesData) {
          setLikedPosts(new Set(likesData.map(like => like.post_id)))
        }
      }
    }

    // Check if current user follows this profile
    if (user && profileData) {
      const { data: followData } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', profileData.id)
        .single()
      
      setIsFollowing(!!followData)
      setFollowerCount(profileData.followers_count || 0)
    }
    setLoading(false)
  }

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile?.display_name || username}'s Profile - Rankers Log`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Profile link copied!')
    }
  }

  const handleFollowChange = (delta) => {
    setFollowerCount(prev => prev + delta)
  }

  function formatTimeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  async function handleLike(postId) {
    if (!user) {
      alert('Please login to like posts')
      return
    }

    const isLiked = likedPosts.has(postId)

    if (isLiked) {
      await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id)
      setLikedPosts(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) - 1) } : p
      ))
    } else {
      await supabase.from('likes').insert({ post_id: postId, user_id: user.id })
      setLikedPosts(prev => new Set([...prev, postId]))
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p
      ))
    }
  }

  function handleComment(postId) {
    navigate(`/posts/${postId}/comments`)
  }

  async function handleShare(post) {
    const shareUrl = `${window.location.origin}/posts/${post.id}`
    const shareText = post.content || post.media_title || 'Check out this post!'

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ranker\'s Log Post', text: shareText, url: shareUrl })
      } catch (err) {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(shareUrl)
          alert('Link copied to clipboard!')
        }
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    }
  }

  function handleMessage() {
    if (!user) {
      alert('Please login to send messages')
      return
    }
    navigate(`/messages/new?user=${profile.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-primary text-4xl animate-pulse">sync</span>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="material-symbols-outlined text-gray-600 text-6xl mb-4">person_off</span>
        <h2 className="text-2xl font-bold text-white mb-2">Player Not Found</h2>
        <p className="text-gray-500 mb-6">The profile @{username} doesn't exist.</p>
        <Link to="/feed" className="text-primary hover:text-white transition-colors">
          ← Return to Base
        </Link>
      </div>
    )
  }

  const displayName = profile.display_name || profile.username
  const level = profile.level || 1
  const rank = profile.rank || 'E'
  const xp = profile.xp || 0
  const title = profile.title || 'Newcomer'
  const avatarUrl = profile.avatar_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdaWmABVJXA2jsgAaK0-A6KfaQdF1oWID-5yztCv3l5U4qlYJDSTECr6S60s6aBycW6BghIvBQ1xOa8-DhAwvTEzDPpjRcZd0K45p4r0ZfOwdKum9Qnyac1EEnvjyeO_Kq60P6BMi4UkW9vs35XyjWPzLq4wVuhV3rWwCt6UUEUAj6mnAT-RhULGMZ8cxGGp7Uc_F5TTib0U2w_QW5cFL4wkdzQUMu-AH7iLWkIVuNlTrz5B5RRSt_BDGQakh-x3VtiqhU72W8jV3j'

  return (
    <>
      {/* Back Navigation */}
      <div className="mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
      {/* Profile Header - HUD Style */}
      <div className="relative bg-[#0a0f14] p-[1px] mb-8" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-60"></div>
        <div className="relative bg-[#0a0f14] p-8" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)' }}>
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-5 h-5 border-l-2 border-t-2 border-primary"></div>
          <div className="absolute bottom-0 right-0 w-5 h-5 border-r-2 border-b-2 border-primary"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar with Glow */}
            <div className="relative w-32 h-32 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-[#00FFFF] rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-full h-full rounded-full bg-cover bg-center border-2 border-[#101a23]" style={{ backgroundImage: `url('${avatarUrl}')` }}></div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black border border-primary text-primary px-3 py-0.5 rounded-full text-xs font-bold tracking-widest z-10 shadow-[0_0_10px_rgba(37,140,244,0.3)]">LVL. {level}</div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <h1 className="text-3xl font-bold text-white">{displayName}</h1>
                <div className="inline-flex items-center gap-1 bg-[#FFD700]/10 border border-[#FFD700]/30 px-2 py-1 rounded">
                  <span className="material-symbols-outlined text-[#FFD700] text-sm">military_tech</span>
                  <span className="text-sm font-bold text-[#FFD700]">{rank}-RANK</span>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-1">@{profile.username}</p>
              <p className="text-xs text-primary uppercase tracking-wider mb-3">{title}</p>
              {profile.bio && (
                <p className="text-sm text-gray-300 mb-4 italic">"{profile.bio}"</p>
              )}
              
              {/* Stats */}
              <div className="flex items-center gap-6 justify-center md:justify-start">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{followerCount}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Followers</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{posts.length}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Logs</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[#FFD700]">{xp.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">XP</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[#00FFFF]">24</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Streak</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-xl font-bold text-primary">{level}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Level</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {user?.id !== profile?.id && (
                <FollowButton 
                  targetUserId={profile?.id}
                  initialIsFollowing={isFollowing}
                  onFollowChange={handleFollowChange}
                />
              )}
              <button 
                onClick={handleMessage}
                className="bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 text-white font-bold py-3 px-8 rounded transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
                Message
              </button>
              <div className="relative z-50">
                <ProfileMenu 
                  isOwnProfile={false}
                  onShare={handleShareProfile}
                  onCopyLink={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Profile link copied!')
                  }}
                  onReport={() => alert('Report feature coming soon!')}
                  onBlock={() => alert('Block feature coming soon!')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <div className="bg-[rgba(20,25,30,0.7)] backdrop-blur-[12px] border border-white/8 rounded-xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">info</span> About
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {profile.bio || `${displayName} hasn't written a bio yet. They're probably too busy grinding XP!`}
            </p>
          </div>
        </div>
        <div>
          <div className="bg-[rgba(20,25,30,0.7)] backdrop-blur-[12px] border border-white/8 rounded-xl p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FFD700] text-base">workspace_premium</span> Badges
            </h3>
            <div className="flex gap-2 flex-wrap">
              <div className="w-10 h-10 rounded bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center" title="Streak Master">
                <span className="material-symbols-outlined text-[#FFD700]">local_fire_department</span>
              </div>
              <div className="w-10 h-10 rounded bg-[#BF00FF]/10 border border-[#BF00FF]/30 flex items-center justify-center" title="Lore Keeper">
                <span className="material-symbols-outlined text-[#BF00FF]">auto_stories</span>
              </div>
              <div className="w-10 h-10 rounded bg-[#00FFFF]/10 border border-[#00FFFF]/30 flex items-center justify-center" title="Binge Watcher">
                <span className="material-symbols-outlined text-[#00FFFF]">visibility</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - Timeline Style */}
      <div className="bg-[rgba(20,25,30,0.7)] backdrop-blur-[12px] border border-white/8 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">history</span>
          Recent Activity
        </h2>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-gray-600 text-5xl mb-4">inventory_2</span>
            <p className="text-gray-500 text-sm">No public logs yet.</p>
          </div>
        ) : (
          <div className="relative pl-8">
            {/* Timeline Spine */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-gray-700 to-transparent"></div>
            
            <div className="space-y-6">
              {posts.map((post, index) => {
                const colors = ['#FFD700', '#00FFFF', '#BF00FF', '#258cf4']
                const color = colors[index % colors.length]
                
                return (
                  <div key={post.id} className="relative group">
                    {/* Timeline Dot */}
                    <div className="absolute -left-8 top-4 w-[2px] h-full" style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }}></div>
                    <div className="absolute -left-[35px] top-3 w-3 h-3 rounded-full border border-black" style={{ background: color, boxShadow: `0 0 8px ${color}` }}></div>
                    
                    {/* Post Card */}
                    <div className="bg-[#0a0f14] border border-white/5 hover:border-white/10 rounded-lg p-4 transition-all group-hover:shadow-[0_0_20px_rgba(37,140,244,0.1)]">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-16 rounded bg-gray-800 bg-cover bg-center shrink-0 flex items-center justify-center" style={post.media_cover_url ? { backgroundImage: `url('${post.media_cover_url}')` } : {}}>
                          {!post.media_cover_url && (
                            <span className="material-symbols-outlined text-gray-600">
                              {post.media_type === 'game' ? 'sports_esports' : post.media_type === 'anime' ? 'movie' : 'menu_book'}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-base truncate group-hover:text-primary transition-colors">{post.media_title}</h4>
                          <p className="text-xs text-slate-400 capitalize">
                            {post.media_type} • {post.progress_type} {post.progress_value}
                          </p>
                          {post.content && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">{post.content}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block text-xs text-slate-500 mb-1">{formatTimeAgo(post.created_at)}</span>
                          <span className="block text-sm font-bold text-emerald-400">+{post.xp_earned || 0} XP</span>
                        </div>
                      </div>
                      
                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex gap-4">
                          <button 
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-1 transition-colors text-xs ${
                              likedPosts.has(post.id) ? 'text-[#FFD700]' : 'text-gray-400 hover:text-[#FFD700]'
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">thumb_up</span>
                            <span>{post.likes_count || 0}</span>
                          </button>
                          <button 
                            onClick={() => handleComment(post.id)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">chat_bubble</span>
                            <span>{post.comments_count || 0}</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => handleShare(post)}
                          className="text-gray-400 hover:text-[#FFD700] transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
