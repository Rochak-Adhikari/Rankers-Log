import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchNotifications()
  }, [user])

  async function fetchNotifications() {
    setLoading(true)
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error && data) {
      setNotifications(data)
    }
    setLoading(false)
  }

  async function markAsRead(notifId) {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notifId)

    if (!error) {
      setNotifications(prev =>
        prev.map(n => n.id === notifId ? { ...n, read_at: new Date().toISOString() } : n)
      )
    }
  }

  async function markAllAsRead() {
    const unreadIds = notifications.filter(n => !n.read_at).map(n => n.id)
    if (unreadIds.length === 0) return

    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .in('id', unreadIds)

    if (!error) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      )
    }
  }

  function formatTimeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  function getNotifStyle(type) {
    const styles = {
      level_up: { icon: 'military_tech', iconColor: 'text-[#FFD700]', bgColor: 'bg-[#FFD700]/10' },
      like: { icon: 'favorite', iconColor: 'text-red-400', bgColor: 'bg-red-500/10' },
      comment: { icon: 'comment', iconColor: 'text-primary', bgColor: 'bg-primary/10' },
      follow: { icon: 'person_add', iconColor: 'text-[#00FFFF]', bgColor: 'bg-[#00FFFF]/10' },
      quest: { icon: 'assignment_turned_in', iconColor: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
      guild: { icon: 'shield', iconColor: 'text-[#BF00FF]', bgColor: 'bg-[#BF00FF]/10' },
      system: { icon: 'info', iconColor: 'text-gray-400', bgColor: 'bg-gray-500/10' }
    }
    return styles[type] || styles.system
  }

  const unreadCount = notifications.filter(n => !n.read_at).length

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 flex flex-wrap justify-between items-end gap-4 border-l-4 border-primary pl-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white text-glow">
            Notifications
          </h1>
          <p className="text-primary/80 font-mono text-sm tracking-widest mt-1">
            // SYSTEM ALERTS // ACTIVITY FEED
          </p>
        </div>
        <div className="flex gap-4">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="bg-primary/10 border border-primary/20 px-3 py-1 rounded text-xs font-mono text-primary hover:bg-primary/20 transition-colors"
            >
              MARK ALL READ ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="glass-panel rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <span className="material-symbols-outlined text-primary text-3xl animate-pulse">sync</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="material-symbols-outlined text-gray-600 text-5xl mb-3">notifications_off</span>
            <p className="text-gray-500 text-sm">No notifications yet</p>
            <p className="text-gray-600 text-xs mt-1">You'll see activity updates here</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((notif) => {
              const style = getNotifStyle(notif.type)
              const isUnread = !notif.read_at

              return (
                <div
                  key={notif.id}
                  onClick={() => isUnread && markAsRead(notif.id)}
                  className={`flex items-start gap-4 p-4 hover:bg-white/5 transition-colors cursor-pointer ${isUnread ? 'bg-primary/5' : ''}`}
                >
                  {/* Icon */}
                  <div className={`${style.bgColor} p-3 rounded-lg ${style.iconColor}`}>
                    <span className="material-symbols-outlined">{style.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold text-sm ${isUnread ? 'text-white' : 'text-gray-400'}`}>
                        {notif.title}
                      </h3>
                      <span className="text-xs text-gray-500 font-mono">{formatTimeAgo(notif.created_at)}</span>
                    </div>
                    <p className={`text-sm ${isUnread ? 'text-gray-300' : 'text-gray-500'}`}>
                      {notif.message}
                    </p>
                  </div>

                  {/* Unread Indicator */}
                  {isUnread && (
                    <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_#258cf4] mt-2"></div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
