import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function AppraisalPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [answers, setAnswers] = useState({})

  const questions = [
    { id: 'media', question: 'What type of media do you consume most?', options: ['Anime', 'Manga', 'Games', 'Light Novels', 'All of the above'] },
    { id: 'hours', question: 'Hours per week spent on hobbies?', options: ['1-5', '5-10', '10-20', '20-40', '40+'] },
    { id: 'genre', question: 'Favorite genre?', options: ['Action', 'Romance', 'Fantasy', 'Sci-Fi', 'Horror', 'Slice of Life'] },
    { id: 'style', question: 'How do you consume content?', options: ['Binge everything', 'Steady pace', 'Multiple at once', 'One at a time'] },
    { id: 'social', question: 'Social preference?', options: ['Solo player', 'Small party', 'Large guild', 'Competitive'] }
  ]

  async function handleAnswer(questionId, answer) {
    const newAnswers = { ...answers, [questionId]: answer }
    setAnswers(newAnswers)
    
    if (step < questions.length) {
      setStep(step + 1)
    } else {
      // Run analysis
      setAnalyzing(true)
      
      // Simulate analysis time
      await new Promise(r => setTimeout(r, 3000))
      
      // Generate results based on answers
      const playerClass = ['Shadow Monarch', 'Flame Emperor', 'Ice Queen', 'Storm King', 'Void Walker'][Math.floor(Math.random() * 5)]
      const rank = ['S', 'A', 'B'][Math.floor(Math.random() * 3)]
      const stats = {
        power: Math.floor(Math.random() * 30) + 70,
        intelligence: Math.floor(Math.random() * 30) + 70,
        agility: Math.floor(Math.random() * 30) + 70,
        endurance: Math.floor(Math.random() * 30) + 70,
        luck: Math.floor(Math.random() * 30) + 70
      }
      
      const result = {
        playerClass,
        rank,
        stats,
        title: `The ${playerClass}`,
        shareId: `PL-${Date.now().toString(36).toUpperCase()}`
      }
      
      setResults(result)
      
      // Save to database
      await supabase.from('appraisals').insert({
        user_id: user?.id,
        player_class: playerClass,
        rank,
        stats,
        share_id: result.shareId
      })
      
      setAnalyzing(false)
    }
  }

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
          <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-primary">psychology</span>
          </div>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">ANALYZING...</h2>
        <p className="text-primary font-mono text-sm">CALCULATING PLAYER POTENTIAL</p>
        <div className="mt-8 flex gap-1">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}></div>
          ))}
        </div>
      </div>
    )
  }

  if (results) {
    return (
      <div className="max-w-2xl mx-auto">
        {/* Results Card */}
        <div className="bg-gradient-to-br from-[#0a1016] to-[#1a1a2e] border border-primary/50 rounded-xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          
          <p className="text-xs font-mono text-primary mb-4 tracking-[0.3em]">SYSTEM APPRAISAL COMPLETE</p>
          
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,140,244,0.5)]">
            <span className="text-4xl font-black text-white">{results.rank}</span>
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2 uppercase">{results.playerClass}</h2>
          <p className="text-lg text-primary mb-8">{results.title}</p>
          
          {/* Stats */}
          <div className="grid grid-cols-5 gap-2 mb-8">
            {Object.entries(results.stats).map(([stat, value]) => (
              <div key={stat} className="text-center">
                <div className="text-2xl font-black text-white">{value}</div>
                <div className="text-[10px] text-gray-400 uppercase">{stat}</div>
              </div>
            ))}
          </div>
          
          {/* Share ID */}
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-400 mb-1">Player License ID</p>
            <p className="text-lg font-mono text-primary">{results.shareId}</p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/license/${results.shareId}`)}
              className="flex-1 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-lg hover:from-[#FFA500] hover:to-[#FFD700] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
            >
              <span className="material-symbols-outlined">badge</span>
              View License
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/license/${results.shareId}`)
                alert('Link copied!')
              }}
              className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">share</span>
              Share
            </button>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/feed')}
          className="w-full mt-6 py-3 text-gray-400 hover:text-white transition-colors"
        >
          Continue to Feed
        </button>
      </div>
    )
  }

  const currentQuestion = questions[step - 1]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="material-symbols-outlined text-5xl text-primary mb-4">psychology</span>
        <h1 className="text-3xl font-black text-white mb-2">SYSTEM APPRAISAL</h1>
        <p className="text-gray-400">Discover your Player class and rank potential</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Question {step} of {questions.length}</span>
          <span>{Math.round((step / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(step / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-[#0a1016] border border-white/10 rounded-xl p-8">
        <h2 className="text-xl font-bold text-white mb-6 text-center">{currentQuestion.question}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(currentQuestion.id, option)}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-left hover:border-primary hover:bg-primary/10 transition-all group"
            >
              <span className="text-white group-hover:text-primary transition-colors">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Skip */}
      <button
        onClick={() => navigate('/feed')}
        className="w-full mt-6 py-3 text-gray-500 hover:text-white transition-colors text-sm"
      >
        Skip Appraisal
      </button>
    </div>
  )
}
