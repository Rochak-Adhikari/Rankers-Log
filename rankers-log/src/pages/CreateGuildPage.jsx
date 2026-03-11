import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function CreateGuildPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'public',
    category: 'general',
    banner: ''
  })

  const categories = [
    { id: 'general', name: 'General', icon: 'groups' },
    { id: 'anime', name: 'Anime', icon: 'movie' },
    { id: 'manga', name: 'Manga', icon: 'menu_book' },
    { id: 'games', name: 'Games', icon: 'sports_esports' },
    { id: 'music', name: 'Music', icon: 'music_note' },
    { id: 'art', name: 'Art', icon: 'palette' },
    { id: 'competitive', name: 'Competitive', icon: 'trophy' },
    { id: 'casual', name: 'Casual', icon: 'weekend' }
  ]

  const bannerOptions = [
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
    'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
    'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter a guild name')
      return
    }

    setCreating(true)

    try {
      // Create guild in database
      const { data, error } = await supabase
        .from('guilds')
        .insert({
          name: formData.name,
          description: formData.description,
          type: formData.type,
          category: formData.category,
          banner_url: formData.banner || bannerOptions[0],
          owner_id: user.id,
          member_count: 1
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating guild:', error)
        if (error.message?.includes('schema cache') || error.code === 'PGRST116') {
          alert('Guild feature is being set up. Please try again later.')
        } else {
          alert(`Failed to create guild: ${error.message}`)
        }
        setCreating(false)
        return
      }

      if (data) {
        // Add owner as member
        await supabase.from('guild_members').insert({
          guild_id: data.id,
          user_id: user.id,
          role: 'owner'
        })

        navigate(`/guilds/${data.id}`)
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Failed to create guild. Please try again.')
    }

    setCreating(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/guilds" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Guilds
        </Link>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Create Guild</h1>
        <p className="text-gray-400">Build your community and lead your faction</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Guild Name */}
        <div>
          <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">
            Guild Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter guild name..."
            className="w-full bg-[#0a1016] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
            maxLength={50}
          />
          <p className="text-xs text-gray-500 mt-1">{formData.name.length}/50 characters</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What is your guild about?"
            rows={4}
            className="w-full bg-[#0a1016] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all resize-none"
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
        </div>

        {/* Guild Type */}
        <div>
          <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">
            Guild Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'public' })}
              className={`p-4 rounded-lg border transition-all flex items-center gap-3 ${
                formData.type === 'public'
                  ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]'
                  : 'bg-[#0a1016] border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              <span className="material-symbols-outlined">public</span>
              <div className="text-left">
                <p className="font-bold">Public</p>
                <p className="text-xs opacity-70">Anyone can join</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'private' })}
              className={`p-4 rounded-lg border transition-all flex items-center gap-3 ${
                formData.type === 'private'
                  ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]'
                  : 'bg-[#0a1016] border-white/10 text-gray-400 hover:border-white/30'
              }`}
            >
              <span className="material-symbols-outlined">lock</span>
              <div className="text-left">
                <p className="font-bold">Private</p>
                <p className="text-xs opacity-70">Invite only</p>
              </div>
            </button>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">
            Category
          </label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.id })}
                className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                  formData.category === cat.id
                    ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]'
                    : 'bg-[#0a1016] border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                <span className="material-symbols-outlined">{cat.icon}</span>
                <span className="text-xs font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Banner Selection */}
        <div>
          <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">
            Guild Banner
          </label>
          <div className="grid grid-cols-3 gap-3">
            {bannerOptions.map((banner, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setFormData({ ...formData, banner })}
                className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  formData.banner === banner
                    ? 'border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                    : 'border-transparent hover:border-white/30'
                }`}
              >
                <img src={banner} alt="" className="w-full h-full object-cover" />
                {formData.banner === banner && (
                  <div className="absolute inset-0 bg-[#FFD700]/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#FFD700]">check_circle</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-[#0a1016] border border-white/10 rounded-xl overflow-hidden">
          <div 
            className="h-24 bg-cover bg-center"
            style={{ backgroundImage: `url('${formData.banner || bannerOptions[0]}')` }}
          />
          <div className="p-4">
            <h3 className="font-bold text-white text-lg">
              {formData.name || 'Your Guild Name'}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {formData.description || 'Guild description will appear here...'}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">{formData.type === 'public' ? 'public' : 'lock'}</span>
                {formData.type === 'public' ? 'Public' : 'Private'}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">group</span>
                1 member
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Link
            to="/guilds"
            className="flex-1 py-3 text-center bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={creating || !formData.name.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold rounded-lg shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {creating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                Creating...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">add</span>
                Create Guild
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
