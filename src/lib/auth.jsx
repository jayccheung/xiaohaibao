import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 从 localStorage 恢复登录态
  useEffect(() => {
    const saved = localStorage.getItem('xiaohaibao_user')
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch { localStorage.removeItem('xiaohaibao_user') }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    const u = { ...userData, loggedAt: Date.now() }
    setUser(u)
    localStorage.setItem('xiaohaibao_user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('xiaohaibao_user')
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

// 需要登录才能访问
export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true })
  }, [user, loading, navigate])

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><span className="text-2xl animate-pulse">🦭</span></div>
  if (!user) return null
  return children
}

// 需要管理员角色
export function RequireAdmin({ children }) {
  const { user, loading, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) navigate('/login', { replace: true })
    if (!loading && user && !isAdmin) navigate('/create', { replace: true })
  }, [user, loading, isAdmin, navigate])

  if (loading) return <div className="min-h-screen bg-surface flex items-center justify-center"><span className="text-2xl animate-pulse">🦭</span></div>
  if (!user || !isAdmin) return null
  return children
}
