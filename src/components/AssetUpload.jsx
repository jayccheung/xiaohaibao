import { useState, useRef } from 'react'

export default function AssetUpload({ label, type, value, onChange, onRemove }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    // Preview only for now; real upload to R2/OSS comes with API
    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('文件不能超过 10MB')
      return
    }

    setUploading(true)
    try {
      const url = URL.createObjectURL(file)
      onChange({ file, path: url, name: file.name })
    } catch {
      setError('参考图保存失败，请重新选择')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-brand-50 border border-brand-100">
          <img src={value.path} alt={label} className="w-full h-full object-cover" />
          <button
            onClick={() => onRemove(type)}
            className="absolute top-2 right-2 w-6 h-6 bg-black/40 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/60"
          >✕</button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-square rounded-xl border-2 border-dashed border-brand-200 bg-surface hover:bg-brand-50 hover:border-brand-400 transition-colors flex flex-col items-center justify-center gap-1"
        >
          <span className="text-2xl">{uploading ? '⏳' : '📷'}</span>
          <span className="text-xs text-text-secondary font-medium">{uploading ? '保存中...' : '点击上传'}</span>
        </button>
      )}

      <span className="text-xs text-text-secondary mt-1">{label}</span>
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  )
}
