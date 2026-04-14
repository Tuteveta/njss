"use client"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { ArrowRight, Shield, Users, FileText, Clock, TrendingUp, CheckCircle, Phone, Download, ChevronRight, ChevronLeft, CalendarDays, MapPin, HelpCircle, Building2, Stethoscope, Scale, Briefcase, Heart, BookOpen, Star, Globe } from "lucide-react"
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
    <section className="relative text-white overflow-hidden h-[420px] sm:h-[500px] lg:h-[580px]">
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
          <div className="absolute inset-0 bg-linear-to-r from-gray-950/95 via-gray-900/75 to-gray-800/30" />
          <div className="absolute inset-0 bg-linear-to-t from-gray-950/70 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 w-full">
          <div className="max-w-2xl">
            {slide.badge && (
              <span className="text-amber-400 text-xs font-semibold tracking-[0.18em] uppercase mb-4 block opacity-90">
                {slide.badge}
              </span>
            )}
            <h1
              key={`title-${current}`}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-white"
              style={{ textShadow: '0 2px 24px rgba(0,0,0,0.4)' }}
            >
              {slide.title}
            </h1>
            <p
              key={`sub-${current}`}
              className="text-sm sm:text-base text-gray-200/85 mb-8 leading-relaxed line-clamp-3 max-w-xl"
            >
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {slide.ctaLabel && (slide.ctaExternal ? (
                <a href={slide.ctaHref || "/"} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-7 rounded-lg text-sm font-bold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors">
                  {slide.ctaLabel} <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <Link href={slide.ctaHref || "/"}
                  className="inline-flex items-center gap-2 h-11 px-7 rounded-lg text-sm font-bold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors">
                  {slide.ctaLabel} <ArrowRight className="w-4 h-4" />
                </Link>
              ))}
              {slide.secondaryLabel && (
                <Link href={slide.secondaryHref || "/"}
                  className="inline-flex items-center gap-2 h-11 px-7 rounded-lg text-sm font-semibold text-white border border-white/30 hover:border-white/60 hover:bg-white/10 transition-colors">
                  {slide.secondaryLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dots + prev/next — grouped at bottom centre */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          <button
            onClick={prev}
            className="w-7 h-7 rounded-full bg-black/25 hover:bg-black/50 border border-white/15 flex items-center justify-center text-white transition-all backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

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

          <button
            onClick={next}
            className="w-7 h-7 rounded-full bg-black/25 hover:bg-black/50 border border-white/15 flex items-center justify-center text-white transition-all backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
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


      {/* Stats */}
      {show("home_show_stats") && (
        <section id="stats" className="bg-gray-900 py-0">
          <hr className="gradient-rule" />
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
              {STAT_DEFS.map((stat) => (
                <div key={stat.label} className="text-center px-6 py-9">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(352,83%,44%)]/15 border border-[hsl(352,83%,44%)]/20 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {s[stat.settingKey as keyof typeof s]}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1.5 uppercase tracking-widest font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <hr className="gradient-rule" />
        </section>
      )}

      {/* Services */}
      {show("home_show_services") && (
        <section id="home-services" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <div className="mb-12">
              <p className="text-[hsl(352,83%,44%)] text-xs font-semibold tracking-[0.18em] uppercase mb-3">Courts &amp; Services</p>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3 heading-bar">Our Courts &amp; Services</h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xl mt-6">
                The NJSS supports the Supreme Court and National Court to deliver independent, fair and just judicial services throughout Papua New Guinea.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {homeServices.map((svc) => {
                const Icon = ICON_MAP[svc.iconName] ?? ICON_MAP.HelpCircle
                return (
                  <Link key={svc.id} href="/services"
                    className="flex items-start gap-4 bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-[hsl(352,83%,44%)]/8 text-[hsl(352,83%,44%)]">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1.5 text-base">{svc.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{svc.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[hsl(352,83%,44%)]">
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
        <section id="process" className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <div className="mb-12">
              <p className="text-[hsl(352,83%,44%)] text-xs font-semibold tracking-[0.18em] uppercase mb-3">Filing a Court Matter</p>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-3 heading-bar">How to File a Court Matter</h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xl mt-6">
                Follow these steps to lodge your matter with the Supreme Court or National Court of Papua New Guinea.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {process.map((p, i) => (
                <div key={p.step} className="relative">
                  <div className="text-center p-3">
                    <div className="w-12 h-12 mx-auto mb-3 bg-[hsl(352,83%,44%)] text-white rounded-full flex items-center justify-center font-black text-sm">
                      {p.step}
                    </div>
                    <h3 className="font-bold text-white mb-1.5 text-sm">{p.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed hidden sm:block">{p.desc}</p>
                  </div>
                  {i < process.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[calc(50%+24px)] w-[calc(100%-48px)] h-px"
                      style={{ background: 'linear-gradient(90deg, hsl(352,83%,44%), hsla(352,83%,44%,0.2))' }} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href={COURT_DIARY_URL}
                className="inline-flex items-center h-11 px-7 rounded-lg text-sm font-bold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors">
                View Court Diary <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* News */}
      {show("home_show_news") && (
        <section id="home-news" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-[hsl(352,83%,44%)] text-xs font-semibold tracking-[0.18em] uppercase mb-3">Latest Updates</p>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 heading-bar">News &amp; Announcements</h2>
              </div>
              <Link href="/news" className="text-sm font-semibold text-[hsl(352,83%,44%)] hover:underline flex items-center gap-1 shrink-0">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {homeNews.map((n) => (
                <Link key={n.id} href={`/news/${n.slug}`} className="block bg-white rounded-2xl border border-gray-200 overflow-hidden h-full">
                  <div className="h-44 overflow-hidden">
                    {n.image
                      ? <img src={n.image} alt={n.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gray-100" />
                    }
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-[hsl(352,83%,44%)]">{n.category}</span>
                      <span className="text-xs text-gray-400">{n.date}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2">{n.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{n.excerpt}</p>
                    <span className="mt-4 text-sm font-semibold text-[hsl(352,83%,44%)] flex items-center gap-1">
                      Read more <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {show("home_show_events") && (
        <section id="home-events" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <div className="flex justify-between items-end mb-12">
              <div>
                <p className="text-[hsl(352,83%,44%)] text-xs font-semibold tracking-[0.18em] uppercase mb-3">Upcoming Events</p>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 heading-bar">Events &amp; Workshops</h2>
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
                      className="flex gap-4 bg-white rounded-2xl border border-gray-200 p-5">
                      <div className="shrink-0 w-16 h-16 rounded-2xl bg-[hsl(352,83%,44%)] text-white flex flex-col items-center justify-center">
                        <span className="text-xl font-black leading-none">{day}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">{month}</span>
                        <span className="text-[9px] opacity-60">{year}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>{e.category}</span>
                        <h3 className="font-semibold text-gray-900 text-sm mt-1.5 leading-snug line-clamp-2">
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
        <>
        <section id="cta" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
              <div>
                <p className="text-[hsl(352,83%,44%)] text-xs font-semibold tracking-[0.18em] uppercase mb-3">Get in Touch</p>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Need Assistance with the Courts?</h2>
                <div className="w-8 h-0.5 bg-[hsl(352,83%,44%)] mt-3 rounded-full" />
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md lg:text-right">
                Registry staff are available Monday – Friday to assist with filing, court listings, and judicial enquiries.
              </p>
            </div>

            {/* Registry cards — joined panel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 rounded-2xl overflow-hidden border border-gray-200">
              <div className="p-7 flex flex-col gap-5">
                <div className="w-10 h-10 rounded-xl bg-[hsl(352,83%,44%)]/8 border border-[hsl(352,83%,44%)]/15 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[hsl(352,83%,44%)]" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[hsl(352,83%,44%)] mb-2">Registry</p>
                  <p className="font-semibold text-gray-900 text-sm mb-2">Talk to Registry Staff</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Call or visit your nearest court registry. Our staff are here to assist you.</p>
                </div>
                <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(352,83%,44%)] hover:text-[hsl(352,83%,35%)] transition-colors">
                  Contact Us <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-7 flex flex-col gap-5 border-x border-gray-200">
                <div className="w-10 h-10 rounded-xl bg-[hsl(352,83%,44%)]/8 border border-[hsl(352,83%,44%)]/15 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[hsl(352,83%,44%)]" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[hsl(352,83%,44%)] mb-2">Head Registry</p>
                  <p className="font-semibold text-gray-900 text-sm mb-2">Waigani Court Complex</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Waigani Drive, Waigani, NCD, Papua New Guinea</p>
                </div>
                <p className="text-sm font-bold text-gray-900">{s.contact_phone.split("/")[0].trim()}</p>
              </div>

              <div className="p-7 flex flex-col gap-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 mb-2">Provincial Registry</p>
                  <p className="font-semibold text-gray-900 text-sm mb-2">Lae Registry</p>
                  <p className="text-xs text-gray-500 leading-relaxed">Lae National Court, Morobe Province</p>
                </div>
                <p className="text-sm font-bold text-gray-900">+675 472 1855</p>
              </div>
            </div>

            {/* Resources bar */}
            <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-[hsl(352,83%,44%)]/8 border border-[hsl(352,83%,44%)]/15 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-[hsl(352,83%,44%)]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Court Forms &amp; Resources</p>
                  <p className="text-xs text-gray-500 mt-0.5">Download official court forms, practice directions and guides</p>
                </div>
              </div>
              <Link href="/resources" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(352,83%,44%)] hover:text-[hsl(352,83%,35%)] transition-colors">
                Download <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>
        </>
      )}
    </div>
  )
}
