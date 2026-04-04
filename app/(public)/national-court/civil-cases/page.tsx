import Link from "next/link"
import { Scale, ArrowRight, BookOpen, CheckCircle, Users, Gavel, Building2 } from "lucide-react"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"

const DIVISIONS = [
  {
    id: "adr",
    title: "Alternative Dispute Resolution (ADR)",
    icon: Users,
    color: "border-l-emerald-500 bg-emerald-50 text-emerald-700",
    iconBg: "bg-emerald-50 text-emerald-700",
    desc: "The ADR Division facilitates resolution of civil disputes through mediation, conciliation, and arbitration as alternatives to full trial. Participation may be ordered by the court or agreed by the parties.",
    items: [
      { label: "ADR Acts & Rules",    href: "/national-court/acts-rules",   desc: "Mediation Act, ADR Rules and Practice Directions" },
      { label: "ADR Case Listings",   href: "/national-court/listings",      desc: "Scheduled mediation and ADR sessions" },
      { label: "ADR Court Users",     href: "/contact?dept=national-court",  desc: "Register as a mediator or ADR practitioner" },
    ],
    overview: [
      "Mediation between parties facilitated by an accredited mediator",
      "Arbitration for commercial and construction disputes",
      "Court-annexed mediation ordered during pre-trial case management",
      "Settlement conferences before a judge",
    ],
  },
  {
    id: "equity",
    title: "Equity Division",
    icon: Scale,
    color: "border-l-purple-500 bg-purple-50 text-purple-700",
    iconBg: "bg-purple-50 text-purple-700",
    desc: "The Equity Division handles applications for injunctions, declarations, trusts, estates, wills and administration of deceased estates, and other equitable relief.",
    items: [
      { label: "Equity Practice Directions", href: "/national-court/acts-rules", desc: "Applicable rules and procedure" },
      { label: "Equity Division Listings",   href: "/national-court/listings",    desc: "Current equity matter listings" },
    ],
    overview: [
      "Applications for injunctions (interim and permanent)",
      "Declarations of right",
      "Trusts and administration of estates",
      "Applications for specific performance",
      "Breach of fiduciary duty claims",
    ],
  },
  {
    id: "common-law",
    title: "Common Law Division",
    icon: Gavel,
    color: "border-l-blue-500 bg-blue-50 text-blue-700",
    iconBg: "bg-blue-50 text-blue-700",
    desc: "The Common Law Division hears personal injury, negligence, defamation, contract, employment, and other common law civil claims. It is the most active civil division of the National Court.",
    items: [
      { label: "Civil Listings",           href: "/national-court/listings",     desc: "Common Law Division case list" },
      { label: "National Court Rules",      href: "/national-court/acts-rules",  desc: "Procedural rules for civil matters" },
      { label: "Court Forms",              href: "/resources",                    desc: "Writ of Summons, Statement of Claim etc." },
    ],
    overview: [
      "Personal injury and negligence claims",
      "Breach of contract",
      "Employment and industrial disputes",
      "Defamation matters",
      "Property and land disputes under common law",
      "Judicial review of administrative decisions",
    ],
  },
  {
    id: "tribunals",
    title: "Other Tribunals",
    icon: Building2,
    color: "border-l-amber-500 bg-amber-50 text-amber-700",
    iconBg: "bg-amber-50 text-amber-700",
    desc: "The National Court exercises supervisory jurisdiction over a range of specialised tribunals and statutory bodies, and hears appeals from their decisions.",
    items: [
      { label: "Tribunal Appeals",        href: "/national-court/listings",         desc: "Appeals from statutory tribunals" },
      { label: "Tribunal Legislation",    href: "/national-court/acts-rules",       desc: "Enabling legislation and tribunal rules" },
    ],
    overview: [
      "Land Titles Commission appeals",
      "Workers Compensation Tribunal appeals",
      "Employment Relations Tribunal",
      "Investment Disputes Tribunal",
      "Taxation appeals from the IRC",
    ],
  },
]

export default function CivilCasesPage() {
  return (
    <div>
      <PageHero
        badge="National Court"
        crumbs={[
          { label: "National Court", href: "/national-court/daily-diary" },
          { label: "Civil Cases" },
        ]}
        title="Civil Cases"
        subtitle="The National Court has unlimited civil jurisdiction. Civil matters are organised across specialist divisions — ADR, Equity, Common Law, and Other Tribunals — each with its own practice and procedure."
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="national-court" />
            <div className="flex-1 min-w-0 space-y-12">

      {/* Quick jump */}
      <div className="flex flex-wrap gap-2 mb-8">
        {DIVISIONS.map(d => (
          <a key={d.id} href={`#${d.id}`} className="text-[12px] font-semibold bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-700 px-3 py-1.5 rounded-lg transition-colors">
            {d.title.split(" (")[0]}
          </a>
        ))}
      </div>

      {/* Division sections */}
      <div className="space-y-8">
        {DIVISIONS.map(div => {
          const Icon = div.icon
          return (
            <div key={div.id} id={div.id} className={`bg-white rounded-2xl border border-gray-200 border-l-4 ${div.color.split(" ")[0]} overflow-hidden`}>
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${div.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-[16px]">{div.title}</h2>
                    <p className="text-[12.5px] text-gray-500 mt-1 leading-relaxed">{div.desc}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Matters Handled</p>
                    <ul className="space-y-1.5">
                      {div.overview.map(o => (
                        <li key={o} className="flex items-start gap-2 text-[12.5px] text-gray-600">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />{o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Quick Links</p>
                    <div className="flex flex-col gap-2">
                      {div.items.map(item => (
                        <Link key={item.label} href={item.href} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 hover:bg-blue-50 group transition-colors">
                          <div>
                            <p className="text-[12.5px] font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{item.label}</p>
                            <p className="text-[11px] text-gray-400">{item.desc}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 shrink-0 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/national-court/listings" className="inline-flex items-center gap-2 h-9 px-5 rounded-lg text-[12px] font-semibold bg-blue-700 hover:bg-blue-800 text-white transition-colors">
          View Civil Listings <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link href="/national-court/acts-rules" className="inline-flex items-center gap-2 h-9 px-5 rounded-lg text-[12px] font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
          <BookOpen className="w-3.5 h-3.5" /> Civil Rules
        </Link>
      </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
