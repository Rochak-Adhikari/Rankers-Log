import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { PostCreatorModal } from '../components/PostCreatorModal'

export function HomeFeedPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPostModal, setShowPostModal] = useState(false)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    fetchPosts()
    if (user) fetchUserProfile()
  }, [user])

  async function fetchUserProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('username, display_name, avatar_url, level, rank')
      .eq('id', user.id)
      .single()
    if (data) setUserProfile(data)
  }

  async function fetchPosts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (username, avatar_url, display_name, level, rank)
      `)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error && data) {
      setPosts(data)
      
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
    setLoading(false)
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
      // Unlike
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id)
      
      setLikedPosts(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
      
      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes_count: Math.max(0, (p.likes_count || 0) - 1) } : p
      ))
    } else {
      // Like
      await supabase
        .from('likes')
        .insert({ post_id: postId, user_id: user.id })
      
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
    const shareText = post.content || post.media_title || 'Check out this post on Ranker\'s Log!'

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ranker\'s Log Post',
          text: shareText,
          url: shareUrl
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl)
        }
      }
    } else {
      copyToClipboard(shareUrl)
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    alert('Link copied to clipboard!')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Sidebar - Navigation */}
      <nav className="hidden lg:flex lg:col-span-2 flex-col gap-6 sticky top-24">
        {/* Mini Profile Card */}
        <div className="p-4 rounded bg-[#16212c]/80 backdrop-blur-sm border border-[#314d68] shadow-lg flex items-center gap-4 group hover:border-primary/50 transition-colors">
          <div 
            className="w-12 h-12 hexagon bg-slate-700 border border-primary/50 shrink-0 bg-cover bg-center flex items-center justify-center" 
            style={userProfile?.avatar_url ? { backgroundImage: `url('${userProfile.avatar_url}')` } : {}}
          >
            {!userProfile?.avatar_url && <span className="material-symbols-outlined text-gray-500">person</span>}
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-white group-hover:text-primary transition-colors">{userProfile?.display_name || userProfile?.username || 'Commander'}</h3>
            <p className="text-xs text-primary/80 uppercase tracking-wider">Level {userProfile?.level || 1} • {userProfile?.rank || 'E'}-Rank</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2">
          <Link to="/feed" className="flex items-center gap-3 px-4 py-3 rounded bg-primary/20 border-l-4 border-primary text-white font-medium shadow-[0_0_15px_rgba(37,140,244,0.15)] transition-all">
            <span className="material-symbols-outlined text-primary">home_app_logo</span>
            <span>Home Base</span>
          </Link>
          <Link to="/library" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-[#182634] border-l-4 border-transparent hover:border-slate-600 text-slate-400 hover:text-white transition-all">
            <span className="material-symbols-outlined">style</span>
            <span>My Collection</span>
          </Link>
          <Link to="/quests" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-[#182634] border-l-4 border-transparent hover:border-slate-600 text-slate-400 hover:text-white transition-all">
            <span className="material-symbols-outlined">assignment</span>
            <span>Quest Log</span>
            <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">3</span>
          </Link>
          <Link to="/guilds" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-[#182634] border-l-4 border-transparent hover:border-slate-600 text-slate-400 hover:text-white transition-all">
            <span className="material-symbols-outlined">group</span>
            <span>Guild Hall</span>
          </Link>
          <Link to="/library" className="flex items-center gap-3 px-4 py-3 rounded hover:bg-[#182634] border-l-4 border-transparent hover:border-slate-600 text-slate-400 hover:text-white transition-all">
            <span className="material-symbols-outlined">inventory_2</span>
            <span>Inventory</span>
          </Link>
        </div>

        {/* Login Streak Widget */}
        <div className="mt-4 p-4 rounded bg-[#182634]/50 border border-[#314d68]/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400 uppercase font-bold">Login Streak</span>
            <span className="text-xs text-primary font-bold">Day 24</span>
          </div>
          <div className="flex gap-1">
            <div className="h-2 flex-1 bg-primary rounded-sm shadow-[0_0_5px_#258cf4]"></div>
            <div className="h-2 flex-1 bg-primary rounded-sm shadow-[0_0_5px_#258cf4]"></div>
            <div className="h-2 flex-1 bg-primary rounded-sm shadow-[0_0_5px_#258cf4]"></div>
            <div className="h-2 flex-1 bg-primary/30 rounded-sm"></div>
            <div className="h-2 flex-1 bg-[#101a23] rounded-sm"></div>
          </div>
        </div>
      </nav>

      {/* Center Feed */}
      <main className="lg:col-span-7 w-full flex flex-col gap-6">
        {/* Post Composer */}
        <button 
          data-testid="open-composer"
          onClick={() => setShowPostModal(true)}
          className="relative w-full bg-[#16212c]/80 backdrop-blur-md border border-[#314d68] rounded p-4 shadow-lg group hover:border-primary hover:shadow-[0_0_15px_rgba(37,140,244,0.15)] transition-all duration-300 cursor-pointer"
        >
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex gap-4 items-center">
            <div 
              className="w-10 h-10 hexagon bg-slate-700 border border-slate-600 shrink-0 bg-cover bg-center flex items-center justify-center" 
              style={userProfile?.avatar_url ? { backgroundImage: `url('${userProfile.avatar_url}')` } : {}}
            >
              {!userProfile?.avatar_url && <span className="material-symbols-outlined text-gray-500 text-sm">person</span>}
            </div>
            <span className="flex-1 text-left text-slate-500 text-sm group-hover:text-slate-400 transition-colors">
              Initialize new log entry...
            </span>
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary group-hover:scale-110 transition-transform">image</span>
              <span className="material-symbols-outlined text-[20px] text-[#FFD700] group-hover:scale-110 transition-transform">emoji_events</span>
              <span className="material-symbols-outlined text-[20px] text-purple-400 group-hover:scale-110 transition-transform">star</span>
              <span className="material-symbols-outlined text-[20px] text-green-400 group-hover:scale-110 transition-transform">label</span>
            </div>
          </div>
        </button>

        {/* Feed Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <span className="material-symbols-outlined text-primary text-4xl animate-pulse">sync</span>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-[#16212c]/80 backdrop-blur-md border border-[#314d68] rounded p-6 text-center">
            <span className="material-symbols-outlined text-gray-600 text-6xl mb-4">inventory_2</span>
            <h3 className="text-xl font-bold text-white mb-2">No Activity Logs Yet</h3>
            <p className="text-gray-500 text-sm">Start tracking your journey!</p>
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} data-testid="post-card" className="bg-[#16212c]/80 backdrop-blur-md border border-[#314d68] rounded hover:border-primary/40 transition-colors duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-primary to-transparent opacity-80"></div>
              <div className="p-5 flex flex-col gap-4">
                {/* Post Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link 
                      to={post.profiles ? `/u/${post.profiles.username}` : '#'}
                      className="w-10 h-10 hexagon bg-slate-700 border border-primary/50 bg-cover bg-center"
                      style={{
                        backgroundImage: post.profiles?.avatar_url ? `url('${post.profiles.avatar_url}')` : undefined
                      }}
                    />
                    <div>
                      <h4 className="font-bold text-white leading-none">
                        <Link to={post.profiles ? `/u/${post.profiles.username}` : '#'} className="hover:text-primary transition-colors">
                          {post.profiles?.display_name || post.profiles?.username || 'Player'}
                        </Link>
                      </h4>
                      <p className="text-xs text-primary/80 mt-1">{formatTimeAgo(post.created_at)} • {post.media_type || 'Activity'} Log</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-[10px] font-bold border border-green-500/30 uppercase tracking-widest">
                    {post.progress_type === 'completion' ? 'Completed' : 'Progress'}
                  </span>
                </div>

                {/* Post Content */}
                <div className="flex flex-col gap-3">
                  {post.content && (
                    <p className="text-slate-300 text-sm leading-relaxed">{post.content}</p>
                  )}

                  {/* Image Display */}
                  {post.image_url && (
                    <div className="rounded-lg overflow-hidden border border-[#314d68]">
                      <img src={post.image_url} alt="" className="w-full max-h-96 object-cover" />
                    </div>
                  )}

                  {/* Achievement Badge */}
                  {post.achievement_type && (
                    <div className="bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#FFD700]/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#FFD700] text-2xl">emoji_events</span>
                      </div>
                      <div>
                        <p className="text-[#FFD700] font-bold text-sm uppercase tracking-wider">Achievement Unlocked!</p>
                        <p className="text-white text-lg font-bold">{post.achievement_type.replace(/_/g, ' ')}</p>
                        <p className="text-[#FFD700] text-xs font-bold">+{post.xp_earned || 0} XP</p>
                      </div>
                    </div>
                  )}

                  {/* Rating Display */}
                  {post.rating && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-lg font-bold text-white">{post.media_title || 'Review'}</h5>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5,6,7,8,9,10].map(star => (
                            <span key={star} className={`material-symbols-outlined text-sm ${star <= post.rating ? 'text-[#FFD700]' : 'text-gray-600'}`}>
                              star
                            </span>
                          ))}
                          <span className="text-[#FFD700] font-bold ml-2">{post.rating}/10</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Media Card */}
                  {post.media_title && !post.rating && !post.achievement_type && (
                    <div className="bg-[#101a23] rounded border border-[#314d68] p-4">
                      <h5 data-testid="post-title" className="text-lg font-bold text-white">{post.media_title}</h5>
                      <p className="text-xs text-slate-400 mt-1 capitalize">
                        {post.media_type} • {post.progress_type} {post.progress_value}
                      </p>
                      {post.xp_earned > 0 && (
                        <div className="text-green-400 text-xs font-bold mt-2">+{post.xp_earned} XP</div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#314d68]/30">
                  <div className="flex gap-4">
                    <button 
                      data-testid="post-like-btn"
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition-colors text-xs font-bold uppercase tracking-wider group ${
                        likedPosts.has(post.id) 
                          ? 'text-[#FFD700]' 
                          : 'text-slate-400 hover:text-[#FFD700]'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform ${
                        likedPosts.has(post.id) ? 'fill-1' : ''
                      }`}>thumb_up</span>
                      <span data-testid="post-like-count">{post.likes_count || 0}</span>
                    </button>
                    <button 
                      data-testid="post-open-comments"
                      onClick={() => handleComment(post.id)}
                      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider group"
                    >
                      <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">chat_bubble</span>
                      <span>Transmit (<span data-testid="post-comment-count">{post.comments_count || 0}</span>)</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => handleShare(post)}
                    className="text-slate-500 hover:text-[#FFD700] transition-colors group"
                  >
                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">share</span>
                  </button>
                </div>
              </div>
            </article>
          ))
        )}

        {/* Loading More */}
        {!loading && posts.length > 0 && (
          <div className="flex justify-center py-6">
            <div className="flex items-center gap-2 text-primary/50 text-xs uppercase tracking-widest animate-pulse">
              <span className="material-symbols-outlined text-lg">sync</span>
              Fetching additional data streams...
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar - Widgets */}
      <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6 sticky top-24">
        {/* Active Quests */}
        <div className="bg-[#16212c]/80 backdrop-blur-md border border-[#314d68] rounded p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#314d68]/50 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">radar</span>
              Active Quests
            </h3>
          </div>
          <div className="flex flex-col gap-3 items-center py-4">
            <span className="material-symbols-outlined text-4xl text-gray-600">assignment</span>
            <p className="text-sm text-gray-400 text-center">Complete quests to earn XP</p>
            <Link 
              to="/quests" 
              className="px-4 py-2 bg-primary/20 border border-primary/30 text-primary rounded hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
            >
              View Quests
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-[#16212c]/80 backdrop-blur-md border border-[#314d68] rounded p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#314d68]/50 pb-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">link</span>
              Quick Links
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/messages" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 transition-colors group">
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">mail</span>
              <span className="text-sm text-slate-300 group-hover:text-white">Messages</span>
            </Link>
            <Link to="/friends" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 transition-colors group">
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">group</span>
              <span className="text-sm text-slate-300 group-hover:text-white">Friends</span>
            </Link>
            <Link to="/notifications" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-white/5 transition-colors group">
              <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">notifications</span>
              <span className="text-sm text-slate-300 group-hover:text-white">Notifications</span>
            </Link>
          </div>
          <Link to="/search" className="w-full mt-2 border border-dashed border-primary/50 text-primary/70 hover:text-primary hover:border-primary hover:shadow-[0_0_10px_rgba(37,140,244,0.3)] py-2 rounded text-xs uppercase tracking-widest transition-all text-center block">
            Find Users
          </Link>
        </div>
      </aside>

      {/* Post Creator Modal */}
      <PostCreatorModal 
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onPostCreated={(newPost) => setPosts(prev => [newPost, ...prev])}
      />
    </div>
  )
}
