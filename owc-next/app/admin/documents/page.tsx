"use client"
import { useEffect, useRef, useState } from "react"
import { Upload, Trash2, Download, FileText } from "lucide-react"
import { adminApi } from "@/lib/adminApi"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Document {
  id: number
  title: string
  category: string
  filename: string
  originalName: string
  fileSize: number
  uploadedAt: string
}

const CATEGORIES = ["Policy", "Form", "Report", "Guide", "Regulation", "Other"]

const CATEGORY_COLORS: Record<string, string> = {
  Policy: "bg-blue-50 text-blue-700",
  Form: "bg-red-50 text-red-800",
  Report: "bg-purple-50 text-purple-700",
  Guide: "bg-emerald-50 text-emerald-700",
  Regulation: "bg-orange-50 text-orange-700",
  Other: "bg-gray-100 text-gray-600",
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PDFManager() {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const load = () => {
    adminApi.getDocuments()
      .then(r => r.json())
      .then(d => setDocs(d.documents || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    if (f && !title) setTitle(f.name.replace(/\.pdf$/i, ""))
  }

  const handleUpload = async () => {
    if (!file || !title.trim()) { setError("Please select a file and enter a title."); return }
    setError("")
    setUploading(true)
    try {
      const res = await adminApi.uploadDocument(file, title.trim(), category)
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || "Upload failed")
      } else {
        setTitle("")
        setCategory(CATEGORIES[0])
        setFile(null)
        if (inputRef.current) inputRef.current.value = ""
        load()
      }
    } catch {
      setError("Could not connect to server")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    await adminApi.deleteDocument(id)
    setDocs(prev => prev.filter(d => d.id !== id))
  }

  const grouped = CATEGORIES.reduce<Record<string, Document[]>>((acc, cat) => {
    acc[cat] = docs.filter(d => d.category === cat)
    return acc
  }, {})

  return (
    <AdminLayout>
      <div className="w-full space-y-6 pb-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-400 text-sm mt-1.5">{docs.length} PDF resources</p>
        </div>

        {/* Upload panel */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-sm font-bold text-gray-700 mb-5">Upload New PDF</h2>
          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Document Title *</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Claims Application Form 2025" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-10"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <div
              className="flex-1 border-2 border-dashed border-gray-200 rounded-xl px-5 py-3.5 text-sm hover:border-gray-400 cursor-pointer transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              {file
                ? <span className="text-gray-800 font-medium">{file.name} <span className="text-gray-400 font-normal">({formatBytes(file.size)})</span></span>
                : <span className="text-gray-400">Click to select a PDF file…</span>
              }
            </div>
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            <Button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="flex items-center gap-2 shrink-0 h-auto px-5"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </div>
        </div>

        {/* Document list */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(210,70%,25%)] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading documents…</p>
          </div>
        ) : docs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No documents uploaded yet</p>
            <p className="text-gray-400 text-sm mt-1">Use the panel above to upload your first PDF</p>
          </div>
        ) : (
          <div className="space-y-5">
            {CATEGORIES.filter(cat => grouped[cat]?.length > 0).map(cat => (
              <div key={cat}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLORS[cat]}`}>{cat}</span>
                  <span className="text-xs text-gray-400">{grouped[cat].length} document{grouped[cat].length !== 1 ? "s" : ""}</span>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                  {grouped[cat].map(doc => (
                    <div key={doc.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{doc.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {doc.originalName} · {formatBytes(doc.fileSize)} ·{" "}
                          {new Date(doc.uploadedAt).toLocaleDateString("en-PG", { year: "numeric", month: "short", day: "numeric" })}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={`/uploads/documents/${doc.filename}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
