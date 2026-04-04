import Link from "next/link"
import { GraduationCap, BookOpen, Users, Calendar, Award, ArrowRight, Mail, Phone, Globe, CheckCircle } from "lucide-react"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"

const PROGRAMS = [
  {
    title: "Judicial Orientation Program",
    audience: "Newly Appointed Judges & Magistrates",
    duration: "2 weeks",
    description: "Comprehensive induction for judicial officers newly appointed to the Supreme Court, National Court, and District Courts, covering PNG constitutional law, court procedures, judgment writing, and judicial ethics.",
    icon: Award,
    color: "bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)]",
  },
  {
    title: "Advanced Judgment Writing",
    audience: "Judges & Magistrates",
    duration: "3 days",
    description: "Specialist workshop focused on clarity, structure, and legal reasoning in written judgments. Delivered with assistance from regional judicial educators.",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Registry Staff Training",
    audience: "NJSS Registry Officers",
    duration: "5 days",
    description: "Practical training for court registry staff covering case management, document processing, registry procedures, customer service, and use of court IT systems.",
    icon: Users,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Gender & Family Violence in Court",
    audience: "Judges, Magistrates & Practitioners",
    duration: "2 days",
    description: "Specialised program addressing the handling of family violence matters in the National Court and District Courts, including trauma-informed approaches and victim protection.",
    icon: Users,
    color: "bg-purple-50 text-purple-700",
  },
  {
    title: "Comparative Law & International Seminars",
    audience: "Judges & Senior Practitioners",
    duration: "Varies",
    description: "Regional and international seminars in partnership with AIJA, the Pacific Judicial Development Programme, and other judicial education bodies.",
    icon: Globe,
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "Legal Practitioners CPD Program",
    audience: "Legal Practitioners",
    duration: "Half-day / Full-day",
    description: "Continuing professional development sessions for lawyers admitted to practice in PNG, offered in partnership with the PNG Law Society.",
    icon: GraduationCap,
    color: "bg-gray-100 text-gray-700",
  },
]

const UPCOMING = [
  { title: "Advanced Judgment Writing Workshop",         date: "14–16 April 2025",    audience: "Judges",                  location: "Waigani" },
  { title: "Registry Officers Certificate Program",      date: "28 April – 2 May 2025", audience: "Registry Staff",         location: "Waigani" },
  { title: "Family Violence Judicial Education Seminar", date: "19–20 May 2025",       audience: "Judges & Magistrates",    location: "Lae" },
  { title: "PNG Law Society CPD Day",                    date: "6 June 2025",          audience: "Legal Practitioners",     location: "Waigani" },
  { title: "Judicial Orientation Program 2025",          date: "14–25 July 2025",      audience: "Newly Appointed Judges",  location: "Waigani" },
]

const PARTNERS = [
  "Australasian Institute of Judicial Administration (AIJA)",
  "Pacific Judicial Development Programme (PJDP)",
  "Federal Court of Australia",
  "Papua New Guinea Law Society",
  "University of Papua New Guinea — Faculty of Law",
  "Divine Word University — School of Law",
]

export default function PNGCJEPage() {
  return (
    <div>
      <PageHero
        badge="About the Courts"
        crumbs={[
          { label: "About the Courts", href: "/about" },
          { label: "PNG Centre for Judicial Excellence" },
        ]}
        title="PNG Centre for Judicial Excellence"
        subtitle="The judicial education and training arm of the NJSS, responsible for the ongoing professional development of judges, magistrates, and court staff across Papua New Guinea."
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="about" />
            <div className="flex-1 min-w-0 space-y-12">

      {/* Mission banner */}
      <div className="bg-gray-900 rounded-xl p-5 mb-8 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <p className="font-bold text-white text-[14px] mb-2">Our Mission</p>
          <p className="text-[12.5px] text-gray-400 leading-relaxed">
            To strengthen the capacity, integrity, and professionalism of the PNG judiciary through high-quality education, training, and continuing professional development for judicial officers and court staff at all levels.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { value: "6+", label: "Programs per Year" },
          { value: "200+", label: "Participants Annually" },
          { value: "6", label: "Partner Organisations" },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-extrabold text-[hsl(352,83%,44%)]">{stat.value}</div>
            <div className="text-[11px] text-gray-400 mt-0.5 leading-tight">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Programs */}
      <div className="mb-10">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Education Programs</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PROGRAMS.map(prog => {
            const Icon = prog.icon
            return (
              <div key={prog.title} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${prog.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-[13.5px] leading-snug">{prog.title}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{prog.audience} · {prog.duration}</p>
                  </div>
                </div>
                <p className="text-[12px] text-gray-500 leading-relaxed">{prog.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mb-10">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Upcoming Programs — 2025</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {UPCOMING.map((event, i) => (
            <div key={i} className={`flex items-start gap-4 px-5 py-4 ${i < UPCOMING.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}>
              <div className="w-8 h-8 rounded-lg bg-[hsl(352,83%,44%)]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-[hsl(352,83%,44%)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-[13px] leading-snug">{event.title}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                  <span className="text-[11px] text-gray-500">{event.date}</span>
                  <span className="text-[11px] text-gray-400">· {event.audience}</span>
                  <span className="text-[11px] text-gray-400">· {event.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div className="mb-8">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Partner Organisations</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {PARTNERS.map(p => (
            <div key={p} className="flex items-center gap-2.5 bg-white rounded-lg border border-gray-200 px-4 py-3">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-[12.5px] text-gray-700">{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gray-900 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="font-bold text-white text-[13px] mb-1">PNGCJE Secretariat</p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:pngcje@judiciary.gov.pg" className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5" /> pngcje@judiciary.gov.pg
            </a>
            <a href="tel:+67532579025" className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5" /> +675 325 7925
            </a>
          </div>
        </div>
        <Link href="/contact?dept=information-desk" className="shrink-0 inline-flex items-center gap-2 h-9 px-5 rounded-lg text-[12px] font-semibold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors">
          Register Interest <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
