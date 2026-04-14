import Link from "next/link"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import SectionTabs from "@/components/SectionTabs"
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react"

const REGISTRIES = [
  { name: "Waigani (Head Registry)", province: "National Capital District", address: "Waigani Court Complex, Waigani Drive, Waigani, NCD", phone: "+675 325 7902", email: "registry@judiciary.gov.pg", hours: "Mon–Fri 8:00 AM–4:00 PM", head: true },
  { name: "Lae Registry",            province: "Morobe Province",           address: "National Court, Gorobe Street, Lae",                  phone: "+675 472 3344", email: "lae.registry@judiciary.gov.pg",     hours: "Mon–Fri 8:00 AM–4:00 PM", head: false },
  { name: "Mt Hagen Registry",       province: "Western Highlands",         address: "National Court, Highlands Highway, Mt Hagen",         phone: "+675 542 1600", email: "hagen.registry@judiciary.gov.pg",   hours: "Mon–Fri 8:00 AM–4:00 PM", head: false },
  { name: "Madang Registry",         province: "Madang Province",           address: "National Court, Coronation Drive, Madang",            phone: "+675 852 2222", email: "madang.registry@judiciary.gov.pg",  hours: "Mon–Fri 8:00 AM–4:00 PM", head: false },
  { name: "Rabaul / Kokopo Registry",province: "East New Britain",          address: "National Court, Mango Avenue, Kokopo",                phone: "+675 982 8877", email: "rabaul.registry@judiciary.gov.pg",  hours: "Mon–Fri 8:00 AM–4:00 PM", head: false },
  { name: "Goroka Registry",         province: "Eastern Highlands",         address: "National Court, Hunter Street, Goroka",               phone: "+675 732 1133", email: "goroka.registry@judiciary.gov.pg",  hours: "Mon–Fri 8:00 AM–4:00 PM", head: false },
  { name: "Wewak Registry",          province: "East Sepik Province",       address: "National Court, Beach Road, Wewak",                   phone: "+675 856 2200", email: "wewak.registry@judiciary.gov.pg",   hours: "Mon–Fri 8:00 AM–4:00 PM", head: false },
  { name: "Kimbe Registry",          province: "West New Britain",          address: "National Court, Kimbe, West New Britain",             phone: "+675 983 5500", email: "kimbe.registry@judiciary.gov.pg",   hours: "Mon–Fri 8:00 AM–4:00 PM", head: false },
  { name: "Manus Registry",          province: "Manus Province",            address: "National Court, Lorengau, Manus",                     phone: "+675 470 9100", email: "manus.registry@judiciary.gov.pg",   hours: "Mon–Fri 8:00 AM–4:00 PM", head: false },
  { name: "Kavieng Registry",        province: "New Ireland Province",      address: "National Court, Kavieng, New Ireland",                phone: "+675 984 2200", email: "kavieng.registry@judiciary.gov.pg", hours: "Mon–Fri 8:00 AM–4:00 PM", head: false },
  { name: "Popondetta Registry",     province: "Oro Province",              address: "National Court, Popondetta, Oro Province",            phone: "+675 629 7100", email: "popo.registry@judiciary.gov.pg",    hours: "Mon–Fri 8:00 AM–4:00 PM", head: false },
  { name: "Kerema Registry",         province: "Gulf Province",             address: "National Court, Kerema, Gulf Province",               phone: "+675 648 1100", email: "kerema.registry@judiciary.gov.pg",  hours: "Mon–Fri 8:00 AM–4:00 PM", head: false },
]

const SERVICES = [
  "Filing of originating process, motions and supporting documents",
  "Sealing and certification of court orders and judgments",
  "Issuance of certified copies of court documents",
  "Collection of court filing fees",
  "Service of process and court documents",
  "Maintenance of the court file and case records",
  "Listing enquiries and case status information",
  "Forms and procedural guidance for litigants",
]

export default function ProvincialRegistriesPage() {
  const head = REGISTRIES.find(r => r.head)!
  const branches = REGISTRIES.filter(r => !r.head)
  return (
    <div>
      <PageHero
        badge="National Court"
        crumbs={[
          { label: "National Court", href: "/national-court/daily-diary" },
          { label: "Provincial Registries" },
        ]}
        title="Provincial Registries"
        subtitle="National Court registries across Papua New Guinea's provinces, providing filing, certification, and registry services."
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />
      <SectionTabs section="national-court" />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="national-court" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { v: REGISTRIES.length, l: "Registries Nationwide" },
              { v: "Mon–Fri", l: "Operating Days" },
              { v: "8AM–4PM", l: "Registry Hours" },
            ].map(s => (
              <div key={s.l} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <div className="text-xl font-extrabold text-blue-700">{s.v}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Registry Services</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {SERVICES.map(s => (
                <div key={s} className="flex items-start gap-2 text-[12.5px] text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />{s}
                </div>
              ))}
            </div>
          </div>

          {/* Head Registry */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">Head Registry</span>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 grid md:grid-cols-2 gap-5">
              <div>
                <h3 className="font-bold text-gray-900 text-[14px] mb-0.5">{head.name}</h3>
                <p className="text-[12px] text-blue-700 font-medium mb-3">{head.province}</p>
                <div className="space-y-2 text-[12.5px] text-gray-600">
                  <div className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />{head.address}</div>
                  <a href={`tel:${head.phone}`} className="flex items-center gap-2 hover:text-gray-900 transition-colors"><Phone className="w-3.5 h-3.5 text-gray-300 shrink-0" />{head.phone}</a>
                  <a href={`mailto:${head.email}`} className="flex items-center gap-2 hover:text-gray-900 transition-colors"><Mail className="w-3.5 h-3.5 text-gray-300 shrink-0" />{head.email}</a>
                  <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />{head.hours}</div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Link href="/contact?dept=national-court" className="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-[13px] font-semibold bg-blue-700 hover:bg-blue-800 text-white transition-colors">
                  Contact Registry <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Provincial branches */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Provincial Branch Registries</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {branches.map(r => (
                <div key={r.name} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                  <h3 className="font-bold text-gray-900 text-[13.5px] mb-0.5">{r.name}</h3>
                  <p className="text-[11px] text-blue-700 font-medium mb-3">{r.province}</p>
                  <div className="space-y-1.5 text-[11.5px] text-gray-500">
                    <div className="flex items-start gap-2"><MapPin className="w-3 h-3 text-gray-300 shrink-0 mt-0.5" />{r.address}</div>
                    <a href={`tel:${r.phone}`} className="flex items-center gap-2 hover:text-gray-800 transition-colors"><Phone className="w-3 h-3 text-gray-300 shrink-0" />{r.phone}</a>
                    <a href={`mailto:${r.email}`} className="flex items-center gap-2 hover:text-gray-800 transition-colors"><Mail className="w-3 h-3 text-gray-300 shrink-0" />{r.email}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
