"use client"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Target, Eye, Award, TrendingUp } from "lucide-react"
import PageHero from "@/components/PageHero"
import ScrollNav from "@/components/ScrollNav"

interface Leader { id: number; name: string; title: string; since: string; photo: string }
interface KV { title: string; desc: string }

interface AboutData {
  mission: string
  vision: string
  mandate: string[]
  highlights: KV[]
  priorities: KV[]
  values: KV[]
  legislation: KV[]
}

const SECTIONS = [
  { id: "mission", label: "Mission & Vision" },
  { id: "mandate", label: "Our Mandate" },
  { id: "highlights", label: "2024 Highlights" },
  { id: "values", label: "Our Values" },
  { id: "leadership", label: "Leadership" },
  { id: "legislation", label: "Legislation" },
]

const DEFAULT: AboutData = {
  mission: "To provide efficient and effective administrative support to the Supreme Court and National Court of Papua New Guinea, enabling the delivery of independent, fair and just judicial services to all people.",
  vision: "To provide equal access to an independent, fair and just judicial services to all people of Papua New Guinea.",
  mandate: [
    "Provide human resource management and administrative services to the judiciary",
    "Manage the financial, procurement and asset operations of the courts",
    "Maintain and operate court facilities, including registries across all provinces",
    "Support the delivery of court listing, case management, and registry services",
    "Develop and implement IT systems to support judicial administration",
    "Support the training and professional development of judicial staff",
  ],
  highlights: [
    { title: "17", desc: "Provincial court registries nationwide" },
    { title: "Waigani", desc: "New court complex expansion progressing on schedule" },
    { title: "E-Judiciary", desc: "Online filing and court diary portal launched" },
    { title: "Active", desc: "Ongoing judicial education through PNG Centre for Judicial Excellence" },
  ],
  priorities: [
    { title: "Modernise Court Systems", desc: "Upgrading IT infrastructure and case management systems for greater efficiency and transparency." },
    { title: "E-Judiciary Portal", desc: "Expanding online filing, court diary access, and case tracking for legal practitioners and the public." },
    { title: "Provincial Access", desc: "Strengthening registries and circuit court services in rural and remote provinces." },
    { title: "Staff Development", desc: "Investing in ongoing professional training for registry and administrative staff through the PNG Centre for Judicial Excellence." },
    { title: "Infrastructure", desc: "Completing the Waigani Court Complex expansion and upgrading facilities in provincial registries." },
  ],
  values: [
    { title: "Independence", desc: "Upholding the independence of the judiciary without fear or favour." },
    { title: "Fairness", desc: "Ensuring equal access to justice for every person in Papua New Guinea." },
    { title: "Integrity", desc: "Maintaining the highest standards of impartiality and ethical conduct." },
    { title: "Excellence", desc: "Continuously improving court administration to serve the public better." },
  ],
  legislation: [
    { title: "Constitution of Papua New Guinea", desc: "The supreme law establishing the judiciary and guaranteeing the right to a fair trial." },
    { title: "Supreme Court Act (Chapter 37)", desc: "Establishes the Supreme Court, its jurisdiction, and rules of procedure." },
    { title: "National Court Act (Chapter 38)", desc: "Establishes the National Court and its jurisdiction across Papua New Guinea." },
    { title: "Judicial Services Act 1999", desc: "Governs the appointment, terms, and conditions of judicial officers." },
    { title: "National Judicial Staff Service Act 1987", desc: "Establishes the NJSS as the administrative arm of the judiciary." },
    { title: "Supreme Court Rules & National Court Rules", desc: "Procedural rules governing the conduct of proceedings in both courts." },
  ],
}

export default function About() {
  const [about, setAbout] = useState<AboutData>(DEFAULT)
  const [leadership, setLeadership] = useState<Leader[]>([])

  useEffect(() => {
    fetch("/api/about")
      .then(r => r.json())
      .then((d: Partial<AboutData> & { highlights?: (KV & { value?: string; label?: string })[] }) => {
        // normalise highlights: backend stores {title,desc} but old data may have {value,label}
        const highlights = (d.highlights ?? DEFAULT.highlights).map(h => ({
          title: h.title ?? (h as { value?: string }).value ?? "",
          desc: h.desc ?? (h as { label?: string }).label ?? "",
        }))
        setAbout({
          mission: d.mission || DEFAULT.mission,
          vision: d.vision || DEFAULT.vision,
          mandate: d.mandate?.length ? d.mandate : DEFAULT.mandate,
          highlights: highlights.length ? highlights : DEFAULT.highlights,
          priorities: d.priorities?.length ? d.priorities : DEFAULT.priorities,
          values: d.values?.length ? d.values : DEFAULT.values,
          legislation: d.legislation?.length ? d.legislation : DEFAULT.legislation,
        })
      })
      .catch(() => {})

    fetch("/api/leadership")
      .then(r => r.json())
      .then((d: { members?: Leader[] }) => { if (d.members?.length) setLeadership(d.members) })
      .catch(() => {})
  }, [])

  return (
    <div>
      <ScrollNav sections={SECTIONS} />
      <PageHero
        badge="About Us"
        title="About the National Judicial Staff Service"
        subtitle="The National Judicial Staff Service (NJSS) is the administrative arm of the Supreme Court and National Court of Papua New Guinea, providing efficient and effective support to enable the delivery of independent, fair and just judicial services."
        crumbs={[{ label: "About" }]}
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      {/* Mission & Vision */}
      <section id="mission" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(352,83%,48%)] border border-[hsl(352,83%,48%)]/30 bg-[hsl(352,83%,48%)]/5 px-4 py-1.5 rounded-full mb-4">Our Purpose</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[hsl(352,83%,38%)]">Mission &amp; Vision</h2>
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-200 mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(352,83%,48%)] flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Our Mission</div>
                  <div className="w-8 h-0.5 rounded-full bg-[hsl(352,83%,48%)]" />
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-[15px]">{about.mission}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Our Vision</div>
                  <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-200" />
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-[15px]">{about.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mandate */}
      <section id="mandate" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">Our Mandate</Badge>
            <h2 className="text-3xl font-bold text-gray-900">What We Are Mandated To Do</h2>
            <p className="text-gray-500 mt-2 text-sm">
              The NJSS is established under the National Judicial Staff Service Act 1987 as the administrative arm of the Supreme Court and National Court of Papua New Guinea.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {about.mandate.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section id="highlights" className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-8">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(352,83%,48%)] border border-[hsl(352,83%,48%)]/30 bg-[hsl(352,83%,48%)]/5 px-3 py-1 rounded-full mb-3">Performance</span>
            <h2 className="text-2xl font-bold text-[hsl(352,83%,38%)]">2025 Highlights</h2>
            <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-200 mt-3" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {about.highlights.map((h, i) => (
              <div key={i} className="relative bg-gray-50 rounded-xl border border-gray-200 px-4 py-4 flex items-center gap-3 group transition-colors overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-gradient-to-r from-[hsl(352,75%,33%)] to-amber-400" />
                <div className="w-8 h-8 rounded-lg bg-[hsl(352,83%,48%)]/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-[hsl(352,83%,48%)]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl font-black text-[hsl(352,83%,38%)] tracking-tight leading-none">{h.title}</div>
                  <div className="text-[11px] text-gray-500 leading-snug mt-0.5">{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Priorities */}
      {about.priorities.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-600 border border-amber-300/50 bg-amber-50 px-4 py-1.5 rounded-full mb-4">2022–2027</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[hsl(352,83%,38%)]">Strategic Priorities</h2>
              <p className="text-gray-500 text-sm mt-3">Aligned with the Judiciary Corporate Strategic Plan</p>
              <div className="w-12 h-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-200 mt-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {about.priorities.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 flex gap-4 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-100 transition-colors">
                    <span className="text-xs font-black text-amber-600">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 text-sm mb-1.5 leading-snug">{p.title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section id="values" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">Our Values</Badge>
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {about.values.map((v, i) => (
              <div key={i} className="group bg-white rounded-xl border border-gray-200 p-6 text-center transition-colors">
                <div className="w-12 h-12 bg-[hsl(352,75%,97%)] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[hsl(352,83%,48%)] transition-colors duration-300">
                  <Award className="w-6 h-6 text-[hsl(352,83%,48%)] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      {leadership.length > 0 && (
        <section id="leadership" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-10">
              <Badge variant="outline" className="mb-3">Our People</Badge>
              <h2 className="text-3xl font-bold text-gray-900">Leadership Team</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadership.map((p) => (
                <Card key={p.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      {p.photo ? (
                        <img src={p.photo} alt={p.name} className="w-14 h-14 rounded-full object-cover border border-gray-200 shrink-0" />
                      ) : (
                        <div className="w-14 h-14 bg-[hsl(352,75%,90%)] rounded-full flex items-center justify-center font-bold text-[hsl(352,83%,48%)] text-lg shrink-0">
                          {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">{p.name}</div>
                        <div className="text-sm text-gray-500">{p.title}</div>
                        {p.since && <div className="text-xs text-gray-400 mt-0.5">Since {p.since}</div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Legislation */}
      <section id="legislation" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">Legal Framework</Badge>
            <h2 className="text-3xl font-bold text-gray-900">Governing Legislation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {about.legislation.map((l, i) => (
              <Card key={i}>
                <CardContent className="pt-6 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">{l.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{l.desc}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
