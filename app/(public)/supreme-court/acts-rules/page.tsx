"use client"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import { FileText, Download, ExternalLink, BookOpen, Scale } from "lucide-react"

const categories = [
  {
    title: "Constitutional Foundations",
    icon: Scale,
    items: [
      { title: "Constitution of the Independent State of Papua New Guinea", year: "1975", type: "Constitution", size: "1.2 MB", href: "#" },
      { title: "Organic Law on National and Local-level Government Elections", year: "1997", type: "Organic Law", size: "420 KB", href: "#" },
      { title: "Organic Law on the Integrity of Political Parties and Candidates", year: "2003", type: "Organic Law", size: "310 KB", href: "#" },
    ],
  },
  {
    title: "Supreme Court Legislation",
    icon: BookOpen,
    items: [
      { title: "Supreme Court Act (Chapter 37)", year: "1975", type: "Act", size: "280 KB", href: "#" },
      { title: "Supreme Court Act (Amendment) 2022", year: "2022", type: "Amendment", size: "95 KB", href: "#" },
      { title: "Supreme Court (Summary Jurisdiction) Act", year: "1978", type: "Act", size: "145 KB", href: "#" },
      { title: "Judicial Conduct Act 2012", year: "2012", type: "Act", size: "210 KB", href: "#" },
    ],
  },
  {
    title: "Supreme Court Rules",
    icon: FileText,
    items: [
      { title: "Supreme Court Rules 2012", year: "2012", type: "Rules", size: "640 KB", href: "#" },
      { title: "Supreme Court Rules (Amendment) 2018", year: "2018", type: "Amendment", size: "180 KB", href: "#" },
      { title: "Supreme Court (Election Petition) Rules", year: "2002", type: "Rules", size: "230 KB", href: "#" },
      { title: "Supreme Court (Bail) Rules", year: "1977", type: "Rules", size: "95 KB", href: "#" },
    ],
  },
  {
    title: "Practice Directions",
    icon: FileText,
    items: [
      { title: "Practice Direction No. 1 of 2024 — Case Management", year: "2024", type: "Practice Direction", size: "85 KB", href: "#" },
      { title: "Practice Direction No. 2 of 2023 — Electronic Filing", year: "2023", type: "Practice Direction", size: "72 KB", href: "#" },
      { title: "Practice Direction No. 3 of 2022 — Remote Hearings", year: "2022", type: "Practice Direction", size: "68 KB", href: "#" },
      { title: "Practice Direction No. 1 of 2021 — COVID-19 Court Protocols", year: "2021", type: "Practice Direction", size: "120 KB", href: "#" },
      { title: "Practice Direction No. 1 of 2019 — Filing of Appeal Books", year: "2019", type: "Practice Direction", size: "90 KB", href: "#" },
    ],
  },
]

const typeColor: Record<string, string> = {
  Constitution:        "bg-red-50 text-red-700",
  "Organic Law":       "bg-orange-50 text-orange-700",
  Act:                 "bg-blue-50 text-blue-700",
  Amendment:           "bg-purple-50 text-purple-700",
  Rules:               "bg-emerald-50 text-emerald-700",
  "Practice Direction":"bg-amber-50 text-amber-700",
}

export default function ActsRulesPage() {
  return (
    <div>
      <PageHero
        badge="Supreme Court"
        title="Acts and Rules"
        subtitle="Legislation, court rules, and practice directions governing Supreme Court proceedings in Papua New Guinea."
        crumbs={[{ label: "Supreme Court", href: "/services#supreme-court" }, { label: "Acts and Rules" }]}
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80"
      />

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start gap-8">
            <SectionNav section="supreme-court" />
            <div className="flex-1 min-w-0">

          {/* Intro */}
          <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5 mb-8 text-sm text-gray-600 leading-relaxed">
            The Supreme Court of Papua New Guinea operates under the authority of the Constitution and the statutes listed below.
            All documents are provided in PDF format. For certified copies of any legislation, please contact the{" "}
            <a href="/contact" className="text-[hsl(352,83%,44%)] hover:underline font-medium">Waigani Court Registry</a>.
          </div>

          {/* Categories */}
          <div className="space-y-8">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <div key={cat.title} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="w-8 h-8 rounded-lg bg-[hsl(352,83%,44%)]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[hsl(352,83%,44%)]" />
                    </div>
                    <h2 className="font-bold text-gray-800 text-base">{cat.title}</h2>
                  </div>
                  <ul className="divide-y divide-gray-50">
                    {cat.items.map((item) => (
                      <li key={item.title} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                        <FileText className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-[hsl(352,83%,44%)] transition-colors" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">{item.title}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{item.year} · {item.size}</div>
                        </div>
                        <span className={`hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${typeColor[item.type] ?? "bg-gray-100 text-gray-600"}`}>
                          {item.type}
                        </span>
                        <a
                          href={item.href}
                          className="flex items-center gap-1.5 text-xs font-semibold text-[hsl(352,83%,44%)] hover:text-[hsl(352,83%,38%)] shrink-0 transition-colors"
                          aria-label={`Download ${item.title}`}
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* External resources */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 px-6 py-5">
            <h3 className="font-bold text-gray-800 mb-4 text-sm">External Legal Resources</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "PNG Law Reform Commission", href: "https://www.lawreform.gov.pg" },
                { label: "Pacific Islands Legal Information Institute", href: "https://www.paclii.org" },
                { label: "Attorney General's Department", href: "#" },
                { label: "Constitutional & Law Reform Commission", href: "#" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:border-[hsl(352,83%,44%)] hover:text-[hsl(352,83%,44%)] transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> {link.label}
                </a>
              ))}
            </div>
          </div>

        </div>
            </div>
          </div>
      </section>
    </div>
  )
}
