import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, X, CheckCircle, AlertCircle, HelpCircle, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminLayout from "@/components/admin/AdminLayout"
import { adminApi } from "@/lib/adminApi"

interface FAQ { id: number; question: string; answer: string; published: boolean; position: number }

const EMPTY = { question: "", answer: "", published: true }

type Toast = { type: "success" | "error"; msg: string } | null

export default function FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState<{ question: string; answer: string; published: boolean }>({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [toast, setToast] = useState<Toast>(null)

  const load = () => {
    setLoading(true)
    adminApi.getFaqs().then(r => r.json()).then(d => setFaqs(d.faqs ?? [])).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }
  const startCreate = () => { setForm({ ...EMPTY }); setEditing(null); setCreating(true) }
  const startEdit = (f: FAQ) => { setForm({ question: f.question, answer: f.answer, published: f.published }); setEditing(f); setCreating(false) }
  const cancel = () => { setCreating(false); setEditing(null) }

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      showToast("error", "Question and Answer are required.")
      return
    }
    setSaving(true)
    try {
      const payload = { ...form, published: form.published ? 1 : 0 }
      const res = editing ? await adminApi.updateFaq(editing.id, payload) : await adminApi.createFaq(payload)
      if (res.ok) {
        showToast("success", editing ? "FAQ updated." : "FAQ created.")
        cancel(); load()
      } else {
        const body = await res.json().catch(() => ({}))
        showToast("error", (body as { error?: string }).error ?? `HTTP ${res.status} — save failed.`)
      }
    } catch {
      showToast("error", "Network error. Is the server running?")
    } finally { setSaving(false) }
  }

  const togglePublish = async (faq: FAQ) => {
    await adminApi.updateFaq(faq.id, { published: faq.published ? 0 : 1 })
    load()
  }

  const confirmDelete = async () => {
    if (deleteId == null) return
    try {
      const res = await adminApi.deleteFaq(deleteId)
      if (res.ok) { showToast("success", "FAQ deleted."); load() }
      else showToast("error", "Delete failed — try again.")
    } catch {
      showToast("error", "Network error.")
    }
    setDeleteId(null)
  }

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= faqs.length) return
    const reordered = [...faqs]
    ;[reordered[i], reordered[j]] = [reordered[j], reordered[i]]
    setFaqs(reordered)
    await adminApi.reorderFaqs(reordered.map(f => f.id))
  }

  const published = faqs.filter(f => f.published).length

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
            <p className="font-semibold text-gray-900 mb-1">Delete FAQ?</p>
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
            <h1 className="text-3xl font-bold text-gray-900">FAQ Manager</h1>
            <p className="text-gray-400 text-sm mt-1.5">{faqs.length} total · {published} published · {faqs.length - published} hidden</p>
          </div>
          {!creating && !editing && (
            <Button onClick={startCreate} className="flex items-center gap-2 h-10 px-5">
              <Plus className="w-4 h-4" /> Add FAQ
            </Button>
          )}
        </div>

        {(creating || editing) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-bold text-gray-700">{editing ? "Edit FAQ" : "New FAQ"}</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Question *</label>
              <Input value={form.question} onChange={e => setForm(p => ({ ...p, question: e.target.value }))} placeholder="Is compensation mandatory for all employers?" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Answer *</label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.answer}
                onChange={e => setForm(p => ({ ...p, answer: e.target.value }))}
                placeholder="Enter the answer…"
              />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input type="checkbox" checked={form.published} onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} className="rounded" />
              Published (visible on Resources page)
            </label>
            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving || !form.question.trim() || !form.answer.trim()} className="flex items-center gap-2">
                {saving ? "Saving…" : editing ? "Save Changes" : "Create FAQ"}
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
              <p className="text-gray-400 text-sm">Loading FAQs…</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="p-16 text-center">
              <HelpCircle className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No FAQs yet</p>
              <p className="text-gray-400 text-sm mt-1">Click "Add FAQ" to get started.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[auto_1fr_auto_auto] border-b border-gray-100 bg-gray-50/60 px-6">
                <div className="py-3.5 pr-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Question &amp; Answer</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">Status</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</div>
              </div>
              <div className="divide-y divide-gray-50">
                {faqs.map((f, i) => (
                  <div key={f.id} className={`grid grid-cols-[auto_1fr_auto_auto] items-center px-6 py-4 hover:bg-gray-50/60 transition-colors ${!f.published ? "opacity-60" : ""}`}>
                    <div className="flex flex-col gap-1 pr-3">
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
                        <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <button onClick={() => move(i, 1)} disabled={i === faqs.length - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                    <div className="min-w-0 pr-4">
                      <div className="font-semibold text-gray-900 text-sm leading-snug">{f.question}</div>
                      <div className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{f.answer}</div>
                    </div>
                    <div className="px-4">
                      {f.published ? (
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
                      <button onClick={() => togglePublish(f)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors" title={f.published ? "Hide" : "Publish"}>
                        {f.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => startEdit(f)} className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-[hsl(210,70%,25%)] transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteId(f.id)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
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
