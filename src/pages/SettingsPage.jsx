import { useState } from 'react'

export default function SettingsPage() {
  const [deepseekKey, setDeepseekKey] = useState('')
  const [image2Key, setImage2Key] = useState('')
  const [showDeepseek, setShowDeepseek] = useState(false)
  const [showImage2, setShowImage2] = useState(false)
  const [saved, setSaved] = useState({})
  const [saving, setSaving] = useState({})

  const handleSave = async (provider) => {
    setSaving(prev => ({ ...prev, [provider]: true }))
    // TODO: connect to API /api/settings/deepseek or /api/settings/image2
    await new Promise(r => setTimeout(r, 500))
    setSaving(prev => ({ ...prev, [provider]: false }))
    setSaved(prev => ({ ...prev, [provider]: true }))
    setTimeout(() => setSaved(prev => ({ ...prev, [provider]: false })), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-900">服务设置</h2>
        <p className="text-text-secondary text-sm mt-1">会按当前账号加密保存，网页只显示脱敏尾号，不会回显原值</p>
      </div>

      {/* DeepSeek */}
      <div className="bg-white rounded-card p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧠</span>
            <div>
              <h3 className="font-bold text-brand-900">DeepSeek · 推理服务</h3>
              <p className="text-text-secondary text-xs">理解内容、判断类型、提炼文字与视觉方案</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            deepseekKey ? 'bg-lime-400/20 text-lime-800' : 'bg-brand-100 text-text-secondary'
          }`}>{deepseekKey ? '已配置' : '未配置'}</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type={showDeepseek ? 'text' : 'password'}
              value={deepseekKey}
              onChange={e => setDeepseekKey(e.target.value)}
              placeholder="DeepSeek API Key"
              className="w-full pl-4 pr-10 py-3 rounded-input border border-brand-100 bg-surface focus:outline-none focus:border-brand-500 text-sm"
            />
            <button
              onClick={() => setShowDeepseek(!showDeepseek)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-700"
            >{showDeepseek ? '🙈' : '👁️'}</button>
          </div>
          <button
            onClick={() => handleSave('deepseek')}
            disabled={!deepseekKey.trim() || saving.deepseek}
            className="px-4 py-3 rounded-btn bg-lime-400 text-text-primary font-bold text-sm hover:bg-lime-500 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {saving.deepseek ? '保存中...' : saved.deepseek ? '✅ 已保存' : '保存并启用'}
          </button>
        </div>
        <a href="https://platform.deepseek.com/sign_in" target="_blank" className="text-brand-500 text-xs underline inline-block">前往 DeepSeek 官方登录获取 Key</a>
      </div>

      {/* Image2 */}
      <div className="bg-white rounded-card p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎨</span>
            <div>
              <h3 className="font-bold text-brand-900">Image2 · 生图服务</h3>
              <p className="text-text-secondary text-xs">一次生成画面、人物、中文文字与排版</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            image2Key ? 'bg-lime-400/20 text-lime-800' : 'bg-brand-100 text-text-secondary'
          }`}>{image2Key ? '已配置' : '未配置'}</span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type={showImage2 ? 'text' : 'password'}
              value={image2Key}
              onChange={e => setImage2Key(e.target.value)}
              placeholder="Image2 API Key"
              className="w-full pl-4 pr-10 py-3 rounded-input border border-brand-100 bg-surface focus:outline-none focus:border-brand-500 text-sm"
            />
            <button
              onClick={() => setShowImage2(!showImage2)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-700"
            >{showImage2 ? '🙈' : '👁️'}</button>
          </div>
          <button
            onClick={() => handleSave('image2')}
            disabled={!image2Key.trim() || saving.image2}
            className="px-4 py-3 rounded-btn bg-lime-400 text-text-primary font-bold text-sm hover:bg-lime-500 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {saving.image2 ? '保存中...' : saved.image2 ? '✅ 已保存' : '保存并启用'}
          </button>
        </div>
        <a href="https://openapi.yiminju.xyz/login" target="_blank" className="text-brand-500 text-xs underline inline-block">前往 Image2 平台登录获取 Key</a>
      </div>

      <p className="text-text-secondary/60 text-xs text-center">由你自己配置 API Key，平台不加收生图费用</p>
    </div>
  )
}
