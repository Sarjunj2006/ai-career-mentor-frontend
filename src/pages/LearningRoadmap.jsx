import { useState } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import { useAuth } from '../context/AuthContext'
import { getRoadmapRequest } from '../api/endpoints/dashboard.api'

const STAGES = [
  { key: '30_days', label: 'First 30 Days', badge: '1' },
  { key: '60_days', label: 'Next 60 Days', badge: '2' },
  { key: '90_days', label: 'Final 90 Days', badge: '3' },
]

const LearningRoadmap = () => {
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
      const response = await getRoadmapRequest(USER_ID, targetRole.trim())
      setData(response.data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Could not generate a learning roadmap. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const roadmap = data?.roadmap ?? {}

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Learning Roadmap</h2>
        <p className="text-sm text-gray-500 mt-1">
          An AI-generated 30/60/90-day plan to reach any target role.
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
              Building your roadmap — this can take up to a minute.
            </span>
          </div>
        </Card>
      )}

      {!isLoading && error && (
        <Card>
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        </Card>
      )}

      {!isLoading && !error && data && (
        <div className="flex flex-col gap-4">
          {STAGES.map((stage) => (
            <Card key={stage.key}>
              <div className="flex items-center gap-3 mb-3">
                <span className="h-7 w-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {stage.badge}
                </span>
                <h3 className="text-sm font-semibold text-gray-800">
                  {stage.label}
                </h3>
              </div>
              <ul className="flex flex-col gap-2 pl-10">
                {(roadmap[stage.key] ?? []).map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default LearningRoadmap