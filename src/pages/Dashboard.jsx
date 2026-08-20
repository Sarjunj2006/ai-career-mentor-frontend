import { useState, useEffect } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import { useAuth } from '../context/AuthContext'
import {
  getProfileRequest,
  generateResumeAnalysisRequest,
  getCareerRecommendationRequest,
} from '../api/endpoints/dashboard.api'

const Dashboard = () => {
  const { user } = useAuth()
  const USER_ID = user?.id

  const [profile, setProfile] = useState(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState('')

  const [analysis, setAnalysis] = useState(null)
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false)
  const [analysisError, setAnalysisError] = useState('')

  const [recommendation, setRecommendation] = useState(null)
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(false)
  const [recommendationError, setRecommendationError] = useState('')

  useEffect(() => {
    if (!USER_ID) return

    const fetchProfile = async () => {
      setIsProfileLoading(true)
      setProfileError('')
      try {
        const response = await getProfileRequest(USER_ID)
        setProfile(response.data)
      } catch (err) {
        setProfileError(
          err.response?.data?.detail || 'Could not load your profile.',
        )
      } finally {
        setIsProfileLoading(false)
      }
    }

    fetchProfile()
  }, [USER_ID])

  const handleGenerateAnalysis = async () => {
    setIsAnalysisLoading(true)
    setAnalysisError('')
    try {
      const response = await generateResumeAnalysisRequest(USER_ID)
      setAnalysis(response.data)
    } catch (err) {
      setAnalysisError(
        err.response?.data?.detail ||
          'Could not generate resume analysis. Make sure a resume has been uploaded.',
      )
    } finally {
      setIsAnalysisLoading(false)
    }
  }

  const handleGetRecommendation = async () => {
    setIsRecommendationLoading(true)
    setRecommendationError('')
    try {
      const response = await getCareerRecommendationRequest(USER_ID)
      setRecommendation(response.data)
    } catch (err) {
      setRecommendationError(
        err.response?.data?.detail || 'Could not fetch career recommendation.',
      )
    } finally {
      setIsRecommendationLoading(false)
    }
  }

  const skillsDetected = analysis?.skills?.length
  const topRecommendation = recommendation?.recommendations?.[0]
  const topCareer = topRecommendation?.role

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          Your career progress at a glance.
        </p>
      </div>

      {/* Welcome / profile summary */}
      <Card>
        {isProfileLoading ? (
          <div className="flex items-center gap-3">
            <Spinner size="sm" />
            <span className="text-sm text-gray-500">Loading your profile...</span>
          </div>
        ) : profileError ? (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {profileError}
          </p>
        ) : profile ? (
          <div>
            <h3 className="text-base font-semibold text-gray-800">Your Background</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Education</p>
                <p className="text-sm text-gray-700 mt-1">{profile.education || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Career Interest</p>
                <p className="text-sm text-gray-700 mt-1">{profile.career_interest || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Preferred Domain</p>
                <p className="text-sm text-gray-700 mt-1">{profile.preferred_domain || 'Not provided'}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              You haven't set up your profile yet — add your background to unlock AI features.
            </p>
            <a href="/profile">
              <Button variant="secondary">Set Up Profile</Button>
            </a>
          </div>
        )}
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Resume Status</p>
          {analysis ? (
            <p className="text-lg font-semibold text-green-700 mt-2">Analyzed</p>
          ) : (
            <p className="text-sm text-gray-400 mt-2">
              Not analyzed yet — use the button below
            </p>
          )}
        </Card>

        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Skills Detected</p>
          {skillsDetected !== undefined ? (
            <p className="text-lg font-semibold text-gray-800 mt-2">{skillsDetected}</p>
          ) : (
            <p className="text-sm text-gray-400 mt-2">Run resume analysis to see this</p>
          )}
        </Card>

        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Top Career Match</p>
          {topCareer ? (
            <p className="text-lg font-semibold text-gray-800 mt-2 truncate">{topCareer}</p>
          ) : (
            <p className="text-sm text-gray-400 mt-2">Get a recommendation below</p>
          )}
        </Card>
      </div>

      {/* AI Resume Analysis */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">AI Resume Analysis</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Skills, ATS score insight, and a written review of your resume.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleGenerateAnalysis}
            disabled={isAnalysisLoading}
          >
            {isAnalysisLoading ? 'Analyzing...' : 'Generate Analysis'}
          </Button>
        </div>

        {isAnalysisLoading && (
          <div className="flex items-center gap-2 mt-4">
            <Spinner size="sm" />
            <span className="text-xs text-gray-500">
              Running AI analysis — this can take 1-2 minutes.
            </span>
          </div>
        )}

        {analysisError && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {analysisError}
          </p>
        )}

        {analysis && (
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Skills Detected</span>
              <span className="text-gray-800 font-medium text-right max-w-xs">
                {analysis.skills?.join(', ') || '—'}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block mb-2">Analysis (first section)</span>
              <p className="text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-3 leading-relaxed whitespace-pre-line">
                {(analysis.resume_analysis ?? '').slice(0, 500)}
                {analysis.resume_analysis?.length > 500 ? '...' : ''}
              </p>
              <a href="/resume-review" className="text-xs text-primary font-medium hover:underline mt-2 inline-block">
                See full review →
              </a>
            </div>
          </div>
        )}
      </Card>

      {/* Career Recommendation */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Career Recommendation</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Your best-fit role based on your resume.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleGetRecommendation}
            disabled={isRecommendationLoading}
          >
            {isRecommendationLoading ? 'Fetching...' : 'Get Recommendation'}
          </Button>
        </div>

        {isRecommendationLoading && (
          <div className="flex items-center gap-2 mt-4">
            <Spinner size="sm" />
            <span className="text-xs text-gray-500">Finding your best-fit career roles...</span>
          </div>
        )}

        {recommendationError && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {recommendationError}
          </p>
        )}

        {recommendation && (
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Top Role</span>
              <span className="text-gray-800 font-medium">
                {topRecommendation?.role ?? '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Match Score</span>
              <span className="text-gray-800 font-medium">
                {topRecommendation?.match_score ?? '—'}%
              </span>
            </div>
            <a href="/career-analysis" className="text-xs text-primary font-medium hover:underline">
              See all recommendations →
            </a>
          </div>
        )}
      </Card>
    </div>
  )
}

export default Dashboard