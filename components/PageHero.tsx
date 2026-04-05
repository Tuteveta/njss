import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface Crumb { label: string; href?: string }
interface PageHeroProps { badge?: string; title: string; subtitle?: string; crumbs: Crumb[]; image?: string }

export default function PageHero({ badge, title, subtitle, crumbs }: PageHeroProps) {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-5">
          <Link href="/" className="flex items-center gap-1 hover:text-gray-600 transition-colors">
            <Home className="w-3 h-3" /><span>Home</span>
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-gray-300" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-gray-600 transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-gray-600 font-semibold">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Badge */}
        {badge && (
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.18em] text-[hsl(352,83%,44%)] border border-[hsl(352,83%,44%)]/30 bg-[hsl(352,83%,44%)]/6 px-3 py-1 rounded-full mb-4">
            {badge}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4 max-w-3xl tracking-tight">
          {title}
        </h1>

        {/* Red accent bar */}
        <div className="w-14 h-[3px] rounded-full bg-[hsl(352,83%,44%)] mb-5" />

        {/* Subtitle */}
        {subtitle && (
          <p className="text-gray-500 text-sm lg:text-[15px] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
