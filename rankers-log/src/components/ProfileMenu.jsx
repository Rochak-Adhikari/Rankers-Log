import { useState, useRef, useEffect } from 'react'

export function ProfileMenu({ onShare, onCopyLink, onReport, onBlock, isOwnProfile = true }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const menuItems = isOwnProfile ? [
    { icon: 'share', label: 'Share Profile', action: onShare, color: 'text-primary' },
    { icon: 'link', label: 'Copy Profile Link', action: onCopyLink, color: 'text-gray-400' },
    { icon: 'qr_code', label: 'QR Code', action: () => alert('QR Code feature coming soon!'), color: 'text-gray-400' },
    { icon: 'analytics', label: 'View Insights', action: () => alert('Profile insights coming soon!'), color: 'text-purple-400' },
    { icon: 'archive', label: 'Archive Posts', action: () => alert('Archive feature coming soon!'), color: 'text-gray-400' },
  ] : [
    { icon: 'share', label: 'Share Profile', action: onShare, color: 'text-primary' },
    { icon: 'link', label: 'Copy Profile Link', action: onCopyLink, color: 'text-gray-400' },
    { icon: 'person_add', label: 'Invite to Guild', action: () => alert('Guild invite coming soon!'), color: 'text-green-400' },
    { divider: true },
    { icon: 'flag', label: 'Report User', action: onReport, color: 'text-orange-400' },
    { icon: 'block', label: 'Block User', action: onBlock, color: 'text-red-400' },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 flex items-center justify-center border border-white/20 rounded hover:bg-white/5 hover:border-[#FFD700]/50 transition-all group"
      >
        <span className="material-icons-round text-gray-400 text-sm group-hover:text-[#FFD700] transition-colors">more_horiz</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#0d1117] border border-[#314d68] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="py-1">
            {menuItems.map((item, index) => (
              item.divider ? (
                <div key={index} className="border-t border-[#314d68] my-1" />
              ) : (
                <button
                  key={index}
                  onClick={() => {
                    item.action?.()
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group"
                >
                  <span className={`material-symbols-outlined text-lg ${item.color} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </span>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </button>
              )
            ))}
          </div>

          {/* Gamified Footer */}
          {isOwnProfile && (
            <div className="border-t border-[#314d68] p-3 bg-[#161b22]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Profile Views Today</span>
                <span className="text-[#FFD700] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  127
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
