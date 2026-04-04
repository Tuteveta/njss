"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Phone } from "lucide-react"
import { SECTIONS } from "@/lib/sectionData"

export default function SectionNav({ section }: { section: string }) {
  const pathname = usePathname()
  const nav = SECTIONS[section]
  if (!nav) return null

  return (
    <div className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-20 bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          {nav.heading}
        </p>
        <nav className="space-y-0.5">
          {nav.items.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[hsl(352,83%,48%)] text-white"
                    : "text-gray-600 hover:bg-[hsl(352,75%,97%)] hover:text-[hsl(352,83%,48%)]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Phone className="w-3.5 h-3.5" /> Contact NJSS
          </Link>
        </div>
      </div>
    </div>
  )
}
