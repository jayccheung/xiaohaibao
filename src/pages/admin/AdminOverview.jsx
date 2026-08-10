import { useState } from 'react'

const mockTrend = [
  { date: '08-04', dau: 12, newUsers: 3, generates: 28 },
  { date: '08-05', dau: 18, newUsers: 5, generates: 42 },
  { date: '08-06', dau: 15, newUsers: 2, generates: 35 },
  { date: '08-07', dau: 22, newUsers: 7, generates: 55 },
  { date: '08-08', dau: 28, newUsers: 9, generates: 68 },
  { date: '08-09', dau: 25, newUsers: 4, generates: 60 },
  { date: '08-10', dau: 31, newUsers: 11, generates: 75 },
]

const failureReasons = [
  { reason: '用户 API Key 无效', count: 8 },
  { reason: 'Image2 服务超时', count: 5 },
  { reason: '内容审核未通过', count: 3 },
  { reason: '参考图格式不支持', count: 2 },
  { reason: '其他错误', count: 1 },
]

export default function AdminOverview() {
  const [timeRange, setTimeRange] = useState('7d')
  const maxVal = Math.max(...mockTrend.map(d => d.generates), 1)

  const today = mockTrend[mockTrend.length - 1]

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-brand-900">运营概览</h2>
        <p className="text-text-secondary text-xs mt-1">数据均以北京时间自然日计算</p>
      </div>

      {/* Today snapshot */}
      <div className="bg-white rounded-card p-5 shadow-sm">
        <p className="text-xs font-semibold text-text-secondary mb-3">今日核心指标</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '今日活跃用户', value: today.dau, unit: '人' },
            { label: '今日新增用户', value: today.newUsers, unit: '人' },
            { label: '今日生成次数', value: today.generates, unit: '次' },
            { label: '今日成功率', value: '92', unit: '%' },
          ].map(item => (
            <div key={item.label} className="bg-brand-50 rounded-xl p-3">
              <p className="text-text-secondary text-[10px]">{item.label}</p>
              <p className="text-2xl font-extrabold text-brand-700 mt-1">{item.value}<span className="text-sm font-medium text-text-secondary ml-0.5">{item.unit}</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* Trend chart */}
      <div className="bg-white rounded-card p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-text-secondary">用户与生成趋势</p>
          <div className="flex gap-1">
            {['7d', '14d', '30d'].map(r => (
              <button key={r} onClick={() => setTimeRange(r)} className={`px-3 py-1 rounded-btn text-[10px] font-semibold ${
                timeRange === r ? 'bg-brand-700 text-white' : 'bg-brand-50 text-text-secondary'
              }`}>{r}</button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-1 h-32">
          {mockTrend.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: '100px' }}>
                <div className="w-full bg-brand-500 rounded-t-sm transition-all"
                  style={{ height: (d.generates / maxVal * 80) + 'px', opacity: 0.3 + (d.generates / maxVal * 0.7) }}></div>
              </div>
              <span className="text-[9px] text-text-secondary/60">{d.date.split('-').pop()}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-brand-500"></span> 生成次数</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-lime-400"></span> 日活用户</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-brand-300"></span> 新增用户</span>
        </div>
      </div>

      {/* Failure analysis */}
      <div className="bg-white rounded-card p-5 shadow-sm">
        <p className="text-xs font-semibold text-text-secondary mb-3">最近 7 天失败原因分布</p>
        {failureReasons.map((f, i) => (
          <div key={i} className="flex items-center gap-3 mb-2">
            <span className="text-xs text-text-secondary w-28 truncate">{f.reason}</span>
            <div className="flex-1 bg-brand-50 rounded-full h-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-400 rounded-full"
                style={{ width: (f.count / failureReasons[0].count * 100) + '%', opacity: 1 - i * 0.15 }}></div>
            </div>
            <span className="text-xs font-semibold text-text-primary w-6 text-right">{f.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
