"use client"
import { useEffect, useState } from "react"
import { adminApi } from "@/lib/adminApi"
import AdminLayout from "@/components/admin/AdminLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, Calendar, MapPin, Clock, X, CheckCircle, AlertCircle, Image as ImageIcon } from "lucide-react"

interface MediaImage { filename: string; url: string; size: number }

function ImagePickerModal({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [images, setImages] = useState<MediaImage[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    adminApi.getImages().then(r => r.json()).then(d => setImages(d.images ?? [])).finally(() => setLoading(false))
  }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">Media Library</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="overflow-y-auto p-4 flex-1">
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-video bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : images.length === 0 ? (
            <p className="text-center text-gray-400 py-12 text-sm">No images uploaded yet. Go to Media Library to upload images.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map(img => (
                <button key={img.filename} onClick={() => { onSelect(img.url); onClose() }}
                  className="aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-[hsl(210,70%,25%)] transition-all group">
                  <img src={img.url} alt={img.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface OWCEvent {
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

const EMPTY: Omit<OWCEvent, "id"> = {
  title: "", description: "", eventDate: "", eventTime: "",
  location: "", category: "Workshop", image: "", published: true,
}

const CATEGORIES = ["Workshop", "Training", "Awareness", "Consultation", "Conference", "Outreach", "General"]

const CATEGORY_COLORS: Record<string, string> = {
  Workshop:     "bg-blue-100 text-blue-700",
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

export default function EventsManager() {
  const [events, setEvents] = useState<OWCEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<OWCEvent | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<Omit<OWCEvent, "id">>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3000)
  }

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminApi.getEvents()
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const d = await res.json()
      setEvents(d.events ?? [])
    } catch (err) {
      showToast("error", `Failed to load events: ${err instanceof Error ? err.message : "unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setForm(EMPTY)
    setEditing(null)
    setCreating(true)
  }

  const openEdit = (e: OWCEvent) => {
    setForm({ title: e.title, description: e.description, eventDate: e.eventDate, eventTime: e.eventTime, location: e.location, category: e.category, image: e.image, published: e.published })
    setEditing(e)
    setCreating(false)
  }

  const closeForm = () => {
    setEditing(null)
    setCreating(false)
  }

  const handleSave = async () => {
    if (!form.title || !form.eventDate || !form.location || !form.category) {
      showToast("error", "Title, date, location, and category are required.")
      return
    }
    setSaving(true)
    try {
      let res: Response
      if (editing) {
        res = await adminApi.updateEvent(editing.id, form)
      } else {
        res = await adminApi.createEvent(form)
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        let msg = `HTTP ${res.status}`
        try { msg = (JSON.parse(text) as { error?: string }).error ?? msg } catch { /* not JSON */ }
        showToast("error", msg)
        return
      }
      showToast("success", editing ? "Event updated." : "Event created.")
      closeForm()
      load()
    } catch {
      showToast("error", "Network error. Is the server running?")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await adminApi.deleteEvent(id)
      showToast("success", "Event deleted.")
      setDeleteId(null)
      load()
    } catch {
      showToast("error", "Delete failed.")
    }
  }

  const upcoming = events.filter(e => !isPast(e.eventDate))
  const past = events.filter(e => isPast(e.eventDate))

  return (
    <AdminLayout>
      {pickerOpen && (
        <ImagePickerModal
          onSelect={url => setForm(f => ({ ...f, image: url }))}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-bold text-gray-900 mb-2">Delete Event?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteId)}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full space-y-6 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events</h1>
            <p className="text-gray-400 text-sm mt-1.5">{upcoming.length} upcoming · {past.length} past</p>
          </div>
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Event
          </Button>
        </div>

        {/* Form */}
        {(creating || editing) && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">{editing ? "Edit Event" : "New Event"}</CardTitle>
              <button onClick={closeForm} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <Input type="date" value={form.eventDate} onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <Input value={form.eventTime} onChange={e => setForm(f => ({ ...f, eventTime: e.target.value }))} placeholder="e.g. 8:00 AM – 1:00 PM" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,70%,25%)]/20"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Venue, City, Province" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Event details..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="flex gap-2">
                  <Input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://… or choose from library" className="flex-1" />
                  <Button type="button" variant="outline" onClick={() => setPickerOpen(true)} className="gap-1.5 shrink-0">
                    <ImageIcon className="w-4 h-4" /> Library
                  </Button>
                </div>
                {form.image && (
                  <div className="mt-3 relative inline-block">
                    <img src={form.image} alt="" className="h-24 rounded-xl object-cover border border-gray-200" />
                    <button onClick={() => setForm(f => ({ ...f, image: "" }))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pub"
                  checked={form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="pub" className="text-sm font-medium text-gray-700">Published (visible on public site)</label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : editing ? "Save Changes" : "Create Event"}</Button>
                <Button variant="outline" onClick={closeForm}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming events */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Upcoming ({upcoming.length})
          </h2>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl border border-gray-200 h-24 animate-pulse" />)}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">No upcoming events. Create one above.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map(e => <EventRow key={e.id} event={e} onEdit={openEdit} onDelete={setDeleteId} />)}
            </div>
          )}
        </div>

        {/* Past events */}
        {past.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" /> Past ({past.length})
            </h2>
            <div className="space-y-3">
              {past.map(e => <EventRow key={e.id} event={e} onEdit={openEdit} onDelete={setDeleteId} />)}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

function EventRow({ event, onEdit, onDelete }: { event: OWCEvent; onEdit: (e: OWCEvent) => void; onDelete: (id: number) => void }) {
  const past = isPast(event.eventDate)
  const colorClass = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.General
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4 ${past ? "opacity-60" : ""}`}>
      {event.image ? (
        <img src={event.image} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
          <Calendar className="w-6 h-6 text-gray-300" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>{event.category}</span>
              {!event.published && <Badge variant="outline" className="text-xs text-gray-400">Draft</Badge>}
              {past && <span className="text-xs text-gray-400">Past</span>}
            </div>
            <h3 className="font-semibold text-gray-900 text-sm leading-snug">{event.title}</h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => onEdit(event)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors" title="Edit">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(event.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.eventDate}</span>
          {event.eventTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.eventTime}</span>}
          {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
        </div>
      </div>
    </div>
  )
}
