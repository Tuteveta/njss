"use client"
import { useEffect, useState } from "react"
import { Save, ChevronDown, BookOpen, Image as ImageIcon, X } from "lucide-react"
import { adminApi } from "@/lib/adminApi"
import AdminLayout from "@/components/admin/AdminLayout"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
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
                  className="aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-[hsl(210,70%,25%)] transition-all group relative">
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

interface PageEntry {
  slug: string
  badge: string
  title: string
  subtitle: string
  heroImage: string
}

export default function PagesManager() {
  const [pages, setPages] = useState<PageEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, PageEntry>>({})
  const [pickerFor, setPickerFor] = useState<string | null>(null)

  useEffect(() => {
    adminApi.getPages()
      .then(r => r.json())
      .then(d => {
        const list: PageEntry[] = d.pages || []
        setPages(list)
        const init: Record<string, PageEntry> = {}
        list.forEach(p => { init[p.slug] = { ...p } })
        setDrafts(init)
      })
      .finally(() => setLoading(false))
  }, [])

  const update = (slug: string, field: keyof PageEntry, val: string) => {
    setDrafts(prev => ({ ...prev, [slug]: { ...prev[slug], [field]: val } }))
  }

  const save = async (slug: string) => {
    setSaving(slug)
    setSaved(null)
    const { badge, title, subtitle, heroImage } = drafts[slug]
    await adminApi.updatePage(slug, { badge, title, subtitle, heroImage })
    setPages(prev => prev.map(p => p.slug === slug ? { ...drafts[slug] } : p))
    setSaving(null)
    setSaved(slug)
    setTimeout(() => setSaved(null), 2500)
  }

  return (
    <AdminLayout>
      {pickerFor && (
        <ImagePickerModal
          onSelect={url => update(pickerFor, "heroImage", url)}
          onClose={() => setPickerFor(null)}
        />
      )}
      <div className="w-full space-y-6 pb-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-400 text-sm mt-1.5">Edit hero section content for each public page</p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(210,70%,25%)] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading pages…</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {pages.map(page => {
              const draft = drafts[page.slug] || page
              const isOpen = expanded === page.slug
              return (
                <div key={page.slug}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : page.slug)}
                    className="w-full flex items-center gap-5 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[hsl(210,70%,93%)] flex items-center justify-center shrink-0">
                      <BookOpen className="w-5 h-5 text-[hsl(210,70%,30%)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-900 capitalize">{page.slug}</div>
                      <div className="text-xs text-gray-400 mt-0.5 truncate">{draft.title || "No title set"}</div>
                    </div>
                    {draft.badge && (
                      <span className="hidden sm:block text-xs font-medium bg-gray-100 text-gray-500 px-3 py-1 rounded-full shrink-0">
                        {draft.badge}
                      </span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 bg-gray-50 border-t border-gray-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Badge Label</label>
                          <Input
                            value={draft.badge}
                            onChange={e => update(page.slug, "badge", e.target.value)}
                            placeholder="e.g. Our Services"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Page Title</label>
                          <Input
                            value={draft.title}
                            onChange={e => update(page.slug, "title", e.target.value)}
                            placeholder="Hero heading"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subtitle / Description</label>
                          <Textarea
                            rows={3}
                            value={draft.subtitle}
                            onChange={e => update(page.slug, "subtitle", e.target.value)}
                            placeholder="Short description shown below the hero title"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hero Image</label>
                          <div className="flex gap-2">
                            <Input
                              value={draft.heroImage}
                              onChange={e => update(page.slug, "heroImage", e.target.value)}
                              placeholder="https://… or choose from library"
                              className="flex-1"
                            />
                            <Button type="button" variant="outline" onClick={() => setPickerFor(page.slug)} className="gap-1.5 shrink-0">
                              <ImageIcon className="w-4 h-4" /> Library
                            </Button>
                          </div>
                          {draft.heroImage && (
                            <div className="mt-3 relative inline-block">
                              <img src={draft.heroImage} alt="" className="h-28 rounded-xl object-cover border border-gray-100 max-w-full" />
                              <button
                                onClick={() => update(page.slug, "heroImage", "")}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="sm:col-span-2 flex items-center gap-3">
                          <Button
                            onClick={() => save(page.slug)}
                            disabled={saving === page.slug}
                            className="flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" />
                            {saving === page.slug ? "Saving…" : "Save Changes"}
                          </Button>
                          {saved === page.slug && (
                            <span className="text-sm text-emerald-600 font-medium">Saved successfully!</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
