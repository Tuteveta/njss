import { Link } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"

interface Crumb {
  label: string
  href?: string
}

interface PageHeroProps {
  badge?: string
  title: string
  subtitle?: string
  crumbs: Crumb[]
  image?: string
}

export default function PageHero({ title, subtitle, crumbs }: PageHeroProps) {
  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
          <Link to="/" className="flex items-center gap-1 hover:text-[hsl(210,70%,25%)] transition-colors">
            <Home className="w-3 h-3" />
            <span>Home</span>
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-gray-300" />
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-[hsl(210,70%,25%)] transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-600 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-[hsl(210,70%,18%)] leading-tight mb-3">
          {title}
        </h1>

        {/* Gradient accent underline */}
        <div className="w-16 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-200 mb-4" />

        {/* Subtitle */}
        {subtitle && (
          <p className="text-gray-500 text-sm lg:text-base max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
