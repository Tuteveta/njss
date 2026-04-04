"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Calendar, Tag, Archive, ChevronRight, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import PageHero from "@/components/PageHero"

interface NewsItem { id: number; slug: string; date: string; month: string; year: string; category: string; title: string; excerpt: string; image: string; author: string; read_time: string }

export default function News() {
  const [allNews, setAllNews] = useState<NewsItem[]>([])
  const [search, setSearch] = useState("")
  const [activeMonth, setActiveMonth] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch("/api/news").then(r => r.json()).then(d => {
      const news = d.news || []
      setAllNews(news)
      const archMap: Record<string, boolean> = {}
      news.forEach((n: NewsItem) => { archMap[n.year] = true })
      setExpandedYears(Object.fromEntries(Object.keys(archMap).map(y => [y, true])))
    }).catch(() => {})
  }, [])

  const archiveMap: Record<string, Record<string, number>> = {}
  allNews.forEach((n) => {
    if (!archiveMap[n.year]) archiveMap[n.year] = {}
    archiveMap[n.year][n.month] = (archiveMap[n.year][n.month] ?? 0) + 1
  })
  const categories = Array.from(new Set(allNews.map((n) => n.category)))

  const filtered = allNews.filter((n) => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase())
    const matchMonth = activeMonth ? n.month === activeMonth : true
    const matchCategory = activeCategory ? n.category === activeCategory : true
    return matchSearch && matchMonth && matchCategory
  })

  const clearFilters = () => {
    setActiveMonth(null)
    setActiveCategory(null)
    setSearch("")
  }

  const hasFilters = search || activeMonth || activeCategory

  return (
    <div>
      <PageHero
        badge="Updates"
        title="News & Announcements"
        subtitle="Stay up to date with the latest news, policy changes, and events from the National Judicial Staff Service."
        crumbs={[{ label: "News & Updates" }]}
        image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=80"
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0 space-y-4">
              {/* Search */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <Input
                    placeholder="Search news..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-0 p-0 h-auto focus-visible:ring-0 text-sm"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                  <Tag className="w-4 h-4 text-[hsl(352,83%,48%)]" /> Categories
                </h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveCategory(null)}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                        !activeCategory
                          ? "bg-[hsl(352,75%,97%)] text-[hsl(352,83%,48%)] font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      All Categories
                      <span className="text-xs text-gray-400">{allNews.length}</span>
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                        className={`w-full text-left text-sm px-2 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                          activeCategory === cat
                            ? "bg-[hsl(352,75%,97%)] text-[hsl(352,83%,48%)] font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {cat}
                        <span className="text-xs text-gray-400">
                          {allNews.filter((n) => n.category === cat).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Archive */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                  <Archive className="w-4 h-4 text-[hsl(352,83%,48%)]" /> Archive
                </h3>
                <div className="space-y-1">
                  {Object.keys(archiveMap)
                    .sort((a, b) => Number(b) - Number(a))
                    .map((year) => (
                      <div key={year}>
                        <button
                          onClick={() =>
                            setExpandedYears((prev) => ({ ...prev, [year]: !prev[year] }))
                          }
                          className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <span className="flex items-center gap-1">
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
                                expandedYears[year] ? "" : "-rotate-90"
                              }`}
                            />
                            {year}
                          </span>
                          <span className="text-xs text-gray-400 font-normal">
                            {allNews.filter((n) => n.year === year).length}
                          </span>
                        </button>
                        {expandedYears[year] && (
                          <ul className="ml-4 mt-0.5 space-y-0.5">
                            {Object.keys(archiveMap[year]).map((month) => (
                              <li key={month}>
                                <button
                                  onClick={() =>
                                    setActiveMonth(month === activeMonth ? null : month)
                                  }
                                  className={`w-full text-left text-sm px-2 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                                    activeMonth === month
                                      ? "bg-[hsl(352,75%,97%)] text-[hsl(352,83%,48%)] font-medium"
                                      : "text-gray-500 hover:bg-gray-50"
                                  }`}
                                >
                                  <span className="flex items-center gap-1">
                                    <ChevronRight className="w-3 h-3 text-gray-300" />
                                    {month.split(" ")[0]}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {archiveMap[year][month]}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Clear filters */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 underline text-center"
                >
                  Clear all filters
                </button>
              )}
            </aside>

            {/* Articles grid */}
            <div className="flex-1">
              {hasFilters && (
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                  Showing <strong className="text-gray-800">{filtered.length}</strong> article{filtered.length !== 1 ? "s" : ""}
                  {activeMonth && <Badge variant="secondary">{activeMonth}</Badge>}
                  {activeCategory && <Badge variant="secondary">{activeCategory}</Badge>}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((n) => (
                  <Link key={n.id} href={`/news/${n.slug}`} className="group block">
                    <Card className="h-full group-hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                      <div className="h-44 overflow-hidden">
                        <img src={n.image} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <Tag className="w-3 h-3" />{n.category}
                          </Badge>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />{n.date}
                          </span>
                        </div>
                        <CardTitle className="text-base leading-snug mt-2 group-hover:text-[hsl(352,83%,48%)] transition-colors">{n.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm">{n.excerpt}</CardDescription>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[hsl(352,83%,48%)] group-hover:gap-2 transition-all">
                          Read more <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400">
                  No articles found. <button onClick={clearFilters} className="underline hover:text-gray-600">Clear filters</button>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
