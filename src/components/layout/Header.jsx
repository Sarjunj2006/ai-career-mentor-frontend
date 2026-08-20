import { useAuth } from '../../context/AuthContext'
import Button from '../common/Button'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 shrink-0 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
      <div>
        <p className="font-semibold text-gray-800">
          Welcome back{user?.name ? `, ${user.name}` : ''}
        </p>
      </div>
      <Button variant="secondary" onClick={logout}>
        Logout
      </Button>
    </header>
  )
}

export default Header