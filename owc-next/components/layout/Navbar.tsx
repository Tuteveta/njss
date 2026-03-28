"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, ChevronDown, ChevronUp, FileText, Lock, Search, Newspaper, CalendarCheck, Layers, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Gov Banner ────────────────────────────────────────────────────────────────
function GovBanner() {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-[hsl(210,72%,13%)] text-xs border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="https://flagcdn.com/h20/pg.png" alt="Papua New Guinea Flag" className="h-3.5 w-auto opacity-90 shrink-0" />
          <span className="text-blue-100/90 font-medium tracking-wide">An Official Papua New Guinea Government Website</span>
          <span className="hidden sm:inline text-blue-400/40 select-none">|</span>
          <button
            onClick={() => setOpen(o => !o)}
            className="hidden sm:flex items-center gap-1 text-blue-300 hover:text-white font-medium transition-colors"
          >
            How to identify
            {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[hsl(210,72%,11%)]">
          <div className="max-w-7xl mx-auto px-4 lg:px-10 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4 text-blue-300" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-1">Official website links end with .gov.pg</p>
                <p className="text-blue-300/80 leading-relaxed text-xs">Government agencies communicate via .gov.pg websites (e.g. go.gov.pg/open).</p>
                <a href="https://go.gov.pg" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white hover:underline mt-1.5 inline-block text-xs transition-colors">
                  Trusted websites →
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-blue-300" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm mb-1">Secure websites use HTTPS</p>
                <p className="text-blue-300/80 leading-relaxed text-xs">Look for a <strong className="text-blue-200">lock (🔒)</strong> or <span className="font-mono text-blue-200">https://</span> before sharing sensitive information.</p>
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
  news:    { icon: Newspaper,     label: "News",    color: "text-blue-600 bg-blue-50" },
  event:   { icon: CalendarCheck, label: "Event",   color: "text-emerald-600 bg-emerald-50" },
  service: { icon: Layers,        label: "Service", color: "text-purple-600 bg-purple-50" },
}

// ── NavSearch panel (slides down below the navbar) ────────────────────────────
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

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/news?q=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  const grouped = ["news", "event", "service"]
    .map(type => ({ type, items: results.filter(r => r.type === type) }))
    .filter(g => g.items.length > 0)

  return (
    <div className="border-t border-gray-100 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-4">
        <form onSubmit={submit}>
          <div className="flex items-center gap-3 border border-gray-200 rounded-xl h-11 bg-gray-50 focus-within:bg-white focus-within:border-[hsl(210,70%,35%)] focus-within:ring-2 focus-within:ring-[hsl(210,70%,35%)]/10 transition-all px-4">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search services, news, events, forms…"
              className="flex-1 text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
            />
            {loading && <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-400 rounded-full animate-spin shrink-0" />}
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Results */}
        {grouped.length > 0 && (
          <div className="mt-3 bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
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
              <button onClick={submit as unknown as React.MouseEventHandler} className="text-xs font-semibold text-[hsl(210,70%,25%)] hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {query.trim().length >= 2 && results.length === 0 && !loading && (
          <p className="mt-3 text-sm text-gray-400 px-1">
            No results for <strong className="text-gray-600">"{query}"</strong> — try a different keyword.
          </p>
        )}
      </div>
    </div>
  )
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
const CLAIMS_URL = "/claims"

const navItems = [
  { label: "Home",      href: "/" },
  { label: "About",     href: "/about" },
  { label: "Services",  href: "/services" },
  { label: "News",      href: "/news" },
  { label: "Events",    href: "/events" },
  { label: "Resources", href: "/resources" },
  { label: "Contact",   href: "/contact" },
]

export default function Navbar() {
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [searchOpen,  setSearchOpen]  = useState(false)
  const pathname = usePathname()

  // Close search on route change
  useEffect(() => { setSearchOpen(false); setMobileOpen(false) }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full">
      <GovBanner />

      {/* Main Navbar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 flex items-center h-[72px] gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 shrink-0 group pr-6 border-r border-gray-200">
            <img src="/png-coa.png" alt="OWC Logo" className="h-12 w-auto transition-transform duration-200 group-hover:scale-105" />
            <div className="hidden sm:flex flex-col justify-center">
              <div className="font-bold text-[hsl(210,70%,22%)] text-[15px] leading-tight tracking-tight">
                Office of Workers Compensation
              </div>
              <div className="text-[10.5px] text-gray-500 tracking-[0.12em] uppercase font-semibold mt-[3px]">
                Papua New Guinea
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center h-full flex-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center h-full px-3.5 text-[13.5px] font-medium transition-colors group whitespace-nowrap",
                    active ? "text-[hsl(210,70%,22%)]" : "text-gray-600 hover:text-[hsl(210,70%,22%)]"
                  )}
                >
                  <span className="relative">
                    {item.label}
                    <span className={cn(
                      "absolute left-0 right-0 -bottom-1.5 h-[2.5px] rounded-full bg-[hsl(210,70%,22%)] transition-all duration-200",
                      active ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                    )} />
                  </span>
                </Link>
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
                  ? "bg-[hsl(210,70%,22%)] border-[hsl(210,70%,22%)] text-white"
                  : "border-gray-200 text-gray-500 hover:border-[hsl(210,70%,35%)] hover:text-[hsl(210,70%,22%)]"
              )}
            >
              <Search className="w-4 h-4" />
            </button>
            <Link
              href={CLAIMS_URL}
              className="inline-flex items-center justify-center h-9 px-5 rounded-lg text-[13px] font-semibold bg-[hsl(210,70%,22%)] hover:bg-[hsl(210,70%,18%)] text-white transition-colors whitespace-nowrap"
            >
              File a Claim
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
                  ? "bg-[hsl(210,70%,22%)] border-[hsl(210,70%,22%)] text-white"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              )}
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block py-2.5 px-3 text-sm font-medium rounded-lg transition-colors",
                      active
                        ? "text-[hsl(210,70%,22%)] bg-[hsl(210,70%,22%)]/8 font-semibold"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[hsl(210,70%,22%)]"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="pt-3 mt-2 border-t border-gray-100">
              <Link
                href={CLAIMS_URL}
                className="flex items-center justify-center h-10 rounded-lg text-sm font-semibold bg-[hsl(210,70%,22%)] hover:bg-[hsl(210,70%,18%)] text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                File a Claim
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
