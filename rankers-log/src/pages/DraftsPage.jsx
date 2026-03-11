import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function DraftsPage() {
  const { user } = useAuth()
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadDrafts()
  }, [user])

  async function loadDrafts() {
    setLoading(true)
    
    const { data } = await supabase
      .from('drafts')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (data && data.length > 0) {
      setDrafts(data)
    } else {
      // Mock data for UI display
      setDrafts([
        { id: '1', title_name: 'Jujutsu Kaisen Review', media_type: 'anime', content: 'Still working on my thoughts about the Shibuya arc...', updated_at: '2024-01-15T10:30:00Z', progress: 12 },
        { id: '2', title_name: 'Baldur\'s Gate 3 Log', media_type: 'game', content: 'Need to add screenshots of my character build...', updated_at: '2024-01-14T18:45:00Z', progress: 85 },
        { id: '3', title_name: 'One Piece Ch. 1100', media_type: 'manga', content: '', updated_at: '2024-01-13T09:00:00Z', progress: 1100 }
      ])
    }

    setLoading(false)
  }

  async function handleDelete(draftId) {
    await supabase
      .from('drafts')
      .delete()
      .eq('id', draftId)
    
    setDrafts(prev => prev.filter(d => d.id !== draftId))
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'anime': return 'movie'
      case 'manga': return 'auto_stories'
      case 'game': return 'sports_esports'
      case 'novel': return 'menu_book'
      default: return 'description'
    }
  }

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-primary pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white" style={{ textShadow: '0 0 20px rgba(37, 140, 244, 0.3)' }}>
            Data Cache
          </h1>
          <p className="text-primary/80 font-mono text-sm tracking-widest mt-1">
            // DRAFT_LOGS // UNSAVED_DATA
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded text-xs font-mono text-yellow-500 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">edit_note</span>
            DRAFTS: {drafts.length}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="text-gray-400 font-mono text-sm">LOADING CACHE...</p>
          </div>
        </div>
      ) : drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">edit_off</span>
          <h3 className="text-xl font-bold text-white mb-2">No Drafts</h3>
          <p className="text-gray-400 max-w-md">You don't have any saved drafts. Start logging your progress!</p>
          <Link to="/feed" className="mt-4 px-6 py-2 bg-primary text-white rounded font-bold hover:bg-primary/80 transition-colors">
            Create Log
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {drafts.map(draft => (
            <div key={draft.id} className="bg-[#0a1016] border border-yellow-500/20 rounded-lg p-5 hover:border-yellow-500/50 transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-yellow-500">{getTypeIcon(draft.media_type)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white group-hover:text-yellow-500 transition-colors truncate">{draft.title_name || 'Untitled Draft'}</h3>
                      <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded font-mono">DRAFT</span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                      {draft.content || 'No content yet...'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="font-mono">
                        Last edited: {new Date(draft.updated_at).toLocaleDateString()} at {new Date(draft.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {draft.progress && (
                        <span className="font-mono">
                          Progress: {draft.progress}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-all" title="Continue editing">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(draft.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all" 
                    title="Delete draft"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Banner */}
      <div className="mt-8 p-4 bg-[#0a1016] border border-white/10 rounded-lg flex items-start gap-4">
        <span className="material-symbols-outlined text-primary text-2xl">info</span>
        <div>
          <h4 className="font-bold text-white mb-1">About Drafts</h4>
          <p className="text-sm text-gray-400">
            Drafts are automatically saved when you start creating a log but don't publish it. 
            They're stored locally and synced to your account. Drafts older than 30 days may be automatically deleted.
          </p>
        </div>
      </div>
    </>
  )
}
