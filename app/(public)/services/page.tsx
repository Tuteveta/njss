"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Shield, Users, Building2, Stethoscope, Scale, HelpCircle,
  Briefcase, Heart, BookOpen, FileText, Star, Globe, ArrowRight, Phone,
} from "lucide-react"
import PageHero from "@/components/PageHero"

interface ApiService {
  id: number; position: number; tag: string; iconName: string
  title: string; description: string; whoEligible: string
  benefits: string[]; published: boolean
}

const ICON_MAP: Record<string, React.ElementType> = {
  Shield, Users, Building2, Stethoscope, Scale, HelpCircle,
  Briefcase, Heart, BookOpen, FileText, Star, Globe,
}

const TAG_COLORS: Record<string, string> = {
  Workers: "text-red-800 border-red-200 bg-red-50",
  Rehabilitation: "text-emerald-700 border-emerald-200 bg-emerald-50",
  Employers: "text-indigo-700 border-indigo-200 bg-indigo-50",
  Medical: "text-teal-700 border-teal-200 bg-teal-50",
  Disputes: "text-purple-700 border-purple-200 bg-purple-50",
  Advisory: "text-amber-700 border-amber-200 bg-amber-50",
}

export default function Services() {
  const [services, setServices] = useState<ApiService[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/services")
      .then(r => r.json())
      .then((d: { services?: ApiService[] }) => {
        const svcs = d.services ?? []
        setServices(svcs)
        if (svcs.length) setActiveId(svcs[0].id)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const active = services.find(s => s.id === activeId)
  const activeIndex = services.findIndex(s => s.id === activeId)
  const IconComponent = active ? (ICON_MAP[active.iconName] ?? HelpCircle) : HelpCircle
  const tagColor = active ? (TAG_COLORS[active.tag] ?? "text-emerald-700 border-emerald-200 bg-emerald-50") : ""

  return (
    <div>
      <PageHero
        badge="Courts & Services"
        title="Our Courts & Services"
        subtitle="The NJSS supports the Supreme Court and National Court of Papua New Guinea in delivering accessible, independent and fair judicial services to all people."
        crumbs={[{ label: "Courts" }]}
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      {!loading && services.length > 0 && (
        <>
          {/* Mobile pill tabs */}
          <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 lg:px-10 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-xs text-gray-400 font-medium shrink-0 pr-2">Courts:</span>
              {services.map(svc => {
                const Icon = ICON_MAP[svc.iconName] ?? HelpCircle
                return (
                  <button
                    key={svc.id}
                    onClick={() => setActiveId(svc.id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeId === svc.id ? "bg-[hsl(352,83%,48%)] text-white" : "bg-gray-100 text-gray-700 hover:bg-[hsl(352,75%,97%)] hover:text-[hsl(352,83%,48%)]"}`}
                  >
                    <Icon className="w-3 h-3" />
                    {svc.tag || svc.title}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 lg:px-10 py-16">
            <div className="flex flex-col lg:flex-row gap-10">

              {/* Sticky sidebar */}
              <aside className="hidden lg:block w-56 shrink-0">
                <div className="sticky top-20 bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Courts</p>
                  <nav className="space-y-0.5">
                    {services.map(svc => {
                      const Icon = ICON_MAP[svc.iconName] ?? HelpCircle
                      return (
                        <button
                          key={svc.id}
                          onClick={() => setActiveId(svc.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-left ${activeId === svc.id ? "bg-[hsl(352,83%,48%)] text-white" : "text-gray-600 hover:bg-[hsl(352,75%,97%)] hover:text-[hsl(352,83%,48%)]"}`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${activeId === svc.id ? "text-white" : "text-gray-400"}`} />
                          {svc.title}
                        </button>
                      )
                    })}
                  </nav>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link href="/contact" className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors">
                      <Phone className="w-3.5 h-3.5" /> Contact NJSS
                    </Link>
                  </div>
                </div>
              </aside>

              {/* Active service panel */}
              {active && (
                <div className="flex-1 min-w-0">
                  {/* Header card */}
                  <div className="bg-white rounded-2xl border border-gray-200 mb-4 overflow-hidden">
                    <div className="px-8 py-8 flex items-start gap-6">
                      <div className="w-14 h-14 rounded-xl bg-[hsl(352,83%,48%)] flex items-center justify-center shrink-0">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-block text-xs font-semibold uppercase tracking-widest border px-3 py-1 rounded-full ${tagColor}`}>
                            {active.tag}
                          </span>
                          <span className="text-2xl font-black text-gray-100 leading-none select-none">
                            {String(activeIndex + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{active.title}</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">{active.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content row */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Who Is Eligible</p>
                      <p className="text-sm text-gray-600 leading-relaxed flex-1">{active.whoEligible}</p>
                      <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(352,83%,48%)] hover:gap-3 transition-all self-start">
                        Enquire about this service <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="md:col-span-3 bg-white rounded-2xl border border-gray-200 p-6">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">What's Included</p>
                      <ul className="space-y-2.5">
                        {active.benefits.map((b, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,48%)] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            <span className="text-sm text-gray-700 leading-relaxed pt-0.5">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer nav */}
                  <div className="mt-4 flex items-center gap-3">
                    {activeIndex > 0 && (
                      <button onClick={() => setActiveId(services[activeIndex - 1].id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:border-[hsl(352,83%,48%)] hover:text-[hsl(352,83%,48%)] transition-colors">
                        ← {services[activeIndex - 1].title}
                      </button>
                    )}
                    {activeIndex < services.length - 1 && (
                      <button onClick={() => setActiveId(services[activeIndex + 1].id)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[hsl(352,83%,48%)] text-white hover:bg-[hsl(352,75%,23%)] transition-colors">
                        {services[activeIndex + 1].title} →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {loading && (
        <div className="py-32 text-center">
          <div className="w-8 h-8 border border-gray-200 border-t-[hsl(352,83%,48%)] rounded-full animate-spin mx-auto" />
        </div>
      )}
    </div>
  )
}
