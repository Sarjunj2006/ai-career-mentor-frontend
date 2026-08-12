import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

const menuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'My Profile', path: '/profile' },
  { label: 'Resume', path: '/resume' },
  { label: 'Career Analysis', path: '/career-analysis' },
  { label: 'Skill Gap', path: '/skill-gap' },
  { label: 'Learning Roadmap', path: '/learning-roadmap' },
  { label: 'Resume Review', path: '/resume-review' },
  { label: 'Interview Prep', path: '/interview-prep' },
  { label: 'AI Career Chat', path: '/ai-chat' },
]

const Sidebar = () => {
  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-200">
        <span className="text-lg font-semibold text-primary">
          Career Mentor
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar