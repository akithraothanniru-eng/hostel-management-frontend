import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('hostel_user')
    const token  = localStorage.getItem('hostel_token')
    if (stored && token) {
      try { setUser(JSON.parse(stored)) } catch { logout() }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    const data = await authService.login(username, password)
    localStorage.setItem('hostel_token', data.token)
    localStorage.setItem('hostel_user', JSON.stringify(data))
    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('hostel_token')
    localStorage.removeItem('hostel_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
