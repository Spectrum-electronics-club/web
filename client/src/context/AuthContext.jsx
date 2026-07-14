import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '@/utils/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('ngnd-access-token')
    if (token) {
      // Decode payload (no verify — server validates on each request)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp * 1000 > Date.now()) {
          setCurrentUser({ id: payload.id, role: payload.role, email: payload.email })
        } else {
          localStorage.removeItem('ngnd-access-token')
          localStorage.removeItem('ngnd-refresh-token')
        }
      } catch {
        // malformed token
        localStorage.removeItem('ngnd-access-token')
        localStorage.removeItem('ngnd-refresh-token')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('ngnd-access-token', data.accessToken)
    localStorage.setItem('ngnd-refresh-token', data.refreshToken)
    setCurrentUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ngnd-access-token')
    localStorage.removeItem('ngnd-refresh-token')
    setCurrentUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
