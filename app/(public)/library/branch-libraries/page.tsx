import { MapPin, Phone, Mail, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import SectionTabs from "@/components/SectionTabs"

const BRANCHES = [
  {
    name: "Waigani Head Library",
    region: "National Capital District",
    address: "Supreme Court Complex, Waigani Drive, Waigani, NCD",
    phone: "+675 325 7902",
    email: "library@judiciary.gov.pg",
    hours: "Mon – Fri: 8:00 AM – 4:00 PM",
    services: ["Full legal collection", "Online database access", "Reference assistance", "Photocopying & printing", "Interlibrary loans"],
    primary: true,
  },
  {
    name: "Lae Branch Library",
    region: "Morobe Province",
    address: "National Court, Lae, Morobe Province",
    phone: "+675 472 3344",
    email: "lae.library@judiciary.gov.pg",
    hours: "Mon – Fri: 8:00 AM – 4:00 PM",
    services: ["Legal reference collection", "Court forms", "Research assistance", "Document copying"],
    primary: false,
  },
  {
    name: "Mt Hagen Branch Library",
    region: "Western Highlands Province",
    address: "National Court, Mt Hagen, Western Highlands",
    phone: "+675 542 1600",
    email: "hagen.library@judiciary.gov.pg",
    hours: "Mon – Fri: 8:00 AM – 4:00 PM",
    services: ["Legal reference collection", "Court forms", "Research assistance"],
    primary: false,
  },
  {
    name: "Madang Branch Library",
    region: "Madang Province",
    address: "National Court, Madang, Madang Province",
    phone: "+675 852 2222",
    email: "madang.library@judiciary.gov.pg",
    hours: "Mon – Fri: 8:00 AM – 4:00 PM",
    services: ["Legal reference collection", "Court forms", "Research assistance"],
    primary: false,
  },
  {
    name: "Rabaul Branch Library",
    region: "East New Britain Province",
    address: "National Court, Kokopo, East New Britain",
    phone: "+675 982 8877",
    email: "rabaul.library@judiciary.gov.pg",
    hours: "Mon – Fri: 8:00 AM – 4:00 PM",
    services: ["Legal reference collection", "Court forms", "Research assistance"],
    primary: false,
  },
  {
    name: "Goroka Branch Library",
    region: "Eastern Highlands Province",
    address: "National Court, Goroka, Eastern Highlands Province",
    phone: "+675 732 1133",
    email: "goroka.library@judiciary.gov.pg",
    hours: "Mon – Fri: 8:00 AM – 4:00 PM",
    services: ["Legal reference collection", "Court forms", "Research assistance"],
    primary: false,
  },
]

export default function BranchLibrariesPage() {
  return (
    <div>
      <PageHero
        badge="Court Library"
        crumbs={[
          { label: "Court Library", href: "/library/branch-libraries" },
          { label: "Branch Libraries" },
        ]}
        title="Branch Libraries"
        subtitle="The NJSS Court Library operates a network of branch libraries across Papua New Guinea, providing legal reference services at National Court locations nationwide."
        image="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=80"
      />
      <SectionTabs section="library" />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="library" />
            <div className="flex-1 min-w-0 space-y-12">
          {/* Summary banner */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8 flex flex-wrap gap-6 items-center">
            <div className="text-center px-4">
              <div className="text-2xl font-extrabold text-[hsl(352,83%,44%)]">{BRANCHES.length}</div>
              <div className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider font-medium">Libraries</div>
            </div>
            <div className="w-px h-10 bg-gray-200 hidden sm:block" />
            <div className="text-center px-4">
              <div className="text-2xl font-extrabold text-gray-900">6</div>
              <div className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider font-medium">Provinces</div>
            </div>
            <div className="w-px h-10 bg-gray-200 hidden sm:block" />
            <div className="text-center px-4">
              <div className="text-2xl font-extrabold text-gray-900">Mon–Fri</div>
              <div className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider font-medium">8 AM – 4 PM</div>
            </div>
            <div className="flex-1 min-w-[200px] sm:text-right">
              <Link
                href="/contact?dept=court-library"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(352,83%,44%)] hover:underline"
              >
                Make an enquiry <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Head library */}
          {BRANCHES.filter(b => b.primary).map(branch => (
            <div key={branch.name} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  Head Library
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-[hsl(352,83%,44%)]/20 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[hsl(352,83%,44%)] via-amber-400 to-[hsl(352,83%,44%)]" />
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">{branch.name}</h2>
                    <p className="text-sm text-[hsl(352,83%,44%)] font-medium mb-4">{branch.region}</p>
                    <ul className="space-y-2.5 text-sm">
                      <li className="flex items-start gap-2.5 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        {branch.address}
                      </li>
                      <li>
                        <a href={`tel:${branch.phone}`} className="flex items-center gap-2.5 text-gray-600 hover:text-gray-900 transition-colors">
                          <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                          {branch.phone}
                        </a>
                      </li>
                      <li>
                        <a href={`mailto:${branch.email}`} className="flex items-center gap-2.5 text-gray-600 hover:text-gray-900 transition-colors">
                          <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                          {branch.email}
                        </a>
                      </li>
                      <li className="flex items-center gap-2.5 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                        {branch.hours}
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Available Services</p>
                    <ul className="space-y-2">
                      {branch.services.map(s => (
                        <li key={s} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Branch libraries grid */}
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Regional Branch Libraries</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {BRANCHES.filter(b => !b.primary).map(branch => (
                <div key={branch.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 text-[14px]">{branch.name}</h3>
                    <p className="text-[12px] text-[hsl(352,83%,44%)] font-medium mt-0.5">{branch.region}</p>
                  </div>
                  <ul className="space-y-2 text-[12px] text-gray-500 mb-4">
                    <li className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                      {branch.address}
                    </li>
                    <li>
                      <a href={`tel:${branch.phone}`} className="flex items-center gap-2 hover:text-gray-800 transition-colors">
                        <Phone className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        {branch.phone}
                      </a>
                    </li>
                    <li>
                      <a href={`mailto:${branch.email}`} className="flex items-center gap-2 hover:text-gray-800 transition-colors">
                        <Mail className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        {branch.email}
                      </a>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                      {branch.hours}
                    </li>
                  </ul>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-[11px] text-gray-400 font-medium mb-1.5">Services</p>
                    <div className="flex flex-wrap gap-1.5">
                      {branch.services.map(s => (
                        <span key={s} className="text-[10px] bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-800 leading-relaxed">
              All branch libraries are located within National Court premises. Please contact the branch directly before visiting to confirm availability and access arrangements.
            </p>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
