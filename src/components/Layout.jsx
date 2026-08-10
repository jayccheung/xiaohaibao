import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const mainNavItems = [
  { to: '/create', label: '创作', icon: '✨' },
  { to: '/works', label: '作品', icon: '🖼️' },
  { to: '/settings', label: '设置', icon: '⚙️' },
]

const adminNavItems = [
  { to: '/admin', label: '概览', icon: '📊' },
  { to: '/admin/users', label: '用户', icon: '👥' },
  { to: '/admin/codes', label: '暗号', icon: '🔑' },
]

export default function Layout() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const { user, isAdmin: userIsAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-lg mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-xl px-5 py-4 border-b border-brand-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-lg">🦭</div>
            <h1 className="text-lg font-bold text-brand-900">小海豹{isAdmin ? ' · 管理后台' : ''}</h1>
          </div>
          <div className="flex items-center gap-3">
            {!isAdmin && userIsAdmin && (
              <NavLink to="/admin" className="text-text-secondary/40 hover:text-brand-700 text-xs font-semibold">后台</NavLink>
            )}
            {isAdmin && (
              <NavLink to="/create" className="text-brand-500 text-xs font-semibold">← 返回创作</NavLink>
            )}
            <button onClick={handleLogout} className="text-text-secondary/40 hover:text-red-500 text-xs" title="退出登录">🚪</button>
          </div>
        </div>
      </header>

      {/* Admin sub-nav */}
      {isAdmin && (
        <nav className="bg-white border-b border-brand-100 px-5 py-2">
          <div className="flex gap-1">
            {adminNavItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-1 px-3 py-1.5 rounded-btn text-xs font-semibold transition-colors ${
                    isActive ? 'bg-brand-700 text-white' : 'text-text-secondary hover:bg-brand-50'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className="flex-1 px-5 py-4">
        <Outlet />
      </main>

      {/* Bottom nav (non-admin) */}
      {!isAdmin && (
        <nav className="sticky bottom-0 bg-surface/80 backdrop-blur-xl border-t border-brand-100 px-4 py-2">
          <div className="flex justify-around">
            {mainNavItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
                    isActive ? 'text-brand-700 bg-brand-50' : 'text-text-secondary'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-semibold">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
