import { createContext, useContext, useState, useEffect } from 'react'
import { loginRequest, getMeRequest } from '../api/endpoints/auth.api'
import { getToken, setToken, removeToken } from '../utils/tokenStorage'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken()
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const response = await getMeRequest()
        setUser(response.data)
        setIsAuthenticated(true)
      } catch {
        removeToken()
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    restoreSession()
  }, [])

  const login = async (credentials) => {
    setError('')
    try {
      const response = await loginRequest(credentials)
      setToken(response.data.access_token)

      const meResponse = await getMeRequest()
      setUser(meResponse.data)
      setIsAuthenticated(true)

      return { success: true }
    } catch (err) {
      const message =
        err.response?.status === 401
          ? 'Invalid email or password.'
          : err.response?.data?.detail || 'Something went wrong. Please try again.'
      setError(message)
      setIsAuthenticated(false)
      return { success: false, message }
    }
  }

  const logout = () => {
    removeToken()
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, error, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)