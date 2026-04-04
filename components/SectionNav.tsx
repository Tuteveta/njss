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
      { label: "Overview",              href: "/about",                       icon: Info },
      { label: "Judges",                href: "/about/judges",                icon: Users },
      { label: "Administration",        href: "/about/court-administration",  icon: Building2 },
      { label: "PNGCJE",                href: "/about/pngcje",                icon: GraduationCap },
      { label: "Complaints Committee",  href: "/about/complaints-committee",  icon: MessageSquareWarning },
      { label: "Tenders Board",         href: "/about/tenders-board",         icon: Briefcase },
      { label: "Court Calendar",        href: "/about/court-calendar",        icon: Calendar },
      { label: "Daily Diary",           href: "/about/daily-diary",           icon: CalendarDays },
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
      { label: "Membership",           href: "/library/membership",        icon: BookMarked },
      { label: "Research Tools",       href: "/library/research-tools",    icon: BookOpen },
      { label: "Databases",            href: "/library/databases",         icon: Database },
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

export default function SectionNav({ section }: { section: string }) {
  const pathname = usePathname()
  const nav = SECTIONS[section]
  if (!nav) return null

  return (
    <div className="hidden lg:block w-44 shrink-0 sticky top-4 self-start">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-[12px] font-bold text-gray-800">{nav.heading}</p>
        </div>
        <ul>
          {nav.items.map((item, i) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href} className={i < nav.items.length - 1 ? "border-b border-gray-100" : ""}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] transition-colors ${
                    isActive
                      ? "bg-[hsl(352,83%,44%)]/6 text-[hsl(352,83%,44%)] font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                  }`}
                >
                  <item.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[hsl(352,83%,44%)]" : "text-gray-400"}`} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
