import Link from "next/link"
import { BookOpen, Download, FileText, Scale, ArrowRight, ExternalLink } from "lucide-react"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import SectionTabs from "@/components/SectionTabs"

const CATEGORIES = [
  {
    title: "Primary Legislation",
    icon: Scale,
    color: "bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)]",
    items: [
      { name: "Constitution of Papua New Guinea", note: "Supreme law — judicial independence provisions", external: true, href: "https://www.paclii.org/pg/legis/consol_act/cotisopng534/" },
      { name: "National Court Act (Chapter 38)",  note: "Jurisdiction and establishment of the National Court",  external: true, href: "https://www.paclii.org/pg/legis/consol_act/nca160/" },
      { name: "Criminal Code Act (Chapter 262)",  note: "Indictable and summary criminal offences",              external: true, href: "https://www.paclii.org/pg/legis/consol_act/cca167/" },
      { name: "District Courts Act (Chapter 40)", note: "Committal jurisdiction and appeals",                    external: true, href: "https://www.paclii.org/pg/legis/consol_act/dca201/" },
      { name: "Evidence Act (Chapter 48)",         note: "Rules of evidence in all courts",                     external: true, href: "https://www.paclii.org/pg/legis/consol_act/ea90/" },
      { name: "Bail Act (Chapter 340)",            note: "Bail entitlements and procedures",                    external: true, href: "https://www.paclii.org/pg/legis/consol_act/ba135/" },
    ],
  },
  {
    title: "National Court Rules & Practice Directions",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-700",
    items: [
      { name: "National Court Rules",                              note: "Principal procedural rules for civil proceedings", external: false, href: "#" },
      { name: "National Court Criminal Practice Rules",           note: "Procedural rules for criminal proceedings",        external: false, href: "#" },
      { name: "Practice Direction No. 1 of 2025 — Commercial",   note: "Commercial Court procedures",                      external: false, href: "#" },
      { name: "Practice Direction No. 2 of 2025 — E-Filing",     note: "Electronic filing guidelines",                    external: false, href: "#" },
      { name: "ADR Rules of the National Court",                  note: "Alternative Dispute Resolution procedures",        external: false, href: "#" },
      { name: "Family Violence Rules",                            note: "Procedures for family violence matters",           external: false, href: "#" },
    ],
  },
  {
    title: "Civil Procedure",
    icon: FileText,
    color: "bg-emerald-50 text-emerald-700",
    items: [
      { name: "Writs of Summons — Form NC1",        note: "Originating civil process form",                    external: false, href: "/resources" },
      { name: "Statement of Claim — Form NC2",      note: "Pleading form for civil matters",                   external: false, href: "/resources" },
      { name: "Notice of Intention to Defend",      note: "Form for defendants entering appearance",           external: false, href: "/resources" },
      { name: "Notice of Motion — Form NC5",        note: "Interlocutory application form",                   external: false, href: "/resources" },
      { name: "Affidavit Form",                     note: "Standard affidavit template",                      external: false, href: "/resources" },
    ],
  },
]

export default function ActsRulesPage() {
  return (
    <div>
      <PageHero
        badge="National Court"
        crumbs={[
          { label: "National Court", href: "/national-court/daily-diary" },
          { label: "Acts & Rules" },
        ]}
        title="Acts & Rules"
        subtitle="Primary legislation, procedural rules, practice directions, and court forms governing proceedings in the National Court of Papua New Guinea."
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />
      <SectionTabs section="national-court" />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="national-court" />
            <div className="flex-1 min-w-0 space-y-12">

      {/* PacLII note */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-8">
        <ExternalLink className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[12px] text-blue-800 leading-relaxed">
          Full text legislation is freely available on <a href="https://www.paclii.org/pg/" target="_blank" rel="noopener noreferrer" className="font-semibold underline">PacLII (Pacific Islands Legal Information Institute)</a>. Links marked with an external icon will open PacLII in a new tab.
        </p>
      </div>

      {CATEGORIES.map(cat => {
        const Icon = cat.icon
        return (
          <div key={cat.title} className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-gray-900 text-[15px] mt-1.5">{cat.title}</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {cat.items.map((item, i) => (
                <div key={item.name} className={`flex items-center justify-between gap-4 px-5 py-4 ${i < cat.items.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}>
                  <div className="flex items-start gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-gray-800 leading-snug">{item.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.note}</p>
                    </div>
                  </div>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-blue-700 hover:underline whitespace-nowrap">
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <a href={item.href} className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors" title="Download">
                      <Download className="w-3.5 h-3.5 text-gray-400" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3">
        <BookOpen className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <p className="text-[12px] text-gray-600 leading-relaxed">
          For copies of court rules not listed here, or for assistance identifying the correct rule or form for your matter, contact the <Link href="/contact?dept=national-court" className="text-blue-700 font-semibold hover:underline">Registry</Link> or visit the <Link href="/library/branch-libraries" className="text-blue-700 font-semibold hover:underline">Court Library</Link>.
        </p>
      </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
