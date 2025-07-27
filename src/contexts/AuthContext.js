import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event)
      
      if (session?.user) {
        setUser(session.user)
        // Only fetch profile if we don't have one yet
        if (!profile || profile.id !== session.user.id) {
          await fetchProfile(session.user.id)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const getInitialSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
      }
    } catch (error) {
      console.error('Error getting initial session:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile not found, create one
          console.log('Profile not found, creating...')
          await createProfile(userId)
        } else {
          console.error('Error fetching profile:', error)
        }
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    }
  }

  const createProfile = async (userId) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) return

      const newProfile = {
        id: userId,
        email: currentUser.email,
        full_name: currentUser.user_metadata?.full_name || 
                  currentUser.user_metadata?.fullName ||
                  currentUser.email.split('@')[0],
        role: 'user',
        is_active: true
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single()

      if (!error && data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })
      
      if (error) throw error
      
      toast.success('Login berhasil!')
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      
      let errorMessage = 'Login gagal'
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email atau password salah'
      }
      
      toast.error(errorMessage)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            fullName: fullName.trim()
          }
        }
      })
      
      if (error) throw error
      
      if (data.user && data.session) {
        toast.success('Registrasi berhasil!')
      } else {
        toast.success('Registrasi berhasil! Cek email untuk verifikasi.')
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      
      let errorMessage = 'Registrasi gagal'
      if (error.message?.includes('User already registered')) {
        errorMessage = 'Email sudah terdaftar'
      }
      
      toast.error(errorMessage)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      console.log('Signing out...')
      
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      // Clear state immediately
      setUser(null)
      setProfile(null)
      
      toast.success('Logout berhasil!')
      
      // Force redirect to home
      window.location.href = '/'
      
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Logout gagal')
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) return { data: null, error: new Error('No user') }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) throw error
      
      setProfile(data)
      toast.success('Profile updated!')
      
      return { data, error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Failed to update profile')
      return { data: null, error }
    }
  }

  // Role checking functions - simplified
  const isAdmin = () => {
    return profile?.role === 'admin'
  }

  const isOwner = () => {
    return profile?.role === 'owner'
  }

  const canManageContent = () => {
    return ['admin', 'owner'].includes(profile?.role)
  }

  const canManageUsers = () => {
    return profile?.role === 'admin'
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin,
    isOwner,
    canManageContent,
    canManageUsers
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}