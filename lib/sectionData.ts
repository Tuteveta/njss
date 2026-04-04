import {
  Scale, Building2, Gavel, LayoutList, BookOpen, MapPin, Shield, Languages, FileVideo,
  Users, Calendar, CalendarDays, GraduationCap, MessageSquareWarning, Briefcase,
  Library, BookMarked, Newspaper, FileText, Info, Database,
} from "lucide-react"

export interface SectionItem { label: string; href: string; icon: React.ElementType }
export interface SectionDef { heading: string; items: SectionItem[] }

export const SECTIONS: Record<string, SectionDef> = {
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
