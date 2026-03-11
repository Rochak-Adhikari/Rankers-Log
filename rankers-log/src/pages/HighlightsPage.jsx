import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export function HighlightsPage() {
  const { user } = useAuth()
  const [highlights, setHighlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newHighlightName, setNewHighlightName] = useState('')
  const [newHighlightIcon, setNewHighlightIcon] = useState('star')

  const availableIcons = [
    { id: 'star', icon: 'star', label: 'Star' },
    { id: 'trophy', icon: 'emoji_events', label: 'Trophy' },
    { id: 'heart', icon: 'favorite', label: 'Heart' },
    { id: 'fire', icon: 'local_fire_department', label: 'Fire' },
    { id: 'bolt', icon: 'bolt', label: 'Bolt' },
    { id: 'diamond', icon: 'diamond', label: 'Diamond' },
    { id: 'crown', icon: 'workspace_premium', label: 'Crown' },
    { id: 'game', icon: 'sports_esports', label: 'Game' },
    { id: 'book', icon: 'menu_book', label: 'Book' },
    { id: 'movie', icon: 'movie', label: 'Movie' },
    { id: 'music', icon: 'music_note', label: 'Music' },
    { id: 'photo', icon: 'photo_camera', label: 'Photo' }
  ]

  useEffect(() => {
    if (user) {
      fetchHighlights()
    }
  }, [user])

  async function fetchHighlights() {
    const { data } = await supabase
      .from('highlights')
      .select('*, posts:highlight_posts(post_id, posts(*))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setHighlights(data)
    } else {
      // Mock data for demo
      setHighlights([
        { 
          id: 1, 
          name: 'Best Moments', 
          icon: 'star', 
          cover_url: null, 
          post_count: 12,
          created_at: '2024-01-15T10:00:00Z'
        },
        { 
          id: 2, 
          name: 'Gaming Wins', 
          icon: 'sports_esports', 
          cover_url: null, 
          post_count: 8,
          created_at: '2024-01-10T15:30:00Z'
        },
        { 
          id: 3, 
          name: 'Manga Reviews', 
          icon: 'menu_book', 
          cover_url: null, 
          post_count: 15,
          created_at: '2024-01-05T08:00:00Z'
        },
        { 
          id: 4, 
          name: 'Achievements', 
          icon: 'emoji_events', 
          cover_url: null, 
          post_count: 25,
          created_at: '2023-12-20T12:00:00Z'
        }
      ])
    }
    setLoading(false)
  }

  const handleCreateHighlight = async () => {
    if (!newHighlightName.trim()) {
      alert('Please enter a highlight name')
      return
    }

    const newHighlight = {
      id: Date.now(),
      name: newHighlightName,
      icon: newHighlightIcon,
      cover_url: null,
      post_count: 0,
      created_at: new Date().toISOString()
    }

    // Try to save to database
    const { data, error } = await supabase
      .from('highlights')
      .insert({
        user_id: user.id,
        name: newHighlightName,
        icon: newHighlightIcon
      })
      .select()
      .single()

    if (data) {
      setHighlights(prev => [data, ...prev])
    } else {
      // Demo mode - add locally
      setHighlights(prev => [newHighlight, ...prev])
    }

    setNewHighlightName('')
    setNewHighlightIcon('star')
    setShowCreateModal(false)
  }

  const handleDeleteHighlight = async (highlightId) => {
    if (!confirm('Are you sure you want to delete this highlight?')) {
      return
    }

    await supabase
      .from('highlights')
      .delete()
      .eq('id', highlightId)

    setHighlights(prev => prev.filter(h => h.id !== highlightId))
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
              <span className="material-symbols-outlined text-[#FFD700] text-3xl">auto_awesome</span>
              Highlights
            </h1>
            <p className="text-gray-400">Curate and showcase your best content in themed collections.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-lg transition-all shadow-[0_0_12px_rgba(255,215,0,0.4)] hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Highlight
          </button>
        </div>
      </div>

      {/* Highlights Grid */}
      {highlights.length === 0 ? (
        <div className="bg-[#13151D] border border-white/10 rounded-xl p-12 text-center">
          <span className="material-symbols-outlined text-[#FFD700] text-6xl mb-4">auto_awesome</span>
          <h3 className="text-xl font-bold text-white mb-2">No Highlights Yet</h3>
          <p className="text-gray-500 mb-6">Create highlights to showcase your best posts and achievements.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-lg"
          >
            Create Your First Highlight
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {highlights.map((highlight) => (
            <div 
              key={highlight.id}
              className="bg-[#13151D] border border-white/10 rounded-xl overflow-hidden hover:border-[#FFD700]/30 transition-all group cursor-pointer"
            >
              {/* Cover Image or Gradient */}
              <div className="aspect-square relative bg-gradient-to-br from-[#FFD700]/20 to-purple-500/20 flex items-center justify-center">
                {highlight.cover_url ? (
                  <img src={highlight.cover_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[#FFD700] text-5xl group-hover:scale-110 transition-transform">
                    {highlight.icon}
                  </span>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    title="View Highlight"
                  >
                    <span className="material-symbols-outlined text-white">visibility</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteHighlight(highlight.id)
                    }}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-full transition-colors"
                    title="Delete Highlight"
                  >
                    <span className="material-symbols-outlined text-red-400">delete</span>
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-white truncate group-hover:text-[#FFD700] transition-colors">
                  {highlight.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {highlight.post_count || 0} posts
                </p>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#13151D] border border-dashed border-white/20 rounded-xl aspect-square flex flex-col items-center justify-center hover:border-[#FFD700]/50 hover:bg-[#FFD700]/5 transition-all group"
          >
            <span className="material-symbols-outlined text-gray-600 text-4xl group-hover:text-[#FFD700] transition-colors mb-2">add_circle</span>
            <span className="text-gray-500 text-sm group-hover:text-white transition-colors">Add Highlight</span>
          </button>
        </div>
      )}

      {/* Create Highlight Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative bg-[#0d1117] border border-[#314d68] rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Create Highlight</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Highlight Name */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Highlight Name</label>
              <input
                type="text"
                value={newHighlightName}
                onChange={(e) => setNewHighlightName(e.target.value)}
                placeholder="e.g., Best Moments, Gaming Wins..."
                className="w-full px-4 py-3 bg-[#182634] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
              />
            </div>

            {/* Icon Selection */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-3">Choose Icon</label>
              <div className="grid grid-cols-6 gap-2">
                {availableIcons.map((iconOption) => (
                  <button
                    key={iconOption.id}
                    onClick={() => setNewHighlightIcon(iconOption.icon)}
                    className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                      newHighlightIcon === iconOption.icon
                        ? 'bg-[#FFD700]/20 border-2 border-[#FFD700]'
                        : 'bg-white/5 border border-white/10 hover:border-[#FFD700]/50'
                    }`}
                    title={iconOption.label}
                  >
                    <span className={`material-symbols-outlined ${
                      newHighlightIcon === iconOption.icon ? 'text-[#FFD700]' : 'text-gray-400'
                    }`}>
                      {iconOption.icon}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#FFD700]">{newHighlightIcon}</span>
                </div>
                <div>
                  <p className="font-bold text-white">{newHighlightName || 'Highlight Name'}</p>
                  <p className="text-xs text-gray-500">0 posts</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCreateHighlight}
                className="flex-1 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-lg transition-all"
              >
                Create Highlight
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="mt-8 bg-[#13151D] border border-white/10 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-[#FFD700] text-2xl">lightbulb</span>
          <div>
            <h3 className="text-white font-bold mb-2">Highlight Tips</h3>
            <ul className="text-sm text-gray-400 space-y-1">
              <li>• Create themed collections for your best content</li>
              <li>• Highlights appear on your public profile</li>
              <li>• Add posts to highlights from the post menu</li>
              <li>• Reorder highlights by dragging them</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
