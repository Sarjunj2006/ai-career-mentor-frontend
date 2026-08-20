import { useState, useEffect } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Spinner from '../components/common/Spinner'
import { useAuth } from '../context/AuthContext'
import { getCareerRecommendationRequest } from '../api/endpoints/dashboard.api'

const CareerAnalysis = () => {
  const { user } = useAuth()
  const USER_ID = user?.id

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasFetched, setHasFetched] = useState(false)

  const fetchRecommendation = async () => {
    if (!USER_ID) return
    setIsLoading(true)
    setError('')
    try {
      const response = await getCareerRecommendationRequest(USER_ID)
      setData(response.data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Could not load career analysis. Make sure a resume has been uploaded.',
      )
    } finally {
      setIsLoading(false)
      setHasFetched(true)
    }
  }

  useEffect(() => {
    fetchRecommendation()
  }, [USER_ID])

  const recommendations =
    data?.recommendations ??
    data?.career_recommendations ??
    (data?.top_recommendation ? [data.top_recommendation] : data?.role ? [data] : [])

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Career Analysis</h2>
          <p className="text-sm text-gray-500 mt-1">
            AI-recommended career paths ranked by fit with your resume.
          </p>
        </div>
        <Button variant="secondary" onClick={fetchRecommendation} disabled={isLoading}>
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <Card>
        {isLoading && (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-gray-500">
              Analyzing your career fit...
            </span>
          </div>
        )}

        {!isLoading && error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {!isLoading && !error && hasFetched && recommendations.length === 0 && (
          <p className="text-sm text-gray-500">
            No recommendations yet — upload a resume on the Resume page first.
          </p>
        )}

        {!isLoading && !error && recommendations.length > 0 && (
          <div className="flex flex-col gap-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-full bg-indigo-50 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {rec.role ?? rec.title ?? rec.career ?? 'Untitled role'}
                    </p>
                    {rec.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{rec.description}</p>
                    )}
                  </div>
                </div>
                {(rec.match_score ?? rec.score) !== undefined && (
                  <span className="text-sm font-medium text-primary shrink-0 ml-4">
                    {rec.match_score ?? rec.score}% match
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default CareerAnalysis