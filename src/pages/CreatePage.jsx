import { useState } from 'react'
import AssetUpload from '../components/AssetUpload'

const STEPS = ['输入内容', '确认方案', '生成海报']
const CATEGORIES = ['生活', '营销', '产品', '课程', '个人']
const RATIOS = ['1:1', '3:4', '9:16']
const QR_POSITIONS = ['右下角', '左下角', '右侧中部', '不需要留白']

export default function CreatePage() {
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState('copy')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('生活')
  const [ratio, setRatio] = useState('3:4')
  const [assets, setAssets] = useState({ person: null, product: null, logo: null })
  const [qrPosition, setQrPosition] = useState('右下角')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [planTexts, setPlanTexts] = useState(['', '', ''])
  const [planCategory, setPlanCategory] = useState('')
  const [planDirection, setPlanDirection] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  const handleAssetChange = (type, data) => {
    setAssets(prev => ({ ...prev, [type]: data }))
  }

  const handleAssetRemove = (type) => {
    setAssets(prev => ({ ...prev, [type]: null }))
  }

  const handleNext = () => {
    if (step === 1) {
      if (!content.trim()) return
      setAnalyzing(true)
      // Simulate DeepSeek analysis
      setTimeout(() => {
        setAnalyzing(false)
        setPlanCategory(category)
        setPlanDirection('暖色调海边氛围，人物自然站位，文字排版居右上')
        setPlanTexts(content.split('\n').slice(0, 3).map(l => l.substring(0, 30) || '示例文字'))
        setStep(2)
      }, 1500)
    } else if (step === 2) {
      setStep(3)
      setGenerating(true)
      setTimeout(() => { setGenerating(false); setResult('done') }, 4000)
    }
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i + 1 < step ? 'bg-lime-400 text-text-primary' :
              i + 1 === step ? 'bg-brand-700 text-white' :
              'bg-brand-100 text-text-secondary'
            }`}>
              {i + 1 < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-semibold hidden sm:inline ${
              i + 1 === step ? 'text-brand-700' : 'text-text-secondary'
            }`}>{s}</span>
            {i < 2 && <div className="w-6 h-px bg-brand-200" />}
          </div>
        ))}
      </div>

      {/* Step 1: Input */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-900">输入你想表达的内容</h2>
          <p className="text-text-secondary text-sm">不需要会写提示词，每一步都看得懂、改得了</p>

          {/* Mode toggle */}
          <div className="flex bg-brand-50 rounded-btn p-1">
            <button onClick={() => setMode('copy')} className={`flex-1 py-2 rounded-btn text-sm font-semibold transition-colors ${
              mode === 'copy' ? 'bg-white text-brand-700 shadow-sm' : 'text-text-secondary'
            }`}>根据朋友圈文案配图</button>
            <button onClick={() => setMode('describe')} className={`flex-1 py-2 rounded-btn text-sm font-semibold transition-colors ${
              mode === 'describe' ? 'bg-white text-brand-700 shadow-sm' : 'text-text-secondary'
            }`}>直接描述想要的图片</button>
          </div>

          <textarea
            value={content} onChange={e => setContent(e.target.value)}
            placeholder={mode === 'copy' ? '粘贴你准备发布的朋友圈文案' : '例如：我想要一张竖版海边生活照，人物自然地走在沙滩上'}
            rows={5}
            className="w-full px-4 py-3 rounded-card border border-brand-100 bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm resize-none"
          />

          {/* Category */}
          <div>
            <p className="text-sm font-semibold text-text-secondary mb-2">内容分类</p>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-btn text-sm font-semibold transition-colors ${
                  category === c ? 'bg-brand-700 text-white' : 'bg-brand-50 text-text-secondary hover:bg-brand-100'
                }`}>{c}</button>
              ))}
            </div>
          </div>

          {/* Ratio */}
          <div>
            <p className="text-sm font-semibold text-text-secondary mb-2">海报比例</p>
            <div className="flex gap-2">
              {RATIOS.map(r => (
                <button key={r} onClick={() => setRatio(r)} className={`px-4 py-2 rounded-btn text-sm font-semibold transition-colors ${
                  ratio === r ? 'bg-brand-700 text-white' : 'bg-brand-50 text-text-secondary hover:bg-brand-100'
                }`}>{r}</button>
              ))}
            </div>
          </div>

          {/* Reference image upload */}
          <div>
            <p className="text-sm font-semibold text-text-secondary mb-2">添加参考素材 <span className="text-text-secondary/50 font-normal">全部可选</span></p>
            <div className="grid grid-cols-3 gap-3">
              <AssetUpload label="人物参考图" type="person" value={assets.person} onChange={handleAssetChange} onRemove={handleAssetRemove} />
              <AssetUpload label="产品/课程封面" type="product" value={assets.product} onChange={handleAssetChange} onRemove={handleAssetRemove} />
              <AssetUpload label="品牌 Logo" type="logo" value={assets.logo} onChange={handleAssetChange} onRemove={handleAssetRemove} />
            </div>
            <p className="text-xs text-text-secondary/60 mt-2">参考图会按当前账号保存，下次创作自动恢复；生成时会与方案一起交给 Image2</p>
          </div>

          <button
            onClick={handleNext}
            disabled={!content.trim() || analyzing}
            className="w-full py-3 rounded-btn bg-lime-400 text-text-primary font-bold text-base hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? '🦭 正在理解内容...' : '生成海报方案，进入第 2 步'}
          </button>
        </div>
      )}

      {/* Step 2: Confirm plan */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-brand-900">确认方案，没有问题再生成</h2>
          <p className="text-text-secondary text-sm">DeepSeek 负责策划，Image2 负责一次生成完整海报</p>

          <div className="bg-white rounded-card p-5 shadow-sm space-y-4">
            {/* Detected type */}
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-1">已识别为 {planCategory}类内容</p>
            </div>

            {/* Visual direction */}
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-1">画面方向</p>
              <textarea value={planDirection} onChange={e => setPlanDirection(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-input border border-brand-100 bg-surface focus:outline-none focus:border-brand-500 text-sm resize-none" />
            </div>

            {/* Poster text */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-text-secondary">必须出现的文字</p>
                <button onClick={() => setPlanTexts([...planTexts, ''])} className="text-brand-500 text-xs font-semibold">+ 添加</button>
              </div>
              {planTexts.map((t, i) => (
                <div key={i} className="flex gap-1 mb-2">
                  <input value={t} onChange={e => { const nt = [...planTexts]; nt[i] = e.target.value; setPlanTexts(nt) }} className="flex-1 px-3 py-2 rounded-input border border-brand-100 bg-surface focus:outline-none focus:border-brand-500 text-sm" />
                  {planTexts.length > 1 && <button onClick={() => setPlanTexts(planTexts.filter((_, j) => j !== i))} className="text-red-400 text-sm px-2">✕</button>}
                </div>
              ))}
            </div>

            {/* QR placement */}
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-1">二维码留白位置</p>
              <select value={qrPosition} onChange={e => setQrPosition(e.target.value)} className="w-full px-3 py-2 rounded-input border border-brand-100 bg-surface focus:outline-none focus:border-brand-500 text-sm">
                {QR_POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-btn border-2 border-brand-200 text-text-secondary font-semibold text-sm hover:bg-brand-50 transition-colors">返回修改</button>
            <button onClick={handleNext} className="flex-1 py-3 rounded-btn bg-lime-400 text-text-primary font-bold text-sm hover:bg-lime-500 transition-colors">确认方案，生成完整海报</button>
          </div>
        </div>
      )}

      {/* Step 3: Generate */}
      {step === 3 && (
        <div className="text-center space-y-6">
          <h2 className="text-xl font-bold text-brand-900">生成朋友圈海报</h2>

          {generating ? (
            <div className="bg-white rounded-card p-8 shadow-sm">
              <div className="text-6xl mb-4 animate-bounce">🦭</div>
              <p className="text-brand-700 font-semibold">Image2 正在生成完整海报</p>
              <div className="text-text-secondary text-sm mt-3 space-y-1">
                <p>正在整理完整海报提示词</p>
                <p>正在上传参考图</p>
                <p>正在生成完整海报</p>
                <p>正在保存生成结果</p>
              </div>
              <button className="mt-4 px-6 py-2 rounded-btn border-2 border-brand-200 text-text-secondary text-sm font-semibold">放到后台，去做其他事情</button>
            </div>
          ) : (
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="text-5xl mb-3">🦭✨</div>
              <p className="text-brand-700 font-bold text-lg">你的完整海报已生成</p>
              <p className="text-text-secondary text-sm mt-1">画面、人物、文字和排版已由 Image2 一次生成</p>
              <div className="mt-4 bg-gradient-to-br from-brand-50 to-lime-100 rounded-card aspect-[3/4] flex items-center justify-center text-text-secondary">海报预览区</div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => { setStep(1); setResult(null) }} className="flex-1 py-3 rounded-btn border-2 border-brand-200 text-text-secondary font-semibold text-sm">修改要求并重新生成</button>
                <button className="flex-1 py-3 rounded-btn bg-lime-400 text-text-primary font-bold text-sm">下载高清海报</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
