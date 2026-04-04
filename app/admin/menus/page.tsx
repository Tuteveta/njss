"use client"
import { useEffect, useState } from "react"
import { Plus, Trash2, Save, GripVertical, Navigation } from "lucide-react"
import { adminApi } from "@/lib/adminApi"
import AdminLayout from "@/components/admin/AdminLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MenuItem {
  id?: number
  label: string
  href: string
  position: number
}

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  useEffect(() => {
    adminApi.getMenus()
      .then(r => r.json())
      .then(d => setItems((d.items || []).sort((a: MenuItem, b: MenuItem) => a.position - b.position)))
      .finally(() => setLoading(false))
  }, [])

  const add = () => setItems(prev => [...prev, { label: "", href: "", position: prev.length }])

  const remove = (i: number) =>
    setItems(prev => prev.filter((_, idx) => idx !== i).map((item, idx) => ({ ...item, position: idx })))

  const update = (i: number, field: "label" | "href", val: string) =>
    setItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item))

  const handleSave = async () => {
    setError("")
    const payload = items.map((item, idx) => ({ ...item, position: idx }))
    setSaving(true)
    try {
      const res = await adminApi.saveMenus(payload)
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || "Save failed")
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      }
    } catch {
      setError("Could not connect to server")
    } finally {
      setSaving(false)
    }
  }

  const onDragStart = (i: number) => setDragIdx(i)
  const onDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) return
    setItems(prev => {
      const next = [...prev]
      const [moved] = next.splice(dragIdx, 1)
      next.splice(i, 0, moved)
      setDragIdx(i)
      return next.map((item, idx) => ({ ...item, position: idx }))
    })
  }
  const onDragEnd = () => setDragIdx(null)

  return (
    <AdminLayout>
      <div className="w-full space-y-6 pb-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Navigation Menu</h1>
            <p className="text-gray-400 text-sm mt-1.5">Drag items to reorder · changes apply to the public site</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-sm text-emerald-600 font-semibold">Saved!</span>}
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2 h-10 px-5">
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save Menu"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-5 py-3">{error}</div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Menu editor */}
          <div className="xl:col-span-2 space-y-3">
            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
                <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(352,83%,48%)] rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading menu…</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-200">
                  {items.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <Navigation className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No menu items yet. Add one below.</p>
                    </div>
                  ) : (
                    <>
                      {/* Column headers */}
                      <div className="grid grid-cols-[40px_32px_1fr_1fr_40px] items-center px-4 py-3 bg-gray-50/60 border-b border-gray-200">
                        <div />
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">#</div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">Label</div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">Path</div>
                        <div />
                      </div>
                      {items.map((item, i) => (
                        <div
                          key={i}
                          draggable
                          onDragStart={() => onDragStart(i)}
                          onDragOver={e => onDragOver(e, i)}
                          onDragEnd={onDragEnd}
                          className={`grid grid-cols-[40px_32px_1fr_1fr_40px] items-center px-4 py-3.5 transition-colors ${
                            dragIdx === i ? "bg-[hsl(210,70%,97%)]" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="cursor-grab active:cursor-grabbing flex items-center justify-center">
                            <GripVertical className="w-4 h-4 text-gray-300" />
                          </div>
                          <span className="text-xs text-gray-400 font-medium">{i + 1}</span>
                          <div className="px-2">
                            <Input
                              value={item.label}
                              onChange={e => update(i, "label", e.target.value)}
                              placeholder="Label"
                              className="h-9"
                            />
                          </div>
                          <div className="px-2">
                            <Input
                              value={item.href}
                              onChange={e => update(i, "href", e.target.value)}
                              placeholder="/path"
                              className="h-9 text-sm"
                            />
                          </div>
                          <button
                            onClick={() => remove(i)}
                            className="flex items-center justify-center p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <button
                  onClick={add}
                  className="flex items-center gap-2 text-sm font-semibold text-[hsl(352,83%,48%)] hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add Menu Item
                </button>
              </>
            )}
          </div>

          {/* Preview panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-sm font-bold text-gray-800">Live Preview</h2>
                <p className="text-xs text-gray-400 mt-0.5">How the menu will appear</p>
              </div>
              <div className="p-4">
                {items.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No items to preview</p>
                ) : (
                  <nav className="space-y-1">
                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group"
                      >
                        <span className="text-sm font-medium text-gray-800">{item.label || <span className="text-gray-300 italic">Label</span>}</span>
                        <span className="text-xs text-gray-400">{item.href || "/"}</span>
                      </div>
                    ))}
                  </nav>
                )}
              </div>
            </div>

            <div className="bg-[hsl(210,70%,97%)] rounded-2xl border border-[hsl(210,70%,88%)] px-5 py-4">
              <p className="text-xs font-semibold text-[hsl(352,75%,33%)] mb-1">How it works</p>
              <p className="text-xs text-[hsl(352,83%,55%)] leading-relaxed">
                Drag items to reorder. Set the label (display name) and path (e.g. <code>/about</code>). Click <strong>Save Menu</strong> to publish changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
