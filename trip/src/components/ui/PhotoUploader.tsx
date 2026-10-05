import { useState, useRef, useCallback } from 'react'
import { photoUrl } from '../../lib/photoUrl'
import { uploadPhoto, deletePhoto } from '../../lib/uploadPhoto'
import type { Category } from '../../data/types'

interface PhotoUploaderProps {
  photos: string[]
  onChange: (photos: string[]) => void
  category: Category
}

interface UploadingFile {
  id: string
  name: string
  progress: number
  preview: string
}

const MAX_PHOTOS = 6
const ACCEPT = 'image/jpeg,image/png,image/webp'

function PhotoUploader({ photos, onChange, category }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const canUpload = uploading.length === 0 && photos.length < MAX_PHOTOS

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const remaining = MAX_PHOTOS - photos.length
    const toUpload = Array.from(files).slice(0, remaining)

    const newUploading: UploadingFile[] = toUpload.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      progress: 0,
      preview: URL.createObjectURL(file),
    }))

    setUploading((prev) => [...prev, ...newUploading])

    for (const item of newUploading) {
      const file = toUpload.find((f) => f.name === item.name)!
      try {
        const path = await uploadPhoto(file, category)
        onChange([...photos, path])
      } catch (err) {
        console.error('Upload failed:', err)
      } finally {
        setUploading((prev) => prev.filter((u) => u.id !== item.id))
        URL.revokeObjectURL(item.preview)
      }
    }
  }, [photos, category, onChange])

  const handleDelete = async (index: number) => {
    const path = photos[index]
    const isUserUpload = path.match(/^[0-9a-f]{8}-/)
    onChange(photos.filter((_, i) => i !== index))
    if (isUserUpload) {
      try {
        await deletePhoto(path)
      } catch {
        // silently ignore — photo may have been deleted already
      }
    }
  }

  const handleMove = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= photos.length) return
    const next = [...photos]
    ;[next[index], next[newIndex]] = [next[newIndex], next[index]]
    onChange(next)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (canUpload) handleFiles(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (canUpload) setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  return (
    <div className="flex flex-col gap-3">
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-3 max-[640px]:grid-cols-3">
          {photos.map((path, i) => (
            <div key={path} className="relative group">
              <img
                src={photoUrl(path)}
                alt=""
                className="w-full aspect-square object-cover rounded-[12px] border border-border"
              />

              <button
                type="button"
                onClick={() => handleDelete(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-red-500/90 text-white rounded-full text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
                title="Delete photo"
              >
                &times;
              </button>

              <div className="flex gap-1 mt-1.5">
                <button
                  type="button"
                  onClick={() => handleMove(i, -1)}
                  disabled={i === 0}
                  className="flex-1 py-1 text-[11px] text-muted bg-bg border border-border rounded-[8px] cursor-pointer hover:border-teal-mid disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move left"
                >
                  &larr;
                </button>
                <span className="flex-1 py-1 text-[10px] text-muted-light text-center">
                  {i + 1}/{photos.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleMove(i, 1)}
                  disabled={i === photos.length - 1}
                  className="flex-1 py-1 text-[11px] text-muted bg-bg border border-border rounded-[8px] cursor-pointer hover:border-teal-mid disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Move right"
                >
                  &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading.length > 0 && (
        <div className="grid grid-cols-4 gap-3 max-[640px]:grid-cols-3">
          {uploading.map((u) => (
            <div key={u.id} className="relative">
              <img
                src={u.preview}
                alt={u.name}
                className="w-full aspect-square object-cover rounded-[12px] border border-border opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-teal-mid border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-[10px] text-muted-light text-center mt-1 truncate">{u.name}</p>
            </div>
          ))}
        </div>
      )}

      {canUpload && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed rounded-[14px] cursor-pointer transition-colors ${
            dragOver
              ? 'border-teal-mid bg-teal-light/30'
              : 'border-border hover:border-teal-mid/50'
          }`}
        >
          <svg className="w-8 h-8 text-muted-light mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <p className="text-[13px] text-muted font-medium">
            Click or drag photos here to upload
          </p>
          <p className="text-[11px] text-muted-light mt-1">
            {photos.length}/{MAX_PHOTOS} photos &middot; JPG, PNG, WebP
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
    </div>
  )
}

export default PhotoUploader
