import { useState } from 'react'

const mockCodes = [
  { id: 1, code: 'SEAL***A1B2', note: '8月内测用户', status: 'used', usedBy: '张三', usedAt: '2026-08-05', maxUses: 1, used: 1 },
  { id: 2, code: 'SEAL***C3D4', note: '朋友圈KOL', status: 'active', usedBy: null, usedAt: null, maxUses: 5, used: 2 },
  { id: 3, code: 'SEAL***E5F6', note: '种子用户', status: 'active', usedBy: null, usedAt: null, maxUses: 10, used: 0 },
  { id: 4, code: 'SEAL***G7H8', note: '合作伙伴', status: 'revoked', usedBy: null, usedAt: null, maxUses: 3, used: 0 },
]

export default function AdminInviteCodes() {
  const [showGenerate, setShowGenerate] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [newCount, setNewCount] = useState(1)
  const [generatedCode, setGeneratedCode] = useState(null)
  const [codes, setCodes] = useState(mockCodes)

  const handleGenerate = () => {
    const code = 'SEAL-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    setGeneratedCode(code)
    // In production, this would come from the API and only show once
  }

  const handleDelete = (id) => {
    setCodes(codes.filter(c => c.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-brand-900">暗号管理</h2>
          <p className="text-text-secondary text-xs mt-1">{codes.length} 个暗号</p>
        </div>
        <button onClick={() => setShowGenerate(true)} className="px-4 py-2 rounded-btn bg-lime-400 text-text-primary font-bold text-sm hover:bg-lime-500 transition-colors">
          + 生成暗号
        </button>
      </div>

      {/* Code list */}
      <div className="space-y-2">
        {codes.map(c => (
          <div key={c.id} className="bg-white rounded-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono font-bold text-brand-700 text-sm">{c.code}</p>
                <p className="text-text-secondary text-xs mt-0.5">{c.note}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  c.status === 'active' ? 'bg-lime-400/20 text-lime-800' :
                  c.status === 'used' ? 'bg-brand-100 text-text-secondary' : 'bg-red-100 text-red-700'
                }`}>
                  {c.status === 'active' ? '可用' : c.status === 'used' ? '已用完' : '已撤销'}
                </span>
                {c.status === 'active' && (
                  <button onClick={() => handleDelete(c.id)} className="text-red-400 text-xs hover:text-red-600">撤销</button>
                )}
              </div>
            </div>
            <div className="mt-2 flex items-center gap-4 text-[11px] text-text-secondary/60">
              <span>使用 {c.used}/{c.maxUses}</span>
              {c.usedBy && <span>最近：{c.usedBy}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Generate modal */}
      {showGenerate && !generatedCode && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowGenerate(false)}>
          <div className="bg-white rounded-t-card sm:rounded-card w-full sm:max-w-sm p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-brand-900 mb-4">生成新暗号</h3>
            <div className="space-y-3">
              <input
                value={newNote} onChange={e => setNewNote(e.target.value)}
                placeholder="用途备注，例如：8月内测用户"
                className="w-full px-4 py-3 rounded-input border border-brand-100 bg-surface focus:outline-none focus:border-brand-500 text-sm"
              />
              <div>
                <p className="text-xs text-text-secondary mb-1">可用次数</p>
                <div className="flex gap-2">
                  {[1, 5, 10, 50].map(n => (
                    <button key={n} onClick={() => setNewCount(n)} className={`px-3 py-1.5 rounded-btn text-xs font-semibold ${
                      newCount === n ? 'bg-brand-700 text-white' : 'bg-brand-50 text-text-secondary'
                    }`}>{n}次</button>
                  ))}
                </div>
              </div>
              <button onClick={handleGenerate} className="w-full py-3 rounded-btn bg-lime-400 text-text-primary font-bold text-sm">生成暗号</button>
            </div>
          </div>
        </div>
      )}

      {/* Generated code reveal */}
      {generatedCode && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-card sm:rounded-card w-full sm:max-w-sm p-6 shadow-xl">
            <div className="text-center space-y-3">
              <span className="text-4xl">🦭</span>
              <h3 className="font-bold text-brand-900">暗号已生成</h3>
              <p className="text-text-secondary text-xs">暗号明文只在创建成功时出现一次，请立即复制</p>
              <div className="bg-brand-50 rounded-xl py-3 px-4 font-mono font-bold text-brand-700 text-lg tracking-wider">{generatedCode}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => { navigator.clipboard.writeText(generatedCode) }}
                  className="flex-1 py-2 rounded-btn bg-brand-100 text-brand-700 font-semibold text-sm"
                >复制暗号</button>
                <button
                  onClick={() => { setShowGenerate(false); setGeneratedCode(null); setNewNote('') }}
                  className="flex-1 py-2 rounded-btn bg-lime-400 text-text-primary font-bold text-sm"
                >完成</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
