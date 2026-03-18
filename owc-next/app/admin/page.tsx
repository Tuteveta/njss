"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Newspaper, FolderOpen,
  ArrowRight, Plus, BookOpen, Image,
  Navigation, ExternalLink, CalendarDays,
  MapPin, Users, HelpCircle, Layers, Briefcase, Info,
} from "lucide-react"
import { adminApi } from "@/lib/adminApi"
import AdminLayout from "@/components/admin/AdminLayout"

interface Stats {
  totalNews: number
  publishedNews: number
  totalDocs: number
}

interface RecentArticle {
  id: number
  title: string
  category: string
  published: boolean
}

function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-xl bg-gray-100" />
        <div className="w-8 h-4 bg-gray-100 rounded" />
      </div>
      <div className="h-9 w-16 bg-gray-100 rounded mb-2" />
      <div className="h-4 w-24 bg-gray-100 rounded mb-1" />
      <div className="h-3 w-20 bg-gray-100 rounded" />
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [articles, setArticles] = useState<RecentArticle[]>([])
  const [username, setUsername] = useState("")

  useEffect(() => {
    adminApi.stats().then(r => r.json()).then(setStats)
    adminApi.me().then(r => r.json()).then(d => setUsername(d.username))
    adminApi.getNews().then(r => r.json()).then(d => setArticles(d.articles || []))
  }, [])

  const statCards = stats ? [
    {
      label: "News Articles", value: stats.totalNews,
      sub: `${stats.publishedNews} published · ${stats.totalNews - stats.publishedNews} drafts`,
      pct: stats.totalNews > 0 ? Math.round((stats.publishedNews / stats.totalNews) * 100) : 0,
      pctLabel: "published",
      icon: Newspaper, bg: "bg-[hsl(210,70%,93%)]", fg: "text-[hsl(210,70%,30%)]",
      bar: "bg-[hsl(210,70%,40%)]", href: "/admin/news",
    },
    {
      label: "Documents", value: stats.totalDocs,
      sub: "PDF resources uploaded",
      pct: null, pctLabel: "",
      icon: FolderOpen, bg: "bg-orange-50", fg: "text-orange-700",
      bar: "bg-orange-400", href: "/admin/documents",
    },
  ] : []

  const quickActions = [
    { label: "Write Article",    desc: "Create and publish a news update",            href: "/admin/news/new",    icon: Plus,        primary: true },
    { label: "News Articles",    desc: "Manage published articles and drafts",         href: "/admin/news",        icon: Newspaper,   primary: false },
    { label: "Events",           desc: "Manage upcoming and past events",              href: "/admin/events",      icon: CalendarDays,primary: false },
    { label: "Hero Slides",      desc: "Edit homepage carousel slides",                href: "/admin/hero-slides", icon: Layers,      primary: false },
    { label: "Services",         desc: "Manage services shown on Services page",       href: "/admin/services",    icon: Briefcase,   primary: false },
    { label: "FAQs",             desc: "Manage frequently asked questions",            href: "/admin/faqs",        icon: HelpCircle,  primary: false },
    { label: "About Content",    desc: "Edit mission, values, and about sections",     href: "/admin/about",       icon: Info,        primary: false },
    { label: "Leadership",       desc: "Edit leadership team profiles",                href: "/admin/leadership",  icon: Users,       primary: false },
    { label: "Offices",          desc: "Update office locations and contact details",  href: "/admin/offices",     icon: MapPin,      primary: false },
    { label: "Pages",            desc: "Edit hero content for each public page",       href: "/admin/pages",       icon: BookOpen,    primary: false },
    { label: "Media Library",    desc: "Upload and manage site images",                href: "/admin/media",       icon: Image,       primary: false },
    { label: "Documents",        desc: "Upload and publish PDF resources",             href: "/admin/documents",   icon: FolderOpen,  primary: false },
    { label: "Navigation",       desc: "Edit and reorder the site menu",               href: "/admin/menus",       icon: Navigation,  primary: false },
  ]

  return (
    <AdminLayout>
      <div className="w-full space-y-8 pb-8">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back{username ? `, ${username}` : ""}
            </h1>
            <p className="text-gray-400 text-sm mt-1.5">
              {new Date().toLocaleDateString("en-PG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <Link
            href="/admin/news/new"
            className="hidden sm:flex items-center gap-2 bg-[hsl(210,70%,25%)] text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-[hsl(210,70%,20%)] transition-colors"
          >
            <Plus className="w-4 h-4" /> New Article
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats ? statCards.map(card => (
            <Link
              key={card.label}
              href={card.href}
              className="relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all group flex flex-col"
            >
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                  <card.icon className={`w-6 h-6 ${card.fg}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all mt-1" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
              <div className="text-sm font-semibold text-gray-700">{card.label}</div>
              <div className="text-xs text-gray-400 mt-0.5 mb-4">{card.sub}</div>
              {card.pct !== null && (
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">{card.pctLabel}</span>
                    <span className="text-[10px] font-semibold text-gray-600">{card.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${card.bar}`} style={{ width: `${card.pct}%` }} />
                  </div>
                </div>
              )}
            </Link>
          )) : (
            Array(2).fill(0).map((_, i) => <StatSkeleton key={i} />)
          )}
        </div>

        {/* Activity + Site links */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Recent Articles */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-800">Recent Articles</h2>
              <Link href="/admin/news" className="text-xs font-medium text-[hsl(210,70%,30%)] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {articles.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Newspaper className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No articles yet</p>
                </div>
              ) : articles.slice(0, 6).map(a => (
                <Link key={a.id} href={`/admin/news/${a.id}/edit`}
                  className="flex items-start gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                    <Newspaper className="w-3.5 h-3.5 text-gray-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate mb-1">{a.title}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{a.category}</span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${a.published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {a.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-gray-200">
              <Link href="/admin/news/new"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[hsl(210,70%,25%)] text-white text-sm font-medium hover:bg-[hsl(210,70%,20%)] transition-colors"
              >
                <Plus className="w-4 h-4" /> Write New Article
              </Link>
            </div>
          </div>

          {/* Public site links */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-sm font-bold text-gray-800">Public Site</h2>
            </div>
            <div className="p-4 space-y-1">
              {[
                { label: "Home",      path: "/" },
                { label: "About",     path: "/about" },
                { label: "Services",  path: "/services" },
                { label: "News",      path: "/news" },
                { label: "Events",    path: "/events" },
                { label: "Resources", path: "/resources" },
                { label: "Contact",   path: "/contact" },
              ].map(link => (
                <a key={link.path} href={link.path} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{link.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">All Sections</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickActions.map(action => (
              <Link key={action.label} href={action.href}
                className={`flex flex-col justify-between rounded-2xl p-6 transition-all group min-h-[130px] ${
                  action.primary
                    ? "bg-[hsl(210,70%,25%)] hover:bg-[hsl(210,70%,20%)] shadow-md hover:shadow-lg"
                    : "bg-white border border-gray-200 hover:shadow-md"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                  action.primary ? "bg-white/15" : "bg-gray-50 group-hover:bg-gray-100"
                }`}>
                  <action.icon className={`w-5 h-5 ${action.primary ? "text-white" : "text-gray-500"}`} />
                </div>
                <div>
                  <div className={`text-sm font-bold mb-1 ${action.primary ? "text-white" : "text-gray-800"}`}>{action.label}</div>
                  <div className={`text-xs leading-relaxed ${action.primary ? "text-blue-200" : "text-gray-400"}`}>{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
