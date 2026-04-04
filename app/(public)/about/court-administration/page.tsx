import Link from "next/link"
import { Building2, Users, FileText, MapPin, Phone, Mail, ArrowRight } from "lucide-react"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import SectionTabs from "@/components/SectionTabs"

const DIVISIONS = [
  {
    name: "Office of the Registrar",
    head: "Registrar of the Supreme Court & National Court",
    description: "The Registrar is the principal administrative officer of both courts. The Office oversees case management, registry operations, and court administration across all NJSS locations.",
    functions: ["Court listings and case management", "Supervision of all registries", "Administration of court orders and judgments", "Liaison between the bench and court staff"],
    color: "border-l-[hsl(352,83%,44%)]",
  },
  {
    name: "Registry Services Division",
    head: "Director of Registry Services",
    description: "Responsible for the operation of all National Court registries across Papua New Guinea's 22 provinces, including filing, sealing, and certification of court documents.",
    functions: ["Document filing and processing", "Certified copy issuance", "Court fee collection", "Provincial registry coordination"],
    color: "border-l-blue-500",
  },
  {
    name: "Human Resources Division",
    head: "Director of Human Resources",
    description: "Manages recruitment, training, payroll, and welfare of all NJSS staff across the judiciary. Responsible for professional development and compliance with PSMA obligations.",
    functions: ["Staff recruitment and selection", "Payroll and entitlements management", "Performance management", "Training and development coordination"],
    color: "border-l-emerald-500",
  },
  {
    name: "Finance & Accounts Division",
    head: "Director of Finance",
    description: "Manages the NJSS budget, financial reporting, procurement, and asset management in compliance with PFMA requirements and donor grant conditions.",
    functions: ["Budget preparation and monitoring", "Financial statements and reporting", "Procurement and tendering", "Asset register and management"],
    color: "border-l-amber-500",
  },
  {
    name: "Information & Communications Technology",
    head: "Director of ICT",
    description: "Maintains and develops the IT infrastructure supporting court operations, including the e-judiciary portal, case management system, and network security.",
    functions: ["Court IT infrastructure", "E-Judiciary portal maintenance", "Cybersecurity and data protection", "ICT procurement and support"],
    color: "border-l-purple-500",
  },
  {
    name: "Infrastructure & Facilities",
    head: "Director of Infrastructure",
    description: "Responsible for the construction, maintenance, and management of all court facilities including the Waigani Court Complex and provincial courthouse infrastructure.",
    functions: ["Court facility maintenance", "Capital works projects", "Property leasing and management", "Security and safety compliance"],
    color: "border-l-orange-500",
  },
]

const KEY_OFFICERS = [
  { title: "Registrar of the Supreme Court & National Court", name: "Mr Kenson Noel",     phone: "+675 325 7902", email: "registrar@judiciary.gov.pg" },
  { title: "Deputy Registrar",                                name: "Ms Evelyn Posanau",  phone: "+675 325 7903", email: "dregistrar@judiciary.gov.pg" },
  { title: "Director of Finance",                             name: "Mr Henry Siwi",      phone: "+675 325 7910", email: "finance@judiciary.gov.pg" },
  { title: "Director of Human Resources",                     name: "Ms Grace Kula",      phone: "+675 325 7912", email: "hr@judiciary.gov.pg" },
]

export default function CourtAdministrationPage() {
  return (
    <div>
      <PageHero
        badge="About the Courts"
        title="Court Administration"
        subtitle="The NJSS is the administrative arm of the Supreme Court and National Court, managing human, financial, and physical resources."
        crumbs={[{ label: "About the Courts", href: "/about" }, { label: "Court Administration" }]}
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />
      <SectionTabs section="about" />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="about" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* NJSS overview card */}
          <div className="bg-gray-900 rounded-xl p-5 mb-8 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="font-bold text-white text-[14px] mb-1">National Judicial Staff Service Act 1987</p>
              <p className="text-[12.5px] text-gray-400 leading-relaxed">
                The NJSS is established as a separate statutory service under the National Judicial Staff Service Act 1987. The Chief Justice and the Judicial and Legal Services Commission oversee the appointment of the Registrar and key administrative officers.
              </p>
            </div>
          </div>

          {/* Divisions */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Divisions &amp; Directorates</h2>
            <div className="flex flex-col gap-4">
              {DIVISIONS.map(div => (
                <div key={div.name} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${div.color} p-5 hover:border-gray-300 transition-colors`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                    <h3 className="font-bold text-gray-900 text-[14px]">{div.name}</h3>
                    <span className="text-[11px] text-gray-400 shrink-0">{div.head}</span>
                  </div>
                  <p className="text-[12.5px] text-gray-500 leading-relaxed mb-3">{div.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {div.functions.map(f => (
                      <span key={f} className="text-[10px] bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Officers */}
          <div className="mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Key Officers</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {KEY_OFFICERS.map(officer => (
                <div key={officer.title} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="w-9 h-9 rounded-full bg-[hsl(352,83%,44%)]/10 flex items-center justify-center mb-3">
                    <Users className="w-4 h-4 text-[hsl(352,83%,44%)]" />
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium mb-0.5">{officer.title}</p>
                  <p className="font-bold text-gray-900 text-[13.5px] mb-3">{officer.name}</p>
                  <div className="space-y-1.5">
                    <a href={`tel:${officer.phone}`} className="flex items-center gap-2 text-[11.5px] text-gray-500 hover:text-gray-800 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-gray-300" /> {officer.phone}
                    </a>
                    <a href={`mailto:${officer.email}`} className="flex items-center gap-2 text-[11.5px] text-gray-500 hover:text-gray-800 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-gray-300" /> {officer.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-semibold text-gray-700 mb-0.5">Head Office — Waigani Court Complex</p>
              <p className="text-[12px] text-gray-500 leading-relaxed">Waigani Drive, Waigani, National Capital District, Papua New Guinea</p>
              <Link href="/contact" className="inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(352,83%,44%)] hover:underline mt-2">
                Contact Us <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
