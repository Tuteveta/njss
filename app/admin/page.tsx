"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Newspaper, FolderOpen,
  ArrowRight, Plus, BookOpen, Image,
  Navigation, ExternalLink, CalendarDays,
  MapPin, Users, HelpCircle, Layers, Briefcase, Info,
  Mail, Activity, UserCog,
} from "lucide-react"
import { adminApi } from "@/lib/adminApi"
import AdminLayout from "@/components/admin/AdminLayout"

interface Stats {
  newsCount: number
  publishedNews?: number
  totalDocs: number
  documentCount: number
  messageCount: number
  unreadCount: number
}

interface RecentArticle {
  id: number
  title: string
  category: string
  published: boolean
}

function StatSkeleton() {
  return (
    <div className="gf-panel animate-pulse">
      <div className="gf-panel-header"><div className="w-20 h-3 bg-gray-200 rounded" /></div>
      <div className="p-4">
        <div className="h-8 w-14 bg-gray-100 rounded mb-2" />
        <div className="h-3 w-24 bg-gray-100 rounded" />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [articles, setArticles] = useState<RecentArticle[]>([])
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("")

  useEffect(() => {
    adminApi.stats().then(r => r.json()).then(setStats)
    adminApi.me().then(r => r.json()).then(d => { setUsername(d.username); setRole(d.role ?? "") })
    adminApi.getNews().then(r => r.json()).then(d => setArticles(d.news || []))
  }, [])

  const publishedNews = stats ? (stats.publishedNews ?? 0) : 0
  const totalNews = stats?.newsCount ?? 0
  const pct = totalNews > 0 ? Math.round((publishedNews / totalNews) * 100) : 0

  const statCards = stats ? [
    {
      label: "News Articles", value: totalNews,
      sub: `${publishedNews} published · ${totalNews - publishedNews} drafts`,
      pct, bar: "bg-[hsl(352,83%,55%)]",
      icon: Newspaper, fg: "text-[hsl(352,75%,33%)]", href: "/admin/news",
    },
    {
      label: "Documents", value: stats.documentCount,
      sub: "PDF resources uploaded",
      pct: null, bar: "",
      icon: FolderOpen, fg: "text-orange-600", href: "/admin/documents",
    },
    {
      label: "Messages", value: stats.messageCount,
      sub: `${stats.unreadCount} unread`,
      pct: null, bar: "",
      icon: Mail, fg: "text-emerald-600", href: "/admin/messages",
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
    ...(role === "superadmin" ? [
      { label: "User Management", desc: "Create and manage admin user accounts",         href: "/admin/users",       icon: UserCog,     primary: false },
    ] : []),
  ]

  return (
    <AdminLayout>
      <div className="w-full space-y-6 pb-8">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Activity className="w-4 h-4 text-[hsl(352,83%,55%)]" />
              <h1 className="text-base font-bold text-gray-900 tracking-tight">
                Welcome back{username ? `, ${username}` : ""}
              </h1>
            </div>
            <p className="text-[11px] text-gray-400 gf-metric">
              {new Date().toLocaleDateString("en-PG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <Link
            href="/admin/news/new"
            className="hidden sm:flex items-center gap-2 bg-[hsl(352,83%,48%)] text-white text-xs font-semibold px-3 py-2 rounded hover:bg-[hsl(352,75%,23%)] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Article
          </Link>
        </div>

        {/* Stat panels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats ? statCards.map(card => (
            <Link key={card.label} href={card.href} className="gf-panel hover:border-[hsl(210,70%,50%)] transition-colors group">
              <div className="gf-panel-header">
                <span className="gf-panel-title flex items-center gap-1.5">
                  <card.icon className={`w-3.5 h-3.5 ${card.fg}`} />
                  {card.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[hsl(352,83%,55%)] transition-colors" />
              </div>
              <div className="p-4">
                <div className={`text-4xl font-bold text-gray-900 gf-metric mb-1`}>{card.value}</div>
                <div className="text-[11px] text-gray-400">{card.sub}</div>
                {card.pct !== null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Published</span>
                      <span className="gf-metric font-semibold text-gray-600">{card.pct}%</span>
                    </div>
                    <div className="h-1 bg-gray-100 overflow-hidden">
                      <div className={`h-full ${card.bar}`} style={{ width: `${card.pct}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          )) : Array(3).fill(0).map((_, i) => <StatSkeleton key={i} />)}
        </div>

        {/* Activity + Site links */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Recent Articles */}
          <div className="xl:col-span-2 gf-panel overflow-hidden">
            <div className="gf-panel-header">
              <span className="gf-panel-title">Recent Articles</span>
              <Link href="/admin/news" className="text-[11px] font-medium text-[hsl(352,83%,55%)] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {articles.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <Newspaper className="w-7 h-7 text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-xs">No articles yet</p>
                </div>
              ) : articles.slice(0, 6).map(a => (
                <Link key={a.id} href={`/admin/news/${a.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.published ? "bg-emerald-400" : "bg-gray-300"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{a.title}</div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{a.category}</span>
                </Link>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60">
              <Link href="/admin/news/new"
                className="flex items-center justify-center gap-2 w-full py-2 bg-[hsl(352,83%,48%)] text-white text-xs font-semibold hover:bg-[hsl(352,75%,23%)] transition-colors rounded"
              >
                <Plus className="w-3.5 h-3.5" /> Write New Article
              </Link>
            </div>
          </div>

          {/* Public site links */}
          <div className="gf-panel overflow-hidden">
            <div className="gf-panel-header">
              <span className="gf-panel-title">Public Site</span>
              <span className="gf-status-dot online" />
            </div>
            <div className="divide-y divide-gray-100">
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
                  className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-xs text-gray-600 group-hover:text-gray-900 font-medium">{link.label}</span>
                  <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-[hsl(352,83%,55%)]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="gf-panel overflow-hidden">
          <div className="gf-panel-header">
            <span className="gf-panel-title">All Sections</span>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {quickActions.map(action => (
              <Link key={action.label} href={action.href}
                className={`flex flex-col gap-2 p-3 rounded border transition-all group ${
                  action.primary
                    ? "bg-[hsl(352,83%,48%)] border-[hsl(352,75%,23%)] hover:bg-[hsl(352,75%,23%)]"
                    : "bg-white border-gray-200 hover:border-[hsl(210,70%,50%)] hover:bg-red-50/30"
                }`}
              >
                <action.icon className={`w-4 h-4 ${action.primary ? "text-white" : "text-gray-400 group-hover:text-[hsl(352,83%,55%)]"}`} />
                <div className={`text-[11px] font-bold leading-tight ${action.primary ? "text-white" : "text-gray-700"}`}>{action.label}</div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}
