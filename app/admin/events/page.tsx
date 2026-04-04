"use client"
import { useEffect, useState } from "react"
import { adminApi } from "@/lib/adminApi"
import AdminLayout from "@/components/admin/AdminLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Plus, Pencil, Trash2, Calendar, MapPin, Clock,
  X, CheckCircle, AlertCircle, Image as ImageIcon,
  Eye, EyeOff, CalendarDays,
} from "lucide-react"

interface MediaImage { filename: string; url: string; size: number }

function ImagePickerModal({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [images, setImages] = useState<MediaImage[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    adminApi.getImages().then(r => r.json()).then(d => setImages(d.images ?? [])).finally(() => setLoading(false))
  }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Choose from Media Library</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(352,83%,48%)] rounded-full animate-spin" />
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
                  className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100 border-2 border-transparent hover:border-[hsl(352,83%,48%)] transition-all"
                >
                  <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
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

interface CourtEvent {
  id: number
  title: string
  description: string
  eventDate: string
  eventTime: string
  location: string
  category: string
  image: string
  published: boolean
}

const EMPTY: Omit<CourtEvent, "id"> = {
  title: "", description: "", eventDate: "", eventTime: "",
  location: "", category: "Workshop", image: "", published: true,
}

const CATEGORIES = ["Workshop", "Training", "Awareness", "Consultation", "Conference", "Outreach", "General"]

const CATEGORY_COLORS: Record<string, string> = {
  Workshop:     "bg-red-100 text-red-800",
  Training:     "bg-indigo-100 text-indigo-700",
  Awareness:    "bg-emerald-100 text-emerald-700",
  Consultation: "bg-amber-100 text-amber-700",
  Conference:   "bg-purple-100 text-purple-700",
  Outreach:     "bg-rose-100 text-rose-700",
  General:      "bg-gray-100 text-gray-600",
}

function isPast(iso: string) {
  return new Date(iso + "T23:59:59") < new Date()
}

type Toast = { type: "success" | "error"; msg: string } | null

export default function EventsManager() {
  const [events, setEvents] = useState<CourtEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<CourtEvent | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<CourtEvent, "id">>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<Toast>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  const load = () => {
    setLoading(true)
    adminApi.getEvents().then(r => r.json()).then(d => setEvents(d.events ?? [])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const startCreate = () => { setForm(EMPTY); setEditing(null); setCreating(true) }
  const startEdit = (e: CourtEvent) => {
    setForm({ title: e.title, description: e.description, eventDate: e.eventDate, eventTime: e.eventTime, location: e.location, category: e.category, image: e.image, published: e.published })
    setEditing(e); setCreating(false)
  }
  const cancel = () => { setEditing(null); setCreating(false) }

  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) => setForm(p => ({ ...p, [k]: v }))

  const save = async () => {
    if (!form.title || !form.eventDate || !form.location || !form.category) {
      showToast("error", "Title, date, location, and category are required.")
      return
    }
    setSaving(true)
    try {
      const res = editing
        ? await adminApi.updateEvent(editing.id, form)
        : await adminApi.createEvent(form)
      if (res.ok) {
        showToast("success", editing ? "Event updated." : "Event created.")
        cancel(); load()
      } else {
        const body = await res.json().catch(() => ({}))
        showToast("error", (body as { error?: string }).error ?? `HTTP ${res.status}`)
      }
    } catch {
      showToast("error", "Network error. Is the server running?")
    } finally { setSaving(false) }
  }

  const togglePublish = async (e: CourtEvent) => {
    await adminApi.updateEvent(e.id, { ...e, published: !e.published })
    load()
  }

  const confirmDelete = async () => {
    if (deleteId == null) return
    try {
      const res = await adminApi.deleteEvent(deleteId)
      if (res.ok) { showToast("success", "Event deleted."); load() }
      else showToast("error", "Delete failed — try again.")
    } catch {
      showToast("error", "Network error.")
    }
    setDeleteId(null)
  }

  const upcoming = events.filter(e => !isPast(e.eventDate))
  const past = events.filter(e => isPast(e.eventDate))

  return (
    <AdminLayout>
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "success" ? "bg-amber-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}
      {deleteId != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80">
            <p className="font-semibold text-gray-900 mb-1">Delete event?</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-400 text-sm mt-1.5">{upcoming.length} upcoming · {past.length} past</p>
          </div>
          {!creating && !editing && (
            <Button onClick={startCreate} className="flex items-center gap-2 h-10 px-5">
              <Plus className="w-4 h-4" /> New Event
            </Button>
          )}
        </div>

        {/* Form */}
        {(creating || editing) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-700">{editing ? "Edit Event" : "New Event"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Title *</label>
                <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Event title" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Date *</label>
                <Input type="date" value={form.eventDate} onChange={e => set("eventDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Time</label>
                <Input value={form.eventTime} onChange={e => set("eventTime", e.target.value)} placeholder="e.g. 8:00 AM – 1:00 PM" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Location *</label>
                <Input value={form.location} onChange={e => set("location", e.target.value)} placeholder="Venue, City, Province" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
                <select
                  value={form.category}
                  onChange={e => set("category", e.target.value)}
                  className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(352,83%,48%)]/20"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea rows={3} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(352,83%,48%)]" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Event details…" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Image</label>
                <div className="flex gap-2">
                  <Input value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://… or choose from library" className="flex-1" />
                  <Button type="button" variant="outline" onClick={() => setPickerOpen(true)} className="flex items-center gap-2 shrink-0">
                    <ImageIcon className="w-4 h-4" /> Library
                  </Button>
                </div>
                {form.image && (
                  <div className="mt-3 relative inline-block">
                    <img src={form.image} alt="" className="h-28 rounded-xl object-cover border border-gray-200" />
                    <button type="button" onClick={() => set("image", "")} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)} className="rounded" />
              Published (visible on public site)
            </label>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving || !form.title.trim()} className="flex items-center gap-2">
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Event"}
              </Button>
              <Button variant="outline" onClick={cancel} className="flex items-center gap-2">
                <X className="w-4 h-4" /> Cancel
              </Button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(352,83%,48%)] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading events…</p>
            </div>
          ) : events.length === 0 ? (
            <div className="p-16 text-center">
              <CalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No events yet</p>
              <p className="text-gray-400 text-sm mt-1">Click "New Event" to get started.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_auto_auto] border-b border-gray-200 bg-gray-50/60 px-6">
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">Status</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</div>
              </div>
              <div className="divide-y divide-gray-200">
                {events.map(e => {
                  const past = isPast(e.eventDate)
                  const colorClass = CATEGORY_COLORS[e.category] ?? CATEGORY_COLORS.General
                  return (
                    <div key={e.id} className={`grid grid-cols-[1fr_auto_auto] items-center px-6 py-4 hover:bg-gray-50/60 transition-colors ${past ? "opacity-60" : ""}`}>
                      <div className="flex items-center gap-4 min-w-0 pr-4">
                        {e.image ? (
                          <img src={e.image} alt="" className="w-20 h-14 rounded-xl object-cover shrink-0 bg-gray-100" />
                        ) : (
                          <div className="w-20 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                            <CalendarDays className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>{e.category}</span>
                            {past && <span className="text-[10px] text-gray-400 font-medium">Past</span>}
                          </div>
                          <div className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1">{e.title}</div>
                          <div className="flex flex-wrap gap-x-3 mt-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.eventDate}</span>
                            {e.eventTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.eventTime}</span>}
                            {e.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="px-4">
                        {e.published ? (
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
                        <button onClick={() => togglePublish(e)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors" title={e.published ? "Hide" : "Publish"}>
                          {e.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button onClick={() => startEdit(e)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-[hsl(352,83%,48%)] transition-colors" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(e.id)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
