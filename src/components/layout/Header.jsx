import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 shrink-0 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-sm text-gray-500">Welcome back,</h1>
        <p className="font-semibold text-gray-800">
          {user?.name ?? 'Guest User'}
        </p>
      </div>

      <Button variant="secondary" onClick={logout}>
        Logout
      </Button>
    </header>
  )
}

export default Header