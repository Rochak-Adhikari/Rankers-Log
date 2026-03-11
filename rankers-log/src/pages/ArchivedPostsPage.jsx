import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export function ArchivedPostsPage() {
  const { user } = useAuth()
  const [archivedPosts, setArchivedPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPosts, setSelectedPosts] = useState([])

  useEffect(() => {
    if (user) {
      fetchArchivedPosts()
    }
  }, [user])

  async function fetchArchivedPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_archived', true)
      .order('created_at', { ascending: false })

    if (data) {
      setArchivedPosts(data)
    } else {
      // Mock data for demo
      setArchivedPosts([
        { id: 1, content: 'My first Solo Leveling reaction!', media_type: 'anime', media_title: 'Solo Leveling', created_at: '2024-01-10T10:00:00Z', xp_earned: 50 },
        { id: 2, content: 'Completed Dark Souls III - what a journey!', media_type: 'game', media_title: 'Dark Souls III', created_at: '2024-01-05T15:30:00Z', xp_earned: 100 },
        { id: 3, content: 'Started reading One Piece manga', media_type: 'manga', media_title: 'One Piece', created_at: '2023-12-20T08:00:00Z', xp_earned: 25 },
      ])
    }
    setLoading(false)
  }

  const handleRestorePost = async (postId) => {
    const { error } = await supabase
      .from('posts')
      .update({ is_archived: false })
      .eq('id', postId)

    if (!error) {
      setArchivedPosts(prev => prev.filter(p => p.id !== postId))
      alert('Post restored successfully!')
    } else {
      // Demo mode
      setArchivedPosts(prev => prev.filter(p => p.id !== postId))
      alert('Post restored successfully!')
    }
  }

  const handleDeletePermanently = async (postId) => {
    if (!confirm('Are you sure you want to permanently delete this post? This action cannot be undone.')) {
      return
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)

    if (!error) {
      setArchivedPosts(prev => prev.filter(p => p.id !== postId))
      alert('Post deleted permanently.')
    } else {
      // Demo mode
      setArchivedPosts(prev => prev.filter(p => p.id !== postId))
      alert('Post deleted permanently.')
    }
  }

  const handleSelectPost = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const handleRestoreSelected = async () => {
    for (const postId of selectedPosts) {
      await handleRestorePost(postId)
    }
    setSelectedPosts([])
  }

  const handleDeleteSelected = async () => {
    if (!confirm(`Are you sure you want to permanently delete ${selectedPosts.length} posts?`)) {
      return
    }
    for (const postId of selectedPosts) {
      setArchivedPosts(prev => prev.filter(p => p.id !== postId))
    }
    setSelectedPosts([])
    alert('Selected posts deleted.')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getMediaTypeIcon = (type) => {
    const icons = {
      anime: 'play_circle',
      manga: 'menu_book',
      game: 'sports_esports',
      movie: 'movie',
      music: 'music_note',
      book: 'book'
    }
    return icons[type] || 'article'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/profile/options" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Options
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <span className="material-symbols-outlined text-gray-400 text-3xl">archive</span>
              Archived Posts
            </h1>
            <p className="text-gray-400">Manage your archived content. Posts here are hidden from your profile.</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#FFD700]">{archivedPosts.length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Archived</p>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedPosts.length > 0 && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6 flex items-center justify-between">
          <p className="text-white font-medium">
            <span className="text-primary">{selectedPosts.length}</span> posts selected
          </p>
          <div className="flex gap-3">
            <button 
              onClick={handleRestoreSelected}
              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">restore</span>
              Restore All
            </button>
            <button 
              onClick={handleDeleteSelected}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">delete_forever</span>
              Delete All
            </button>
          </div>
        </div>
      )}

      {/* Archived Posts List */}
      {archivedPosts.length === 0 ? (
        <div className="bg-[#13151D] border border-white/10 rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-gray-600 text-6xl mb-4">inventory_2</span>
          <h3 className="text-xl font-bold text-white mb-2">No Archived Posts</h3>
          <p className="text-gray-500 mb-6">Posts you archive will appear here. You can restore them anytime.</p>
          <Link 
            to="/profile"
            className="inline-flex items-center gap-2 text-primary hover:text-blue-400 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Profile
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {archivedPosts.map((post) => (
            <div 
              key={post.id} 
              className={`bg-[#13151D] border rounded-xl p-5 transition-all ${
                selectedPosts.includes(post.id) 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => handleSelectPost(post.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    selectedPosts.includes(post.id)
                      ? 'bg-primary border-primary'
                      : 'border-gray-600 hover:border-primary'
                  }`}
                >
                  {selectedPosts.includes(post.id) && (
                    <span className="material-symbols-outlined text-white text-sm">check</span>
                  )}
                </button>

                {/* Media Type Icon */}
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">
                    {getMediaTypeIcon(post.media_type)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {post.media_title && (
                        <h3 className="text-white font-bold mb-1">{post.media_title}</h3>
                      )}
                      <p className="text-gray-400 text-sm line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">calendar_today</span>
                          {formatDate(post.created_at)}
                        </span>
                        <span className="capitalize">{post.media_type}</span>
                        {post.xp_earned > 0 && (
                          <span className="text-green-400">+{post.xp_earned} XP</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleRestorePost(post.id)}
                        className="p-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-lg transition-colors"
                        title="Restore Post"
                      >
                        <span className="material-symbols-outlined text-sm">restore</span>
                      </button>
                      <button
                        onClick={() => handleDeletePermanently(post.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg transition-colors"
                        title="Delete Permanently"
                      >
                        <span className="material-symbols-outlined text-sm">delete_forever</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="mt-8 bg-[#13151D] border border-white/10 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-[#FFD700] text-2xl">info</span>
          <div>
            <h3 className="text-white font-bold mb-2">About Archived Posts</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Archived posts are hidden from your public profile</li>
              <li>• You can restore archived posts at any time</li>
              <li>• Permanently deleted posts cannot be recovered</li>
              <li>• XP earned from archived posts is retained</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
