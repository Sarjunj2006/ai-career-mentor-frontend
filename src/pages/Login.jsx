import { useNavigate } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleFakeLogin = (e) => {
    e.preventDefault()
    // Temporary — replace with real API call in the auth integration step
    login({ name: 'Test User' })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <Card className="w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Log in to Career Mentor
        </h2>
        <form onSubmit={handleFakeLogin} className="flex flex-col gap-4">
          <Input label="Email" name="email" type="email" placeholder="you@example.com" />
          <Input label="Password" name="password" type="password" placeholder="••••••••" />
          <Button type="submit" variant="primary" className="w-full">
            Log In
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default Login