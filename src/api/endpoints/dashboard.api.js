import axiosClient from '../axiosClient'

export const getProfileRequest = (userId) => {
  return axiosClient.get(`/profile/${userId}`)
}

export const generateResumeAnalysisRequest = (userId) => {
  return axiosClient.post(`/ai/resume-analysis/${userId}`, null, {
    timeout: 120000,
  })
}

export const getCareerRecommendationRequest = (userId) => {
  return axiosClient.get(`/ai/career-recommendation/${userId}`, {
    timeout: 120000,
  })
}

export const getSkillGapRequest = (userId, targetRole) => {
  return axiosClient.get(`/ai/skill-gap/${userId}`, {
    params: { target_role: targetRole },
    timeout: 120000,
  })
}

export const getRoadmapRequest = (userId, targetRole) => {
  return axiosClient.get(`/ai/roadmap/${userId}`, {
    params: { target_role: targetRole },
    timeout: 120000,
  })
}

export const getInterviewPrepRequest = (userId, targetRole) => {
  return axiosClient.post(
    `/ai/interview-prep/${userId}`,
    undefined,
    { params: { target_role: targetRole }, timeout: 120000 },
  )
}

export const sendChatMessageRequest = (userId, question) => {
  return axiosClient.post(
    `/ai/chat/${userId}`,
    { question },
    { timeout: 120000 },
  )
}