import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import { DEFAULT_AVATAR_URL } from '../lib/constants'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [user])

  async function fetchProfile() {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!error && data) {
      setProfile(data)
    }
    setLoading(false)
  }

  async function updateProfile(updates) {
    if (!user) return { error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }

    return { data, error }
  }

  async function updateAvatar(file) {
    if (!user || !file) return { error: 'Invalid input' }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-avatar-${Date.now()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, { cacheControl: '3600', upsert: true })

    if (uploadError) {
      return { error: uploadError.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    // Update profile
    return updateProfile({ avatar_url: publicUrl })
  }

  async function updateBanner(file) {
    if (!user || !file) return { error: 'Invalid input' }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-banner-${Date.now()}.${fileExt}`
    const filePath = `banners/${fileName}`

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, { cacheControl: '3600', upsert: true })

    if (uploadError) {
      return { error: uploadError.message }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    // Update profile
    return updateProfile({ banner_url: publicUrl })
  }

  const defaultAvatar = DEFAULT_AVATAR_URL

  const value = {
    profile,
    loading,
    avatarUrl: profile?.avatar_url || defaultAvatar,
    bannerUrl: profile?.banner_url || null,
    username: profile?.username || user?.user_metadata?.username || 'Player',
    displayName: profile?.display_name || profile?.username || 'Player',
    level: profile?.level || 1,
    rank: profile?.rank || 'E',
    refreshProfile: fetchProfile,
    updateProfile,
    updateAvatar,
    updateBanner
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
