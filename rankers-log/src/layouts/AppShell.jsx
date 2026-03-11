import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ProfileProvider, useProfile } from '../hooks/useProfile'
import { PostCreatorModal } from '../components/PostCreatorModal'

// Inner shell component — must be inside ProfileProvider to use useProfile
function AppShellInner() {
  const { signOut } = useAuth()
  const { avatarUrl } = useProfile()
  const navigate = useNavigate()
  const [showMobileNav, setShowMobileNav] = useState(true)
  const [showPostModal, setShowPostModal] = useState(false)
  const lastScrollY = useRef(0)
  const navScrollRef = useRef(null)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 50) {
        setShowMobileNav(true)
      } else if (currentScrollY > lastScrollY.current) {
        setShowMobileNav(false)
      } else {
        setShowMobileNav(true)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'text-white font-medium relative p-3 transition-colors after:content-[\'\'] after:absolute after:-bottom-4 after:left-0 after:w-full after:h-0.5 after:bg-primary after:shadow-[0_0_10px_#258cf4]'
      : 'text-slate-400 hover:text-primary font-medium p-3 transition-colors'

  const mobileNavClass = ({ isActive }) =>
    isActive
      ? 'flex flex-col items-center justify-center w-12 h-12 text-primary relative'
      : 'flex flex-col items-center justify-center w-12 h-12 text-slate-400 hover:text-white transition-colors'

  return (
    <div className="relative flex flex-col h-screen w-full overflow-hidden bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5980?q=80&w=2672&auto=format&fit=crop')] bg-cover bg-center">
      {/* Overlay to darken background image */}
      <div className="absolute inset-0 bg-[#0b1219]/90 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#223649_1px,transparent_1px),linear-gradient(to_bottom,#223649_1px,transparent_1px)] bg-[length:40px_40px] opacity-[0.07] z-0 pointer-events-none"></div>
      <div className="scanline"></div>

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#101922]/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-6">
          {/* Logo - Always Visible */}
          <Link to="/feed" className="flex items-center gap-3 shrink-0 transition-all cursor-pointer group">
            <div className="size-8 text-primary animate-pulse group-hover:animate-none group-hover:text-[#FFD700] group-hover:drop-shadow-[0_0_10px_#FFD700] transition-all duration-300">
              <span className="material-symbols-outlined text-4xl">hexagon</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase hidden md:block group-hover:text-[#FFD700] group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.6)] transition-all duration-300">RANKERS LOG</h1>
          </Link>

          {/* Horizontal Navigation - Scrollable */}
          <nav 
            ref={navScrollRef}
            className="hidden lg:flex items-center justify-center gap-2 overflow-x-auto no-scrollbar flex-1 px-8 border-l border-white/10"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <NavLink data-testid="nav-feed" to="/feed" className={navLinkClass} title="Home Feed">
              <span className="material-symbols-outlined text-[22px]">home</span>
            </NavLink>
            <NavLink data-testid="nav-search" to="/search" className={navLinkClass} title="Search">
              <span className="material-symbols-outlined text-[22px]">search</span>
            </NavLink>
            <NavLink data-testid="nav-messages" to="/messages" className={navLinkClass} title="Messages">
              <span className="material-symbols-outlined text-[22px]">chat</span>
            </NavLink>
            <NavLink data-testid="nav-friends" to="/friends" className={navLinkClass} title="Friends">
              <span className="material-symbols-outlined text-[22px]">group</span>
            </NavLink>
            <NavLink data-testid="nav-guilds" to="/guilds" className={navLinkClass} title="Guilds">
              <span className="material-symbols-outlined text-[22px]">shield</span>
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex max-w-md w-64">
            <div className="relative w-full group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors text-[20px]">search</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 bg-[#182634] border border-white/10 rounded text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Search Database..."
                  type="text"
                />
            </div>
          </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <NavLink to="/notifications" className="w-10 h-10 flex items-center justify-center rounded bg-[#182634] border border-white/10 hover:border-primary hover:text-primary hover:shadow-[0_0_10px_rgba(37,140,244,0.3)] transition-all relative">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </NavLink>
              <NavLink to="/settings" className="w-10 h-10 flex items-center justify-center rounded bg-[#182634] border border-white/10 hover:border-primary hover:text-primary hover:shadow-[0_0_10px_rgba(37,140,244,0.3)] transition-all">
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </NavLink>

              <NavLink to="/profile" className="w-10 h-10 hexagon bg-slate-700 border-2 border-primary/50 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img
                    alt="User Avatar"
                    className="w-full h-full object-cover hexagon"
                    src={avatarUrl}
                  />
                ) : (
                  <span className="material-symbols-outlined text-gray-500">person</span>
                )}
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-[1440px] mx-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 h-16 glass-panel-heavy border-t border-white/10 z-50 flex items-center justify-around px-2 transition-transform duration-300 ${showMobileNav ? 'translate-y-0' : 'translate-y-full'}`}>
        <NavLink data-testid="nav-feed" to="/feed" className={mobileNavClass}>
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined text-2xl">home</span>
              <span className="text-[9px] font-bold mt-0.5 tracking-wider">BASE</span>
              {isActive && <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_#258cf4]"></div>}
            </>
          )}
        </NavLink>

        <NavLink data-testid="nav-search" to="/search" className={mobileNavClass}>
          <span className="material-symbols-outlined text-2xl">search</span>
        </NavLink>

        {/* CENTRAL ADD BUTTON - Opens Post Creator Modal */}
        <button 
          data-testid="open-composer"
          onClick={() => setShowPostModal(true)}
          className="flex flex-col items-center justify-center w-14 h-14 -mt-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full shadow-[0_0_20px_rgba(255,215,0,0.5)] text-black"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>

        <NavLink data-testid="nav-messages" to="/messages" className={mobileNavClass}>
          <span className="material-symbols-outlined text-2xl">chat</span>
        </NavLink>

        <NavLink data-testid="nav-notifications" to="/notifications" className={mobileNavClass}>
          <span className="material-symbols-outlined text-2xl">notifications</span>
        </NavLink>

        <NavLink data-testid="nav-profile" to="/profile" className={mobileNavClass}>
          {({ isActive }) => (
            <div className="size-6 bg-slate-700 hexagon p-[1px] flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  alt="Profile"
                  className="w-full h-full object-cover hexagon"
                  src={avatarUrl}
                />
              ) : (
                <span className="material-symbols-outlined text-gray-500 text-xs">person</span>
              )}
            </div>
          )}
        </NavLink>
      </div>

      {/* Post Creator Modal */}
      <PostCreatorModal 
        isOpen={showPostModal} 
        onClose={() => setShowPostModal(false)}
        onPostCreated={() => {
          setShowPostModal(false)
          navigate('/feed')
        }}
      />
    </div>
  )
}

// Public export — wraps AppShellInner with ProfileProvider so all
// child pages can safely call useProfile() without it throwing.
export function AppShell() {
  return (
    <ProfileProvider>
      <AppShellInner />
    </ProfileProvider>
  )
}
