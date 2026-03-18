import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard, Newspaper,
  LogOut, Menu, ExternalLink, ChevronRight,
  Image, FolderOpen, BookOpen, Navigation, X, Settings, CalendarDays,
  MapPin, Users, HelpCircle, Layers, ShieldAlert, Briefcase, Info,
} from "lucide-react"
import { adminApi } from "@/lib/adminApi"
import { cn } from "@/lib/utils"

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
      { label: "Audit Log", href: "/admin/audit-log", icon: ShieldAlert },
    ],
  },
]

// Flat list used for active-state detection in breadcrumb
const navItems = navGroups.flatMap(g => g.items)

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)   // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false) // mobile overlay

  const logout = () => {
    adminApi.logout().finally(() => navigate("/admin/login"))
  }

  const currentLabel = navItems.find(n =>
    n.href === location.pathname ||
    (n.href !== "/admin" && location.pathname.startsWith(n.href))
  )?.label ?? "Admin"

  const SidebarContent = ({ slim }: { slim?: boolean }) => (
    <div className="flex flex-col h-full bg-[hsl(210,70%,15%)] text-gray-300">
      {/* Logo */}
      <div className={cn("border-b border-white/10 flex items-center", slim ? "px-3 py-5 justify-center" : "px-5 py-5")}>
        {slim ? (
          <img src="/png-coa.png" alt="OWC" className="w-9 h-9 object-contain" />
        ) : (
          <div className="flex items-center gap-3">
            <img src="/png-coa.png" alt="OWC Logo" className="w-9 h-9 object-contain shrink-0" />
            <div>
              <div className="text-white font-bold text-sm leading-tight">OWC Admin</div>
              <div className="text-xs text-gray-400 leading-tight">Content Management</div>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 py-3 overflow-y-auto", slim ? "px-2 space-y-0.5" : "px-3")}>
        {navGroups.map((group, gi) => (
          <div key={gi} className={slim ? "" : "mb-4"}>
            {!slim && group.label && (
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 px-3 mb-1 mt-1">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = location.pathname === item.href ||
                  (item.href !== "/admin" && location.pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.href}
                    to={item.href}
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
      <aside className={cn("hidden lg:block shrink-0 fixed inset-y-0 left-0 z-30 transition-all duration-200", sidebarW)}>
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
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20 px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Hamburger — always visible */}
            <button
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setCollapsed(c => !c)
                } else {
                  setMobileOpen(o => !o)
                }
              }}
              aria-label="Toggle sidebar"
            >
              {mobileOpen
                ? <X className="w-5 h-5" />
                : <Menu className="w-5 h-5" />
              }
            </button>

            {/* Page title */}
            <div className="text-sm font-semibold text-gray-700">{currentLabel}</div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
