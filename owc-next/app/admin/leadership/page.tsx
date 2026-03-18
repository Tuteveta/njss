"use client"
import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, CheckCircle, AlertCircle, Users, Image, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminLayout from "@/components/admin/AdminLayout"
import { adminApi } from "@/lib/adminApi"

interface Leader { id: number; name: string; title: string; since: string; photo: string; position: number }

const EMPTY = { name: "", title: "", since: "", photo: "" }

type Toast = { type: "success" | "error"; msg: string } | null

function ImagePickerModal({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [images, setImages] = useState<{ filename: string; url: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState("")

  useEffect(() => {
    adminApi.getImages()
      .then(r => r.json())
      .then(d => setImages(d.images ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Pick from Media Library</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-gray-200 border-t-[hsl(210,70%,25%)] rounded-full animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No images uploaded yet.</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {images.map(img => (
                <button
                  key={img.filename}
                  onClick={() => setSelected(img.url)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selected === img.url ? "border-[hsl(210,70%,25%)] shadow-md" : "border-transparent hover:border-gray-300"}`}
                >
                  <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
                  {selected === img.url && (
                    <div className="absolute inset-0 bg-[hsl(210,70%,25%)]/20 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-[hsl(210,70%,25%)] flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!selected} onClick={() => { onSelect(selected); onClose() }}>
            Use Selected Photo
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function LeadershipManager() {
  const [members, setMembers] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Leader | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [toast, setToast] = useState<Toast>(null)
  const [pickerOpen, setPickerOpen] = useState(false)

  const load = () => {
    setLoading(true)
    adminApi.getLeadership().then(r => r.json()).then(d => setMembers(d.members ?? [])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }
  const set = (k: keyof typeof EMPTY, v: string) => setForm(p => ({ ...p, [k]: v }))
  const startCreate = () => { setForm({ ...EMPTY }); setEditing(null); setCreating(true) }
  const startEdit = (m: Leader) => { setForm({ name: m.name, title: m.title, since: m.since, photo: m.photo ?? "" }); setEditing(m); setCreating(false) }
  const cancel = () => { setCreating(false); setEditing(null) }

  const save = async () => {
    if (!form.name.trim() || !form.title.trim()) {
      showToast("error", "Name and Title are required.")
      return
    }
    setSaving(true)
    try {
      const res = editing
        ? await adminApi.updateLeader(editing.id, form)
        : await adminApi.createLeader(form)
      if (res.ok) {
        showToast("success", editing ? "Member updated." : "Member added.")
        cancel()
        load()
      } else {
        const body = await res.json().catch(() => ({}))
        showToast("error", (body as { error?: string }).error ?? `HTTP ${res.status} — save failed.`)
      }
    } catch {
      showToast("error", "Network error. Is the server running?")
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (deleteId == null) return
    try {
      const res = await adminApi.deleteLeader(deleteId)
      if (res.ok) {
        showToast("success", "Member removed.")
        load()
      } else {
        showToast("error", "Delete failed — try again.")
      }
    } catch {
      showToast("error", "Network error.")
    }
    setDeleteId(null)
  }

  return (
    <AdminLayout>
      {pickerOpen && (
        <ImagePickerModal
          onSelect={url => set("photo", url)}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
          {toast.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {deleteId != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80">
            <p className="font-semibold text-gray-900 mb-1">Remove member?</p>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="destructive" className="flex-1" onClick={confirmDelete}>Remove</Button>
              <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full space-y-6 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leadership Team</h1>
            <p className="text-gray-400 text-sm mt-1.5">{members.length} member{members.length !== 1 ? "s" : ""} · shown on the About page</p>
          </div>
          {!creating && !editing && (
            <Button onClick={startCreate} className="flex items-center gap-2 h-10 px-5">
              <Plus className="w-4 h-4" /> Add Member
            </Button>
          )}
        </div>

        {(creating || editing) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-700">{editing ? "Edit Member" : "New Member"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Sir John Kaupa" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Since (Year)</label>
                <Input value={form.since} onChange={e => set("since", e.target.value)} placeholder="2022" />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Title / Role *</label>
                <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Commissioner" />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Photo</label>
                <div className="flex gap-2">
                  <Input
                    value={form.photo}
                    onChange={e => set("photo", e.target.value)}
                    placeholder="https://… or pick from library"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={() => setPickerOpen(true)} className="shrink-0 flex items-center gap-1.5">
                    <Image className="w-4 h-4" /> Library
                  </Button>
                </div>
                {form.photo && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={form.photo} alt="Preview" className="w-14 h-14 rounded-full object-cover border border-gray-200" />
                    <button type="button" onClick={() => set("photo", "")} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving || !form.name.trim()} className="flex items-center gap-2">
                {saving ? "Saving…" : editing ? "Save Changes" : "Add Member"}
              </Button>
              <Button variant="outline" onClick={cancel} className="flex items-center gap-2">
                <X className="w-4 h-4" /> Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(210,70%,25%)] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading members…</p>
            </div>
          ) : members.length === 0 ? (
            <div className="p-16 text-center">
              <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No members yet</p>
              <p className="text-gray-400 text-sm mt-1">Click "Add Member" to get started.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[auto_1fr_auto_auto] border-b border-gray-200 bg-gray-50/60 px-6">
                <div className="py-3.5 pr-4 w-12" />
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name &amp; Role</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:block px-4">Since</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</div>
              </div>
              <div className="divide-y divide-gray-200">
                {members.map(m => (
                  <div key={m.id} className="grid grid-cols-[auto_1fr_auto_auto] items-center px-6 py-4 hover:bg-gray-50/60 transition-colors">
                    {m.photo ? (
                      <img src={m.photo} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0 mr-4" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[hsl(210,70%,90%)] flex items-center justify-center font-bold text-[hsl(210,70%,25%)] text-sm shrink-0 mr-4">
                        {m.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">{m.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{m.title}</div>
                    </div>
                    <div className="hidden sm:block px-4 text-sm text-gray-500">{m.since}</div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(m)} className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-[hsl(210,70%,25%)] transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(m.id)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Remove">
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
