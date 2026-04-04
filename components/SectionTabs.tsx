"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SECTIONS } from "@/lib/sectionData"

export default function SectionTabs({ section }: { section: string }) {
  const pathname = usePathname()
  const nav = SECTIONS[section]
  if (!nav) return null

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <span className="text-xs text-gray-400 font-medium shrink-0 pr-2">{nav.heading}:</span>
        {nav.items.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[hsl(352,83%,48%)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-[hsl(352,75%,97%)] hover:text-[hsl(352,83%,48%)]"
              }`}
            >
              <Icon className="w-3 h-3" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
