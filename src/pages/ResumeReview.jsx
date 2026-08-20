import { useState } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import { useAuth } from '../context/AuthContext'
import { generateResumeAnalysisRequest } from '../api/endpoints/dashboard.api'

const ResumeReview = () => {
  const { user } = useAuth()
  const USER_ID = user?.id

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setIsLoading(true)
    setError('')
    setData(null)

    try {
      const response = await generateResumeAnalysisRequest(USER_ID)
      setData(response.data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Could not generate resume review. Make sure a resume has been uploaded.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Resume Review</h2>
          <p className="text-sm text-gray-500 mt-1">
            A full AI review of your uploaded resume - strengths, weaknesses, and improvements.
          </p>
        </div>
        <Button variant="primary" onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? 'Reviewing...' : 'Generate Review'}
        </Button>
      </div>

      <Card>
        {isLoading && (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-gray-500">
              Reviewing your resume - this can take 1-2 minutes.
            </span>
          </div>
        )}

        {!isLoading && error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {!isLoading && !error && !data && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">
              Click Generate Review to get a full AI-written review of your resume.
            </p>
            <a href="/resume" className="text-xs text-primary font-medium hover:underline mt-2 inline-block">
              Need to upload a resume first?
            </a>
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="flex flex-col gap-6 text-sm">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                Skills Detected
              </p>
              <div className="flex flex-wrap gap-2">
                {(data.skills ?? []).length > 0 ? (
                  data.skills.map((skill) => (
                    <span key={skill} className="bg-indigo-50 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                Full Review
              </p>
              <p className="text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-4 leading-relaxed whitespace-pre-line">
                {data.resume_analysis || 'No review text returned.'}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ResumeReview