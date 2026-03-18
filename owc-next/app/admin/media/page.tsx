"use client"
import { useEffect, useRef, useState } from "react"
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from "lucide-react"
import { adminApi } from "@/lib/adminApi"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"

interface ImageItem {
  filename: string
  url: string
  size: number
  uploadedAt: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaLibrary() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [selected, setSelected] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = () => {
    adminApi.getImages()
      .then(r => r.json())
      .then(d => setImages(d.images || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError("")
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const res = await adminApi.uploadImage(file)
        if (!res.ok) {
          const d = await res.json()
          setError(d.error || "Upload failed")
          break
        }
      }
      load()
    } catch {
      setError("Could not connect to server")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleDelete = async (filename: string) => {
    if (!confirm(`Delete ${filename}?`)) return
    await adminApi.deleteImage(filename)
    setImages(prev => prev.filter(i => i.filename !== filename))
    if (selected === filename) setSelected(null)
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <AdminLayout>
      <div className="w-full space-y-6 pb-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
            <p className="text-gray-400 text-sm mt-1.5">{images.length} images uploaded</p>
          </div>
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              className="hidden"
              onChange={e => handleUpload(e.target.files)}
            />
            <Button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 h-10 px-5"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading…" : "Upload Images"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-5 py-3">{error}</div>
        )}

        {/* Drop zone */}
        <div
          className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-[hsl(210,70%,50%)] hover:bg-[hsl(210,70%,99%)] transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files) }}
        >
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-600 mb-1">Drag & drop images here</p>
          <p className="text-xs text-gray-400">or click to browse · JPG, PNG, GIF, WEBP · max 10 MB each</p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-white rounded-2xl border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <ImageIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No images yet</p>
            <p className="text-gray-400 text-sm mt-1">Upload your first image above</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map(img => (
              <div
                key={img.filename}
                className={`bg-white rounded-2xl border overflow-hidden group cursor-pointer transition-all ${
                  selected === img.filename ? "border-[hsl(210,70%,40%)] ring-2 ring-[hsl(210,70%,40%)]/20" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelected(selected === img.filename ? null : img.filename)}
              >
                <div className="aspect-square bg-gray-50 relative">
                  <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); copyUrl(img.url) }}
                      className="p-2.5 bg-white rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                      title="Copy URL"
                    >
                      {copied === img.url ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(img.filename) }}
                      className="p-2.5 bg-white rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="px-3 py-3 border-t border-gray-200">
                  <p className="text-xs text-gray-700 font-medium truncate">{img.filename}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatBytes(img.size)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected image detail panel */}
        {selected && (() => {
          const img = images.find(i => i.filename === selected)
          if (!img) return null
          return (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-6 items-start">
              <img src={img.url} alt={img.filename} className="w-32 h-32 rounded-xl object-cover border border-gray-200 shrink-0" />
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Filename</p>
                  <p className="text-sm font-medium text-gray-900">{img.filename}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">URL</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 truncate text-gray-700">{img.url}</code>
                    <button
                      onClick={() => copyUrl(img.url)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
                    >
                      {copied === img.url ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">Size</p>
                    <p className="font-medium text-gray-700">{formatBytes(img.size)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Uploaded</p>
                    <p className="font-medium text-gray-700">
                      {new Date(img.uploadedAt).toLocaleDateString("en-PG", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </AdminLayout>
  )
}
