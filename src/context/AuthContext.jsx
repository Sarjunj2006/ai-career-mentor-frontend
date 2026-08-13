import { createContext, useContext, useState, useEffect } from 'react'
import { loginRequest } from '../api/endpoints/auth.api'
import { getToken, setToken, removeToken } from '../utils/tokenStorage'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Restore auth state on page refresh
  useEffect(() => {
    const token = getToken()
    if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials) => {
    setError('')
    try {
      const response = await loginRequest(credentials)
      const { access_token } = response.data

      setToken(access_token)
      setIsAuthenticated(true)

      return { success: true }
    } catch (err) {
      const message =
        err.response?.status === 401
          ? 'Invalid email or password.'
          : err.response?.data?.detail ||
            'Something went wrong. Please try again.'

      setError(message)
      setIsAuthenticated(false)

      return { success: false, message }
    }
  }

  const logout = () => {
    removeToken()
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)