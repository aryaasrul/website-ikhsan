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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        
        if (session?.user) {
          setUser(session.user)
          await getProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const getInitialSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      
      if (session?.user) {
        setUser(session.user)
        await getProfile(session.user.id)
      }
    } catch (error) {
      console.error('Error getting session:', error)
      toast.error('Error loading session')
    } finally {
      setLoading(false)
    }
  }

  const getProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // If profile doesn't exist, it will be created by trigger
        console.log('Profile not found or error:', error)
        return
      }
      
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      toast.success('Login berhasil!')
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      toast.error(error.message || 'Login gagal')
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      if (error) throw error
      
      toast.success('Registrasi berhasil! Silakan cek email untuk verifikasi.')
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      toast.error(error.message || 'Registrasi gagal')
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast.success('Logout berhasil!')
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Logout gagal')
      return { error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('No user logged in')
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) throw error
      
      setProfile(data)
      toast.success('Profile berhasil diupdate!')
      return { data, error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Gagal update profile')
      return { data: null, error }
    }
  }

  // Role checking functions
  const isAdmin = () => profile?.role === 'admin'
  const isOwner = () => profile?.role === 'owner'
  const canManageContent = () => ['admin', 'owner'].includes(profile?.role)
  const canManageUsers = () => profile?.role === 'admin'

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    getProfile,
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