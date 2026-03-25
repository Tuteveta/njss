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
  Workshop:     "bg-blue-100 text-blue-700",
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

const CLAIMS_URL = "https://portal.owc.gov.pg"

const FALLBACK_SERVICES: HomeService[] = [
  { id: 1, tag: "Workers", iconName: "Shield", title: "Workers Compensation", description: "Financial support covering medical expenses, lost wages, and permanent disability for workers injured on the job.", published: true },
  { id: 2, tag: "Rehab", iconName: "Heart", title: "Injury Rehabilitation", description: "Structured recovery programs helping injured workers return to safe and meaningful employment.", published: true },
  { id: 3, tag: "Claims", iconName: "FileText", title: "Claim Filing", description: "Simple and transparent online or in-person process to submit and track your compensation claim.", published: true },
  { id: 4, tag: "Employers", iconName: "Briefcase", title: "Employer Registration", description: "Register your business and ensure full workforce coverage under PNG Workers Compensation legislation.", published: true },
]

const FALLBACK_NEWS: HomeArticle[] = [
  { id: 1, slug: "#", date: "March 5, 2026", category: "Policy Update", title: "OWC Launches New Online Claims Portal for 2026", excerpt: "The Office of Workers Compensation is pleased to announce the launch of our improved digital claims system, making it easier for workers to file and track claims.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80" },
  { id: 2, slug: "#", date: "February 18, 2026", category: "Workshop", title: "Employer Awareness Workshop — Port Moresby", excerpt: "Join us for a free workshop on employer obligations under the Workers Compensation Act 1978. All registered businesses are encouraged to attend.", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80" },
  { id: 3, slug: "#", date: "February 1, 2026", category: "Announcement", title: "Updated Medical Assessment Schedules for 2026", excerpt: "New medical fee schedules have been gazetted and take effect from February 1, 2026. Employers and insurers should review the updated rates.", image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80" },
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
  { id: 1, badge: "Official Government Agency", title: "Protecting Papua New Guinea's Workforce", subtitle: "A statutory office under the Department of Labour and Industrial Relations (DLIR), OWC ensures every worker injured on the job receives fair compensation, quality rehabilitation, and a safe path back to employment.", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80", ctaLabel: "File a Claim", ctaHref: CLAIMS_URL, ctaExternal: true, secondaryLabel: "Learn More", secondaryHref: "/about" },
  { id: 2, badge: "Workers Compensation", title: "Fair Compensation for Every Injured Worker", subtitle: "From medical expenses to lost wages and permanent disability — OWC ensures you receive every benefit you are entitled to under Papua New Guinea law.", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80", ctaLabel: "Check Your Eligibility", ctaHref: "/services", ctaExternal: false, secondaryLabel: "View Services", secondaryHref: "/services" },
  { id: 3, badge: "Employer Compliance", title: "Supporting PNG Employers in Meeting Their Obligations", subtitle: "Register your business, understand your coverage requirements, and ensure your workforce is protected under the Workers Compensation Act 1978.", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80", ctaLabel: "Register Now", ctaHref: "/services#employer", ctaExternal: false, secondaryLabel: "Resources", secondaryHref: "/resources" },
  { id: 4, badge: "Rehabilitation Services", title: "A Safe Path Back to Employment", subtitle: "OWC's structured rehabilitation programs help injured workers recover and return to safe, meaningful work — supporting their families and communities.", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80", ctaLabel: "Learn About Rehab", ctaHref: "/services#rehabilitation", ctaExternal: false, secondaryLabel: "Contact Us", secondaryHref: "/contact" },
]

const HOME_SECTIONS = [
  { id: "stats",         label: "Statistics" },
  { id: "home-services", label: "Services" },
  { id: "process",       label: "Claims Process" },
  { id: "home-news",     label: "News" },
  { id: "home-events",   label: "Events" },
  { id: "cta",           label: "Contact" },
]

const STAT_DEFS = [
  { settingKey: "stat_claims",     label: "Claims Lodged (2024)", icon: FileText },
  { settingKey: "stat_benefits",   label: "Benefits Paid (2024)", icon: TrendingUp },
  { settingKey: "stat_processing", label: "Days Avg. Processing", icon: Clock },
  { settingKey: "stat_coverage",   label: "Nationwide Coverage",  icon: Users },
]

const process = [
  { step: "01", title: "Report Injury", desc: "Notify your employer immediately after a workplace injury or occupational disease diagnosis." },
  { step: "02", title: "Seek Medical Care", desc: "Get treatment from a registered medical provider and keep all records and receipts." },
  { step: "03", title: "Submit Claim", desc: "Complete the claim form and submit with supporting documents to OWC." },
  { step: "04", title: "Assessment", desc: "OWC reviews and assesses your claim with a case officer assigned to you." },
  { step: "05", title: "Receive Benefits", desc: "Approved claims receive compensation payments directly or through your employer's insurer." },
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
    <section className="relative text-white overflow-hidden h-[400px] sm:h-[440px] lg:h-[480px]">
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${s.image}')` }}
          />
          <div className="absolute inset-0 bg-[hsl(210,70%,10%)]/75" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-14 w-full">
          <div className="max-w-2xl">
            {slide.badge && (
              <span className="inline-block mb-3 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-semibold tracking-wider uppercase">
                {slide.badge}
              </span>
            )}
            <h1
              key={`title-${current}`}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug mb-3"
            >
              {slide.title}
            </h1>
            <p
              key={`sub-${current}`}
              className="text-sm sm:text-base text-blue-100/90 mb-6 leading-relaxed line-clamp-3"
            >
              {slide.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              {slide.ctaLabel && (slide.ctaExternal ? (
                <a href={slide.ctaHref || "/"} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                  {slide.ctaLabel} <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <Link href={slide.ctaHref || "/"}
                  className="inline-flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                  {slide.ctaLabel} <ArrowRight className="w-4 h-4" />
                </Link>
              ))}
              {slide.secondaryLabel && (
                <Link href={slide.secondaryHref || "/"}
                  className="inline-flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-semibold border border-white/40 text-white hover:bg-white/10 transition-colors">
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
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 border border-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === current ? "w-6 h-2 bg-emerald-400" : "w-2 h-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 border border-white/20 flex items-center justify-center text-white transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
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
        <div className="bg-emerald-50 border-b border-emerald-200 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
            <AlertCircle className="w-4 h-4 text-emerald-800 shrink-0" />
            <span className="text-emerald-900">
              {s.banner_text}{" "}
              {s.banner_link && (
                <Link href={s.banner_link} className="underline font-medium">Learn more →</Link>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      {show("home_show_stats") && (
        <section id="stats" className="bg-white py-8 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-200">
              {STAT_DEFS.map((stat) => (
                <div key={stat.label} className="text-center px-4 py-2">
                  <stat.icon className="w-6 h-6 text-[hsl(210,70%,25%)] mx-auto mb-1.5" />
                  <div className="text-2xl font-bold text-[hsl(210,70%,25%)]">{s[stat.settingKey as keyof typeof s]}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {show("home_show_services") && (
        <section id="home-services" className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <Badge variant="outline" className="mb-2">Our Services</Badge>
            <h2 className="text-2xl font-bold text-gray-900">How We Support You</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Comprehensive workers compensation services to protect employees and guide employers across Papua New Guinea.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {homeServices.map((svc) => {
              const Icon = ICON_MAP[svc.iconName] ?? ICON_MAP.HelpCircle
              return (
                <Link key={svc.id} href="/services"
                  className="group flex items-start gap-4 bg-white rounded-xl border border-gray-200 p-5 transition-colors">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 text-[hsl(210,70%,25%)] group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-[hsl(210,70%,25%)] transition-colors">{svc.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{svc.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[hsl(210,70%,25%)] group-hover:gap-2 transition-all">
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

      {/* How to File a Claim */}
      {show("home_show_process") && (
        <section id="process" className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
              <Badge variant="outline" className="mb-2">Claims Process</Badge>
              <h2 className="text-2xl font-bold text-gray-900">How to File a Claim</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Follow these steps to ensure your workers compensation claim is processed smoothly and efficiently.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {process.map((p, i) => (
                <div key={p.step} className="relative group">
                  <div className="text-center p-3">
                    <div className="relative w-10 h-10 mx-auto mb-2">
                      <span className="absolute inset-0 rounded-full bg-[hsl(210,70%,25%)] opacity-0 group-hover:opacity-20 group-hover:scale-[2.2] transition-all duration-500 ease-out" />
                      <span className="absolute inset-0 rounded-full bg-[hsl(210,70%,25%)] opacity-0 group-hover:opacity-10 group-hover:scale-[3.2] transition-all duration-700 ease-out delay-100" />
                      <div className="relative w-10 h-10 bg-[hsl(210,70%,25%)] text-white rounded-full flex items-center justify-center font-bold text-xs group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[hsl(210,70%,25%)]/30 transition-all duration-300">
                        {p.step}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm group-hover:text-[hsl(210,70%,25%)] transition-colors">{p.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed hidden sm:block">{p.desc}</p>
                  </div>
                  {i < process.length - 1 && (
                    <div className="hidden lg:block absolute top-9 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 bg-blue-100" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <a href={CLAIMS_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center h-9 px-5 rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                Start Your Claim <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* News */}
      {show("home_show_news") && (
        <section id="home-news" className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-7">
              <div>
                <Badge variant="outline" className="mb-2">Latest Updates</Badge>
                <h2 className="text-2xl font-bold text-gray-900">News & Announcements</h2>
              </div>
              <Link href="/news" className="text-sm font-medium text-[hsl(210,70%,25%)] hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {homeNews.map((n) => (
                <Link key={n.id} href={`/news/${n.slug}`}>
                  <Card className="hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full">
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
                      <CardTitle className="text-base leading-snug hover:text-[hsl(210,70%,25%)]">
                        {n.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{n.excerpt}</CardDescription>
                      <span className="mt-3 text-sm font-medium text-[hsl(210,70%,25%)] hover:underline flex items-center gap-1">
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
        <section id="home-events" className="py-10 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-end mb-7">
              <div>
                <Badge variant="outline" className="mb-2">Upcoming Events</Badge>
                <h2 className="text-2xl font-bold text-gray-900">Events &amp; Workshops</h2>
              </div>
              <Link href="/events" className="text-sm font-medium text-[hsl(210,70%,25%)] hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-14 text-center">
                <CalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="font-semibold text-gray-500">No upcoming events at this time</p>
                <p className="text-sm text-gray-400 mt-1 mb-5">Check back soon — new events and workshops are added regularly.</p>
                <Link href="/events" className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(210,70%,25%)] hover:underline">
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
                      <div className="shrink-0 w-14 h-14 rounded-xl bg-[hsl(210,70%,25%)] text-white flex flex-col items-center justify-center">
                        <span className="text-lg font-black leading-none">{day}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{month}</span>
                        <span className="text-[9px] opacity-60">{year}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>{e.category}</span>
                        <h3 className="font-semibold text-gray-900 text-sm mt-1.5 leading-snug group-hover:text-[hsl(210,70%,25%)] transition-colors line-clamp-2">
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
        <section id="cta" className="py-10 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 lg:px-10">
            <div className="mb-8">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(210,70%,25%)] border border-[hsl(210,70%,25%)]/30 bg-[hsl(210,70%,25%)]/5 px-4 py-1.5 rounded-full mb-3">Get in Touch</span>
              <h2 className="text-2xl lg:text-3xl font-bold text-[hsl(210,70%,18%)]">Need Help with Your Claim?</h2>
              <div className="w-12 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-200 mt-3 mb-4" />
              <p className="text-gray-500 leading-relaxed text-sm">
                Our experienced case officers are available Monday to Friday to guide you through the claims process and answer any questions.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(210,70%,25%)]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-[hsl(210,70%,25%)]" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(210,70%,25%)]">Case Officer</span>
                </div>
                <div className="font-bold text-gray-900 text-sm">Talk to a Case Officer</div>
                <div className="text-xs text-gray-500 leading-relaxed">Call or visit any of our offices. Our team is here to help you every step of the way.</div>
                <div className="mt-auto pt-2.5 border-t border-gray-100">
                  <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(210,70%,25%)] hover:gap-2.5 transition-all">
                    Contact Us <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[hsl(210,70%,25%)]/10 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-[hsl(210,70%,25%)]" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(210,70%,25%)]">Head Office</span>
                </div>
                <div className="font-bold text-gray-900 text-sm">Port Moresby (DLIR HQ)</div>
                <div className="text-xs text-gray-500 leading-relaxed">Gaukara Rumana, Wards Rd, Port Moresby, NCD</div>
                <div className="mt-auto pt-2.5 border-t border-gray-100 text-sm font-semibold text-[hsl(210,70%,25%)]">{s.contact_phone.split("/")[0].trim()}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Regional Office</span>
                </div>
                <div className="font-bold text-gray-900 text-sm">Lae</div>
                <div className="text-xs text-gray-500 leading-relaxed">Lae City Centre, Morobe Province</div>
                <div className="mt-auto pt-2.5 border-t border-gray-100 text-sm font-semibold text-emerald-700">+675 472 0000</div>
              </div>
            </div>
            <div className="mt-5 bg-gray-50 rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-red-300" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Claim Forms & Resources</div>
                  <div className="text-xs text-gray-400 mt-0.5">Download official OWC forms and guides</div>
                </div>
              </div>
              <Link href="/resources" className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(210,70%,25%)] hover:gap-2.5 transition-all">
                Download <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
