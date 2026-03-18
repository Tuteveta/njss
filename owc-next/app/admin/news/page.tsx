"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, Newspaper } from "lucide-react"
import { adminApi } from "@/lib/adminApi"
import AdminLayout from "@/components/admin/AdminLayout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Article {
  id: number
  slug: string
  date: string
  category: string
  title: string
  excerpt: string
  image: string
  published: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "bg-blue-50 text-blue-700",
  Policy: "bg-purple-50 text-purple-700",
  Workshop: "bg-orange-50 text-orange-700",
  Announcement: "bg-red-50 text-red-800",
  Compliance: "bg-red-50 text-red-700",
  Advisory: "bg-yellow-50 text-yellow-700",
  General: "bg-gray-100 text-gray-600",
}

export default function NewsManager() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all")
  const [deleting, setDeleting] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    adminApi.getNews()
      .then(r => r.json())
      .then(d => setArticles(d.articles || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    await adminApi.deleteArticle(id)
    setArticles(prev => prev.filter(a => a.id !== id))
    setDeleting(null)
  }

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || (filter === "published" ? a.published : !a.published)
    return matchSearch && matchFilter
  })

  const published = articles.filter(a => a.published).length
  const drafts = articles.length - published

  return (
    <AdminLayout>
      <div className="w-full space-y-6 pb-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">News Articles</h1>
            <p className="text-gray-400 text-sm mt-1.5">
              {articles.length} total · {published} published · {drafts} drafts
            </p>
          </div>
          <Link href="/admin/news/new">
            <Button className="flex items-center gap-2 h-10 px-5">
              <Plus className="w-4 h-4" /> New Article
            </Button>
          </Link>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search by title, category or excerpt…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden shrink-0">
            {(["all", "published", "draft"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? "bg-[hsl(210,70%,25%)] text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {f === "all" ? `All (${articles.length})` : f === "published" ? `Published (${published})` : `Drafts (${drafts})`}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(210,70%,25%)] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading articles…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <Newspaper className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No articles found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search or filter</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_auto_auto_auto_auto] border-b border-gray-200 bg-gray-50/60 px-6">
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Article</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:block px-4">Category</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:block px-4">Date</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">Status</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</div>
              </div>
              <div className="divide-y divide-gray-200">
                {filtered.map(a => (
                  <div key={a.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center px-6 py-4 hover:bg-gray-50/60 transition-colors group">
                    {/* Article info */}
                    <div className="flex items-center gap-4 min-w-0 pr-4">
                      {a.image ? (
                        <img src={a.image} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0 bg-gray-100" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <Newspaper className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 leading-snug line-clamp-1 text-sm">{a.title}</div>
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{a.excerpt}</div>
                      </div>
                    </div>
                    {/* Category */}
                    <div className="hidden md:block px-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[a.category] || "bg-gray-100 text-gray-600"}`}>
                        {a.category}
                      </span>
                    </div>
                    {/* Date */}
                    <div className="hidden lg:block px-4 text-sm text-gray-500 whitespace-nowrap">{a.date}</div>
                    {/* Status */}
                    <div className="px-4">
                      {a.published ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full whitespace-nowrap">
                          <Eye className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                          <EyeOff className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/news/${a.id}/edit`}
                        className="p-2 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-[hsl(210,70%,25%)] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <a
                        href={`/news/${a.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-gray-400 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                        title="View on site"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
                        disabled={deleting === a.id}
                        className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
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
