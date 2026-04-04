"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Menu, X, ChevronDown, FileText, Lock, Search, Newspaper, CalendarCheck,
  Layers, ArrowRight, BookOpen, Scale, Users, Building2, Library,
  Calendar, Gavel, Scroll, ClipboardList, Info, LayoutList,
  BookMarked, Briefcase, MessageSquareWarning, GraduationCap,
  MapPin, Shield, Languages, FileVideo
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Gov Banner ────────────────────────────────────────────────────────────────
function GovBanner() {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-gray-900 text-xs border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="https://flagcdn.com/h20/pg.png" alt="Papua New Guinea Flag" className="h-3.5 w-auto opacity-90 shrink-0" />
          <span className="text-gray-300/80 font-medium tracking-wide">An Official Papua New Guinea Government Website</span>
          <span className="hidden sm:inline text-white/20 select-none">|</span>
          <button
            onClick={() => setOpen(o => !o)}
            className="hidden sm:flex items-center gap-1 text-amber-400/80 hover:text-amber-300 font-medium transition-colors"
          >
            How to identify
            <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", open && "rotate-180")} />
          </button>
        </div>
      </div>
      {open && (
        <div className="bg-gray-900 border-t border-gray-700/60">
          <div className="max-w-7xl mx-auto px-4 lg:px-10 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-1">Official website links end with .gov.pg</p>
                <p className="text-gray-400 leading-relaxed text-xs">Government agencies communicate via .gov.pg websites (e.g. go.gov.pg/open).</p>
                <a href="https://go.gov.pg" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-white hover:underline mt-1.5 inline-block text-xs transition-colors">
                  Trusted websites →
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-1">Secure websites use HTTPS</p>
                <p className="text-gray-400 leading-relaxed text-xs">Look for a <strong className="text-gray-200">lock (🔒)</strong> or <span className="font-mono text-gray-200">https://</span> before sharing sensitive information.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Search types ──────────────────────────────────────────────────────────────
interface SearchResult { type: "news" | "event" | "service"; id: number; title: string; meta: string; url: string }

const RESULT_META: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  news:    { icon: Newspaper,     label: "News",    color: "text-red-700 bg-red-50" },
  event:   { icon: CalendarCheck, label: "Event",   color: "text-emerald-600 bg-emerald-50" },
  service: { icon: Layers,        label: "Service", color: "text-purple-600 bg-purple-50" },
}

// ── NavSearch panel ───────────────────────────────────────────────────────────
function NavSearch({ onClose }: { onClose: () => void }) {
  const [query,   setQuery]   = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router  = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return }
    const t = setTimeout(() => {
      setLoading(true)
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then(r => r.json())
        .then((d: { results?: SearchResult[] }) => setResults(d.results ?? []))
        .catch(() => {})
        .finally(() => setLoading(false))
    }, 280)
    return () => clearTimeout(t)
  }, [query])

  const submit = (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/news?q=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  const grouped = ["news", "event", "service"]
    .map(type => ({ type, items: results.filter(r => r.type === type) }))
    .filter(g => g.items.length > 0)

  return (
    <div className="border-t border-gray-800 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-4">
        <form onSubmit={submit}>
          <div className="flex items-center gap-3 border border-gray-700 rounded-xl h-12 bg-white/6 focus-within:bg-white/10 focus-within:border-amber-400/60 transition-all px-4">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search court services, news, events, forms…"
              className="flex-1 text-sm text-white bg-transparent outline-none placeholder:text-gray-500"
            />
            {loading && <div className="w-4 h-4 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin shrink-0" />}
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-200 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>

        {grouped.length > 0 && (
          <div className="mt-3 bg-white rounded-xl border border-gray-100 overflow-hidden">
            {grouped.map(({ type, items }) => {
              const meta = RESULT_META[type]
              const Icon = meta.icon
              return (
                <div key={type}>
                  <div className="px-4 pt-3 pb-1">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.color}`}>
                      <Icon className="w-3 h-3" /> {meta.label}
                    </span>
                  </div>
                  {items.map(r => (
                    <Link
                      key={`${r.type}-${r.id}`}
                      href={r.url}
                      onClick={onClose}
                      className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm text-gray-800 font-medium line-clamp-1">{r.title}</span>
                      {r.meta && <span className="text-xs text-gray-400 shrink-0">{r.meta}</span>}
                    </Link>
                  ))}
                </div>
              )
            })}
            <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-gray-400">{results.length} result{results.length !== 1 ? "s" : ""}</span>
              <button onClick={submit as unknown as React.MouseEventHandler} className="text-xs font-semibold text-[hsl(352,83%,44%)] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {query.trim().length >= 2 && results.length === 0 && !loading && (
          <p className="mt-3 text-sm text-gray-400 px-1">
            No results for <strong className="text-gray-200">"{query}"</strong> — try a different keyword.
          </p>
        )}
      </div>
    </div>
  )
}

// ── Nav item types with mega menu support ─────────────────────────────────────
interface NavChild {
  label: string
  href: string
  description?: string
  icon?: React.ElementType
}
interface NavColumn {
  heading?: string
  items: NavChild[]
}
interface NavItem {
  label: string
  href: string
  columns?: NavColumn[]
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Supreme Court",
    href: "/supreme-court/listings",
    columns: [
      {
        heading: "Court Operations",
        items: [
          {
            label: "Daily Court Diary",
            href: "/supreme-court/daily-diary",
            description: "Today's scheduled sittings and appearances",
            icon: Calendar,
          },
          {
            label: "Listings",
            href: "/supreme-court/listings",
            description: "Case listings by division, judge and status",
            icon: LayoutList,
          },
        ],
      },
      {
        heading: "Legal Resources",
        items: [
          {
            label: "Acts and Rules",
            href: "/supreme-court/acts-rules",
            description: "Constitution, Acts, Rules and Practice Directions",
            icon: Scroll,
          },
          {
            label: "Summary Determinations",
            href: "/supreme-court/summary-determinations",
            description: "Published judgment summaries and abstracts",
            icon: Gavel,
          },
        ],
      },
    ],
  },
  {
    label: "National Court",
    href: "/national-court/daily-diary",
    columns: [
      {
        heading: "Court Services",
        items: [
          { label: "Daily Court Diary",       href: "/national-court/daily-diary",          description: "Today's scheduled sittings",              icon: Calendar   },
          { label: "Provincial Registries",   href: "/national-court/provincial-registries", description: "Registry locations nationwide",           icon: MapPin     },
          { label: "Sheriff",                 href: "/national-court/sheriff",               description: "Service of process & execution",          icon: Shield     },
          { label: "Interpreting Service",    href: "/national-court/interpreting-service",  description: "Language assistance in proceedings",      icon: Languages  },
          { label: "Court Reporting Service", href: "/national-court/court-reporting",       description: "Transcripts & audio recordings",          icon: FileVideo  },
        ],
      },
      {
        heading: "Cases & Procedure",
        items: [
          { label: "Criminal Cases",  href: "/national-court/criminal-cases", description: "Indictable offences & criminal jurisdiction",  icon: Gavel      },
          { label: "Civil Cases",     href: "/national-court/civil-cases",    description: "ADR, Equity, Common Law & Tribunals",           icon: Scale      },
          { label: "Listings",        href: "/national-court/listings",       description: "Weekly case listings & schedules",             icon: LayoutList },
          { label: "Acts & Rules",    href: "/national-court/acts-rules",     description: "Legislation, rules & practice directions",     icon: BookOpen   },
        ],
      },
    ],
  },
  {
    label: "About The Courts",
    href: "/about",
    columns: [
      {
        heading: "Court Information",
        items: [
          {
            label: "Daily Court Diary",
            href: "/about/daily-diary",
            description: "Today's scheduled sittings and appearances",
            icon: Calendar,
          },
          {
            label: "Court Calendar 2018",
            href: "/about/court-calendar",
            description: "Official annual sitting calendar",
            icon: BookOpen,
          },
          {
            label: "Judges",
            href: "/about/judges",
            description: "Supreme & National Court judicial officers",
            icon: Scale,
          },
          {
            label: "Court Administration",
            href: "/about/court-administration",
            description: "NJSS structure, divisions and key officers",
            icon: Building2,
          },
        ],
      },
      {
        heading: "Bodies & Programmes",
        items: [
          {
            label: "NJSS Tenders Board",
            href: "/about/tenders-board",
            description: "Current tenders and procurement notices",
            icon: Briefcase,
          },
          {
            label: "Judicial Complaints Committee",
            href: "/about/complaints-committee",
            description: "Lodge a complaint about judicial conduct",
            icon: MessageSquareWarning,
          },
          {
            label: "PNG Centre for Judicial Excellence",
            href: "/about/pngcje",
            description: "Judicial education and training programmes",
            icon: GraduationCap,
          },
        ],
      },
    ],
  },
  {
    label: "Court Library",
    href: "/library/branch-libraries",
    columns: [
      {
        heading: "Library",
        items: [
          {
            label: "Branch Libraries",
            href: "/library/branch-libraries",
            description: "Locations and services of branch court libraries",
            icon: Library,
          },
          {
            label: "Library Membership List",
            href: "/library/membership",
            description: "Registered members and membership application",
            icon: Users,
          },
          {
            label: "Publications",
            href: "/library/publications",
            description: "Court publications, journals and annual reports",
            icon: BookMarked,
          },
        ],
      },
      {
        heading: "Research",
        items: [
          {
            label: "Legal Research Tools",
            href: "/library/research-tools",
            description: "Guides, indexes and research methodologies",
            icon: BookOpen,
          },
          {
            label: "Library Databases",
            href: "/library/databases",
            description: "Online legal databases and case law resources",
            icon: Scale,
          },
        ],
      },
    ],
  },
  { label: "Contact Us", href: "/contact" },
]

// ── Mega Menu Panel ───────────────────────────────────────────────────────────
function MegaMenuPanel({
  item,
  onClose,
}: {
  item: NavItem
  onClose: () => void
}) {
  if (!item.columns) return null
  const colCount = item.columns.length

  return (
    <div
      className={cn(
        "absolute top-full left-1/2 -translate-x-1/2 mt-0 z-50",
        "bg-gray-900/60 backdrop-blur-xl rounded-b-2xl",
        "animate-in fade-in slide-in-from-top-1 duration-150",
        colCount >= 2 ? "w-160" : "w-85"
      )}
      style={{ marginTop: 0 }}
    >
      {/* Bottom accent line */}
      <div className="h-0.75 w-full bg-linear-to-r from-[hsl(352,83%,44%)] via-amber-500 to-[hsl(352,83%,44%)]" />

      <div className={cn("p-7 grid gap-10", colCount >= 2 ? "grid-cols-2" : "grid-cols-1")}>
        {item.columns.map((col, ci) => (
          <div key={ci}>
            {col.heading && (
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-4 px-1">
                {col.heading}
              </p>
            )}
            <div className="flex flex-col gap-1">
              {col.items.map((child) => {
                const Icon = child.icon
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onClose}
                    className="group flex items-start gap-3.5 px-3 py-3 rounded-xl hover:bg-white/6 transition-colors duration-100"
                  >
                    {Icon && (
                      <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[hsl(352,83%,44%)]/25 transition-colors">
                        <Icon className="w-4 h-4 text-gray-300 group-hover:text-[hsl(352,83%,60%)] transition-colors" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-semibold text-gray-200 group-hover:text-white transition-colors leading-snug">
                        {child.label}
                      </div>
                      {child.description && (
                        <div className="text-[11.5px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                          {child.description}
                        </div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Desktop Nav Item ──────────────────────────────────────────────────────────
function DesktopNavItem({
  item,
  active,
  isOpen,
  onOpen,
  onClose,
}: {
  item: NavItem
  active: boolean
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (item.columns) onOpen()
  }, [item.columns, onOpen])

  const handleMouseLeave = useCallback(() => {
    if (!item.columns) return
    closeTimer.current = setTimeout(onClose, 120)
  }, [item.columns, onClose])

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])

  const linkClasses = cn(
    "flex items-center gap-1 h-full px-4 text-[13px] font-medium transition-colors duration-150 whitespace-nowrap relative",
    active || isOpen
      ? "text-white"
      : "text-gray-200/85 hover:text-white"
  )

  const labelWithUnderline = (label: string) => (
    <span className="relative">
      {label}
      <span className={cn(
        "absolute left-0 right-0 -bottom-1 h-[3px] rounded-full bg-amber-400 transition-all duration-200",
        active || isOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100"
      )} />
    </span>
  )

  if (!item.columns) {
    return (
      <Link
        href={item.href}
        className={cn(linkClasses, "group")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {labelWithUnderline(item.label)}
      </Link>
    )
  }

  return (
    <div
      className="relative flex items-center h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className={cn(linkClasses, "group")}>
        {labelWithUnderline(item.label)}
        <ChevronDown className={cn(
          "w-3 h-3 mt-0.5 transition-transform duration-200",
          isOpen ? "rotate-180 text-amber-400" : "text-gray-400"
        )} />
      </button>

      {isOpen && (
        <MegaMenuPanel
          item={item}
          onClose={onClose}
        />
      )}
    </div>
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
const COURT_DIARY_URL = "/filings"

export default function Navbar() {
  const [openMenu,       setOpenMenu]       = useState<string | null>(null)
  const [mobileOpen,     setMobileOpen]     = useState(false)
  const [searchOpen,     setSearchOpen]     = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)

  // Close menus on route change
  useEffect(() => {
    setOpenMenu(null)
    setSearchOpen(false)
    setMobileOpen(false)
  }, [pathname])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const hasOverlay = openMenu !== null

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-all duration-200",
          hasOverlay ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpenMenu(null)}
        aria-hidden="true"
      />

      <header className="sticky top-0 z-50 w-full">
        <GovBanner />

        {/* Main Navbar — dark charcoal */}
        <div ref={navRef} className="bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 lg:px-10 flex items-center h-17 gap-0">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 shrink-0 group pr-6 mr-2"
            >
              <img
                src="/png-coa.png"
                alt="NJSS Logo"
                className="h-11 w-auto transition-transform duration-200 group-hover:scale-105"
              />
              <div className="hidden sm:flex flex-col justify-center">
                <div className="font-bold text-white text-[13.5px] leading-tight tracking-tight">
                  National Judicial Staff Service
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-stretch h-full flex-1 ml-1">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/" && item.href !== "#" && pathname.startsWith(item.href.split("#")[0]))
                return (
                  <DesktopNavItem
                    key={item.label}
                    item={item}
                    active={active}
                    isOpen={openMenu === item.label}
                    onOpen={() => setOpenMenu(item.label)}
                    onClose={() => setOpenMenu(null)}
                  />
                )
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2 ml-auto shrink-0">
              <button
                onClick={() => setSearchOpen(o => !o)}
                aria-label="Search"
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-colors border",
                  searchOpen
                    ? "bg-amber-400 border-amber-400 text-gray-900"
                    : "border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white"
                )}
              >
                <Search className="w-4 h-4" />
              </button>
              <Link
                href={COURT_DIARY_URL}
                className="inline-flex items-center justify-center h-9 px-5 rounded-lg text-[13px] font-semibold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors whitespace-nowrap border border-[hsl(352,83%,55%)]/30"
              >
                Court Diary
              </Link>
            </div>

            {/* Mobile: search + hamburger */}
            <div className="lg:hidden flex items-center gap-1 ml-auto">
              <button
                onClick={() => { setSearchOpen(o => !o); setMobileOpen(false) }}
                aria-label="Search"
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center transition-colors border",
                  searchOpen
                    ? "bg-amber-400 border-amber-400 text-gray-900"
                    : "border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white"
                )}
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-white/8 transition-colors text-gray-200"
                onClick={() => { setMobileOpen(o => !o); setSearchOpen(false) }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search panel */}
        {searchOpen && <NavSearch onClose={() => setSearchOpen(false)} />}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-gray-900 max-h-[80vh] overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <nav className="flex flex-col gap-0.5">
                {navItems.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && item.href !== "#" && pathname.startsWith(item.href.split("#")[0]))
                  const expanded = mobileExpanded === item.label
                  const allChildren = item.columns?.flatMap(c => c.items) ?? []

                  if (!item.columns || allChildren.length === 0) {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "block py-2.5 px-3 text-sm font-medium rounded-lg transition-colors",
                          active
                            ? "text-amber-400 bg-white/8 font-semibold"
                            : "text-gray-200 hover:bg-white/5 hover:text-white"
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )
                  }

                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => setMobileExpanded(expanded ? null : item.label)}
                        className={cn(
                          "w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium rounded-lg transition-colors",
                          active || expanded
                            ? "text-amber-400 bg-white/8"
                            : "text-gray-200 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {item.label}
                        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", expanded && "rotate-180 text-amber-400")} />
                      </button>
                      {expanded && (
                        <div className="ml-3 mt-0.5 border-l-2 border-amber-400/20 pl-3 flex flex-col gap-0.5 pb-1">
                          {allChildren.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block py-2 px-2 text-sm text-gray-400 hover:text-white rounded-md hover:bg-white/5 transition-colors"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
              <div className="pt-3 mt-2">
                <Link
                  href={COURT_DIARY_URL}
                  className="flex items-center justify-center h-10 rounded-lg text-sm font-semibold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Court Diary
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
