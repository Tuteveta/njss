import { BookMarked, Download, ArrowRight, FileText, Newspaper, BarChart2, Scroll } from "lucide-react"
import Link from "next/link"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"

const ANNUAL_REPORTS = [
  { year: "2025", title: "NJSS Annual Report 2025", pages: "148 pages", size: "5.0 MB", available: true },
  { year: "2024", title: "NJSS Annual Report 2024", pages: "136 pages", size: "4.5 MB", available: true },
  { year: "2023", title: "NJSS Annual Report 2023", pages: "124 pages", size: "3.9 MB", available: true },
  { year: "2022", title: "NJSS Annual Report 2022", pages: "118 pages", size: "3.6 MB", available: true },
  { year: "2021", title: "NJSS Annual Report 2021", pages: "112 pages", size: "3.2 MB", available: false },
  { year: "2020", title: "NJSS Annual Report 2020", pages: "108 pages", size: "3.0 MB", available: false },
]

const JOURNALS = [
  {
    title: "Papua New Guinea Law Journal",
    frequency: "Annual",
    description: "The leading scholarly journal on Papua New Guinea law, publishing articles on PNG jurisprudence, comparative law, and legal developments.",
    icon: Scroll,
    available: true,
  },
  {
    title: "PNG Judiciary Newsletter",
    frequency: "Quarterly",
    description: "Internal quarterly newsletter covering court operations, staff achievements, legal updates, and upcoming events across the judiciary.",
    icon: Newspaper,
    available: true,
  },
  {
    title: "NJSS Statistical Bulletin",
    frequency: "Quarterly",
    description: "Quarterly statistical report on case filings, disposals, pending matters, and court performance data across all courts.",
    icon: BarChart2,
    available: true,
  },
]

const PRACTICE_DIRECTIONS = [
  { title: "Practice Direction No. 1 of 2025 — Commercial Court Procedures", date: "15 January 2025", court: "National Court" },
  { title: "Practice Direction No. 2 of 2025 — Electronic Filing Guidelines", date: "1 March 2025", court: "Supreme Court & National Court" },
  { title: "Practice Direction No. 1 of 2024 — Case Management Directions", date: "10 February 2024", court: "National Court" },
  { title: "Practice Direction No. 2 of 2024 — Appellate Practice Directions", date: "5 June 2024", court: "Supreme Court" },
  { title: "Practice Direction No. 3 of 2024 — Mediation & ADR Procedures", date: "20 September 2024", court: "National Court" },
]

export default function PublicationsPage() {
  return (
    <div>
      <PageHero
        badge="Court Library"
        crumbs={[
          { label: "Court Library", href: "/library/branch-libraries" },
          { label: "Publications" },
        ]}
        title="Publications"
        subtitle="Official publications of the National Judicial Staff Service — annual reports, journals, bulletins, and practice directions."
        image="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=80"
      />

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="library" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Annual Reports */}
          <div>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <BarChart2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Annual Reports</h2>
                <p className="text-sm text-gray-500 mt-0.5">Published NJSS performance, operational, and financial reports</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ANNUAL_REPORTS.map(report => (
                <div key={report.year} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 hover:border-gray-300 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[13.5px] text-gray-900 leading-snug">{report.title}</div>
                    <div className="text-[11px] text-gray-400 mt-1">{report.pages} · PDF · {report.size}</div>
                  </div>
                  {report.available ? (
                    <a
                      href="#"
                      className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:border-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,44%)]/5 transition-colors"
                      title={`Download ${report.title}`}
                    >
                      <Download className="w-3.5 h-3.5 text-gray-500" />
                    </a>
                  ) : (
                    <Link
                      href="/contact?dept=court-library"
                      className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(352,83%,44%)] hover:underline mt-1"
                    >
                      Request <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Journals & Newsletters */}
          <div>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <BookMarked className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Journals & Newsletters</h2>
                <p className="text-sm text-gray-500 mt-0.5">Scholarly journals, statistical bulletins, and internal newsletters</p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {JOURNALS.map(journal => {
                const Icon = journal.icon
                return (
                  <div key={journal.title} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:border-gray-300 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-gray-900 text-[14px]">{journal.title}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                          {journal.frequency}
                        </span>
                      </div>
                      <p className="text-[12.5px] text-gray-500 leading-relaxed">{journal.description}</p>
                    </div>
                    {journal.available && (
                      <Link
                        href="/contact?dept=court-library"
                        className="shrink-0 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[hsl(352,83%,44%)] hover:underline whitespace-nowrap"
                      >
                        Subscribe <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Practice Directions */}
          <div>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Scroll className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Practice Directions</h2>
                <p className="text-sm text-gray-500 mt-0.5">Current directions and circulars issued by the bench</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {PRACTICE_DIRECTIONS.map((pd, i) => (
                <div key={i} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-gray-800 leading-snug">{pd.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{pd.court} · {pd.date}</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:border-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,44%)]/5 transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-gray-400">
              For earlier practice directions, <Link href="/contact?dept=court-library" className="text-[hsl(352,83%,44%)] hover:underline font-medium">contact the Court Library</Link>.
            </p>
          </div>

          {/* Request CTA */}
          <div className="bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-[14px]">Can't find a publication?</p>
              <p className="text-[12px] text-gray-400 mt-0.5">Contact the library to request older editions, specialised reports, or out-of-print materials.</p>
            </div>
            <Link
              href="/contact?dept=court-library"
              className="shrink-0 inline-flex items-center gap-2 h-10 px-6 rounded-lg text-[13px] font-semibold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors"
            >
              Contact Library <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
