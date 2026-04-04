"use client"
import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, CheckCircle, AlertCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminLayout from "@/components/admin/AdminLayout"
import { adminApi } from "@/lib/adminApi"

interface Office {
  id: number
  name: string
  address: string
  phone: string
  email: string
  hours: string
}

const EMPTY: Omit<Office, "id"> = { name: "", address: "", phone: "", email: "", hours: "Mon–Fri: 8:00 AM – 4:00 PM" }

type Toast = { type: "success" | "error"; msg: string } | null

export default function OfficesManager() {
  const [offices, setOffices] = useState<Office[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Office | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [toast, setToast] = useState<Toast>(null)

  const load = () => {
    setLoading(true)
    adminApi.getOffices().then(r => r.json()).then(d => setOffices(d.offices ?? [])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }
  const set = (k: keyof typeof EMPTY, v: string) => setForm(p => ({ ...p, [k]: v }))
  const startCreate = () => { setForm({ ...EMPTY }); setEditing(null); setCreating(true) }
  const startEdit = (o: Office) => { setForm({ name: o.name, address: o.address, phone: o.phone, email: o.email, hours: o.hours }); setEditing(o); setCreating(false) }
  const cancel = () => { setCreating(false); setEditing(null) }

  const save = async () => {
    if (!form.name.trim()) {
      showToast("error", "Office name is required.")
      return
    }
    setSaving(true)
    try {
      const res = editing ? await adminApi.updateOffice(editing.id, form) : await adminApi.createOffice(form)
      if (res.ok) {
        showToast("success", editing ? "Office updated." : "Office created.")
        cancel(); load()
      } else {
        const body = await res.json().catch(() => ({}))
        showToast("error", (body as { error?: string }).error ?? `HTTP ${res.status} — save failed.`)
      }
    } catch {
      showToast("error", "Network error. Is the server running?")
    } finally { setSaving(false) }
  }

  const confirmDelete = async () => {
    if (deleteId == null) return
    try {
      const res = await adminApi.deleteOffice(deleteId)
      if (res.ok) { showToast("success", "Office deleted."); load() }
      else showToast("error", "Delete failed — try again.")
    } catch {
      showToast("error", "Network error.")
    }
    setDeleteId(null)
  }

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
            <p className="font-semibold text-gray-900 mb-1">Delete office?</p>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="destructive" className="flex-1" onClick={confirmDelete}>Delete</Button>
              <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full space-y-6 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Office Locations</h1>
            <p className="text-gray-400 text-sm mt-1.5">{offices.length} office{offices.length !== 1 ? "s" : ""} · shown on the Contact page</p>
          </div>
          {!creating && !editing && (
            <Button onClick={startCreate} className="flex items-center gap-2 h-10 px-5">
              <Plus className="w-4 h-4" /> Add Office
            </Button>
          )}
        </div>

        {(creating || editing) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-700">{editing ? "Edit Office" : "New Office"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Office Name *</label>
                <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Head Office — Port Moresby" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Address</label>
                <Input value={form.address} onChange={e => set("address", e.target.value)} placeholder="Gaukara Rumana, Wards Rd, Port Moresby, NCD" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                <Input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+675 325 7902" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                <Input value={form.email} onChange={e => set("email", e.target.value)} placeholder="info@judiciary.gov.pg" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Office Hours</label>
                <Input value={form.hours} onChange={e => set("hours", e.target.value)} placeholder="Mon–Fri: 8:00 AM – 4:00 PM" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving || !form.name.trim()} className="flex items-center gap-2">
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Office"}
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
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(352,83%,48%)] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading offices…</p>
            </div>
          ) : offices.length === 0 ? (
            <div className="p-16 text-center">
              <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No offices yet</p>
              <p className="text-gray-400 text-sm mt-1">Add your first office location above</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_auto_auto_auto] border-b border-gray-200 bg-gray-50/60 px-6">
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Office</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:block px-4">Phone</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:block px-4">Hours</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</div>
              </div>
              <div className="divide-y divide-gray-200">
                {offices.map(o => (
                  <div key={o.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center px-6 py-4 hover:bg-gray-50/60 transition-colors">
                    <div className="min-w-0 pr-4">
                      <div className="font-semibold text-gray-900 text-sm">{o.name}</div>
                      {o.address && <div className="text-xs text-gray-400 mt-0.5">{o.address}</div>}
                      {o.email && <div className="text-xs text-gray-400 mt-0.5">{o.email}</div>}
                    </div>
                    <div className="hidden md:block px-4 text-sm text-gray-500 whitespace-nowrap">{o.phone}</div>
                    <div className="hidden lg:block px-4 text-sm text-gray-500 whitespace-nowrap">{o.hours}</div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(o)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-[hsl(352,83%,48%)] transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(o.id)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
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
