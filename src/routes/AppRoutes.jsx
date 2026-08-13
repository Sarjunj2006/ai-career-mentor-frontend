import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Layout from '../components/layout/Layout'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Resume from '../pages/Resume'
import CareerAnalysis from '../pages/CareerAnalysis'
import SkillGap from '../pages/SkillGap'
import LearningRoadmap from '../pages/LearningRoadmap'
import ResumeReview from '../pages/ResumeReview'
import InterviewPrep from '../pages/InterviewPrep'
import AiCareerChat from '../pages/AiCareerChat'
import NotFound from '../pages/NotFound'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/career-analysis" element={<CareerAnalysis />} />
          <Route path="/skill-gap" element={<SkillGap />} />
          <Route path="/learning-roadmap" element={<LearningRoadmap />} />
          <Route path="/resume-review" element={<ResumeReview />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />
          <Route path="/ai-chat" element={<AiCareerChat />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes