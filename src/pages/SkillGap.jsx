import { useState } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import { useAuth } from '../context/AuthContext'
import { getSkillGapRequest } from '../api/endpoints/dashboard.api'

const SkillGap = () => {
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
      const response = await getSkillGapRequest(USER_ID, targetRole.trim())
      setData(response.data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'Could not analyze skill gap. Make sure a resume has been uploaded.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const currentSkills = data?.current_skills ?? []
  const analysis = data?.analysis ?? {}
  const matchPercentage = analysis.match_percentage
  const matchedSkills = analysis.matched_skills ?? []
  const missingSkills = analysis.missing_skills ?? []

  const SkillTag = ({ skill, tone }) => (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
        tone === 'matched'
          ? 'bg-green-50 text-green-700'
          : tone === 'missing'
          ? 'bg-red-50 text-red-700'
          : 'bg-indigo-50 text-primary'
      }`}
    >
      {skill}
    </span>
  )

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Skill Gap</h2>
        <p className="text-sm text-gray-500 mt-1">
          See which skills you're missing for any target role.
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
              placeholder="e.g. Cloud Security Engineer"
            />
          </div>
          <Button type="submit" variant="primary" disabled={isLoading || !targetRole.trim()}>
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </form>
      </Card>

      {isLoading && (
        <Card>
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span className="text-sm text-gray-500">
              Analyzing your skill gap — this can take up to a minute.
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
        <Card>
          <div className="flex flex-col gap-6 text-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Target Role</p>
                <p className="text-base font-semibold text-gray-800 mt-1">
                  {analysis.target_role}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Match</p>
                <p className="text-2xl font-semibold text-primary mt-1">
                  {matchPercentage === null || matchPercentage === undefined
                    ? '—'
                    : `${matchPercentage}%`}
                </p>
              </div>
            </div>

            {analysis.note && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 -mt-2">
                {analysis.note}
              </p>
            )}

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                Your Current Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {currentSkills.length > 0 ? (
                  currentSkills.map((skill) => <SkillTag key={skill} skill={skill} />)
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                Matched Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.length > 0 ? (
                  matchedSkills.map((skill) => (
                    <SkillTag key={skill} skill={skill} tone="matched" />
                  ))
                ) : (
                  <span className="text-gray-400">None matched yet</span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
                Missing Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill) => (
                    <SkillTag key={skill} skill={skill} tone="missing" />
                  ))
                ) : (
                  <span className="text-gray-400">None — great coverage!</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default SkillGap