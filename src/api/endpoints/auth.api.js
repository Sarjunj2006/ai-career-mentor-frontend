import axiosClient from '../axiosClient'

export const loginRequest = (credentials) => {
  // credentials: { username, password } or { email, password } — match your FastAPI schema
  return axiosClient.post('/auth/login', credentials)
}

export const registerRequest = (userData) => {
  return axiosClient.post('/auth/register', userData)
}

export const getMeRequest = () => {
  return axiosClient.get('/auth/me')
}