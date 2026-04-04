"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Scale, Building2, Gavel, LayoutList, BookOpen, MapPin, Shield, Languages, FileVideo,
  Users, Calendar, CalendarDays, GraduationCap, MessageSquareWarning, Briefcase,
  Library, BookMarked, Newspaper, FileText, Info, Database,
} from "lucide-react"

interface NavItem { label: string; href: string; icon: React.ElementType }

const SECTIONS: Record<string, { heading: string; items: NavItem[] }> = {
  about: {
    heading: "About the Courts",
    items: [
      { label: "Overview",                           href: "/about",                       icon: Info },
      { label: "Judges",                             href: "/about/judges",                icon: Users },
      { label: "Court Administration",               href: "/about/court-administration",  icon: Building2 },
      { label: "PNG Centre for Judicial Excellence", href: "/about/pngcje",                icon: GraduationCap },
      { label: "Complaints Committee",               href: "/about/complaints-committee",  icon: MessageSquareWarning },
      { label: "Tenders Board",                      href: "/about/tenders-board",         icon: Briefcase },
      { label: "Court Calendar",                     href: "/about/court-calendar",        icon: Calendar },
      { label: "Daily Diary",                        href: "/about/daily-diary",           icon: CalendarDays },
    ],
  },
  "national-court": {
    heading: "National Court",
    items: [
      { label: "Daily Diary",           href: "/national-court/daily-diary",           icon: CalendarDays },
      { label: "Listings",              href: "/national-court/listings",              icon: LayoutList },
      { label: "Civil Cases",           href: "/national-court/civil-cases",           icon: Scale },
      { label: "Criminal Cases",        href: "/national-court/criminal-cases",        icon: Gavel },
      { label: "Acts & Rules",          href: "/national-court/acts-rules",            icon: BookOpen },
      { label: "Provincial Registries", href: "/national-court/provincial-registries", icon: MapPin },
      { label: "Sheriff's Office",      href: "/national-court/sheriff",               icon: Shield },
      { label: "Court Reporting",       href: "/national-court/court-reporting",       icon: FileVideo },
      { label: "Interpreting Service",  href: "/national-court/interpreting-service",  icon: Languages },
    ],
  },
  library: {
    heading: "Court Library",
    items: [
      { label: "Branch Libraries",     href: "/library/branch-libraries",  icon: Library },
      { label: "Library Membership",   href: "/library/membership",        icon: BookMarked },
      { label: "Legal Research Tools", href: "/library/research-tools",    icon: BookOpen },
      { label: "Library Databases",    href: "/library/databases",         icon: Database },
      { label: "Publications",         href: "/library/publications",      icon: Newspaper },
    ],
  },
  "supreme-court": {
    heading: "Supreme Court",
    items: [
      { label: "Daily Diary",            href: "/supreme-court/daily-diary",             icon: CalendarDays },
      { label: "Listings",               href: "/supreme-court/listings",                icon: LayoutList },
      { label: "Acts & Rules",           href: "/supreme-court/acts-rules",              icon: BookOpen },
      { label: "Summary Determinations", href: "/supreme-court/summary-determinations",  icon: FileText },
    ],
  },
}

export default function SideNav({ section }: { section: string }) {
  const pathname = usePathname()
  const nav = SECTIONS[section]
  if (!nav) return null

  return (
    <div className="py-5 px-3 space-y-1.5">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 px-2 pb-1">
        {nav.heading}
      </p>
      {nav.items.map(item => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12px] font-medium transition-colors border ${
              isActive
                ? "bg-[hsl(352,83%,44%)]/8 border-[hsl(352,83%,44%)]/20 text-[hsl(352,83%,44%)]"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
              isActive ? "bg-[hsl(352,83%,44%)]/10" : "bg-gray-100"
            }`}>
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[hsl(352,83%,44%)]" : "text-gray-500"}`} />
            </div>
            <span className="leading-tight">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
