import { useState } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import { useAuth } from '../context/AuthContext'
import { getInterviewPrepRequest } from '../api/endpoints/dashboard.api'

const InterviewPrep = () => {
  const { user } = useAuth()
  const USER_ID = user?.id

  const [targetRole, setTargetRole] = useState('')
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!targetRole.trim()) return

    setIsLoading(true)
    setError('')
    setData(null)

    try {
      const response = await getInterviewPrepRequest(USER_ID, targetRole.trim())
      setData(response.data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Could not generate interview prep. Make sure a resume and profile exist.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Interview Prep</h2>
        <p className="text-sm text-gray-500 mt-1">
          AI-generated interview questions tailored to any target role.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1">
            <Input
              label="Target Role"
              name="targetRole"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Data Analyst"
            />
          </div>
          <Button type="submit" variant="primary" disabled={isLoading || !targetRole.trim()}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </form>
      </Card>

      {isLoading && (
        <Card>
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-gray-500">
              Preparing interview questions - this can take 1-2 minutes.
            </span>
          </div>
        </Card>
      )}

      {!isLoading && error && (
        <Card>
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
          <div className="flex gap-4 mt-2">
            <a href="/profile" className="text-xs text-primary font-medium hover:underline">
              Set up your profile
            </a>
            <a href="/resume" className="text-xs text-primary font-medium hover:underline">
              Upload your resume
            </a>
          </div>
        </Card>
      )}

      {!isLoading && !error && data && (
        <Card>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
            For: {data.target_role}
          </p>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
            {data.interview_preparation}
          </p>
        </Card>
      )}
    </div>
  )
}

export default InterviewPrep