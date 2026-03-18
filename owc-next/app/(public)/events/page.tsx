"use client"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, Clock, Calendar, Search, Tag, ChevronRight } from "lucide-react"
import PageHero from "@/components/PageHero"
import ScrollNav from "@/components/ScrollNav"

const SECTIONS = [
  { id: "upcoming", label: "Upcoming Events" },
  { id: "past", label: "Past Events" },
]

const CATEGORY_COLORS: Record<string, string> = {
  Workshop:     "bg-blue-100 text-blue-700",
  Training:     "bg-indigo-100 text-indigo-700",
  Awareness:    "bg-emerald-100 text-emerald-700",
  Consultation: "bg-amber-100 text-amber-700",
  Conference:   "bg-purple-100 text-purple-700",
  Outreach:     "bg-rose-100 text-rose-700",
  General:      "bg-gray-100 text-gray-600",
}

interface OWCEvent {
  id: number
  title: string
  description: string
  eventDate: string
  eventTime: string
  location: string
  category: string
  image: string
  published: boolean
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("en-PG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
}

function isPast(iso: string) {
  return new Date(iso + "T23:59:59") < new Date()
}

function EventCard({ event }: { event: OWCEvent }) {
  const past = isPast(event.eventDate)
  const colorClass = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.General
  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${past ? "opacity-70" : ""}`}>
      {event.image && (
        <div className="h-44 overflow-hidden relative">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          {past && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="bg-white/90 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">Past Event</span>
            </div>
          )}
        </div>
      )}
      <CardContent className="pt-5 pb-5 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>{event.category}</span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />{formatDate(event.eventDate)}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 leading-snug text-[15px]">{event.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{event.description}</p>
        <div className="space-y-1.5 pt-1">
          {event.eventTime && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 text-[hsl(210,70%,25%)] shrink-0" />
              {event.eventTime}
            </div>
          )}
          {event.location && (
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5 text-[hsl(210,70%,25%)] shrink-0 mt-0.5" />
              {event.location}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Events() {
  const [events, setEvents] = useState<OWCEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/events")
      .then(r => r.json())
      .then(d => setEvents(d.events ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  const categories = Array.from(new Set(events.map(e => e.category)))

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory ? e.category === activeCategory : true
    return matchSearch && matchCategory
  })

  const upcoming = filtered.filter(e => !isPast(e.eventDate))
  const past     = filtered.filter(e => isPast(e.eventDate))

  return (
    <div>
      <PageHero
        badge="Events"
        title="Upcoming Events"
        subtitle="Workshops, awareness campaigns, public consultations, and training sessions hosted by the Office of Workers' Compensation across Papua New Guinea."
        crumbs={[{ label: "Events" }]}
        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80"
      />

      <ScrollNav sections={SECTIONS} />

      <section id="upcoming" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-400 shrink-0" />
              <button
                onClick={() => setActiveCategory(null)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  activeCategory === null
                    ? "bg-[hsl(210,70%,25%)] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[hsl(210,70%,25%)]"
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-[hsl(210,70%,25%)] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-[hsl(210,70%,25%)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
              <Badge variant="outline" className="text-xs">{upcoming.length}</Badge>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 h-72 animate-pulse" />
                ))}
              </div>
            ) : upcoming.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="font-semibold text-gray-600 mb-1">
                  {search || activeCategory ? "No events match your search" : "No upcoming events at this time"}
                </p>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                  {search || activeCategory
                    ? "Try adjusting your filters or search terms."
                    : "New workshops, consultations, and awareness campaigns are announced regularly. Check back soon or contact us for more information."}
                </p>
                {(search || activeCategory) && (
                  <button
                    onClick={() => { setSearch(""); setActiveCategory(null) }}
                    className="mt-4 text-sm font-medium text-[hsl(210,70%,25%)] hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcoming.map(e => <EventCard key={e.id} event={e} />)}
              </div>
            )}
          </div>

          {/* Past events */}
          {past.length > 0 && (
            <div id="past" className="mt-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <h2 className="text-xl font-bold text-gray-700">Past Events</h2>
                <Badge variant="outline" className="text-xs">{past.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {past.map(e => <EventCard key={e.id} event={e} />)}
              </div>
            </div>
          )}

          {/* Subscribe CTA */}
          <div className="mt-14 bg-[hsl(210,70%,25%)] rounded-2xl p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">Stay Informed</h3>
            <p className="text-blue-100 text-sm mb-5 max-w-md mx-auto">
              To receive updates about upcoming OWC workshops and events in your province, contact your nearest Provincial Labour Office or OWC headquarters.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <a href="mailto:workerscomp@owc.gov.pg"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[hsl(210,70%,25%)] font-semibold hover:bg-blue-50 transition-colors">
                workerscomp@owc.gov.pg <ChevronRight className="w-4 h-4" />
              </a>
              <span className="text-blue-200">or call (+675) 313 5000 / Toll-Free 180 1100</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
