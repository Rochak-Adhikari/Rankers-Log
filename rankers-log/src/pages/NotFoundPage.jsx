import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-display flex items-center justify-center">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[length:40px_40px] opacity-20 z-0"></div>
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(37,140,244,0.1)_0%,transparent_70%)] z-0"></div>
      
      <div className="relative z-10 text-center px-4">
        {/* Glitch Effect Title */}
        <div className="relative mb-8">
          <h1 className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-primary/80 to-primary/20 leading-none tracking-tighter">
            404
          </h1>
          <div className="absolute inset-0 text-[120px] md:text-[180px] font-black text-primary/10 leading-none tracking-tighter animate-pulse">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            QUEST NOT FOUND
          </h2>
          <p className="text-gray-400 font-mono text-sm tracking-wider">
            // ERROR: The requested route does not exist in this realm //
          </p>
        </div>

        {/* Decorative Element */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-primary/50"></div>
          <span className="material-symbols-outlined text-primary text-2xl animate-pulse">warning</span>
          <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-primary/50"></div>
        </div>

        {/* Navigation Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/feed"
            className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold rounded-lg shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">home</span>
            Return to Base
          </Link>
          <Link 
            to="/"
            className="px-6 py-3 bg-white/5 border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 hover:border-primary/50 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">explore</span>
            Landing Page
          </Link>
        </div>

        {/* Status Code Details */}
        <div className="mt-12 p-4 bg-[#0a1016]/50 border border-white/10 rounded-lg max-w-md mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
            <span className="text-red-400">●</span>
            <span>STATUS: Page not found</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-1">
            <span className="text-yellow-400">●</span>
            <span>SUGGESTION: Check URL or navigate using menu</span>
          </div>
        </div>
      </div>
    </div>
  )
}
