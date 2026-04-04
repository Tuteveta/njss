import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface Crumb { label: string; href?: string }
interface PageHeroProps { badge?: string; title: string; subtitle?: string; crumbs: Crumb[]; image?: string }

export default function PageHero({ badge, title, subtitle, crumbs, image }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      {/* PNG-red gradient overlay */}
      <div className={`absolute inset-0 ${
        image
          ? "bg-gradient-to-r from-[hsl(352,83%,44%)]/96 via-[hsl(352,83%,36%)]/88 to-[hsl(352,83%,42%)]/70"
          : "bg-[hsl(352,83%,38%)]"
      }`} />
      {/* Subtle diagonal pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)",
          backgroundSize: "16px 16px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] text-white/50 mb-5">
          <Link href="/" className="flex items-center gap-1 hover:text-white/80 transition-colors">
            <Home className="w-3 h-3" /><span>Home</span>
          </Link>
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-white/30" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white/80 transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-white/80 font-semibold">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Badge */}
        {badge && (
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300 border border-amber-400/40 bg-amber-400/10 px-3 py-1 rounded-full mb-4">
            {badge}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-4 max-w-3xl tracking-tight">
          {title}
        </h1>

        {/* Gold accent bar */}
        <div className="w-14 h-[3px] rounded-full bg-gradient-to-r from-amber-400 to-amber-200 mb-5" />

        {/* Subtitle */}
        {subtitle && (
          <p className="text-white/70 text-sm lg:text-[15px] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  )
}
