"use client"
import { useState } from "react"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import { Search, FileText, Download, ChevronDown, ChevronUp } from "lucide-react"

const determinations = [
  {
    no: "SC REV 12 of 2024",
    title: "Michael Kama v The State",
    date: "14 March 2025",
    judges: "Salika CJ, Kandakasi J, Batari J",
    division: "Constitutional",
    outcome: "Application dismissed",
    summary: "The Supreme Court dismissed an application for constitutional review of a decision of the National Court relating to the interpretation of Section 41 of the Constitution. The Court held that the threshold requirements for leave had not been met and that the National Court had correctly applied the relevant constitutional provisions.",
    keywords: ["Constitutional Review", "Section 41", "Leave", "Threshold"],
  },
  {
    no: "SCA 17 of 2022",
    title: "Papua New Guinea v Curtain Bros (PNG) Ltd",
    date: "20 March 2025",
    judges: "Hartshorn J, Makail J, Anis J",
    division: "Commercial",
    outcome: "Appeal allowed",
    summary: "The Supreme Court allowed the State's appeal against a National Court judgment awarding damages in a government construction contract dispute. The Court found errors in the assessment of damages and remitted the matter back to the National Court for reassessment of quantum only.",
    keywords: ["Government Contract", "Damages", "Reassessment", "Construction"],
  },
  {
    no: "SC EP 04 of 2022",
    title: "Marat v Nagle & Electoral Commission",
    date: "15 March 2025",
    judges: "Salika CJ, Batari J, Kandakasi J, Makail J, Anis J",
    division: "Election Petition",
    outcome: "Appeal dismissed",
    summary: "A five-judge bench dismissed an election petition appeal relating to the 2022 National General Elections for the Manus Open electorate. The Court held that the trial judge had correctly assessed the evidence and applied the applicable provisions of the Organic Law on National and Local-level Government Elections.",
    keywords: ["Election Petition", "Manus Open", "2022 Elections", "Five Bench"],
  },
  {
    no: "SCA 55 of 2022",
    title: "MRDC v Mineral Resources Authority",
    date: "10 March 2025",
    judges: "Hartshorn J, Makail J, Murray J",
    division: "Administrative",
    outcome: "Appeal dismissed",
    summary: "The Supreme Court dismissed an appeal by the Mineral Resources Development Company against a decision of the National Court upholding the Mineral Resources Authority's administrative determination. The Court confirmed that the MRA had acted within its statutory mandate.",
    keywords: ["Mining", "Administrative Decision", "Statutory Authority", "MRDC"],
  },
  {
    no: "SCA 44 of 2023",
    title: "Bank South Pacific Ltd v Natera",
    date: "1 February 2025",
    judges: "Batari J, Makail J, Anis J",
    division: "Commercial",
    outcome: "Appeal allowed in part",
    summary: "The Court allowed BSP's appeal in part, finding that the National Court had erred in its assessment of the defendant's contributory negligence. The quantum of damages was varied. The Court reaffirmed the principles applicable to banking disputes and the duty of care owed by financial institutions.",
    keywords: ["Banking", "Negligence", "Contributory Negligence", "Damages"],
  },
  {
    no: "SC OS 01 of 2024",
    title: "In Re: Interpretation of Section 145 Constitution",
    date: "15 January 2025",
    judges: "Salika CJ, Kandakasi J, Batari J, Hartshorn J, Murray J",
    division: "Constitutional",
    outcome: "Constitutional reference answered",
    summary: "The Supreme Court answered a constitutional reference concerning the interpretation of Section 145 of the Constitution relating to parliamentary procedures. The Court provided authoritative guidance on the meaning of 'absolute majority' in the context of votes of no confidence.",
    keywords: ["Constitutional Reference", "Section 145", "Vote of No Confidence", "Parliament"],
  },
]

const divisions = ["All", "Constitutional", "Commercial", "Administrative", "Election Petition", "Civil"]
const years     = ["All Years", "2025", "2024", "2023", "2022"]

export default function SummaryDeterminationsPage() {
  const [search,   setSearch]   = useState("")
  const [division, setDivision] = useState("All")
  const [year,     setYear]     = useState("All Years")
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = determinations.filter(d => {
    const q = search.toLowerCase()
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.no.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q) || d.keywords.some(k => k.toLowerCase().includes(q))
    const matchDiv    = division === "All"      || d.division === division
    const matchYear   = year     === "All Years" || d.date.includes(year)
    return matchSearch && matchDiv && matchYear
  })

  const divisionColor: Record<string, string> = {
    Constitutional:     "bg-red-50 text-red-700",
    Civil:              "bg-blue-50 text-blue-700",
    Commercial:         "bg-purple-50 text-purple-700",
    Administrative:     "bg-orange-50 text-orange-700",
    "Election Petition":"bg-amber-50 text-amber-700",
  }

  const outcomeColor = (o: string) => {
    if (o.toLowerCase().includes("allowed")) return "bg-green-50 text-green-700"
    if (o.toLowerCase().includes("dismissed")) return "bg-red-50 text-red-600"
    if (o.toLowerCase().includes("part")) return "bg-blue-50 text-blue-700"
    return "bg-gray-100 text-gray-600"
  }

  return (
    <div>
      <PageHero
        badge="Supreme Court"
        title="Summary Determinations"
        subtitle="Published summary determinations and judgment abstracts from the Supreme Court of Papua New Guinea."
        crumbs={[{ label: "Supreme Court", href: "/services#supreme-court" }, { label: "Summary Determinations" }]}
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&q=80"
      />

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start gap-8">
            <SectionNav section="supreme-court" />
            <div className="flex-1 min-w-0">

          {/* Intro */}
          <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5 mb-6 text-sm text-gray-600 leading-relaxed">
            Summary determinations are brief published abstracts of Supreme Court decisions. They are provided for public
            information purposes only. Full judgments are available from the{" "}
            <a href="https://www.paclii.org/pg/cases/PGSC/" target="_blank" rel="noopener noreferrer" className="text-[hsl(352,83%,44%)] hover:underline font-medium">
              Pacific Islands Legal Information Institute (PacLII)
            </a>{" "}
            and the Court Library.
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 mb-6 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl h-10 bg-gray-50 focus-within:bg-white focus-within:border-[hsl(352,83%,44%)] transition-all px-3 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search case, parties, keywords…"
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
            <select value={division} onChange={e => setDivision(e.target.value)} className="border border-gray-200 rounded-xl h-10 px-3 bg-gray-50 text-sm text-gray-700 outline-none">
              {divisions.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={year} onChange={e => setYear(e.target.value)} className="border border-gray-200 rounded-xl h-10 px-3 bg-gray-50 text-sm text-gray-700 outline-none">
              {years.map(y => <option key={y}>{y}</option>)}
            </select>
            <span className="text-xs text-gray-400 ml-auto">{filtered.length} determination{filtered.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Determination cards */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 py-12 text-center text-sm text-gray-400">
                No determinations found matching your search.
              </div>
            ) : filtered.map((d) => {
              const isOpen = expanded === d.no
              return (
                <div key={d.no} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  {/* Header row */}
                  <button
                    onClick={() => setExpanded(isOpen ? null : d.no)}
                    className="w-full text-left px-6 py-4 flex flex-wrap gap-3 items-start hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-[hsl(352,83%,44%)] font-bold">{d.no}</span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${divisionColor[d.division] ?? "bg-gray-100 text-gray-600"}`}>
                          {d.division}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${outcomeColor(d.outcome)}`}>
                          {d.outcome}
                        </span>
                      </div>
                      <div className="font-semibold text-gray-800 text-sm">{d.title}</div>
                      <div className="text-xs text-gray-400 mt-1">{d.date} · {d.judges}</div>
                    </div>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                      : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                    }
                  </button>

                  {/* Expanded summary */}
                  {isOpen && (
                    <div className="border-t border-gray-100 px-6 py-5 bg-gray-50">
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{d.summary}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {d.keywords.map(k => (
                          <span key={k} className="text-[11px] bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{k}</span>
                        ))}
                        <a
                          href={`https://www.paclii.org/pg/cases/PGSC/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-[hsl(352,83%,44%)] hover:underline"
                        >
                          <Download className="w-3.5 h-3.5" /> Full Judgment (PacLII)
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* PacLII note */}
          <div className="mt-8 bg-white rounded-xl border border-gray-200 px-6 py-4 flex items-center gap-3">
            <FileText className="w-5 h-5 text-[hsl(352,83%,44%)] shrink-0" />
            <p className="text-sm text-gray-600">
              Full text judgments are freely available at{" "}
              <a href="https://www.paclii.org/pg/cases/PGSC/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[hsl(352,83%,44%)] hover:underline">
                www.paclii.org/pg/cases/PGSC
              </a>
            </p>
          </div>

        </div>
            </div>
          </div>
      </section>
    </div>
  )
}
