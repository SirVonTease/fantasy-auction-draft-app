import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Grid3X3, 
  Search, 
  Users, 
  Settings as SettingsIcon 
} from 'lucide-react'

const Navigation = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Grid3X3, label: 'Draft Board' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/roster', icon: Users, label: 'Roster' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-3 px-4 transition-colors duration-200 ${
                  isActive 
                    ? 'text-nfl-blue' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation