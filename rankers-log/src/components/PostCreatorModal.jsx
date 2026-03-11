import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { DEFAULT_AVATAR_URL, MAX_IMAGE_SIZE_BYTES, ALLOWED_IMAGE_TYPES } from '../lib/constants'

const ACHIEVEMENT_TYPES = [
  { id: 'first_watch', name: 'First Watch', icon: 'play_circle', xp: 50, color: 'text-blue-400' },
  { id: 'binge_session', name: 'Binge Session', icon: 'local_fire_department', xp: 100, color: 'text-orange-400' },
  { id: 'series_complete', name: 'Series Complete', icon: 'emoji_events', xp: 200, color: 'text-yellow-400' },
  { id: 'manga_milestone', name: 'Manga Milestone', icon: 'menu_book', xp: 150, color: 'text-purple-400' },
  { id: 'game_beaten', name: 'Game Beaten', icon: 'sports_esports', xp: 250, color: 'text-green-400' },
  { id: 'review_posted', name: 'Review Posted', icon: 'rate_review', xp: 75, color: 'text-cyan-400' },
]

const AVAILABLE_TAGS = [
  { id: 'anime', name: 'Anime', icon: 'tv', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'manga', name: 'Manga', icon: 'menu_book', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'game', name: 'Game', icon: 'sports_esports', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  { id: 'movie', name: 'Movie', icon: 'movie', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'review', name: 'Review', icon: 'rate_review', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'progress', name: 'Progress', icon: 'trending_up', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'spoiler', name: 'Spoiler', icon: 'warning', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { id: 'discussion', name: 'Discussion', icon: 'forum', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
]

export function PostCreatorModal({ isOpen, onClose, onPostCreated }) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedAchievement, setSelectedAchievement] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [rating, setRating] = useState(0)
  const [mediaTitle, setMediaTitle] = useState('')
  const [activeTab, setActiveTab] = useState('post') // post, achievement, rating
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)')
        return
      }

      // Validate file size
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        alert('Image size must be less than 5MB. Please choose a smaller file.')
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.onerror = () => {
        alert('Failed to read image file. Please try again.')
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const toggleTag = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    )
  }

  const handleSubmit = async () => {
    if (!content.trim() && !selectedImage && !selectedAchievement) {
      alert('Please add some content, an image, or select an achievement')
      return
    }

    setUploading(true)

    try {
      // CRITICAL: Ensure profile exists before creating post
      const { data: profileCheck, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError || !profileCheck) {
        console.error('Profile not found, creating now...', profileError)
        // Create profile immediately
        const { error: createError } = await supabase.from('profiles').insert({
          id: user.id,
          username: user.user_metadata?.username || `user_${user.id.substring(0, 8)}`,
          display_name: user.user_metadata?.username || 'Player',
          avatar_url: DEFAULT_AVATAR_URL
        })
        
        if (createError) {
          alert('Failed to create user profile. Please contact support.')
          setUploading(false)
          return
        }
      }

      let imageUrl = null

      // Upload image if selected
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        const filePath = `posts/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, selectedImage, { cacheControl: '3600', upsert: false })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          if (uploadError.message?.includes('Bucket not found')) {
            alert('Storage not configured. Please create a "media" bucket in Supabase Storage.')
          } else if (uploadError.message?.includes('already exists')) {
            alert('File already exists. Please try again.')
          } else {
            alert(`Upload failed: ${uploadError.message}`)
          }
          setUploading(false)
          return
        }

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      // Create post with only essential fields first
      const postData = {
        user_id: user.id,
        content: content.trim() || null,
        image_url: imageUrl,
        media_type: selectedAchievement ? 'achievement' : (selectedTags[0] || 'general'),
        media_title: mediaTitle || null,
        xp_earned: selectedAchievement?.xp || 0
      }

      // Try to insert with minimal required fields
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single()

      if (error) {
        console.error('Error creating post:', error)
        // Provide more specific error messages
        if (error.code === '42501') {
          alert('Permission denied. Please check your login status.')
        } else if (error.code === '23502') {
          alert('Missing required field. Please fill in all required information.')
        } else if (error.code === '23505') {
          alert('Duplicate post detected. Please try again.')
        } else if (error.message?.includes('schema cache') || error.message?.includes('not find the table')) {
          alert('Database table not configured. Please ensure the "posts" table exists in Supabase. Contact support if this persists.')
        } else if (error.code === 'PGRST116' || error.code === '42P01') {
          alert('Database table "posts" not found. Please run the database migrations or create the table in Supabase.')
        } else {
          alert(`Failed to create post: ${error.message || 'Unknown error'}`)
        }
        setUploading(false)
        return
      }

      if (data) {
        // Update user XP if achievement
        if (selectedAchievement) {
          try {
            await supabase.rpc('increment_user_xp', { 
              user_id: user.id, 
              xp_amount: selectedAchievement.xp 
            })
          } catch (xpError) {
            console.warn('XP update failed:', xpError)
          }
        }

        // Fetch the post with profile data for display
        const { data: fullPost } = await supabase
          .from('posts')
          .select('*, profiles:user_id (username, avatar_url, display_name, level, rank)')
          .eq('id', data.id)
          .single()

        onPostCreated?.(fullPost || data)
        handleClose()
      }
    } catch (err) {
      console.error('Error:', err)
      alert('An error occurred. Please try again.')
    }

    setUploading(false)
  }

  const handleClose = () => {
    setContent('')
    setSelectedImage(null)
    setImagePreview(null)
    setSelectedAchievement(null)
    setSelectedTags([])
    setRating(0)
    setMediaTitle('')
    setActiveTab('post')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div data-testid="post-modal" className="relative w-full max-w-2xl bg-[#0d1117] border border-[#314d68] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#314d68]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">edit_note</span>
            Create New Log Entry
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#314d68]">
          <button
            onClick={() => setActiveTab('post')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'post' 
                ? 'text-primary border-b-2 border-primary bg-primary/10' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm mr-1">article</span>
            Post
          </button>
          <button
            onClick={() => setActiveTab('achievement')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'achievement' 
                ? 'text-[#FFD700] border-b-2 border-[#FFD700] bg-[#FFD700]/10' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm mr-1">emoji_events</span>
            Achievement
          </button>
          <button
            onClick={() => setActiveTab('rating')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'rating' 
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-400/10' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm mr-1">star</span>
            Review
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {/* Text Input */}
          <textarea
            data-testid="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              activeTab === 'achievement' 
                ? "Describe your achievement..." 
                : activeTab === 'rating'
                ? "Write your review..."
                : "What's happening in your journey?"
            }
            className="w-full bg-[#161b22] border border-[#314d68] rounded-lg p-4 text-white placeholder-gray-500 resize-none h-32 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mt-4 rounded-lg overflow-hidden border border-[#314d68]">
              <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 p-1 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-white text-sm">close</span>
              </button>
            </div>
          )}

          {/* Achievement Tab Content */}
          {activeTab === 'achievement' && (
            <div className="mt-4">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">
                Select Achievement Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ACHIEVEMENT_TYPES.map((achievement) => (
                  <button
                    key={achievement.id}
                    onClick={() => setSelectedAchievement(
                      selectedAchievement?.id === achievement.id ? null : achievement
                    )}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedAchievement?.id === achievement.id
                        ? 'border-[#FFD700] bg-[#FFD700]/10 shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                        : 'border-[#314d68] bg-[#161b22] hover:border-[#FFD700]/50'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-2xl ${achievement.color}`}>
                      {achievement.icon}
                    </span>
                    <p className="text-xs text-white font-medium mt-1">{achievement.name}</p>
                    <p className="text-[10px] text-[#FFD700]">+{achievement.xp} XP</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rating Tab Content */}
          {activeTab === 'rating' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">
                  Media Title
                </label>
                <input
                  data-testid="post-media-title"
                  type="text"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="e.g., Solo Leveling, Elden Ring..."
                  className="w-full bg-[#161b22] border border-[#314d68] rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">
                  Your Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 transition-all ${
                        star <= rating 
                          ? 'text-[#FFD700] scale-110' 
                          : 'text-gray-600 hover:text-gray-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {star <= rating ? 'star' : 'star_border'}
                      </span>
                    </button>
                  ))}
                  <span className="ml-2 text-lg font-bold text-white self-center">
                    {rating > 0 ? `${rating}/10` : ''}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="mt-4">
            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2 block">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1 ${
                    selectedTags.includes(tag.id)
                      ? tag.color + ' shadow-lg'
                      : 'bg-[#161b22] text-gray-400 border-[#314d68] hover:border-gray-500'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{tag.icon}</span>
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#314d68] bg-[#161b22]">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-primary hover:bg-primary/20 rounded-lg transition-colors"
              title="Add Image"
            >
              <span className="material-symbols-outlined">image</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              data-testid="post-submit"
              onClick={handleSubmit}
              disabled={uploading}
              className="px-6 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-lg shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  Uploading...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">send</span>
                  Post
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
