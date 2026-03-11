import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProfileOptionsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showQRCode, setShowQRCode] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const profileUrl = `${window.location.origin}/u/${user?.user_metadata?.username || 'user'}`
  const shareText = 'Check out my profile on Rankers Log!'

  const socialPlatforms = [
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: '𝕏',
      color: 'bg-black hover:bg-gray-900',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'f',
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`
    },
    {
      id: 'messenger',
      name: 'Messenger',
      icon: '💬',
      color: 'bg-gradient-to-r from-[#00B2FF] to-[#006AFF] hover:opacity-90',
      url: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(profileUrl)}&app_id=291494419107518`
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      color: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90',
      action: () => {
        navigator.clipboard.writeText(profileUrl)
        alert('Link copied! Open Instagram and paste in your story or DM.')
      }
    },
    {
      id: 'twitch',
      name: 'Twitch',
      icon: '📺',
      color: 'bg-[#9146FF] hover:bg-[#7B2FFF]',
      action: () => {
        navigator.clipboard.writeText(profileUrl)
        alert('Link copied! Share it in your Twitch chat or bio.')
      }
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: '🎮',
      color: 'bg-[#5865F2] hover:bg-[#4752C4]',
      action: () => {
        navigator.clipboard.writeText(`${shareText} ${profileUrl}`)
        alert('Link copied! Paste it in Discord.')
      }
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '📱',
      color: 'bg-[#25D366] hover:bg-[#20BD5A]',
      url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + profileUrl)}`
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-[#0088CC] hover:bg-[#0077B5]',
      url: `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(shareText)}`
    }
  ]

  const handleSocialShare = (platform) => {
    if (platform.url) {
      window.open(platform.url, '_blank', 'width=600,height=400')
    } else if (platform.action) {
      platform.action()
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
    alert('Profile link copied to clipboard!')
  }

  const handleGenerateQR = () => {
    setShowQRCode(true)
  }

  const handleViewHighlights = () => {
    navigate('/profile/highlights')
  }

  const handleArchivePosts = () => {
    navigate('/profile/archive')
  }

  const handleExportData = () => {
    alert('Data export feature coming soon! Download all your posts, reviews, and activity.')
  }

  const handlePrivacySettings = () => {
    navigate('/settings/privacy')
  }

  const handlePlayerCard = () => {
    navigate('/appraisal')
  }

  const options = [
    {
      id: 'share',
      icon: 'share',
      title: 'Share Profile',
      description: 'Share to social platforms',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      action: () => setShowShareModal(true)
    },
    {
      id: 'copy',
      icon: 'link',
      title: 'Copy Profile Link',
      description: 'Copy your profile URL to clipboard',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      borderColor: 'border-blue-400/30',
      action: handleCopyLink
    },
    {
      id: 'qr',
      icon: 'qr_code',
      title: 'QR Code',
      description: 'Generate QR code for your profile',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-400/30',
      action: handleGenerateQR
    },
    {
      id: 'highlights',
      icon: 'auto_awesome',
      title: 'View Highlights',
      description: 'Manage your curated content collections',
      color: 'text-[#FFD700]',
      bgColor: 'bg-[#FFD700]/10',
      borderColor: 'border-[#FFD700]/30',
      action: handleViewHighlights
    },
    {
      id: 'playercard',
      icon: 'badge',
      title: 'Player Card',
      description: 'View and share your player appraisal',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      borderColor: 'border-cyan-400/30',
      action: handlePlayerCard
    },
    {
      id: 'archive',
      icon: 'archive',
      title: 'Archive Posts',
      description: 'Manage your archived content',
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/10',
      borderColor: 'border-gray-400/30',
      action: handleArchivePosts
    },
    {
      id: 'export',
      icon: 'download',
      title: 'Export Data',
      description: 'Download all your data',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/30',
      action: handleExportData
    },
    {
      id: 'privacy',
      icon: 'shield',
      title: 'Privacy Settings',
      description: 'Control who can see your profile',
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-400/30',
      action: handlePrivacySettings
    }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/profile" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Profile
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Profile Options</h1>
        <p className="text-gray-400">Manage your profile settings and sharing options</p>
      </div>

      {/* Profile Stats Card */}
      <div className="bg-[#13151D] rounded-xl p-6 border border-white/10 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-1">Profile Views Today</h3>
            <p className="text-3xl font-bold text-[#FFD700]">127</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-1">Total Engagement</h3>
            <p className="text-3xl font-bold text-primary">2,458</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-1">Profile Rank</h3>
            <p className="text-3xl font-bold text-purple-400">#342</p>
          </div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={option.action}
            className={`bg-[#13151D] border ${option.borderColor} rounded-xl p-6 text-left hover:bg-white/5 transition-all group`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${option.bgColor} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <span className={`material-symbols-outlined ${option.color} text-2xl`}>
                  {option.icon}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold mb-1 group-hover:text-primary transition-colors">
                  {option.title}
                </h3>
                <p className="text-sm text-gray-400">{option.description}</p>
              </div>
              <span className="material-symbols-outlined text-gray-600 group-hover:text-white transition-colors">
                chevron_right
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowShareModal(false)}
          />
          <div className="relative bg-[#0d1117] border border-[#314d68] rounded-xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Share Profile</h2>
              <button 
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Social Platforms Grid */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {socialPlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => handleSocialShare(platform)}
                  className={`${platform.color} p-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-105`}
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="text-white text-xs font-medium">{platform.name}</span>
                </button>
              ))}
            </div>

            {/* Copy Link Section */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Profile Link</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-[#182634] border border-white/10 rounded text-white text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-medium rounded transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowQRCode(false)}
          />
          <div className="relative bg-[#0d1117] border border-[#314d68] rounded-xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Profile QR Code</h2>
              <button 
                onClick={() => setShowQRCode(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* QR Code using API */}
            <div className="bg-white p-6 rounded-lg mb-6">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}&bgcolor=ffffff&color=000000&margin=10`}
                alt="Profile QR Code"
                className="w-full aspect-square"
              />
            </div>

            <p className="text-center text-gray-400 text-sm mb-4">
              Scan this code to view your profile
            </p>

            {/* Share QR to socials */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 text-center">Share QR Code</p>
              <div className="flex justify-center gap-2">
                {socialPlatforms.slice(0, 6).map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handleSocialShare(platform)}
                    className={`${platform.color} w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110`}
                    title={platform.name}
                  >
                    <span className="text-lg">{platform.icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <a 
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(profileUrl)}&format=png&download=1`}
                download="rankers-log-qr.png"
                className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFD700] text-black font-bold py-3 rounded-lg transition-colors text-center"
              >
                Download QR Code
              </a>
              <button 
                onClick={() => setShowQRCode(false)}
                className="px-6 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-8 bg-[#13151D] border border-white/10 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-primary text-2xl">info</span>
          <div>
            <h3 className="text-white font-bold mb-2">About Profile Options</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              These options help you manage your profile visibility, share your achievements, and control your data. 
              Some features are still in development and will be available soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
