import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const mockWorks = [
  { id: 1, title: '夏日海边', category: '生活', status: 'completed', date: '2026-08-09', ratio: '3:4' },
  { id: 2, title: '新品推广', category: '营销', status: 'completed', date: '2026-08-08', ratio: '9:16' },
  { id: 3, title: '周末分享', category: '生活', status: 'generating', date: '2026-08-10', ratio: '1:1' },
]

const filters = ['全部作品', '生活', '营销', '产品', '课程', '个人']
const statusMap = { completed: '已完成', generating: '生成中', failed: '失败' }
const statusColor = { completed: 'bg-lime-400/20 text-lime-800', generating: 'bg-orange-100 text-orange-700', failed: 'bg-red-100 text-red-700' }
const categoryIcons = { '生活': '🌴', '营销': '📢', '产品': '📦', '课程': '📚', '个人': '✨' }

export default function WorksPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('全部作品')

  const filtered = filter === '全部作品' ? mockWorks : mockWorks.filter(w => w.category === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-900">我的作品</h2>
          <p className="text-text-secondary text-sm">找回历史海报，或从上次方案继续创作</p>
        </div>
      </div>

      <button
        onClick={() => navigate('/create')}
        className="w-full py-3 rounded-btn bg-lime-400 text-text-primary font-bold text-sm hover:bg-lime-500 transition-colors"
      >✨ 创作一张新海报</button>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-btn text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === f ? 'bg-brand-700 text-white' : 'bg-brand-50 text-text-secondary hover:bg-brand-100'
          }`}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🦭</div>
          <p className="text-text-secondary">完成第一张海报后，会自动保存在这里</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(work => (
            <div key={work.id} className="bg-white rounded-card p-3 shadow-sm">
              <div className="bg-brand-50 rounded-xl flex items-center justify-center"
                style={{ aspectRatio: work.ratio === '9:16' ? '9/16' : work.ratio === '1:1' ? '1/1' : '3/4' }}>
                <span className="text-3xl">{categoryIcons[work.category] || '🖼️'}</span>
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-text-primary text-sm truncate">{work.title}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusColor[work.status]}`}>{statusMap[work.status]}</span>
                </div>
                <p className="text-text-secondary/60 text-[10px] mt-0.5">{work.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
