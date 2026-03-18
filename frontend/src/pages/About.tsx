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
  mission: "To administer a fair, efficient, and accessible workers compensation system that protects the rights of workers injured in the course of employment, while promoting safe and healthy workplaces across Papua New Guinea.",
  vision: "A Papua New Guinea where every worker is protected, valued, and supported — where workplace injuries are prevented, and those affected receive timely and adequate compensation to restore their dignity and livelihood.",
  mandate: [
    "Administer and enforce the Workers' Compensation Act 1978",
    "Investigate and process claims for compensation",
    "Issue compensation determinations and monitor employer compliance",
    "Register and regulate approved insurers",
    "Maintain records of occupational injuries, deaths, and related settlements",
    "Support development and amendment of compensation legislation and policy",
  ],
  highlights: [
    { title: "1,732", desc: "Compensation claims lodged nationwide" },
    { title: "K3.2M+", desc: "In benefits paid to injured workers and dependents" },
    { title: "Regional", desc: "Capacity building for Provincial Labour Office staff" },
    { title: "Active", desc: "Ongoing consultations for amendments to the Workers' Compensation Act" },
  ],
  priorities: [
    { title: "Modernise the Act", desc: "Updating the Workers' Compensation Act 1978 to reflect current labour market needs and international best practices." },
    { title: "Digitise Claims", desc: "Digitizing claims management systems for efficiency and transparency across all offices." },
    { title: "Decentralise Processing", desc: "Empowering Provincial Labour Offices (PLOs) to handle claims regionally." },
    { title: "Strengthen Insurer Regulation", desc: "Improving collaboration with the financial sector and oversight of approved insurers." },
    { title: "Improve Data Reporting", desc: "Enhancing data collection and reporting on occupational injuries and claims outcomes." },
  ],
  values: [
    { title: "Fairness", desc: "Every claim is assessed objectively and equitably." },
    { title: "Transparency", desc: "We communicate openly about processes and decisions." },
    { title: "Integrity", desc: "We uphold the highest ethical standards in public service." },
    { title: "Excellence", desc: "We continuously improve to serve workers better." },
  ],
  legislation: [
    { title: "Workers' Compensation Act 1978", desc: "The primary legislation governing workers' compensation in PNG." },
    { title: "Workers' Compensation Regulation", desc: "Subsidiary regulations providing procedural and technical rules under the Act." },
    { title: "Industrial Relations Act 1962", desc: "Related provisions supporting employment and workplace dispute frameworks." },
    { title: "Occupational Health & Safety Act 1993", desc: "Workplace safety standards complementing compensation legislation." },
    { title: "Employment Act (Chapter 373)", desc: "Employment law framework including injury provisions." },
    { title: "ILO Conventions on Social Protection", desc: "International Labour Organization conventions on employment injury benefits and social protection ratified by PNG." },
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
        title="About the Office of Workers Compensation"
        subtitle="A statutory office under the Department of Labour and Industrial Relations (DLIR), OWC administers and enforces the Workers' Compensation Act 1978 — ensuring injured workers in Papua New Guinea receive fair and prompt compensation."
        crumbs={[{ label: "About" }]}
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=80"
      />

      {/* Mission & Vision */}
      <section id="mission" className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(210,70%,25%)] border border-[hsl(210,70%,25%)]/30 bg-[hsl(210,70%,25%)]/5 px-4 py-1.5 rounded-full mb-4">Our Purpose</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[hsl(210,70%,18%)]">Mission &amp; Vision</h2>
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-200 mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(210,70%,25%)] flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Our Mission</div>
                  <div className="w-8 h-0.5 rounded-full bg-[hsl(210,70%,25%)]" />
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-[15px]">{about.mission}</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Our Vision</div>
                  <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-200" />
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-[15px]">{about.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mandate */}
      <section id="mandate" className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">Our Mandate</Badge>
            <h2 className="text-3xl font-bold text-gray-900">What We Are Mandated To Do</h2>
            <p className="text-gray-500 mt-2 text-sm">
              The OWC is mandated under the Workers' Compensation Act 1978 and operates as a statutory arm within the Department of Labour and Industrial Relations (DLIR).
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {about.mandate.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section id="highlights" className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-8">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(210,70%,25%)] border border-[hsl(210,70%,25%)]/30 bg-[hsl(210,70%,25%)]/5 px-3 py-1 rounded-full mb-3">Performance</span>
            <h2 className="text-2xl font-bold text-[hsl(210,70%,18%)]">2024 Highlights</h2>
            <div className="w-8 h-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-200 mt-3" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {about.highlights.map((h, i) => (
              <div key={i} className="relative bg-gray-50 rounded-xl border border-gray-100 px-4 py-4 flex items-center gap-3 group hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-gradient-to-r from-[hsl(210,70%,30%)] to-emerald-400" />
                <div className="w-8 h-8 rounded-lg bg-[hsl(210,70%,25%)]/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-3.5 h-3.5 text-[hsl(210,70%,25%)]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xl font-black text-[hsl(210,70%,18%)] tracking-tight leading-none">{h.title}</div>
                  <div className="text-[11px] text-gray-500 leading-snug mt-0.5">{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Priorities */}
      {about.priorities.length > 0 && (
        <section className="py-16 bg-gray-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="mb-12">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-600 border border-amber-300/50 bg-amber-50 px-4 py-1.5 rounded-full mb-4">2022–2027</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[hsl(210,70%,18%)]">Strategic Priorities</h2>
              <p className="text-gray-500 text-sm mt-3">Aligned with the DLIR Corporate Strategic Plan</p>
              <div className="w-12 h-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-200 mt-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {about.priorities.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
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
              <div key={i} className="group bg-white rounded-xl border border-gray-100 p-6 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-[hsl(210,70%,96%)] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[hsl(210,70%,25%)] transition-colors duration-300">
                  <Award className="w-6 h-6 text-[hsl(210,70%,25%)] group-hover:text-white transition-colors duration-300" />
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
                        <div className="w-14 h-14 bg-[hsl(210,70%,90%)] rounded-full flex items-center justify-center font-bold text-[hsl(210,70%,25%)] text-lg shrink-0">
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
