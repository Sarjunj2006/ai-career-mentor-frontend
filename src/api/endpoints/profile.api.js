import axiosClient from '../axiosClient'

export const getProfileByIdRequest = (userId) => {
  return axiosClient.get(`/profile/${userId}`)
}

export const createProfileRequest = (userId, profileData) => {
  return axiosClient.post(`/profile/?user_id=${userId}`, profileData)
}
export const updateProfileRequest = (userId, profileData) => {
  return axiosClient.put(`/profile/${userId}`, profileData)
}