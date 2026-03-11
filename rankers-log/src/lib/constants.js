// ============================================
// RANKER'S LOG - APPLICATION CONSTANTS
// ============================================
// Single source of truth for app-wide constants

// Default avatar URL - use null to show icon fallback
// This ensures consistency across all components
export const DEFAULT_AVATAR_URL = null

// App metadata
export const APP_NAME = 'Ranker\'s Log'
export const APP_VERSION = '1.0.0'

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 50

// File upload limits
export const MAX_IMAGE_SIZE_MB = 5
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

// XP and leveling
export const XP_PER_LEVEL = 1000
export const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS']

// Privacy settings defaults
export const DEFAULT_PRIVACY_SETTINGS = {
  dm_policy: 'everyone', // 'everyone', 'followers', 'mutuals', 'no_one'
  profile_visible: true,
  show_activity: true
}

// Notification types
export const NOTIFICATION_TYPES = {
  LIKE: 'like',
  COMMENT: 'comment',
  FOLLOW: 'follow',
  LEVEL_UP: 'level_up',
  QUEST: 'quest',
  GUILD: 'guild',
  SYSTEM: 'system'
}

// Post media types
export const MEDIA_TYPES = ['anime', 'manga', 'manhwa', 'game', 'novel', 'movie', 'general']

// Guild roles
export const GUILD_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member'
}

// DM thread statuses
export const DM_STATUS = {
  ACCEPTED: 'accepted',
  PENDING: 'pending',
  DECLINED: 'declined'
}
