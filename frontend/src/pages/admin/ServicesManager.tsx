import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, CheckCircle, AlertCircle, Briefcase, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminLayout from "@/components/admin/AdminLayout"
import { adminApi } from "@/lib/adminApi"

interface Service {
  id: number; position: number; tag: string; iconName: string
  title: string; description: string; whoEligible: string
  benefits: string[]; published: boolean
}

const ICON_OPTIONS = [
  "Shield", "Users", "Building2", "Stethoscope", "Scale", "HelpCircle",
  "Briefcase", "Heart", "BookOpen", "FileText", "Star", "Globe",
]

const EMPTY = {
  tag: "", iconName: "HelpCircle", title: "", description: "",
  whoEligible: "", benefits: [""], published: true,
}

type Toast = { type: "success" | "error"; msg: string } | null

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Service | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ ...EMPTY, benefits: [""] })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [toast, setToast] = useState<Toast>(null)

  const load = () => {
    setLoading(true)
    adminApi.getServices().then(r => r.json()).then(d => setServices(d.services ?? [])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }
  const startCreate = () => { setForm({ ...EMPTY, benefits: [""] }); setEditing(null); setCreating(true) }
  const startEdit = (s: Service) => {
    setForm({ tag: s.tag, iconName: s.iconName, title: s.title, description: s.description, whoEligible: s.whoEligible, benefits: s.benefits.length ? s.benefits : [""], published: s.published })
    setEditing(s); setCreating(false)
  }
  const cancel = () => { setCreating(false); setEditing(null) }

  const setBenefit = (i: number, v: string) => setForm(p => { const b = [...p.benefits]; b[i] = v; return { ...p, benefits: b } })
  const addBenefit = () => setForm(p => ({ ...p, benefits: [...p.benefits, ""] }))
  const removeBenefit = (i: number) => setForm(p => ({ ...p, benefits: p.benefits.filter((_, j) => j !== i) }))

  const save = async () => {
    if (!form.title.trim()) {
      showToast("error", "Title is required.")
      return
    }
    setSaving(true)
    try {
      const payload = { ...form, benefits: form.benefits.filter(b => b.trim()), published: form.published }
      const res = editing
        ? await adminApi.updateService(editing.id, payload)
        : await adminApi.createService(payload)
      if (res.ok) {
        showToast("success", editing ? "Service updated." : "Service created.")
        cancel(); load()
      } else {
        const body = await res.json().catch(() => ({}))
        showToast("error", (body as { error?: string }).error ?? `HTTP ${res.status} — save failed.`)
      }
    } catch {
      showToast("error", "Network error. Is the server running?")
    } finally { setSaving(false) }
  }

  const togglePublish = async (s: Service) => {
    await adminApi.updateService(s.id, { ...s, published: !s.published })
    load()
  }

  const confirmDelete = async () => {
    if (deleteId == null) return
    try {
      const res = await adminApi.deleteService(deleteId)
      if (res.ok) { showToast("success", "Service deleted."); load() }
      else showToast("error", "Delete failed — try again.")
    } catch {
      showToast("error", "Network error.")
    }
    setDeleteId(null)
  }

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= services.length) return
    const reordered = [...services];
    [reordered[i], reordered[j]] = [reordered[j], reordered[i]]
    setServices(reordered)
    await adminApi.reorderServices(reordered.map(s => s.id))
  }

  const published = services.filter(s => s.published).length

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
            <p className="font-semibold text-gray-900 mb-1">Delete service?</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Services</h1>
            <p className="text-gray-400 text-sm mt-1.5">{services.length} total · {published} published · shown on the Services page</p>
          </div>
          {!creating && !editing && (
            <Button onClick={startCreate} className="flex items-center gap-2 h-10 px-5">
              <Plus className="w-4 h-4" /> Add Service
            </Button>
          )}
        </div>

        {(creating || editing) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-700">{editing ? "Edit Service" : "New Service"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tag / Category *</label>
                <Input value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} placeholder="Workers, Employers, Medical…" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Icon</label>
                <select
                  value={form.iconName}
                  onChange={e => setForm(p => ({ ...p, iconName: e.target.value }))}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {ICON_OPTIONS.map(ico => <option key={ico} value={ico}>{ico}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Title *</label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Workers Compensation" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea rows={3} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of this service…" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Who Is Eligible</label>
                <textarea rows={2} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={form.whoEligible} onChange={e => setForm(p => ({ ...p, whoEligible: e.target.value }))} placeholder="Any worker employed under a contract of service…" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Benefits / What's Included</label>
                <div className="space-y-2">
                  {form.benefits.map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <Input value={b} onChange={e => setBenefit(i, e.target.value)} placeholder={`Benefit ${i + 1}`} className="flex-1" />
                      {form.benefits.length > 1 && (
                        <button type="button" onClick={() => removeBenefit(i)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addBenefit} className="text-xs font-medium text-[hsl(210,70%,25%)] hover:underline flex items-center gap-1 mt-1">
                    <Plus className="w-3 h-3" /> Add benefit
                  </button>
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="rounded" />
              Published (visible on Services page)
            </label>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving || !form.title.trim()} className="flex items-center gap-2">
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Service"}
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
              <p className="text-gray-400 text-sm">Loading services…</p>
            </div>
          ) : services.length === 0 ? (
            <div className="p-16 text-center">
              <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No services yet</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[auto_1fr_auto_auto] border-b border-gray-100 bg-gray-50/60 px-6">
                <div className="py-3.5 pr-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">Status</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</div>
              </div>
              <div className="divide-y divide-gray-50">
                {services.map((s, i) => (
                  <div key={s.id} className={`grid grid-cols-[auto_1fr_auto_auto] items-center px-6 py-4 hover:bg-gray-50/60 transition-colors ${!s.published ? "opacity-60" : ""}`}>
                    <div className="flex flex-col gap-1 pr-3">
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
                        <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <button onClick={() => move(i, 1)} disabled={i === services.length - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                    <div className="min-w-0 pr-4">
                      {s.tag && <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{s.tag}</div>}
                      <div className="font-semibold text-gray-900 text-sm">{s.title}</div>
                      {s.description && <div className="text-xs text-gray-400 mt-1 line-clamp-1">{s.description}</div>}
                      {s.benefits.length > 0 && (
                        <div className="text-xs text-gray-300 mt-0.5">{s.benefits.length} benefit{s.benefits.length !== 1 ? "s" : ""}</div>
                      )}
                    </div>
                    <div className="px-4">
                      {s.published ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full">
                          <Eye className="w-3 h-3" /> Visible
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
