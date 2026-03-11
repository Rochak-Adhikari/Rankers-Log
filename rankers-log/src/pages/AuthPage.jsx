import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function AuthPage() {
  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'login'
  const [activeTab, setActiveTab] = useState(initialTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  const { signIn, signUp, resetPassword } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      navigate('/feed')
    }
    setLoading(false)
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { error } = await signUp(email, password, username)
    
    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for the confirmation link!')
      setActiveTab('login')
    }
    setLoading(false)
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { error } = await resetPassword(email)
    
    if (error) {
      setError(error.message)
    } else {
      setMessage('Password reset link sent to your email!')
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#050505] text-white font-display overflow-hidden min-h-screen flex items-center justify-center selection:bg-primary selection:text-white">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[length:40px_40px] opacity-20 z-0"></div>
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(37,140,244,0.1)_0%,transparent_70%)] z-0"></div>

      <div className="w-full max-w-[440px] px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 relative">
          <Link to="/" className="inline-flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-4xl text-primary animate-pulse">hub</span>
            <h1 className="text-3xl font-bold tracking-tight text-white text-glow">RANKERS LOG</h1>
          </Link>
          <p className="text-xs text-primary font-mono tracking-[0.2em] uppercase opacity-70">/// System Access Point ///</p>
        </div>

        {/* Decorative Lines */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent to-primary/50 hidden md:block"></div>
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-gradient-to-l from-transparent to-primary/50 hidden md:block"></div>

        {/* Tabs */}
        {activeTab !== 'forgot' && (
          <div className="flex gap-2 mb-0 px-2 relative z-20">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 text-center text-sm font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 border-t border-x chamfered-top ${
                activeTab === 'login'
                  ? 'bg-primary/15 border-primary text-primary text-glow'
                  : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3 text-center text-sm font-bold uppercase tracking-widest cursor-pointer transition-all duration-300 border-t border-x chamfered-top ${
                activeTab === 'signup'
                  ? 'bg-primary/15 border-primary text-primary text-glow'
                  : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Main Panel */}
        <div className="glass-panel chamfered-box p-1 relative group transition-all duration-500 hover:shadow-[0_0_30px_rgba(37,140,244,0.15)]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary opacity-60"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary opacity-60"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary opacity-60"></div>

          <div className="bg-[#0a0f14]/80 chamfered-box p-8 relative z-10 min-h-[400px] flex flex-col justify-center">
            {/* Error/Message Display */}
            {error && (
              <div data-testid="auth-error" className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm">
                {message}
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">WELCOME BACK</h2>
                  <p className="text-xs text-gray-400 font-mono">IDENTIFY YOURSELF TO PROCEED</p>
                </div>
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-wider text-primary mb-1 ml-1 font-bold group-focus-within:text-white transition-colors">Username / Email</label>
                    <input
                      data-testid="auth-email"
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded-sm placeholder-gray-600 bg-white/3 border border-white/10 text-white focus:bg-primary/5 focus:border-primary focus:shadow-[0_0_15px_rgba(37,140,244,0.2)] focus:outline-none transition-all"
                      placeholder="Enter ID..."
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-wider text-primary mb-1 ml-1 font-bold group-focus-within:text-white transition-colors">Password</label>
                    <input
                      data-testid="auth-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded-sm placeholder-gray-600 bg-white/3 border border-white/10 text-white focus:bg-primary/5 focus:border-primary focus:shadow-[0_0_15px_rgba(37,140,244,0.2)] focus:outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded bg-white/5 border-gray-600 text-primary focus:ring-0" />
                    <span className="text-gray-400 group-hover:text-white transition-colors">Remember Node</span>
                  </label>
                  <button type="button" onClick={() => setActiveTab('forgot')} className="text-primary hover:text-white transition-colors cursor-pointer hover:underline">Forgot Code?</button>
                </div>
                <button
                  data-testid="auth-submit-login"
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden bg-primary/10 border border-primary/50 text-primary hover:bg-primary hover:text-white transition-all duration-300 py-3 font-bold uppercase tracking-widest text-sm disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? 'Initializing...' : 'Initialize Login'}
                    <span className="material-symbols-outlined text-sm">login</span>
                  </span>
                  <div className="absolute inset-0 bg-primary/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
                <div className="mt-6 pt-6 border-t border-white/5 flex justify-center gap-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Or connect via</p>
                  <div className="flex gap-3">
                    <button type="button" className="h-6 w-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 hover:text-primary transition-colors text-gray-400">
                      <span className="text-xs font-bold">G</span>
                    </button>
                    <button type="button" className="h-6 w-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 hover:text-primary transition-colors text-gray-400">
                      <span className="text-xs font-bold">D</span>
                    </button>
                    <button type="button" className="h-6 w-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 hover:text-primary transition-colors text-gray-400">
                      <span className="text-xs font-bold">X</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">NEW PLAYER</h2>
                  <p className="text-xs text-gray-400 font-mono">CREATE PROFILE TO START LOGGING</p>
                </div>
                <div className="space-y-3">
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-wider text-primary mb-1 ml-1 font-bold group-focus-within:text-white transition-colors">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded-sm placeholder-gray-600 bg-white/3 border border-white/10 text-white focus:bg-primary/5 focus:border-primary focus:shadow-[0_0_15px_rgba(37,140,244,0.2)] focus:outline-none transition-all"
                      placeholder="Choose callsign..."
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-wider text-primary mb-1 ml-1 font-bold group-focus-within:text-white transition-colors">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded-sm placeholder-gray-600 bg-white/3 border border-white/10 text-white focus:bg-primary/5 focus:border-primary focus:shadow-[0_0_15px_rgba(37,140,244,0.2)] focus:outline-none transition-all"
                      placeholder="Comms frequency..."
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-wider text-primary mb-1 ml-1 font-bold group-focus-within:text-white transition-colors">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded-sm placeholder-gray-600 bg-white/3 border border-white/10 text-white focus:bg-primary/5 focus:border-primary focus:shadow-[0_0_15px_rgba(37,140,244,0.2)] focus:outline-none transition-all"
                      placeholder="Secure code..."
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center px-4">
                  By initializing, you agree to the <Link to="/legal/terms" className="text-gray-300 hover:text-white cursor-pointer underline">Terms of Service</Link> and <Link to="/legal/privacy" className="text-gray-300 hover:text-white cursor-pointer underline">Privacy Protocol</Link>.
                </div>
                <button
                  data-testid="auth-submit-signup"
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden bg-primary/10 border border-primary/50 text-primary hover:bg-primary hover:text-white transition-all duration-300 py-3 font-bold uppercase tracking-widest text-sm mt-2 disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? 'Creating...' : 'Create Account'}
                    <span className="material-symbols-outlined text-sm">person_add</span>
                  </span>
                  <div className="absolute inset-0 bg-primary/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                </button>
              </form>
            )}

            {/* Forgot Password Form */}
            {activeTab === 'forgot' && (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 text-primary">
                    <span className="material-symbols-outlined text-2xl">lock_reset</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">RECOVERY PROTOCOL</h2>
                  <p className="text-xs text-gray-400 font-mono">ENTER LINKED EMAIL TO RESET CREDENTIALS</p>
                </div>
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-wider text-primary mb-1 ml-1 font-bold group-focus-within:text-white transition-colors">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded-sm placeholder-gray-600 bg-white/3 border border-white/10 text-white focus:bg-primary/5 focus:border-primary focus:shadow-[0_0_15px_rgba(37,140,244,0.2)] focus:outline-none transition-all"
                      placeholder="name@domain.com"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative group overflow-hidden bg-white/5 border border-white/20 text-white hover:bg-primary hover:border-primary transition-all duration-300 py-3 font-bold uppercase tracking-widest text-sm disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                    <span className="material-symbols-outlined text-sm">send</span>
                  </span>
                </button>
                <div className="text-center pt-4">
                  <button type="button" onClick={() => setActiveTab('login')} className="text-xs text-gray-400 hover:text-primary transition-colors cursor-pointer flex items-center justify-center gap-1 group">
                    <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span> Return to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer Decorations */}
        <div className="mt-8 flex justify-center gap-8 opacity-40">
          <div className="flex flex-col items-center gap-1">
            <div className="hexagon bg-primary h-2 w-2"></div>
            <span className="text-[10px] text-primary font-mono tracking-widest">SECURE</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="hexagon bg-gray-500 h-2 w-2"></div>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest">ENCRYPTED</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="hexagon bg-gray-500 h-2 w-2"></div>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest">V.4.2</span>
          </div>
        </div>
      </div>
    </div>
  )
}
