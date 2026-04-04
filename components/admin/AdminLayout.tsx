"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, Newspaper,
  LogOut, Menu, ExternalLink, ChevronRight,
  Image, FolderOpen, BookOpen, Navigation, X, Settings, CalendarDays,
  MapPin, Users, HelpCircle, Layers, ShieldAlert, Briefcase, Info, UserCog,
} from "lucide-react"
import { adminApi } from "@/lib/adminApi"
import { cn } from "@/lib/utils"
import { ROLE_LABELS, ROLE_COLORS, canAccess, type Role } from "@/lib/roles"

function LiveClock() {
  const [time, setTime] = useState("")
  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString("en-PG", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    setTime(fmt())
    const t = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(t)
  }, [])
  return <span className="gf-metric text-xs text-gray-400 tabular-nums">{time}</span>
}

interface NavGroup { label?: string; items: { label: string; href: string; icon: React.ElementType }[] }

const navGroups: NavGroup[] = [
  {
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "News Articles", href: "/admin/news", icon: Newspaper },
      { label: "Events", href: "/admin/events", icon: CalendarDays },
      { label: "Hero Slides", href: "/admin/hero-slides", icon: Layers },
      { label: "Services", href: "/admin/services", icon: Briefcase },
      { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    label: "Organisation",
    items: [
      { label: "About Content", href: "/admin/about", icon: Info },
      { label: "Leadership", href: "/admin/leadership", icon: Users },
      { label: "Offices", href: "/admin/offices", icon: MapPin },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Pages", href: "/admin/pages", icon: BookOpen },
      { label: "Media Library", href: "/admin/media", icon: Image },
      { label: "Documents", href: "/admin/documents", icon: FolderOpen },
      { label: "Menus", href: "/admin/menus", icon: Navigation },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Site Settings", href: "/admin/settings", icon: Settings },
      { label: "Users", href: "/admin/users", icon: UserCog },
      { label: "Audit Log", href: "/admin/audit-log", icon: ShieldAlert },
    ],
  },
]

// Flat list used for active-state detection in breadcrumb
const navItems = navGroups.flatMap(g => g.items)

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [role, setRole] = useState<string>("")

  useEffect(() => {
    adminApi.me().then(r => r.json()).then(d => setRole(d.role ?? ""))
  }, [])

  const logout = () => {
    adminApi.logout().finally(() => router.push("/admin/login"))
  }

  const currentLabel = navItems.find(n =>
    n.href === pathname ||
    (n.href !== "/admin" && pathname.startsWith(n.href))
  )?.label ?? "Admin"

  // Filter nav groups based on role
  const filteredGroups = navGroups.map(g => ({
    ...g,
    items: g.items.filter(item => !role || canAccess(role, item.href)),
  })).filter(g => g.items.length > 0)

  const SidebarContent = ({ slim }: { slim?: boolean }) => (
    <div className="flex flex-col h-full bg-[hsl(352,75%,15%)] text-gray-300 overflow-hidden sidebar-scroll">
      {/* Logo */}
      <div className={cn("border-b border-white/10 flex items-center", slim ? "px-3 py-5 justify-center" : "px-5 py-5")}>
        {slim ? (
          <img src="/png-coa.png" alt="NJSS" className="w-9 h-9 object-contain" />
        ) : (
          <div className="flex items-center gap-3">
            <img src="/png-coa.png" alt="NJSS Logo" className="w-9 h-9 object-contain shrink-0" />
            <div>
              <div className="text-white font-bold text-sm leading-tight">NJSS Admin</div>
              <div className="text-xs text-gray-400 leading-tight">Content Management</div>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 py-3 overflow-y-auto overflow-x-hidden sidebar-scroll", slim ? "px-2 space-y-0.5" : "px-3")}>
        {filteredGroups.map((group, gi) => (
          <div key={gi} className={slim ? "" : "mb-4"}>
            {!slim && group.label && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-3 mb-1 mt-1">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={slim ? item.label : undefined}
                    className={cn(
                      "flex items-center rounded-lg text-sm font-medium transition-colors",
                      slim ? "justify-center p-2.5" : "gap-3 px-3 py-2",
                      active
                        ? "bg-white/15 text-white"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!slim && (
                      <>
                        {item.label}
                        {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-gray-400" />}
                      </>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-white/10 py-4 space-y-1", slim ? "px-2" : "px-3")}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={slim ? "View Public Site" : undefined}
          className={cn(
            "flex items-center rounded-lg text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors",
            slim ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
          )}
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!slim && "View Public Site"}
        </a>
        <button
          onClick={logout}
          title={slim ? "Sign Out" : undefined}
          className={cn(
            "w-full flex items-center rounded-lg text-sm text-gray-400 hover:bg-red-500/20 hover:text-red-300 transition-colors",
            slim ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!slim && "Sign Out"}
        </button>
      </div>
    </div>
  )

  const sidebarW = collapsed ? "w-[60px]" : "w-56"

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Desktop sidebar */}
      <aside className={cn("hidden lg:block shrink-0 fixed inset-y-0 left-0 z-30 transition-all duration-200 overflow-hidden", sidebarW)}>
        <SidebarContent slim={collapsed} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-56 shrink-0">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className={cn("flex-1 flex flex-col min-h-screen transition-all duration-200", collapsed ? "lg:ml-[60px]" : "lg:ml-56")}>

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-4 h-11 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-500"
              onClick={() => {
                if (window.innerWidth >= 1024) setCollapsed(c => !c)
                else setMobileOpen(o => !o)
              }}
              aria-label="Toggle sidebar"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="text-gray-300">/</span>
              <span className="font-semibold text-gray-700">{currentLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LiveClock />
            {role && (
              <span className={`hidden sm:inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[role as Role] ?? "bg-gray-100 text-gray-600"}`}>
                {ROLE_LABELS[role as Role] ?? role}
              </span>
            )}
            <span className="gf-divider text-gray-300" />
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-gray-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
