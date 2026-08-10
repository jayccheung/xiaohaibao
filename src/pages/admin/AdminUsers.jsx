import { useState } from 'react'

const mockUsers = [
  { id: 1, name: '张三', email: 'zhang***@qq.com', role: 'user', accessType: 'key', joinDate: '2026-08-05', generates: 12 },
  { id: 2, name: '李四', email: 'lis***@163.com', role: 'agent', accessType: 'credit', joinDate: '2026-08-06', generates: 45 },
  { id: 3, name: '王五', email: 'wang***@gmail.com', role: 'user', accessType: 'key', joinDate: '2026-08-07', generates: 3 },
  { id: 4, name: '赵六', email: 'zhao***@126.com', role: 'user', accessType: 'credit', joinDate: '2026-08-08', generates: 18 },
  { id: 5, name: '小海豹管理员', email: 'admi***@seal.com', role: 'admin', accessType: 'key', joinDate: '2026-08-04', generates: 0 },
]

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  const filtered = mockUsers.filter(u =>
    u.name.includes(search) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-brand-900">用户管理</h2>
        <p className="text-text-secondary text-xs mt-1">{filtered.length} 个账号</p>
      </div>

      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="搜索姓名或邮箱"
        className="w-full px-4 py-3 rounded-input border border-brand-100 bg-white focus:outline-none focus:border-brand-500 text-sm"
      />

      <div className="space-y-2">
        {filtered.map(user => (
          <div
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className="bg-white rounded-card p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-brand-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-text-primary text-sm">{user.name}</p>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  user.role === 'admin' ? 'bg-brand-100 text-brand-700' :
                  user.role === 'agent' ? 'bg-lime-400/30 text-lime-800' : 'bg-brand-50 text-text-secondary'
                }`}>{user.role === 'admin' ? '管理员' : user.role === 'agent' ? '代理' : '用户'}</span>
              </div>
              <p className="text-text-secondary/60 text-[11px] truncate">{user.email}</p>
              <p className="text-text-secondary/40 text-[10px]">加入 {user.joinDate} · 生成 {user.generates} 次</p>
            </div>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
              user.accessType === 'credit' ? 'bg-orange-100 text-orange-700' : 'bg-lime-400/20 text-lime-800'
            }`}>{user.accessType === 'credit' ? '积分' : '自备Key'}</span>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-t-card sm:rounded-card w-full sm:max-w-sm p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-brand-900">{selectedUser.name}</h3>
              <button onClick={() => setSelectedUser(null)} className="text-text-secondary">✕</button>
            </div>
            <dl className="space-y-2 text-sm">
              {[
                ['邮箱', selectedUser.email],
                ['角色', selectedUser.role === 'admin' ? '管理员' : selectedUser.role === 'agent' ? '代理' : '用户'],
                ['调用方式', selectedUser.accessType === 'credit' ? '积分' : '自备Key'],
                ['生成次数', selectedUser.generates + ' 次'],
                ['加入时间', selectedUser.joinDate],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-text-secondary">{label}</dt>
                  <dd className="text-text-primary font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
