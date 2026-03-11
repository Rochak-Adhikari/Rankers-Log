import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function OnboardingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [interests, setInterests] = useState([])
  const [favoriteGenres, setFavoriteGenres] = useState([])
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)

  const allInterests = [
    { id: 'anime', label: 'Anime', icon: 'movie' },
    { id: 'manga', label: 'Manga', icon: 'auto_stories' },
    { id: 'games', label: 'Games', icon: 'sports_esports' },
    { id: 'novels', label: 'Light Novels', icon: 'menu_book' },
    { id: 'webtoons', label: 'Webtoons', icon: 'web_stories' },
    { id: 'manhwa', label: 'Manhwa', icon: 'import_contacts' }
  ]

  const allGenres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
    'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life',
    'Sports', 'Thriller', 'Isekai', 'Mecha', 'Supernatural'
  ]

  function toggleInterest(id) {
    setInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  function toggleGenre(genre) {
    setFavoriteGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    )
  }

  async function handleComplete() {
    setLoading(true)

    await supabase.from('profiles').update({
      display_name: displayName || user?.user_metadata?.username,
      interests,
      favorite_genres: favoriteGenres,
      onboarding_completed: true
    }).eq('id', user.id)

    setLoading(false)
    navigate('/feed')
  }

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono text-gray-400">INITIALIZATION SEQUENCE</span>
            <span className="text-xs font-mono text-primary">{step}/3</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="bg-[#0a1016] border border-primary/30 rounded-xl p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-primary">waving_hand</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-4">WELCOME, PLAYER</h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              You've been selected to join the elite ranks. Let's configure your profile to optimize your experience.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-bold text-white mb-2 text-left">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={user?.user_metadata?.username || 'Enter your player name...'}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-center text-xl placeholder-gray-500 focus:border-primary focus:outline-none"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-lg hover:from-[#FFA500] hover:to-[#FFD700] transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)]"
            >
              Begin Setup
            </button>
          </div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <div className="bg-[#0a1016] border border-primary/30 rounded-xl p-8">
            <h2 className="text-2xl font-black text-white mb-2 text-center">SELECT YOUR DOMAINS</h2>
            <p className="text-gray-400 mb-6 text-center">What types of content do you track?</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {allInterests.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`p-6 rounded-lg border text-center transition-all ${
                    interests.includes(interest.id)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl mb-2">{interest.icon}</span>
                  <p className="font-bold">{interest.label}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={interests.length === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-lg hover:from-[#FFA500] hover:to-[#FFD700] transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Genres */}
        {step === 3 && (
          <div className="bg-[#0a1016] border border-primary/30 rounded-xl p-8">
            <h2 className="text-2xl font-black text-white mb-2 text-center">FAVORITE GENRES</h2>
            <p className="text-gray-400 mb-6 text-center">Select genres you enjoy (choose at least 3)</p>
            
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {allGenres.map(genre => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                    favoriteGenres.includes(genre)
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={favoriteGenres.length < 3 || loading}
                className="flex-1 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/80 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Initializing...
                  </>
                ) : (
                  'Complete Setup'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Skip Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/feed')}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
