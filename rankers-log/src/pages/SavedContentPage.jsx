import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function SavedContentPage() {
  const { user } = useAuth()
  const [savedItems, setSavedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (user) loadSavedContent()
  }, [user, filter])

  async function loadSavedContent() {
    setLoading(true)
    
    const { data } = await supabase
      .from('saves')
      .select('*, posts(*, profiles(username, avatar_url))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      setSavedItems(data.map(s => s.posts).filter(Boolean))
    } else {
      // Mock data for UI display
      setSavedItems([
        { id: '1', title_name: 'Solo Leveling Ch. 150', media_type: 'manga', content: 'Jin-Woo finally reaches S-Rank! This chapter was incredible.', created_at: '2024-01-15', profiles: { username: 'NeonDrifter', avatar_url: '' } },
        { id: '2', title_name: 'Elden Ring Boss Guide', media_type: 'game', content: 'Detailed strategy for defeating Malenia without taking damage.', created_at: '2024-01-14', profiles: { username: 'VoidWalker', avatar_url: '' } },
        { id: '3', title_name: 'Attack on Titan Finale', media_type: 'anime', content: 'My thoughts on how the series concluded...', created_at: '2024-01-13', profiles: { username: 'TitanSlayer', avatar_url: '' } },
        { id: '4', title_name: 'Cyberpunk 2077 2.0', media_type: 'game', content: 'The update that finally made the game what it should have been.', created_at: '2024-01-12', profiles: { username: 'NightCity_V', avatar_url: '' } }
      ])
    }

    setLoading(false)
  }

  async function handleUnsave(postId) {
    await supabase
      .from('saves')
      .delete()
      .eq('user_id', user.id)
      .eq('post_id', postId)
    
    setSavedItems(prev => prev.filter(item => item.id !== postId))
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'anime': return 'movie'
      case 'manga': return 'auto_stories'
      case 'game': return 'sports_esports'
      case 'novel': return 'menu_book'
      default: return 'bookmark'
    }
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-primary pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(37, 140, 244, 0.3)' }}>
            Personal Archive
          </h1>
          <p className="text-primary/80 font-mono text-sm tracking-widest mt-1">
            // SAVED_CONTENT // BOOKMARKS
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded text-xs font-mono text-primary">
            SAVED: {savedItems.length}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'anime', 'manga', 'game', 'novel'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
              filter === type
                ? 'bg-primary text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-gray-400 font-mono text-sm">LOADING ARCHIVE...</p>
          </div>
        </div>
      ) : savedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">bookmark_border</span>
          <h3 className="text-xl font-bold text-white mb-2">Archive Empty</h3>
          <p className="text-gray-400 max-w-md">You haven't saved any content yet. Bookmark posts to access them later.</p>
          <Link to="/feed" className="mt-4 px-6 py-2 bg-primary text-white rounded font-bold hover:bg-primary/80 transition-colors">
            Browse Feed
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedItems.filter(item => filter === 'all' || item.media_type === filter).map(item => (
            <div key={item.id} className="bg-[#0a1016] border border-white/10 rounded-lg p-5 hover:border-primary/50 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">{getTypeIcon(item.media_type)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{item.title_name}</h3>
                    <p className="text-xs text-gray-500">by @{item.profiles?.username}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleUnsave(item.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Remove from saved"
                >
                  <span className="material-symbols-outlined">bookmark_remove</span>
                </button>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{item.content}</p>
              <div className="flex justify-between items-center pt-3 border-t border-white/5">
                <span className="text-xs text-gray-500 font-mono">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
                <span className="text-xs font-bold text-primary/60 uppercase">{item.media_type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
