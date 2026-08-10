import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function LoginPage() {
  const [mode, setMode] = useState('login')  // login | register
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('请填写邮箱和密码'); return }
    if (mode === 'register' && !name) { setError('请填写你的称呼'); return }
    // 模拟登录/注册（后续接入 real auth）
    const userData = {
      id: 'u_' + Date.now(),
      email,
      name: name || email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'user',
    }
    login(userData)
    navigate('/create')
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-5">
      {/* Brand */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-4xl mx-auto mb-4">
          🦭
        </div>
        <h1 className="text-3xl font-extrabold text-brand-900">小海豹</h1>
        <p className="text-text-secondary mt-2 text-lg">一次生成完整海报</p>
        <p className="text-text-secondary/60 text-sm mt-1">把朋友圈内容，变成一张能直接发布的图</p>
      </div>

      {/* Form card */}
      <div className="w-full max-w-sm bg-white rounded-card shadow-sm p-6">
        {/* Mode tabs */}
        <div className="flex mb-6 bg-brand-50 rounded-btn p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-btn text-sm font-semibold transition-colors ${
              mode === 'login' ? 'bg-white text-brand-700 shadow-sm' : 'text-text-secondary'
            }`}
          >登录</button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-btn text-sm font-semibold transition-colors ${
              mode === 'register' ? 'bg-white text-brand-700 shadow-sm' : 'text-text-secondary'
            }`}
          >注册</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">你的称呼</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="怎么称呼你？"
                className="w-full px-4 py-3 rounded-input border border-brand-100 bg-surface focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">邮箱</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-input border border-brand-100 bg-surface focus:outline-none focus:border-brand-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">密码</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-input border border-brand-100 bg-surface focus:outline-none focus:border-brand-500 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button type="submit" className="w-full py-3 rounded-btn bg-brand-700 text-white font-bold text-sm hover:bg-brand-900 transition-colors">
            {mode === 'login' ? '登录' : '注册'}
          </button>

          {mode === 'login' && (
            <p className="text-xs text-text-secondary text-center">
              演示提示：用 <code className="bg-brand-50 px-1 rounded">admin@seal.com</code> 可进管理后台
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
