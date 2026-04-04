"use client"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { ArrowRight, Shield, Users, FileText, Clock, TrendingUp, CheckCircle, Phone, Download, AlertCircle, ChevronRight, ChevronLeft, CalendarDays, MapPin, HelpCircle, Building2, Stethoscope, Scale, Briefcase, Heart, BookOpen, Star, Globe } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSettings } from "@/context/SettingsContext"
import ScrollNav from "@/components/ScrollNav"

interface HomeEvent {
  id: number
  title: string
  eventDate: string
  eventTime: string
  location: string
  category: string
}

interface HomeService { id: number; tag: string; iconName: string; title: string; description: string; published: boolean }
interface HomeArticle { id: number; slug: string; date: string; category: string; title: string; excerpt: string; image: string }

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield, Users, Building2, Stethoscope, Scale, HelpCircle,
  Briefcase, Heart, BookOpen, FileText, Star, Globe, CheckCircle, TrendingUp, Clock,
}

const EVENT_COLORS: Record<string, string> = {
  Workshop:     "bg-red-100 text-red-800",
  Training:     "bg-indigo-100 text-indigo-700",
  Awareness:    "bg-emerald-100 text-emerald-700",
  Consultation: "bg-amber-100 text-amber-700",
  Conference:   "bg-purple-100 text-purple-700",
  Outreach:     "bg-rose-100 text-rose-700",
  General:      "bg-gray-100 text-gray-600",
}

function formatShortDate(iso: string) {
  const d = new Date(iso + "T00:00:00")
  return { day: d.getDate(), month: d.toLocaleString("en-PG", { month: "short" }), year: d.getFullYear() }
}

const COURT_DIARY_URL = "/filings"

const FALLBACK_SERVICES: HomeService[] = [
  { id: 1, tag: "Supreme Court", iconName: "Scale", title: "Supreme Court", description: "The highest court in Papua New Guinea, hearing appeals and exercising original jurisdiction in constitutional and complex matters.", published: true },
  { id: 2, tag: "National Court", iconName: "Building2", title: "National Court", description: "The principal trial court for civil and criminal matters across Papua New Guinea, with registries in all major provinces.", published: true },
  { id: 3, tag: "Registry", iconName: "FileText", title: "Court Registry", description: "File and retrieve court documents, access case listings, and obtain certified copies of court records at any registry.", published: true },
  { id: 4, tag: "Library", iconName: "BookOpen", title: "Court Library", description: "Comprehensive legal research facilities, publications, and databases available to legal practitioners and the public.", published: true },
]

const FALLBACK_NEWS: HomeArticle[] = [
  { id: 1, slug: "#", date: "March 17, 2026", category: "Announcement", title: "NJSS Launches E-Judiciary Portal for Online Court Filings", excerpt: "The National Judicial Staff Service has launched its new online portal enabling legal practitioners to file court documents, access case listings and track matters digitally.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80" },
  { id: 2, slug: "#", date: "February 28, 2026", category: "Reports", title: "Judiciary Annual Report 2025 Released", excerpt: "The Supreme Court and National Court of Papua New Guinea have released the Annual Judges Report for 2025, highlighting key judicial outcomes and administrative achievements.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80" },
  { id: 3, slug: "#", date: "January 15, 2026", category: "Notice", title: "Waigani Court Complex Expansion Update", excerpt: "Construction works on the Waigani Court Complex expansion are progressing on schedule. Updated court room allocations and registry locations are now available.", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80" },
]

interface ApiSlide {
  id: number
  badge: string
  title: string
  subtitle: string
  image: string
  ctaLabel: string
  ctaHref: string
  ctaExternal: boolean
  secondaryLabel: string
  secondaryHref: string
}

const FALLBACK_SLIDES: ApiSlide[] = [
  { id: 1, badge: "Official Judiciary Website", title: "Equal Access to Justice for All People", subtitle: "The National Judicial Staff Service supports the Supreme Court and National Court of Papua New Guinea — delivering independent, fair and just judicial services to every citizen.", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80", ctaLabel: "Court Diary", ctaHref: "/filings", ctaExternal: false, secondaryLabel: "About NJSS", secondaryHref: "/about" },
  { id: 2, badge: "Supreme Court", title: "Papua New Guinea's Highest Court", subtitle: "The Supreme Court hears appeals, exercises original jurisdiction in constitutional matters, and delivers binding precedents that shape Papua New Guinea's legal landscape.", image: "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?w=1920&q=80", ctaLabel: "Supreme Court Diary", ctaHref: "/supreme-court/daily-diary", ctaExternal: false, secondaryLabel: "Acts & Rules", secondaryHref: "/supreme-court/acts-rules" },
  { id: 3, badge: "National Court", title: "Justice Delivered Across the Nation", subtitle: "With registries in every major province, the National Court brings civil and criminal justice closer to communities throughout Papua New Guinea.", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=80", ctaLabel: "Court Listings", ctaHref: "/national-court/listings", ctaExternal: false, secondaryLabel: "Provincial Registries", secondaryHref: "/national-court/provincial-registries" },
  { id: 4, badge: "Court Library", title: "Advancing Legal Research in PNG", subtitle: "The Judiciary's Court Library provides comprehensive legal research facilities, publications, and databases to support legal practitioners, scholars, and the public.", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1920&q=80", ctaLabel: "Library Resources", ctaHref: "/library/branch-libraries", ctaExternal: false, secondaryLabel: "Contact Us", secondaryHref: "/contact" },
]

const HOME_SECTIONS = [
  { id: "stats",         label: "At a Glance" },
  { id: "home-services", label: "Courts" },
  { id: "process",       label: "How to File" },
  { id: "home-news",     label: "News" },
  { id: "home-events",   label: "Events" },
  { id: "cta",           label: "Contact" },
]

const STAT_DEFS = [
  { settingKey: "stat_cases",      label: "Cases Filed (2025)",   icon: Scale },
  { settingKey: "stat_benefits",   label: "Judgments Delivered",  icon: CheckCircle },
  { settingKey: "stat_processing", label: "Provinces Served",     icon: Building2 },
  { settingKey: "stat_coverage",   label: "Judicial Officers",    icon: Users },
]

const process = [
  { step: "01", title: "Prepare Documents", desc: "Gather all required documents including originating process, supporting affidavits, and applicable court fees." },
  { step: "02", title: "Visit the Registry", desc: "Attend the nearest court registry or use the E-Judiciary portal to lodge your documents." },
  { step: "03", title: "Pay Court Fees", desc: "Pay the prescribed filing fees. Fee waivers may be available for certain matters." },
  { step: "04", title: "Obtain Listing Date", desc: "The registry will allocate a return date for your matter to be called before a Judge." },
  { step: "05", title: "Attend Court", desc: "Appear before the court on the allocated date. Legal representation is strongly recommended." },
]


function HeroSlider({ slides }: { slides: ApiSlide[] }) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const go = useCallback((idx: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(idx)
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  const prev = () => go((current - 1 + slides.length) % slides.length)
  const next = useCallback(() => go((current + 1) % slides.length), [current, go, slides.length])

  useEffect(() => {
    if (slides.length < 2) return
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next, slides.length])

  // Reset index if slides change
  useEffect(() => { setCurrent(0) }, [slides.length])

  if (slides.length === 0) return null
  const slide = slides[Math.min(current, slides.length - 1)]

  return (
    <section className="relative text-white overflow-hidden h-[420px] sm:h-[500px] lg:h-[560px]">
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[8000ms]"
            style={{ backgroundImage: `url('${s.image}')`, transform: i === current ? 'scale(1)' : 'scale(1.05)' }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-gray-950/90 via-gray-900/70 to-gray-800/40" />
          <div className="absolute inset-0 bg-linear-to-t from-gray-950/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-14 w-full">
          <div className="max-w-2xl">
            {slide.badge && (
              <span className="text-amber-300 text-xs font-bold tracking-[0.18em] uppercase mb-4 block">
                {slide.badge}
              </span>
            )}
            <h1
              key={`title-${current}`}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-white"
            >
              {slide.title}
            </h1>
            <p
              key={`sub-${current}`}
              className="text-sm sm:text-base text-gray-200/85 mb-7 leading-relaxed line-clamp-3 max-w-xl"
            >
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {slide.ctaLabel && (slide.ctaExternal ? (
                <a href={slide.ctaHref || "/"} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-7 rounded-lg text-sm font-bold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors shadow-lg shadow-[hsl(352,83%,44%)]/30">
                  {slide.ctaLabel} <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <Link href={slide.ctaHref || "/"}
                  className="inline-flex items-center gap-2 h-11 px-7 rounded-lg text-sm font-bold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors shadow-lg shadow-[hsl(352,83%,44%)]/30">
                  {slide.ctaLabel} <ArrowRight className="w-4 h-4" />
                </Link>
              ))}
              {slide.secondaryLabel && (
                <Link href={slide.secondaryHref || "/"}
                  className="inline-flex items-center gap-2 h-11 px-7 rounded-lg text-sm font-semibold border border-gray-500/50 text-white/90 hover:bg-white/10 hover:border-gray-400/60 hover:text-white transition-colors backdrop-blur-sm">
                  {slide.secondaryLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows — only show if multiple slides */}
      {slides.length > 1 && <>
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/25 hover:bg-black/50 border border-white/15 flex items-center justify-center text-white transition-all hover:scale-110 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === current ? "w-7 h-2 bg-amber-400" : "w-2 h-2 bg-white/35 hover:bg-white/65"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/25 hover:bg-black/50 border border-white/15 flex items-center justify-center text-white transition-all hover:scale-110 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </>}
    </section>
  )
}

export default function Home() {
  const s = useSettings()
  const show = (key: string) => s[key as keyof typeof s] !== "false"

  const [heroSlides, setHeroSlides] = useState<ApiSlide[]>(FALLBACK_SLIDES)
  useEffect(() => {
    fetch("/api/hero-slides")
      .then(r => r.json())
      .then((d: { slides?: ApiSlide[] }) => { if (d.slides?.length) setHeroSlides(d.slides) })
      .catch(() => {})
  }, [])

  const [upcomingEvents, setUpcomingEvents] = useState<HomeEvent[]>([])
  useEffect(() => {
    fetch("/api/events")
      .then(r => r.json())
      .then(d => {
        const all: HomeEvent[] = d.events ?? []
        const now = new Date()
        setUpcomingEvents(all.filter(e => new Date(e.eventDate + "T23:59:59") >= now).slice(0, 3))
      })
      .catch(() => {})
  }, [])

  const [homeServices, setHomeServices] = useState<HomeService[]>(FALLBACK_SERVICES)
  useEffect(() => {
    fetch("/api/services")
      .then(r => r.json())
      .then(d => { const s = (d.services ?? []).slice(0, 4); if (s.length) setHomeServices(s) })
      .catch(() => {})
  }, [])

  const [homeNews, setHomeNews] = useState<HomeArticle[]>(FALLBACK_NEWS)
  useEffect(() => {
    fetch("/api/news")
      .then(r => r.json())
      .then(d => { const n = (d.news ?? []).slice(0, 3); if (n.length) setHomeNews(n) })
      .catch(() => {})
  }, [])

  return (
    <div>
      <ScrollNav sections={HOME_SECTIONS} />
      {/* Hero Slider */}
      <HeroSlider slides={heroSlides} />

      {/* Alert banner — controlled from admin settings */}
      {s.banner_enabled === "true" && s.banner_text && (
        <div className="bg-gray-900 border-b border-gray-800 py-2.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />
            <span className="text-gray-300 tracking-wide">
              {s.banner_text}{" "}
              {s.banner_link && (
                <Link href={s.banner_link} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">Learn more →</Link>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      {show("home_show_stats") && (
        <section id="stats" className="bg-gray-900 py-0">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/8">
              {STAT_DEFS.map((stat) => (
                <div key={stat.label} className="text-center px-6 py-7 group">
                  <stat.icon className="w-5 h-5 text-amber-400/70 mx-auto mb-2 group-hover:text-amber-400 transition-colors" />
                  <div className="text-3xl font-extrabold text-white tracking-tight">{s[stat.settingKey as keyof typeof s]}</div>
                  <div className="text-[11px] text-gray-400 mt-1.5 uppercase tracking-widest font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {show("home_show_services") && (
        <section id="home-services" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-10">
              <Badge variant="outline" className="mb-2">Courts &amp; Services</Badge>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3">Our Courts &amp; Services</h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
                The NJSS supports the Supreme Court and National Court to deliver independent, fair and just judicial services throughout Papua New Guinea.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {homeServices.map((svc) => {
                const Icon = ICON_MAP[svc.iconName] ?? ICON_MAP.HelpCircle
                return (
                  <Link key={svc.id} href="/services"
                    className="group flex items-start gap-4 bg-white rounded-2xl border border-gray-200 hover:border-[hsl(352,83%,44%)]/30 p-5 transition-all hover:shadow-lg hover:shadow-[hsl(352,83%,44%)]/6 hover:-translate-y-0.5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[hsl(352,83%,44%)]/8 text-[hsl(352,83%,44%)] group-hover:bg-[hsl(352,83%,44%)]/15 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-[hsl(352,83%,44%)] transition-colors">{svc.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{svc.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[hsl(352,83%,44%)] group-hover:gap-2 transition-all">
                        Learn more <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* How to File a Court Matter */}
      {show("home_show_process") && (
        <section id="process" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-10">
              <Badge variant="outline" className="mb-2">Filing a Court Matter</Badge>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3">How to File a Court Matter</h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xl">
                Follow these steps to lodge your matter with the Supreme Court or National Court of Papua New Guinea.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {process.map((p, i) => (
                <div key={p.step} className="relative group">
                  <div className="text-center p-3">
                    <div className="relative w-10 h-10 mx-auto mb-2">
                      <span className="absolute inset-0 rounded-full bg-[hsl(352,83%,48%)] opacity-0 group-hover:opacity-20 group-hover:scale-[2.2] transition-all duration-500 ease-out" />
                      <span className="absolute inset-0 rounded-full bg-[hsl(352,83%,48%)] opacity-0 group-hover:opacity-10 group-hover:scale-[3.2] transition-all duration-700 ease-out delay-100" />
                      <div className="relative w-10 h-10 bg-[hsl(352,83%,48%)] text-white rounded-full flex items-center justify-center font-bold text-xs group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                        {p.step}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-[hsl(352,83%,48%)] transition-colors">{p.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed hidden sm:block">{p.desc}</p>
                  </div>
                  {i < process.length - 1 && (
                    <div className="hidden lg:block absolute top-9 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 bg-red-100" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href={COURT_DIARY_URL}
                className="inline-flex items-center h-9 px-5 rounded-md text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white transition-colors">
                View Court Diary <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* News */}
      {show("home_show_news") && (
        <section id="home-news" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <Badge variant="outline" className="mb-2">Latest Updates</Badge>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">News &amp; Announcements</h2>
              </div>
              <Link href="/news" className="text-sm font-semibold text-[hsl(352,83%,44%)] hover:underline flex items-center gap-1 shrink-0">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {homeNews.map((n) => (
                <Link key={n.id} href={`/news/${n.slug}`}>
                  <Card className="hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
                    <div className="h-36 overflow-hidden">
                      {n.image
                        ? <img src={n.image} alt={n.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full bg-gray-100" />
                      }
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">{n.category}</Badge>
                        <span className="text-xs text-gray-400">{n.date}</span>
                      </div>
                      <CardTitle className="text-base leading-snug hover:text-[hsl(352,83%,48%)]">
                        {n.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{n.excerpt}</CardDescription>
                      <span className="mt-3 text-sm font-medium text-[hsl(352,83%,48%)] hover:underline flex items-center gap-1">
                        Read more <ChevronRight className="w-4 h-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {show("home_show_events") && (
        <section id="home-events" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <Badge variant="outline" className="mb-2">Upcoming Events</Badge>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Events &amp; Workshops</h2>
              </div>
              <Link href="/events" className="text-sm font-semibold text-[hsl(352,83%,44%)] hover:underline flex items-center gap-1 shrink-0">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-14 text-center">
                <CalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="font-semibold text-gray-500">No upcoming events at this time</p>
                <p className="text-sm text-gray-400 mt-1 mb-5">Check back soon — new events and workshops are added regularly.</p>
                <Link href="/events" className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(352,83%,48%)] hover:underline">
                  Browse all events <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {upcomingEvents.map(e => {
                  const { day, month, year } = formatShortDate(e.eventDate)
                  const colorClass = EVENT_COLORS[e.category] ?? EVENT_COLORS.General
                  return (
                    <Link key={e.id} href="/events"
                      className="group flex gap-4 bg-white rounded-xl border border-gray-200 p-4 transition-colors">
                      <div className="shrink-0 w-14 h-14 rounded-xl bg-[hsl(352,83%,48%)] text-white flex flex-col items-center justify-center">
                        <span className="text-lg font-black leading-none">{day}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{month}</span>
                        <span className="text-[9px] opacity-60">{year}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>{e.category}</span>
                        <h3 className="font-semibold text-gray-900 text-sm mt-1.5 leading-snug group-hover:text-[hsl(352,83%,48%)] transition-colors line-clamp-2">
                          {e.title}
                        </h3>
                        {e.location && (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{e.location.split(",")[0]}</span>
                          </div>
                        )}
                        {e.eventTime && (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <CalendarDays className="w-3 h-3 shrink-0" />
                            {e.eventTime}
                          </div>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      {show("home_show_cta") && (
        <section id="cta" className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <div className="mb-8">
              <Badge variant="outline" className="mb-2">Get in Touch</Badge>
              <h2 className="text-2xl lg:text-3xl font-bold text-[hsl(352,83%,38%)]">Need Assistance with the Courts?</h2>
              <div className="w-12 h-1 rounded-full bg-linear-to-r from-amber-500 to-amber-200 mt-3 mb-4" />
              <p className="text-gray-500 leading-relaxed text-sm">
                Our registry staff are available Monday to Friday to assist you with filing, court listings, and general judicial enquiries.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(352,83%,48%)]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-[hsl(352,83%,48%)]" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(352,83%,48%)]">Registry</span>
                </div>
                <div className="font-bold text-gray-900 text-sm">Talk to Registry Staff</div>
                <div className="text-xs text-gray-500 leading-relaxed">Call or visit your nearest court registry. Our staff are here to assist you.</div>
                <div className="mt-auto pt-2.5 border-t border-gray-100">
                  <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(352,83%,48%)] hover:gap-2.5 transition-all">
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(352,83%,48%)]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-[hsl(352,83%,48%)]" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(352,83%,48%)]">Head Registry</span>
                </div>
                <div className="font-bold text-gray-900 text-sm">Waigani Court Complex</div>
                <div className="text-xs text-gray-500 leading-relaxed">Waigani Drive, Waigani, NCD, Papua New Guinea</div>
                <div className="mt-auto pt-2.5 border-t border-gray-100 text-sm font-semibold text-[hsl(352,83%,48%)]">{s.contact_phone.split("/")[0].trim()}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Provincial Registry</span>
                </div>
                <div className="font-bold text-gray-900 text-sm">Lae Registry</div>
                <div className="text-xs text-gray-500 leading-relaxed">Lae National Court, Morobe Province</div>
                <div className="mt-auto pt-2.5 border-t border-gray-100 text-sm font-semibold text-emerald-700">+675 472 1855</div>
              </div>
            </div>
            <div className="mt-5 bg-gray-50 rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-red-300" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Court Forms &amp; Resources</div>
                  <div className="text-xs text-gray-400 mt-0.5">Download official court forms, practice directions and guides</div>
                </div>
              </div>
              <Link href="/resources" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(352,83%,48%)] hover:gap-2.5 transition-all">
                Download <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
