"use client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Calendar, Tag, Clock, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NewsItem {
  id: number; slug: string; date: string; month: string; year: string;
  category: string; title: string; excerpt: string; image: string;
  author: string; read_time: string; readTime?: string;
  body: { heading?: string; text: string }[]
}

export default function NewsArticle() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug
  const router = useRouter()
  const [allNews, setAllNews] = useState<NewsItem[]>([])
  const [article, setArticle] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/news").then(r => r.json()).then(d => {
      const news: NewsItem[] = d.news || []
      setAllNews(news)
      const found = news.find((n) => n.slug === slug) || null
      setArticle(found)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-400">Loading…</div>

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
        <p className="text-gray-500 mb-6">The article you are looking for does not exist or has been removed.</p>
        <Link href="/news" className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(352,83%,48%)] hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    )
  }

  const currentIndex = allNews.findIndex((n) => n.slug === slug)
  const prev = currentIndex > 0 ? allNews[currentIndex - 1] : null
  const next = currentIndex < allNews.length - 1 ? allNews[currentIndex + 1] : null
  const related = allNews.filter((n) => n.slug !== slug && n.category === article.category).slice(0, 2)

  return (
    <div>
      {/* Hero image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[hsl(352,75%,15%)]/70" />
        <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-6 lg:px-10 pb-10 w-full left-0 right-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-red-200 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/news" className="hover:text-white">News & Updates</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white truncate max-w-xs">{article.title}</span>
          </nav>
          <Badge className="mb-3 bg-red-600 border-0 text-white w-fit">{article.category}</Badge>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-blue-100">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{article.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{article.readTime || article.read_time}</span>
            <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" />{article.author}</span>
          </div>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Article body */}
            <article className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10">
                {/* Excerpt lead */}
                <p className="text-base text-gray-700 font-medium leading-relaxed border-l-4 border-red-600 pl-4 mb-8">
                  {article.excerpt}
                </p>

                <div className="space-y-6">
                  {(article.body || []).map((block, i) => (
                    <div key={i}>
                      {block.heading && (
                        <h2 className="text-lg font-bold text-gray-900 mb-2">{block.heading}</h2>
                      )}
                      <p className="text-sm text-gray-600 leading-relaxed">{block.text}</p>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="mt-10 pt-6 border-t border-gray-100 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-400 font-medium">Tagged:</span>
                  <Badge variant="secondary">{article.category}</Badge>
                  <Badge variant="secondary">Judicial Services</Badge>
                  <Badge variant="secondary">PNG</Badge>
                </div>
              </div>

              {/* Prev / Next */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev ? (
                  <Link
                    href={`/news/${prev.slug}`}
                    className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:-translate-y-0.5 transition-all group"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-400 mt-1 shrink-0 group-hover:text-[hsl(352,83%,48%)]" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">Previous</p>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-[hsl(352,83%,48%)] leading-snug line-clamp-2">{prev.title}</p>
                    </div>
                  </Link>
                ) : <div />}
                {next && (
                  <Link
                    href={`/news/${next.slug}`}
                    className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4 hover:-translate-y-0.5 transition-all group text-right justify-end"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">Next</p>
                      <p className="text-sm font-medium text-gray-800 group-hover:text-[hsl(352,83%,48%)] leading-snug line-clamp-2">{next.title}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-1 shrink-0 group-hover:text-[hsl(352,83%,48%)]" />
                  </Link>
                )}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:w-72 shrink-0 space-y-6">
              {/* Back */}
              <button
                onClick={() => router.push("/news")}
                className="flex items-center gap-2 text-sm font-medium text-[hsl(352,83%,48%)] hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> All Articles
              </button>

              {/* Related */}
              {related.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <Link key={r.id} href={`/news/${r.slug}`} className="flex gap-3 group">
                        <img src={r.image} alt={r.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-800 group-hover:text-[hsl(352,83%,48%)] leading-snug line-clamp-2">{r.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{r.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All recent */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Recent Articles</h3>
                <div className="space-y-3">
                  {allNews.filter((n) => n.slug !== slug).slice(0, 4).map((r) => (
                    <Link key={r.id} href={`/news/${r.slug}`} className="flex items-start gap-2 group">
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300 mt-0.5 shrink-0 group-hover:text-[hsl(352,83%,48%)]" />
                      <div>
                        <p className="text-xs font-medium text-gray-700 group-hover:text-[hsl(352,83%,48%)] leading-snug line-clamp-2">{r.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-[hsl(352,83%,48%)] rounded-xl p-5 text-white">
                <h3 className="font-semibold mb-2 text-sm">Need Assistance?</h3>
                <p className="text-xs text-blue-100 mb-4 leading-relaxed">Our case officers are available Monday–Friday to help with your claim.</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Contact NJSS <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </div>
  )
}
