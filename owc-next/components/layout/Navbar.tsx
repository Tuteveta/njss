"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, ChevronDown, ChevronUp, FileText, Lock, Search, Phone, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

function GovBanner() {
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState("")
  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString("en-PG", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    setTime(fmt())
    const t = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="bg-[hsl(210,70%,15%)] text-xs border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-1.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="https://flagcdn.com/h20/pg.png" alt="Papua New Guinea Flag" className="h-3 w-auto opacity-90 shrink-0" />
          <span className="text-blue-200 font-medium">An Official Papua New Guinea Government Website</span>
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-0.5 text-blue-300 hover:text-white font-semibold hover:underline ml-1 transition-colors"
          >
            How to identify
            {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-blue-300/70">
          <Phone className="w-3 h-3 shrink-0" />
          <span>Hotline: <span className="text-blue-200 font-semibold">1800-OWC</span></span>
          <span className="gf-divider text-blue-300/30" />
          <Clock className="w-3 h-3 shrink-0" />
          <span>Mon–Fri <span className="text-blue-200 font-semibold">08:00–17:00</span> PGT</span>
          <span className="gf-divider text-blue-300/30" />
          <span className="text-blue-200">{time}</span>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-[hsl(210,70%,15%)]">
          <div className="max-w-7xl mx-auto px-4 lg:px-10 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white text-sm mb-1">Official website links end with .gov.pg</p>
                <p className="text-blue-300 leading-relaxed text-xs">Government agencies communicate via .gov.pg websites (e.g. go.gov.pg/open).</p>
                <a href="https://go.gov.pg" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-white hover:underline mt-1 inline-block text-xs transition-colors">Trusted websites →</a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white text-sm mb-1">Secure websites use HTTPS</p>
                <p className="text-blue-300 leading-relaxed text-xs">Look for a <strong>lock</strong> (🔒) or <span className="font-mono">https://</span> before sharing sensitive information.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CLAIMS_URL = "/claims"

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/news?q=${encodeURIComponent(query.trim())}`)
    setQuery("")
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <GovBanner />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <img src="/png-coa.png" alt="OWC Logo" className="h-11 w-auto transition-transform duration-200 group-hover:scale-105" />
            <div className="hidden sm:block">
              <div className="font-bold text-[hsl(210,70%,22%)] text-sm leading-tight tracking-tight">Office of Workers Compensation</div>
              <div className="text-[10px] text-gray-500 leading-tight tracking-widest uppercase font-medium">Papua New Guinea</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative px-3.5 py-5 text-sm font-medium transition-colors group",
                    active ? "text-[hsl(210,70%,22%)]" : "text-gray-600 hover:text-[hsl(210,70%,22%)]"
                  )}
                >
                  {item.label}
                  <span className={cn(
                    "absolute -bottom-px left-0 right-0 h-0.5 bg-[hsl(210,70%,22%)] transition-all duration-200",
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                  )} />
                </Link>
              )
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <form onSubmit={handleSearch}>
              <div className="flex items-center border border-gray-200 rounded-lg h-9 bg-gray-50 focus-within:bg-white focus-within:border-[hsl(210,70%,35%)] focus-within:ring-2 focus-within:ring-[hsl(210,70%,35%)]/10 transition-all overflow-hidden">
                <Search className="w-4 h-4 text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="bg-transparent px-2 text-sm outline-none w-32 text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </form>
            <Link
              href={CLAIMS_URL}
              className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-sm font-semibold bg-[hsl(210,70%,22%)] hover:bg-[hsl(210,70%,18%)] text-white transition-colors shadow-sm"
            >
              File a Claim
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <form onSubmit={handleSearch} className="mb-3 mt-1">
              <div className="flex items-center border border-gray-200 rounded-lg h-9 bg-gray-50 w-full overflow-hidden">
                <Search className="w-4 h-4 text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="bg-transparent px-2 text-sm outline-none flex-1 text-gray-700"
                />
              </div>
            </form>
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block py-2.5 px-3 text-sm font-medium rounded-lg transition-colors",
                    active ? "text-[hsl(210,70%,22%)] bg-blue-50" : "text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="pt-3 pb-3 border-t border-gray-100 mt-2">
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
