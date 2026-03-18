"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Save, Eye } from "lucide-react"
import { adminApi } from "@/lib/adminApi"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface BodyBlock { heading: string; text: string }

const CATEGORIES = ["Technology", "Policy", "Workshop", "Announcement", "Compliance", "Advisory", "General"]
const MONTHS_MAP: Record<string, string> = {
  "01": "January", "02": "February", "03": "March", "04": "April",
  "05": "May", "06": "June", "07": "July", "08": "August",
  "09": "September", "10": "October", "11": "November", "12": "December",
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function parseMonthYear(dateStr: string): { month: string; year: string } {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return { month: "", year: "" }
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const y = String(d.getFullYear())
  return { month: `${MONTHS_MAP[m]} ${y}`, year: y }
}

function formatDateForDisplay(isoDate: string): string {
  const d = new Date(isoDate)
  if (isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString("en-PG", { year: "numeric", month: "long", day: "numeric" })
}

export default function NewsEditor() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const isNew = !id

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugManual, setSlugManual] = useState(false)
  const [isoDate, setIsoDate] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [excerpt, setExcerpt] = useState("")
  const [image, setImage] = useState("")
  const [author, setAuthor] = useState("OWC Communications")
  const [readTime, setReadTime] = useState("3 min read")
  const [published, setPublished] = useState(true)
  const [body, setBody] = useState<BodyBlock[]>([{ heading: "", text: "" }])

  useEffect(() => {
    if (!isNew && id) {
      adminApi.getArticle(Number(id))
        .then(r => r.json())
        .then(a => {
          setTitle(a.title)
          setSlug(a.slug)
          setSlugManual(true)
          setCategory(a.category)
          setExcerpt(a.excerpt)
          setImage(a.image)
          setAuthor(a.author)
          setReadTime(a.readTime)
          setPublished(a.published)
          setBody(a.body?.length ? a.body : [{ heading: "", text: "" }])
          const d = new Date(a.date)
          if (!isNaN(d.getTime())) setIsoDate(d.toISOString().split("T")[0])
        })
        .finally(() => setLoading(false))
    }
  }, [id, isNew])

  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!slugManual) setSlug(slugify(val))
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    const { month, year } = parseMonthYear(isoDate)
    if (!month) { setError("Please enter a valid date."); return }
    const filteredBody = body.filter(b => b.text.trim())
    const payload = {
      slug, date: formatDateForDisplay(isoDate),
      month, year, category, title, excerpt, image, author, readTime, published,
      body: filteredBody,
    }
    setSaving(true)
    try {
      const res = isNew
        ? await adminApi.createArticle(payload)
        : await adminApi.updateArticle(Number(id), payload)
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Save failed"); return }
      setSuccess(isNew ? "Article created!" : "Article updated!")
      if (isNew) setTimeout(() => router.push("/admin/news"), 1200)
    } catch {
      setError("Could not connect to server")
    } finally {
      setSaving(false)
    }
  }

  const addBlock = () => setBody(prev => [...prev, { heading: "", text: "" }])
  const removeBlock = (i: number) => setBody(prev => prev.filter((_, idx) => idx !== i))
  const updateBlock = (i: number, field: "heading" | "text", val: string) =>
    setBody(prev => prev.map((b, idx) => idx === i ? { ...b, [field]: val } : b))

  if (loading) return (
    <AdminLayout>
      <div className="p-16 text-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(210,70%,25%)] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading article…</p>
      </div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div className="w-full pb-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/admin/news" className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{isNew ? "New Article" : "Edit Article"}</h1>
              {!isNew && slug && (
                <p className="text-sm text-gray-400 mt-0.5">/{slug}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isNew && (
              <a
                href={`/news/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 bg-white border border-gray-200 px-4 py-2.5 rounded-xl transition-colors"
              >
                <Eye className="w-4 h-4" /> Preview
              </a>
            )}
            <Button
              type="submit"
              form="article-form"
              disabled={saving}
              className="flex items-center gap-2 h-10 px-5"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : isNew ? "Publish Article" : "Save Changes"}
            </Button>
          </div>
        </div>

        {error && <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-5 py-4">{error}</div>}
        {success && <div className="mb-6 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">{success}</div>}

        <form id="article-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Main content — 2/3 */}
            <div className="xl:col-span-2 space-y-6">

              {/* Article Details */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Article Details</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <Input
                    required
                    value={title}
                    onChange={e => handleTitleChange(e.target.value)}
                    placeholder="Article headline"
                    className="text-base h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
                  <Input
                    required
                    value={slug}
                    onChange={e => { setSlug(e.target.value); setSlugManual(true) }}
                    placeholder="url-friendly-slug"
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Public URL: <span className="font-mono">/news/{slug || "…"}</span></p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt *</label>
                  <Textarea
                    required
                    rows={3}
                    value={excerpt}
                    onChange={e => setExcerpt(e.target.value)}
                    placeholder="Short summary shown in news listings"
                  />
                </div>
              </div>

              {/* Body blocks */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Article Body</h2>
                  <button
                    type="button"
                    onClick={addBlock}
                    className="flex items-center gap-1.5 text-sm font-semibold text-[hsl(210,70%,25%)] hover:underline"
                  >
                    <Plus className="w-4 h-4" /> Add Section
                  </button>
                </div>
                <div className="space-y-4">
                  {body.map((block, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-5 bg-gray-50/40">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-gray-400">Section {i + 1}</span>
                        {body.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBlock(i)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <Input
                          value={block.heading}
                          onChange={e => updateBlock(i, "heading", e.target.value)}
                          placeholder="Section heading (optional)"
                        />
                        <Textarea
                          rows={4}
                          value={block.text}
                          onChange={e => updateBlock(i, "text", e.target.value)}
                          placeholder="Section text *"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar — 1/3 */}
            <div className="space-y-6">

              {/* Publish settings */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Publish</h2>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={e => setPublished(e.target.checked)}
                    className="w-4 h-4 accent-[hsl(210,70%,25%)]"
                  />
                  <label htmlFor="published" className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Published
                    <span className="block text-xs font-normal text-gray-400 mt-0.5">Visible on the public site</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date *</label>
                  <Input required type="date" value={isoDate} onChange={e => setIsoDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-10"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Meta */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Meta</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                  <Input value={author} onChange={e => setAuthor(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Read Time</label>
                  <Input value={readTime} onChange={e => setReadTime(e.target.value)} placeholder="3 min read" />
                </div>
              </div>

              {/* Hero image */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Hero Image</h2>
                <Input
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/…"
                />
                {image && (
                  <div className="rounded-xl overflow-hidden border border-gray-200 h-40">
                    <img src={image} alt="Hero preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Bottom actions */}
              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 h-11">
                  <Save className="w-4 h-4" />
                  {saving ? "Saving…" : isNew ? "Publish Article" : "Save Changes"}
                </Button>
                <Link
                  href="/admin/news"
                  className="text-sm text-center text-gray-400 hover:text-gray-700 transition-colors"
                >
                  Cancel & go back
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
