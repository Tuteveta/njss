import { useEffect, useState } from "react"
import { Check, Plus, X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminLayout from "@/components/admin/AdminLayout"
import { adminApi } from "@/lib/adminApi"

interface KV { title: string; desc: string }

interface AboutData {
  mission: string
  vision: string
  mandate: string[]
  highlights: KV[]
  priorities: KV[]
  values: KV[]
  legislation: KV[]
}

const EMPTY: AboutData = {
  mission: "", vision: "",
  mandate: [],
  highlights: [], priorities: [], values: [], legislation: [],
}

function StringList({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; onChange(n) }} placeholder={`Item ${i + 1}`} className="flex-1" />
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, ""])} className="text-xs font-medium text-[hsl(210,70%,25%)] hover:underline flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add item
        </button>
      </div>
    </div>
  )
}

function KVList({ label, items, onChange }: { label: string; items: KV[]; onChange: (v: KV[]) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
            <div className="flex gap-2">
              <Input value={item.title} onChange={e => { const n = [...items]; n[i] = { ...n[i], title: e.target.value }; onChange(n) }} placeholder="Title" className="flex-1" />
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea rows={2} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={item.desc} onChange={e => { const n = [...items]; n[i] = { ...n[i], desc: e.target.value }; onChange(n) }} placeholder="Description" />
          </div>
        ))}
        <button type="button" onClick={() => onChange([...items, { title: "", desc: "" }])} className="text-xs font-medium text-[hsl(210,70%,25%)] hover:underline flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add item
        </button>
      </div>
    </div>
  )
}

const TABS = [
  { key: "mission", label: "Mission & Vision" },
  { key: "mandate", label: "Mandate" },
  { key: "highlights", label: "Highlights" },
  { key: "priorities", label: "Strategic Priorities" },
  { key: "values", label: "Values" },
  { key: "legislation", label: "Legislation" },
] as const

type TabKey = (typeof TABS)[number]["key"]

export default function AboutManager() {
  const [data, setData] = useState<AboutData>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")
  const [activeTab, setActiveTab] = useState<TabKey>("mission")

  useEffect(() => {
    adminApi.getAbout()
      .then(r => r.json())
      .then(d => setData({ mission: d.mission ?? "", vision: d.vision ?? "", mandate: d.mandate ?? [], highlights: d.highlights ?? [], priorities: d.priorities ?? [], values: d.values ?? [], legislation: d.legislation ?? [] }))
      .finally(() => setLoading(false))
  }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000) }

  const save = async () => {
    setSaving(true)
    try {
      const res = await adminApi.saveAbout(data)
      if (res.ok) showToast("About content saved.")
    } finally { setSaving(false) }
  }

  const set = (k: keyof AboutData, v: AboutData[typeof k]) => setData(p => ({ ...p, [k]: v }))

  return (
    <AdminLayout>
      <div className="w-full space-y-6 pb-6">
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
            <Check className="w-4 h-4" /> {toast}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">About Content</h1>
            <p className="text-gray-400 text-sm mt-1.5">Edit all sections shown on the About page</p>
          </div>
          <Button onClick={save} disabled={saving || loading} className="flex items-center gap-2 h-10 px-5">
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(210,70%,25%)] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading…</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Tab bar */}
            <div className="flex items-center gap-0 border-b border-gray-100 overflow-x-auto">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`shrink-0 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? "border-[hsl(210,70%,25%)] text-[hsl(210,70%,25%)]" : "border-transparent text-gray-500 hover:text-gray-800"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-6">
              {activeTab === "mission" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mission Statement</label>
                    <textarea rows={4} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={data.mission} onChange={e => set("mission", e.target.value)} placeholder="Our mission…" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Vision Statement</label>
                    <textarea rows={4} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={data.vision} onChange={e => set("vision", e.target.value)} placeholder="Our vision…" />
                  </div>
                </>
              )}

              {activeTab === "mandate" && (
                <StringList label="Mandate Items" items={data.mandate} onChange={v => set("mandate", v)} />
              )}

              {activeTab === "highlights" && (
                <div>
                  <p className="text-xs text-gray-400 mb-4">Each highlight shows a bold value (e.g. "1,732") and a descriptive label below it.</p>
                  <KVList label="Highlights" items={data.highlights.map(h => ({ title: h.title ?? (h as { value?: string }).value ?? "", desc: h.desc ?? (h as { label?: string }).label ?? "" }))} onChange={v => set("highlights", v.map(i => ({ title: i.title, desc: i.desc })))} />
                  <p className="text-xs text-gray-400 mt-2">Note: "Title" = the bold number/value. "Description" = the label below.</p>
                </div>
              )}

              {activeTab === "priorities" && (
                <KVList label="Strategic Priority Items" items={data.priorities} onChange={v => set("priorities", v)} />
              )}

              {activeTab === "values" && (
                <KVList label="Core Values" items={data.values} onChange={v => set("values", v)} />
              )}

              {activeTab === "legislation" && (
                <KVList label="Legislation Items" items={data.legislation} onChange={v => set("legislation", v)} />
              )}
            </div>

            <div className="px-6 pb-6 flex justify-end border-t border-gray-50 pt-4">
              <Button onClick={save} disabled={saving} className="flex items-center gap-2">
                <Info className="w-4 h-4" /> {saving ? "Saving…" : "Save All Changes"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
