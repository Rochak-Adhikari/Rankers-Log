import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="bg-[#050505] text-white font-display overflow-x-hidden min-h-screen relative flex flex-col selection:bg-primary selection:text-white">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[length:40px_40px] opacity-20 z-0"></div>
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(37,140,244,0.15)_0%,rgba(5,5,5,0)_70%)] z-0"></div>
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 z-50"></div>

      <header className="relative z-50 flex items-center justify-between px-6 md:px-12 py-6 w-full max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="size-10 text-primary animate-pulse group-hover:text-white transition-colors duration-500">
            <span className="material-symbols-outlined text-4xl">hub</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight leading-none group-hover:text-glow transition-all">RANKERS LOG</h1>
            <p className="text-[10px] text-primary tracking-[0.3em] font-medium opacity-70">SYSTEM ONLINE</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <span className="text-gray-600 cursor-default select-none">FEATURES</span>
          <span className="text-gray-600 cursor-default select-none">LEADERBOARD</span>
          <Link to="/auth/login" className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/5 hover:border-white/50 text-white transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)]">LOGIN</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 px-6 md:px-12 relative z-10 w-full max-w-[1440px] mx-auto py-12 lg:py-0">
        <div className="flex-1 max-w-xl space-y-8 text-center lg:text-left relative">
          <div className="absolute -left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block"></div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit mx-auto lg:mx-0 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></span>
            <span className="text-xs font-bold tracking-widest text-gray-300">NEXUS V.4.2 LIVE</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tight">
            TRACK YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00FFFF] to-white animate-pulse">IMMERSION</span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0 font-body">
            The ultimate specialized HUD for tracking progress in anime, manga, games, and novels.
            Build your skill tree, sync with the global database, and rank up.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
            <Link to="/auth/signup" className="chamfered-btn h-14 px-8 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-bold tracking-widest text-sm uppercase hover:from-[#FFA500] hover:to-[#FFD700] transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] flex items-center gap-3 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <span className="relative z-10">Begin Quest</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform relative z-10">arrow_forward</span>
            </Link>
            <Link to="/auth/login" className="chamfered-btn h-14 px-8 bg-transparent border border-white/20 text-white font-bold tracking-widest text-sm uppercase hover:bg-white/5 hover:border-primary/50 hover:text-primary transition-all flex items-center gap-3 backdrop-blur-sm group">
              Login
              <span className="material-symbols-outlined text-sm group-hover:text-primary transition-colors">login</span>
            </Link>
          </div>
          <div className="pt-8 flex flex-wrap items-center gap-6 md:gap-8 justify-center lg:justify-start text-xs text-gray-500 font-mono border-t border-white/5 mt-8">
            <div className="flex items-center gap-2 group cursor-help">
              <span className="material-symbols-outlined text-primary group-hover:animate-bounce">database</span>
              <span>14.2M LOGS</span>
            </div>
            <div className="flex items-center gap-2 group cursor-help">
              <span className="material-symbols-outlined text-[#BF00FF] group-hover:animate-bounce">group</span>
              <span>42K AGENTS</span>
            </div>
            <div className="flex items-center gap-2 group cursor-help">
              <span className="material-symbols-outlined text-[#FFD700] group-hover:animate-bounce">trophy</span>
              <span>RANK S REWARDS</span>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg relative mt-12 lg:mt-0" style={{ perspective: '1000px' }}>
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-20 pointer-events-none"></div>
          <div className="relative z-10 w-full aspect-square md:aspect-[4/3] flex items-center justify-center">
            {/* Background Card 1 */}
            <div className="absolute top-0 right-0 w-3/4 animate-float-delayed opacity-60 scale-90 hover:opacity-100 hover:scale-95 transition-all duration-500 z-0">
              <div className="chamfered-box p-[1px] bg-gradient-to-br from-[#00FFFF]/50 to-transparent">
                <div className="chamfered-box bg-[#0a0f14] h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-cover bg-center grayscale-[50%]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBduUClT67EH4qznbqtRZ-gqkTWTWAxy_qfVxSIqOIkVLc9bSUAOJ_WxB_9dL7eyRgOyj8evIhI8wg0JmyRwTly6tr9pV8945HD0MzLBBgbAJSE8NPAxEfqthPiE1NOIAWfno0Y5uzgdcUOW3qLF_Ocdl4v51kW3eVHtIE2PtQzK4xGu8VYuvNp56WE_6Pobw9Cq1grOuxQxaOetFBNy6nWyBiJDtBZ6Oi6g99-AEHZ_rR11ehaprahjCqp0GPLjUAQ1L9jci2ZKXiI')" }}></div>
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[#00FFFF] text-xs font-bold tracking-widest">CYBERPUNK</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Card 2 */}
            <div className="absolute bottom-0 left-0 w-3/4 animate-float-delayed opacity-60 scale-90 hover:opacity-100 hover:scale-95 transition-all duration-500 z-10" style={{ animationDelay: '1.5s' }}>
              <div className="chamfered-box p-[1px] bg-gradient-to-br from-[#BF00FF]/50 to-transparent">
                <div className="chamfered-box bg-[#0a0f14] h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-cover bg-center grayscale-[50%]" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaCFjtC8Z9SMEyFpIvp0w4QUVCToRIdXCg5KEVqRJ1y8N4D_UCYg5zAp4GXrnr3NR2SWE_NxTeZ4eAnVdcxhOIvVAiiz5AaZQb8-X1vaYGt_ZvuwpOnH1zsZ0SxW-0r09ZEAJXeGRpOp4cvrtkxrGzJgqFEfJK2_PCuo9AQoYC4fETmUXkvqWPZQUn_sYokIUTIXZfuPtQZq-KsusbLcsfDFsbE0vdjD3Q3nCxlA40iY52ABTmSeZdqc8H7aW7S_NPVYgknsKpNn4r')" }}></div>
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-[#BF00FF] text-xs font-bold tracking-widest">SOLO LEVELING</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Featured Card */}
            <div className="absolute inset-0 m-auto w-3/4 h-3/4 animate-float z-20">
              <div className="chamfered-box p-[2px] bg-gradient-to-b from-primary via-primary/50 to-transparent shadow-[0_0_30px_rgba(37,140,244,0.15)]">
                <div className="chamfered-box bg-[#101922] h-full flex flex-col relative overflow-hidden group">
                  <div className="h-40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBbZFCri93NCuEqpwAA_Q6hM1OP5arvBZp4V_tfv7zz758-BZ-1OoA4Wz_qSykQyDgOtk2XQtGekTLa4CYhvs-3An0_PUEH5AMzMbTDEuzXZTiiipPA77ilvfVwNJf_0lnmEOnTtqn4MFINvAcMqr3apExp6DyyTKVj4qZHaUjH85YBiHoMJeM8EfUZSF1CmidgpEjVIZk2GNWjgRpZlhNNk4snJegJLZbN9arXrlm8P9JKjvMfpRz8LQRmLaPtbM4V21KiQaek8XFg')", filter: 'hue-rotate(190deg) contrast(1.2)' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101922] to-transparent"></div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[9px] font-bold text-primary border border-primary/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                      LIVE FEED
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between relative bg-gradient-to-b from-transparent to-[#050505]">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-primary">target</span>
                        ACTIVE QUEST
                      </h3>
                      <div className="space-y-2 mt-3">
                        <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-wide">
                          <span>Progress</span>
                          <span className="text-white font-mono">85%</span>
                        </div>
                        <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[85%] shadow-[0_0_10px_rgba(37,140,244,0.5)]"></div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Daily: Read 3 chapters of One Piece</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded border border-black bg-gray-700 bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdaWmABVJXA2jsgAaK0-A6KfaQdF1oWID-5yztCv3l5U4qlYJDSTECr6S60s6aBycW6BghIvBQ1xOa8-DhAwvTEzDPpjRcZd0K45p4r0ZfOwdKum9Qnyac1EEnvjyeO_Kq60P6BMi4UkW9vs35XyjWPzLq4wVuhV3rWwCt6UUEUAj6mnAT-RhULGMZ8cxGGp7Uc_F5TTib0U2w_QW5cFL4wkdzQUMu-AH7iLWkIVuNlTrz5B5RRSt_BDGQakh-x3VtiqhU72W8jV3j')" }}></div>
                        <div className="w-6 h-6 rounded border border-black bg-gray-700 bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNi7Ir1_JVDK5k575XBEKw6VG8QHAiyB-d9mBlpBJO5RiXtSCo7DXGDGrAsOe7wo86lDtRXea3FxYOrPOmf44M0gRyIXNoAJF3AWYvO-q6DdmJ6glqW5W0_Esga9nt1F8N0wBJAR66XHxm1hovtEI6UpG16VmJp1mrv1cfBxDzPel7nMHFmIMACAoj47B4z-Ol562sFu6Qo6Cq0nqJhnTxpX0Nbdp_6W21MxGeUmiHBdwEsmpQncyUuWCQfWtAk5U-ujggqwJYwB81')" }}></div>
                        <div className="w-6 h-6 rounded border border-black bg-gray-800 flex items-center justify-center text-[8px] text-gray-400 font-mono">+42</div>
                      </div>
                      <button className="text-[10px] text-primary font-bold hover:text-white transition-colors tracking-widest uppercase">SYNCED</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md py-4 mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 uppercase tracking-widest">
          <p>© 2024 RANKERS LOG SYSTEM. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <Link to="/legal/terms" className="hover:text-primary cursor-pointer transition-colors">Terms</Link>
            <Link to="/legal/privacy" className="hover:text-primary cursor-pointer transition-colors">Privacy</Link>
            <span className="hover:text-primary cursor-pointer transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              System Normal
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
