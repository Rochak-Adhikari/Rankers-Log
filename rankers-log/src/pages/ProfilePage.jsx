import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { PostCreatorModal } from '../components/PostCreatorModal'
import { FollowButton } from '../components/FollowButton'

export function ProfilePage() {
  const { user } = useAuth()
  const { avatarUrl, username, displayName, level, rank } = useProfile()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [reviews, setReviews] = useState([])
  const [trackingList, setTrackingList] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showPostModal, setShowPostModal] = useState(false)
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchUserPosts()
      fetchReviews()
      fetchTrackingList()
    }
  }, [user])

  async function fetchProfile() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error && data) {
      setProfile(data)
    }
    setLoading(false)
  }

  async function fetchUserPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setPosts(data)
      
      // Fetch user's likes
      const { data: likesData } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', user.id)
      
      if (likesData) {
        setLikedPosts(new Set(likesData.map(like => like.post_id)))
      }
    }
  }

  async function fetchReviews() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .not('rating', 'is', null)
      .order('created_at', { ascending: false })
      .limit(10)

    if (data) setReviews(data)
  }

  async function fetchTrackingList() {
    // Fetch from tracking_list table or use posts with progress
    const { data } = await supabase
      .from('tracking_list')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (data) {
      setTrackingList(data)
    }
  }

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev])
    if (newPost.rating) {
      setReviews(prev => [newPost, ...prev])
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      watching: 'text-blue-400 bg-blue-400/20',
      reading: 'text-purple-400 bg-purple-400/20',
      playing: 'text-green-400 bg-green-400/20',
      completed: 'text-[#FFD700] bg-[#FFD700]/20',
      dropped: 'text-red-400 bg-red-400/20',
      planned: 'text-gray-400 bg-gray-400/20'
    }
    return colors[status] || colors.planned
  }

  // avatarUrl, username, displayName, level, rank come from useProfile hook above

  async function handleLike(postId) {
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
    navigate(`/post/${postId}`)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-primary text-4xl animate-pulse">sync</span>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24">
        {/* Left Column - Profile Card */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Profile Card */}
          <div className="bg-[#13151D] rounded-xl p-0.5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A]/20 via-transparent to-[#1A1A1A]/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="bg-[#13151D] rounded-[10px] p-6 relative h-full flex flex-col items-center text-center">
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur border border-[#FFD700]/50 text-[#FFD700] px-3 py-1 rounded text-xs font-bold shadow-[0_0_12px_rgba(255,215,0,0.6)]">
                RANK {rank}
              </div>
              
              {/* Hexagon Avatar */}
              <div className="relative w-32 h-32 mb-4 mt-2">
                <div className="absolute inset-[-4px] bg-gradient-to-b from-[#1A1A1A] to-transparent opacity-60 animate-pulse hexagon"></div>
                <div className="w-full h-full p-1 bg-[#13151D] relative z-10 hexagon">
                  <img alt="Profile Avatar" className="w-full h-full object-cover hexagon" src={avatarUrl} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#13151D] p-1 rounded-full border border-gray-700">
                  <span className="material-symbols-outlined text-[#1A1A1A] text-sm">verified</span>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-1">{displayName}</h1>
              <div className="text-[#FFD700] text-sm font-medium mb-4 tracking-wide">{rank}-RANK {['S', 'SS', 'SSS'].includes(rank) ? 'RANKER' : 'PLAYER'} | LVL {level}</div>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                {profile?.bio || 'No bio yet. Edit your profile to add one.'}
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 w-full mb-6 border-t border-b border-white/5 py-4">
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold text-white">{posts.length}</span>
                  <span className="text-[10px] uppercase text-gray-500 tracking-wider">Posts</span>
                </div>
                <Link to="/friends?tab=followers" className="flex flex-col items-center border-l border-r border-white/5 hover:bg-white/5 rounded py-1 transition-colors cursor-pointer">
                  <span className="text-lg font-bold text-white">{profile?.followers_count || 0}</span>
                  <span className="text-[10px] uppercase text-gray-500 tracking-wider">Followers</span>
                </Link>
                <Link to="/friends?tab=following" className="flex flex-col items-center hover:bg-white/5 rounded py-1 transition-colors cursor-pointer">
                  <span className="text-lg font-bold text-white">{profile?.following_count || 0}</span>
                  <span className="text-[10px] uppercase text-gray-500 tracking-wider">Following</span>
                </Link>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 w-full">
                <Link 
                  to="/profile/edit"
                  className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold py-1.5 px-3 rounded text-sm transform transition hover:-translate-y-0.5 shadow-[0_0_12px_rgba(255,215,0,0.6)] hover:shadow-[0_0_20px_rgba(255,215,0,0.8)] flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-xs">edit</span>
                  Edit Profile
                </Link>
                <Link 
                  to="/profile/options"
                  className="w-10 h-10 flex items-center justify-center border border-white/20 rounded hover:bg-white/5 hover:border-[#FFD700]/50 transition-all group"
                  title="Profile Options"
                >
                  <span className="material-symbols-outlined text-gray-400 text-sm group-hover:text-[#FFD700] transition-colors">more_horiz</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* About Card */}
          <div className="bg-[#13151D] rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-white/10">
            <h3 className="font-bold text-lg mb-4 text-white border-l-4 border-[#FFD700] pl-3">About</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {profile?.location && (
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400 text-lg">location_on</span>
                  {profile.location}
                </li>
              )}
              {profile?.website && (
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gray-400 text-lg">link</span>
                  <a className="hover:text-[#FFD700] transition-colors" href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-400 text-lg">schedule</span>
                Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
              </li>
            </ul>
          </div>
          
          {/* Collection Card */}
          <div className="bg-[#13151D] rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-white border-l-4 border-[#FFD700] pl-3">Collection</h3>
              <Link to="/library" className="text-xs text-[#FFD700] hover:text-white transition-colors">See all</Link>
            </div>
            <div className="text-center py-6">
              <span className="material-symbols-outlined text-gray-600 text-4xl mb-2">collections_bookmark</span>
              <p className="text-gray-500 text-sm">No items tracked yet</p>
              <Link to="/library" className="text-xs text-[#FFD700] hover:text-white mt-2 inline-block transition-colors">Browse Library →</Link>
            </div>
          </div>
        </aside>
        
        {/* Center Column - Feed */}
        <section className="lg:col-span-6 space-y-6">
          {/* Create Post Input */}
          <button 
            onClick={() => setShowPostModal(true)}
            className="w-full bg-[#13151D] rounded-xl p-4 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-white/10 flex items-center gap-4 hover:border-[#FFD700]/30 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 bg-gray-700 hexagon">
              <img className="w-full h-full object-cover opacity-80 hexagon" src={avatarUrl} alt="" />
            </div>
            <span className="flex-1 text-left text-gray-500 text-sm group-hover:text-gray-400 transition-colors">
              Write a review or update progress...
            </span>
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-xl text-gray-400 group-hover:text-[#FFD700] transition-colors">image</span>
              <span className="material-symbols-outlined text-xl text-gray-400 group-hover:text-[#FFD700] transition-colors">star_rate</span>
              <span className="material-symbols-outlined text-xl text-gray-400 group-hover:text-[#FFD700] transition-colors">emoji_events</span>
            </div>
          </button>
          
          {/* Tabs */}
          <div className="flex border-b border-white/10 relative">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`flex-1 pb-4 text-center font-bold transition-colors relative ${activeTab === 'posts' ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-gray-400 hover:text-white'}`}
            >
              Posts
              {activeTab === 'posts' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#FFD700] blur-[8px] opacity-50"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 pb-4 text-center font-bold transition-colors relative ${activeTab === 'reviews' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
            >
              Reviews ({reviews.length})
              {activeTab === 'reviews' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-purple-400 blur-[8px] opacity-50"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('tracking')}
              className={`flex-1 pb-4 text-center font-bold transition-colors relative ${activeTab === 'tracking' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
            >
              Tracking
              {activeTab === 'tracking' && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary blur-[8px] opacity-50"></span>}
            </button>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'posts' && (
            <>
              {posts.length === 0 ? (
                <div className="bg-[#13151D] rounded-xl p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-white/10 text-center">
                  <span className="material-symbols-outlined text-gray-600 text-6xl mb-4">inventory_2</span>
                  <p className="text-gray-500">No posts yet</p>
                  <button 
                    onClick={() => setShowPostModal(true)}
                    className="mt-4 px-4 py-2 bg-[#FFD700]/20 text-[#FFD700] rounded-lg text-sm font-bold hover:bg-[#FFD700]/30 transition-colors"
                  >
                    Create your first post
                  </button>
                </div>
              ) : (
                posts.map(post => (
                  <article key={post.id} className="bg-[#13151D] rounded-xl p-0.5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-[#1A1A1A]/30 relative overflow-hidden">
                    <div className="bg-[#13151D] rounded-[10px] p-6 relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-gray-300 hexagon">
                            <img src={avatarUrl} alt="" className="w-full h-full object-cover hexagon" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              {displayName}
                              {post.achievement_type && (
                                <span className="text-[#FFD700] text-xs flex items-center gap-1">
                                  <span className="material-symbols-outlined text-sm">emoji_events</span>
                                  +{post.xp_earned} XP
                                </span>
                              )}
                            </h4>
                            <span className="text-xs text-gray-400">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-white">
                          <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                      </div>
                      {post.image_url && (
                        <img src={post.image_url} alt="" className="w-full rounded-lg mb-4 max-h-96 object-cover" />
                      )}
                      <p className="text-sm text-gray-300 mb-4">{post.content || `Logged ${post.media_title}`}</p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 text-sm transition-colors ${
                            likedPosts.has(post.id) ? 'text-[#FFD700]' : 'text-gray-400 hover:text-[#FFD700]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">thumb_up</span> 
                          {post.likes_count || 0}
                        </button>
                        <button 
                          onClick={() => handleComment(post.id)}
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FFD700] transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">chat_bubble</span> 
                          {post.comments_count || 0}
                        </button>
                        <button 
                          onClick={() => handleShare(post)}
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#FFD700] transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">share</span> Share
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <>
              {reviews.length === 0 ? (
                <div className="bg-[#13151D] rounded-xl p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-white/10 text-center">
                  <span className="material-symbols-outlined text-purple-400/50 text-6xl mb-4">rate_review</span>
                  <p className="text-gray-500 mb-2">No reviews yet</p>
                  <p className="text-gray-600 text-sm">Share your thoughts on anime, manga, games & more!</p>
                  <button 
                    onClick={() => setShowPostModal(true)}
                    className="mt-4 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-bold hover:bg-purple-500/30 transition-colors"
                  >
                    Write a review
                  </button>
                </div>
              ) : (
                reviews.map(review => (
                  <article key={review.id} className="bg-[#13151D] rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-purple-500/20">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-white">{review.media_title || 'Untitled'}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[1,2,3,4,5,6,7,8,9,10].map(star => (
                              <span key={star} className={`material-symbols-outlined text-sm ${star <= review.rating ? 'text-[#FFD700]' : 'text-gray-600'}`}>
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-[#FFD700] font-bold">{review.rating}/10</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{review.content}</p>
                  </article>
                ))
              )}
            </>
          )}

          {/* Tracking List Tab */}
          {activeTab === 'tracking' && (
            <div className="space-y-3">
              {trackingList.length === 0 ? (
                <div className="bg-[#13151D] rounded-xl p-8 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-white/10 text-center">
                  <span className="material-symbols-outlined text-primary/50 text-6xl mb-4">playlist_add</span>
                  <p className="text-gray-500 mb-2">Nothing being tracked</p>
                  <p className="text-gray-600 text-sm">Start tracking your anime, manga, and games!</p>
                </div>
              ) : (
                trackingList.map(item => (
                  <div key={item.id} className="bg-[#13151D] rounded-xl p-4 shadow-lg border border-white/10 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 bg-gray-800 rounded-lg flex items-center justify-center border border-white/10">
                        {item.cover ? (
                          <img src={item.cover} alt={item.title} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <span className="material-symbols-outlined text-gray-600 text-2xl">
                            {item.type === 'ANIME' ? 'tv' : item.type === 'MANGA' || item.type === 'MANHWA' ? 'menu_book' : 'sports_esports'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-bold truncate">{item.title}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{item.type}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-primary to-[#FFD700] rounded-full shadow-[0_0_8px_rgba(37,140,244,0.5)]"
                              style={{ width: `${(item.progress / item.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 font-mono">
                            {item.progress}/{item.total}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-gray-400 hover:text-primary">add</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
        
        {/* Right Column - Widgets */}
        <aside className="lg:col-span-3 space-y-6">
          {/* Achievements */}
          <div className="bg-[#13151D] rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Achievements</h3>
              <Link to="/achievements" className="text-xs text-[#FFD700] hover:text-white transition-colors">View All</Link>
            </div>
            <div className="text-center py-6">
              <span className="material-symbols-outlined text-gray-600 text-4xl mb-2">emoji_events</span>
              <p className="text-gray-500 text-sm">No achievements unlocked yet</p>
              <p className="text-gray-600 text-xs mt-1">Complete quests and milestones to earn badges</p>
            </div>
          </div>
          
           {/* Currently Tracking */}
           <div className="bg-[#13151D] rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-[#1A1A1A]/40 relative overflow-hidden">
             <h3 className="font-bold text-white mb-4 border-l-4 border-[#FFD700] pl-3">Currently Watching</h3>
             <div className="text-center py-4">
               <span className="material-symbols-outlined text-gray-600 text-3xl mb-2">tv</span>
               <p className="text-gray-500 text-sm">Nothing tracked yet</p>
               <Link to="/library" className="text-xs text-[#FFD700] hover:text-white mt-2 inline-block transition-colors">Start tracking →</Link>
             </div>
           </div>
          
          {/* Suggested Rankers */}
          <div className="bg-[#13151D] rounded-xl p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] border border-white/10">
            <h3 className="font-bold text-white mb-4">Suggested Rankers</h3>
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-gray-600 text-4xl mb-2">people</span>
              <p className="text-gray-500 text-sm">No online friends</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Post Creator Modal */}
      <PostCreatorModal 
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  )
}
