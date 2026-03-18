import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, CheckCircle, AlertCircle, Layers, Eye, EyeOff, ChevronUp, ChevronDown, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminLayout from "@/components/admin/AdminLayout"
import { adminApi } from "@/lib/adminApi"

interface Slide {
  id: number; badge: string; title: string; subtitle: string; image: string
  ctaLabel: string; ctaHref: string; ctaExternal: boolean
  secondaryLabel: string; secondaryHref: string
  published: boolean; position: number
}

interface MediaImage { filename: string; url: string; size: number; uploadedAt: string }

type Toast = { type: "success" | "error"; msg: string } | null

const EMPTY = {
  badge: "", title: "", subtitle: "", image: "",
  ctaLabel: "Learn More", ctaHref: "/", ctaExternal: false,
  secondaryLabel: "", secondaryHref: "/", published: true,
}

function ImagePickerModal({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [images, setImages] = useState<MediaImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getImages()
      .then(r => r.json())
      .then(d => setImages(d.images ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Choose from Media Library</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(210,70%,25%)] rounded-full animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16">
              <ImageIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No images uploaded yet</p>
              <p className="text-gray-400 text-sm mt-1">Upload images in the Media Library first</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map(img => (
                <button
                  key={img.filename}
                  onClick={() => { onSelect(img.url); onClose() }}
                  className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100 border-2 border-transparent hover:border-[hsl(210,70%,25%)] transition-all focus:outline-none focus:border-[hsl(210,70%,25%)]"
                >
                  <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.filename}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HeroSlidesManager() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Slide | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [toast, setToast] = useState<Toast>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const load = () => {
    setLoading(true)
    adminApi.getHeroSlides().then(r => r.json()).then(d => setSlides(d.slides ?? [])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }
  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) => setForm(p => ({ ...p, [k]: v }))

  const startCreate = () => { setForm({ ...EMPTY }); setEditing(null); setCreating(true) }
  const startEdit = (s: Slide) => {
    setForm({ badge: s.badge, title: s.title, subtitle: s.subtitle, image: s.image, ctaLabel: s.ctaLabel, ctaHref: s.ctaHref, ctaExternal: s.ctaExternal, secondaryLabel: s.secondaryLabel, secondaryHref: s.secondaryHref, published: s.published })
    setEditing(s); setCreating(false)
  }
  const cancel = () => { setCreating(false); setEditing(null) }

  const toPayload = () => ({ ...form, ctaExternal: form.ctaExternal ? 1 : 0, published: form.published ? 1 : 0 })

  const save = async () => {
    if (!form.title.trim()) {
      showToast("error", "Title is required.")
      return
    }
    setSaving(true)
    try {
      const res = editing
        ? await adminApi.updateHeroSlide(editing.id, toPayload())
        : await adminApi.createHeroSlide(toPayload())
      if (res.ok) {
        showToast("success", editing ? "Slide updated." : "Slide created.")
        cancel(); load()
      } else {
        const body = await res.json().catch(() => ({}))
        showToast("error", (body as { error?: string }).error ?? `HTTP ${res.status} — save failed.`)
      }
    } catch {
      showToast("error", "Network error. Is the server running?")
    } finally { setSaving(false) }
  }

  const togglePublish = async (s: Slide) => {
    await adminApi.updateHeroSlide(s.id, { published: s.published ? 0 : 1 })
    load()
  }

  const confirmDelete = async () => {
    if (deleteId == null) return
    try {
      const res = await adminApi.deleteHeroSlide(deleteId)
      if (res.ok) { showToast("success", "Slide deleted."); load() }
      else showToast("error", "Delete failed — try again.")
    } catch {
      showToast("error", "Network error.")
    }
    setDeleteId(null)
  }

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= slides.length) return
    const reordered = [...slides]
    ;[reordered[i], reordered[j]] = [reordered[j], reordered[i]]
    setSlides(reordered)
    await adminApi.reorderHeroSlides(reordered.map(s => s.id))
  }

  const published = slides.filter(s => s.published).length

  return (
    <AdminLayout>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}
      {deleteId != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80">
            <p className="font-semibold text-gray-900 mb-1">Delete slide?</p>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="destructive" className="flex-1" onClick={confirmDelete}>Delete</Button>
              <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
      {pickerOpen && (
        <ImagePickerModal onSelect={url => set("image", url)} onClose={() => setPickerOpen(false)} />
      )}

      <div className="w-full space-y-6 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
            <p className="text-gray-400 text-sm mt-1.5">{slides.length} total · {published} published · shown on the homepage carousel</p>
          </div>
          {!creating && !editing && (
            <Button onClick={startCreate} className="flex items-center gap-2 h-10 px-5">
              <Plus className="w-4 h-4" /> Add Slide
            </Button>
          )}
        </div>

        {(creating || editing) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-700">{editing ? "Edit Slide" : "New Slide"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Badge / Tag</label>
                <Input value={form.badge} onChange={e => set("badge", e.target.value)} placeholder="Official Government Agency" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Title *</label>
                <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Protecting PNG's Workforce" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subtitle</label>
                <textarea rows={2} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={form.subtitle} onChange={e => set("subtitle", e.target.value)} placeholder="Short description…" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Background Image</label>
                <div className="flex gap-2">
                  <Input value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://… or choose from library" className="flex-1" />
                  <Button type="button" variant="outline" onClick={() => setPickerOpen(true)} className="flex items-center gap-2 shrink-0">
                    <ImageIcon className="w-4 h-4" /> Library
                  </Button>
                </div>
                {form.image && (
                  <div className="mt-3 relative inline-block">
                    <img src={form.image} alt="" className="h-28 rounded-xl object-cover border border-gray-100" />
                    <button type="button" onClick={() => set("image", "")} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Primary Button Label</label>
                <Input value={form.ctaLabel} onChange={e => set("ctaLabel", e.target.value)} placeholder="File a Claim" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Primary Button URL</label>
                <Input value={form.ctaHref} onChange={e => set("ctaHref", e.target.value)} placeholder="/services or https://portal.owc.gov.pg" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Secondary Button Label</label>
                <Input value={form.secondaryLabel} onChange={e => set("secondaryLabel", e.target.value)} placeholder="Learn More" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Secondary Button URL</label>
                <Input value={form.secondaryHref} onChange={e => set("secondaryHref", e.target.value)} placeholder="/about" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input type="checkbox" checked={form.ctaExternal} onChange={e => set("ctaExternal", e.target.checked)} className="rounded" />
                Primary button opens in new tab
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)} className="rounded" />
                Published
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving || !form.title.trim()} className="flex items-center gap-2">
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Slide"}
              </Button>
              <Button variant="outline" onClick={cancel} className="flex items-center gap-2">
                <X className="w-4 h-4" /> Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(210,70%,25%)] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading slides…</p>
            </div>
          ) : slides.length === 0 ? (
            <div className="p-16 text-center">
              <Layers className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No slides yet</p>
              <p className="text-gray-400 text-sm mt-1">Click "Add Slide" to get started.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[auto_1fr_auto_auto] border-b border-gray-100 bg-gray-50/60 px-6">
                <div className="py-3.5 pr-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slide</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">Status</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</div>
              </div>
              <div className="divide-y divide-gray-50">
                {slides.map((s, i) => (
                  <div key={s.id} className={`grid grid-cols-[auto_1fr_auto_auto] items-center px-6 py-4 hover:bg-gray-50/60 transition-colors ${!s.published ? "opacity-60" : ""}`}>
                    <div className="flex flex-col gap-1 pr-3">
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
                        <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <button onClick={() => move(i, 1)} disabled={i === slides.length - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 min-w-0 pr-4">
                      {s.image ? (
                        <img src={s.image} alt="" className="w-20 h-14 rounded-xl object-cover shrink-0 bg-gray-100" />
                      ) : (
                        <div className="w-20 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <Layers className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        {s.badge && <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{s.badge}</div>}
                        <div className="font-semibold text-gray-900 text-sm leading-snug mt-0.5 line-clamp-1">{s.title}</div>
                        {s.subtitle && <div className="text-xs text-gray-400 mt-1 line-clamp-1">{s.subtitle}</div>}
                      </div>
                    </div>
                    <div className="px-4">
                      {s.published ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                          <Eye className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                          <EyeOff className="w-3 h-3" /> Hidden
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => togglePublish(s)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors" title={s.published ? "Hide" : "Publish"}>
                        {s.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => startEdit(s)} className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-[hsl(210,70%,25%)] transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(s.id)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
