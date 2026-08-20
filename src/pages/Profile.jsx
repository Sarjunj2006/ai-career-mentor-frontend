import { useState, useEffect } from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Spinner from '../components/common/Spinner'
import { useAuth } from '../context/AuthContext'
import {
  getProfileByIdRequest,
  createProfileRequest,
  updateProfileRequest,
} from '../api/endpoints/profile.api'

const FIELDS = [
  { name: 'education', label: 'Education' },
  { name: 'experience', label: 'Experience' },
  { name: 'location', label: 'Location' },
  { name: 'career_interest', label: 'Career Interest' },
  { name: 'preferred_domain', label: 'Preferred Domain' },
]

const emptyForm = {
  education: '',
  experience: '',
  location: '',
  career_interest: '',
  preferred_domain: '',
}

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase())
  return initials.join('') || '?'
}

const Profile = () => {
  const { user } = useAuth()
  const USER_ID = user?.id

  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const fetchProfile = async () => {
    if (!USER_ID) return
    setIsLoading(true)
    setLoadError('')
    try {
      const response = await getProfileByIdRequest(USER_ID)
      setProfile(response.data)
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null)
      } else {
        setLoadError(err.response?.data?.detail || 'Could not load profile.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [USER_ID])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const startEditing = () => {
    setFormData({
      education: profile?.education ?? '',
      experience: profile?.experience ?? '',
      location: profile?.location ?? '',
      career_interest: profile?.career_interest ?? '',
      preferred_domain: profile?.preferred_domain ?? '',
    })
    setSubmitError('')
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setSubmitError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = profile
        ? await updateProfileRequest(USER_ID, formData)
        : await createProfileRequest(USER_ID, formData)

      setProfile(response.data)
      setIsEditing(false)
    } catch (err) {
      setSubmitError(
        err.response?.data?.detail || 'Could not save profile. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const showForm = !isLoading && !loadError && (!profile || isEditing)

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Avatar header card */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold shrink-0">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {user?.name || 'Your Profile'}
            </h2>
            <p className="text-sm text-gray-500">
              {profile?.career_interest
                ? `${profile.career_interest}${profile.location ? ` · ${profile.location}` : ''}`
                : user?.email}
            </p>
          </div>
        </div>
      </Card>

      {/* Background details section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800">Background</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Used by AI features like career analysis, skill gap, and interview prep.
            </p>
          </div>

          {!isLoading && !loadError && profile && !isEditing && (
            <Button variant="secondary" onClick={startEditing}>
              Edit
            </Button>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4">
          {isLoading && (
            <div className="flex items-center gap-3">
              <Spinner size="sm" />
              <span className="text-sm text-gray-500">Loading your profile...</span>
            </div>
          )}

          {!isLoading && loadError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {loadError}
            </p>
          )}

          {!isLoading && !loadError && profile && !isEditing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {FIELDS.map((field) => (
                <div key={field.name}>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    {field.label}
                  </p>
                  <p className="text-sm text-gray-800 font-medium mt-1">
                    {profile[field.name] || '—'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!profile && (
                <p className="text-sm text-gray-500 -mt-1">
                  You haven't set up your profile yet. Fill this in to unlock career
                  analysis, interview prep, and more.
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FIELDS.map((field) => (
                  <Input
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.label}
                  />
                ))}
              </div>

              {submitError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {submitError}
                </p>
              )}

              <div className="flex gap-3">
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Profile'}
                </Button>
                {profile && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={cancelEditing}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  )
}

export default Profile