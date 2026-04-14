"use client"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import SectionTabs from "@/components/SectionTabs"
import { CalendarDays, Clock, User } from "lucide-react"

const TODAY = new Date().toLocaleDateString("en-PG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

const diaryEntries = [
  {
    time: "9:00 AM",
    court: "Court 1 – Chief Justice's Court",
    judge: "Chief Justice Sir Gibuma Gibbs Salika",
    cases: [
      { no: "SC REV 12 of 2024", parties: "Michael Kama v The State", type: "Constitutional Review", status: "Mention" },
      { no: "SCA 08 of 2024",    parties: "PNG Power Ltd v Koroma & Ors", type: "Civil Appeal", status: "Hearing" },
      { no: "SC OS 03 of 2025",  parties: "In Re: Electoral Commission Matter", type: "Original Jurisdiction", status: "Judgment" },
    ],
  },
  {
    time: "9:00 AM",
    court: "Court 2 – Waigani",
    judge: "Justice Kandakasi",
    cases: [
      { no: "SCA 44 of 2023", parties: "Bank South Pacific Ltd v Natera", type: "Commercial Appeal", status: "Hearing" },
      { no: "SCA 51 of 2023", parties: "Rimbunan Hijau (PNG) Ltd v State", type: "Civil Appeal", status: "Mention" },
      { no: "SC EP 07 of 2024", parties: "Kama v Dion & Electoral Commission", type: "Election Petition Appeal", status: "Ruling" },
    ],
  },
  {
    time: "9:30 AM",
    court: "Court 3 – Waigani",
    judge: "Justice Batari",
    cases: [
      { no: "SCA 22 of 2024", parties: "Somare v PNG Land Board",         type: "Administrative Appeal", status: "Hearing" },
      { no: "SCA 29 of 2024", parties: "Telikom PNG Ltd v Rooney & Ors",  type: "Civil Appeal",          status: "Mention" },
    ],
  },
  {
    time: "10:00 AM",
    court: "Court 4 – Constitutional Matters",
    judge: "Full Bench (5 Judges)",
    cases: [
      { no: "SC REV 01 of 2025", parties: "In re: Organic Law on Elections (Amendment)", type: "Constitutional Reference", status: "Hearing" },
    ],
  },
  {
    time: "9:00 AM",
    court: "Lae Registry – Court 1",
    judge: "Justice Anis",
    cases: [
      { no: "SCA 33 of 2023", parties: "Morobe Provincial Govt v Kama", type: "Civil Appeal", status: "Hearing" },
      { no: "SCA 40 of 2023", parties: "Pacific MMI Insurance v Tobung", type: "Commercial Appeal", status: "Mention" },
    ],
  },
]

const statusColor: Record<string, string> = {
  Hearing:  "bg-blue-50 text-blue-700",
  Mention:  "bg-amber-50 text-amber-700",
  Judgment: "bg-green-50 text-green-700",
  Ruling:   "bg-purple-50 text-purple-700",
}

export default function DailyCourtDiaryPage() {
  return (
    <div>
      <PageHero
        badge="Supreme Court"
        title="Daily Court Diary"
        subtitle="Today's Supreme Court sittings, listings and scheduled matters across all registries."
        crumbs={[{ label: "Supreme Court", href: "/services#supreme-court" }, { label: "Daily Court Diary" }]}
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />
      <SectionTabs section="supreme-court" />
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <div className="flex items-start gap-8">
            <SectionNav section="supreme-court" />
            <div className="flex-1 min-w-0">

          {/* Date banner */}
          <div className="flex items-center gap-3 mb-8 bg-white border border-gray-200 rounded-xl px-5 py-4">
            <CalendarDays className="w-5 h-5 text-[hsl(352,83%,44%)] shrink-0" />
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Today's Sittings</div>
              <div className="text-base font-bold text-gray-800">{TODAY}</div>
            </div>
            <div className="ml-auto text-xs text-gray-400">All times are Papua New Guinea Standard Time (PNGT, UTC+10)</div>
          </div>

          {/* Notice */}
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
            <strong>Notice:</strong> Court sittings are subject to change. Parties and counsel should confirm with the relevant Registry before attending. Contact the Waigani Registry on <strong>+675 325 7902</strong>.
          </div>

          {/* Court listings */}
          <div className="space-y-4">
            {diaryEntries.map((entry, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
                {/* Card header — icon + court info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(352,83%,44%)]/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[hsl(352,83%,44%)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-[15px] leading-snug">{entry.court}</div>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{entry.time}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{entry.judge}</span>
                    </div>
                  </div>
                </div>

                {/* Cases */}
                <div className="divide-y divide-gray-100">
                  {entry.cases.map((c, j) => (
                    <div key={j} className="flex flex-wrap items-center gap-3 py-3">
                      <span className="text-xs font-semibold text-[hsl(352,83%,44%)] w-36 shrink-0">{c.no}</span>
                      <span className="flex-1 text-sm font-medium text-gray-800 min-w-0">{c.parties}</span>
                      <span className="hidden md:block text-xs text-gray-400 w-44 shrink-0">{c.type}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 ${statusColor[c.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-10 bg-white rounded-xl border border-gray-200 px-6 py-5 text-sm text-gray-600">
            <p className="font-semibold text-gray-800 mb-2">Registry Contact Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500">
              <div><span className="font-medium text-gray-700">Waigani (NCD)</span><br />+675 325 7902 | supremecourt@judiciary.gov.pg</div>
              <div><span className="font-medium text-gray-700">Lae Registry</span><br />+675 472 1855 | lae.registry@judiciary.gov.pg</div>
              <div><span className="font-medium text-gray-700">Mt Hagen Registry</span><br />+675 542 1600 | hagen.registry@judiciary.gov.pg</div>
            </div>
          </div>

        </div>
            </div>
          </div>
      </section>
    </div>
  )
}
