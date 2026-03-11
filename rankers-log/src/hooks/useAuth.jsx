import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { DEFAULT_AVATAR_URL } from '../lib/constants'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })
    
    // Ensure profile exists - retry with exponential backoff
    if (data?.user && !error) {
      await ensureProfileExists(data.user.id, username)
    }
    
    return { data, error }
  }

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    // Ensure profile exists after login
    if (data?.user && !error) {
      await ensureProfileExists(data.user.id, data.user.user_metadata?.username)
    }
    
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`
    })
    return { data, error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper function to ensure profile exists with retry logic
async function ensureProfileExists(userId, username, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single()
      
      if (existingProfile) return true
      
      // Profile doesn't exist, try to create
      if (checkError?.code === 'PGRST116') {
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userId,
          username: username || `user_${userId.substring(0, 8)}`,
          display_name: username || 'Player',
          avatar_url: DEFAULT_AVATAR_URL
        })
        
        if (!insertError) return true
        if (insertError.code === '23505') return true // Already exists (race condition)
      }
      
      // Wait before retry (exponential backoff: 100ms, 200ms, 400ms)
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, i)))
      }
    } catch (err) {
      console.error('Profile check/create error:', err)
    }
  }
  return false
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
