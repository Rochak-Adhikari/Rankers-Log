import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function CommentsPage() {
  const { postId } = useParams()
  const { user } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const commentsEndRef = useRef(null)

  useEffect(() => {
    loadPost()
    loadComments()
    if (user) loadUserProfile()
    
    // Subscribe to new comments in realtime
    const subscription = supabase
      .channel(`comments:${postId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${postId}`
      }, async (payload) => {
        // Fetch the profile for the new comment
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', payload.new.user_id)
          .single()
        
        const newComment = { ...payload.new, profiles: profile, likes_count: 0 }
        setComments(prev => [...prev, newComment])
      })
      .subscribe()
    
    return () => {
      subscription.unsubscribe()
    }
  }, [postId, user])

  async function loadUserProfile() {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single()
    if (data) setUserProfile(data)
  }

  async function loadPost() {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles(username, avatar_url, display_name)')
      .eq('id', postId)
      .single()

    if (data) {
      setPost(data)
    }
  }

  async function loadComments() {
    setLoading(true)
    
    const { data } = await supabase
      .from('comments')
      .select('*, profiles(username, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })

    setComments(data || [])
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setSubmitting(true)
    const commentContent = newComment.trim()
    setNewComment('')

    const { data, error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: user.id,
      content: commentContent
    }).select('*, profiles(username, avatar_url)').single()

    if (!error && data) {
      // Comment will be added via realtime subscription, but add optimistically if subscription is slow
      setComments(prev => {
        if (prev.some(c => c.id === data.id)) return prev
        return [...prev, { ...data, likes_count: 0 }]
      })
    }

    setSubmitting(false)
  }

  async function handleLike(commentId) {
    if (!user) {
      alert('Please login to like comments')
      return
    }

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('comment_id', commentId)
      .eq('user_id', user.id)
      .single()

    if (existingLike) {
      // Unlike
      await supabase.from('comment_likes').delete().eq('id', existingLike.id)
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, likes_count: Math.max(0, (c.likes_count || 0) - 1) } : c
      ))
    } else {
      // Like
      await supabase.from('comment_likes').insert({ comment_id: commentId, user_id: user.id })
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, likes_count: (c.likes_count || 0) + 1 } : c
      ))
    }
  }

  async function handleDelete(commentId) {
    await supabase.from('comments').delete().eq('id', commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  return (
    <>
      {/* Back Button */}
      <Link to="/feed" className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest cursor-pointer hover:text-primary transition-colors w-fit group mb-6">
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span>Back to Feed</span>
      </Link>

      {/* Post Header */}
      {post && (
        <div className="bg-[#0a1016] border border-white/10 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
              {post.profiles?.avatar_url ? (
                <img src={post.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-primary">person</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white">{post.profiles?.username}</span>
                <span className="text-xs text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mb-2">{post.title_name}</h2>
              <p className="text-gray-400">{post.content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">forum</span>
          Data Stream
          <span className="text-sm text-gray-400 font-normal ml-2">({comments.length} comments)</span>
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
            {userProfile?.avatar_url ? (
              <img src={userProfile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-primary text-sm">person</span>
            )}
          </div>
          <div className="flex-1">
            <textarea
              data-testid="comment-input"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                data-testid="comment-submit"
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded hover:from-[#FFA500] hover:to-[#FFD700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_10px_rgba(255,215,0,0.3)]"
              >
                {submitting ? (
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">send</span>
                )}
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
          <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">chat_bubble_outline</span>
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} data-testid="comment-item" className="bg-[#0a1016] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors group">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  {comment.profiles?.avatar_url ? (
                    <img src={comment.profiles.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-primary text-sm">person</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white">{comment.profiles?.username}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">{comment.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <button 
                      onClick={() => handleLike(comment.id)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">thumb_up</span>
                      {comment.likes_count || 0}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-sm">reply</span>
                      Reply
                    </button>
                    {comment.user_id === user?.id && (
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
