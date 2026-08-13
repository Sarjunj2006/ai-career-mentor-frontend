import axiosClient from '../axiosClient'

export const uploadResumeRequest = (file, userId, onUploadProgress) => {
  const formData = new FormData()
  formData.append('file', file)

  return axiosClient.post(`/resume/upload?user_id=${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })
}