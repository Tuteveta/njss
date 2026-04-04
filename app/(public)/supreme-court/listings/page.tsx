"use client"
import { useState } from "react"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import { Search, Filter, CalendarDays, ChevronRight } from "lucide-react"

const allListings = [
  { no: "SC REV 01 of 2025", parties: "In Re: Organic Law on Elections (Amendment)",     division: "Constitutional",  date: "2025-04-07", judge: "Full Bench",          status: "Active",   nextAction: "Hearing 7 Apr 2025" },
  { no: "SCA 08 of 2024",    parties: "PNG Power Ltd v Koroma & Ors",                     division: "Civil",           date: "2025-04-03", judge: "Kandakasi J",        status: "Active",   nextAction: "Hearing 3 Apr 2025" },
  { no: "SCA 44 of 2023",    parties: "Bank South Pacific Ltd v Natera",                  division: "Commercial",      date: "2025-04-03", judge: "Batari J",           status: "Active",   nextAction: "Hearing 3 Apr 2025" },
  { no: "SC EP 07 of 2024",  parties: "Kama v Dion & Electoral Commission",               division: "Election Petition",date: "2025-04-03", judge: "Kandakasi J",       status: "Active",   nextAction: "Ruling 3 Apr 2025" },
  { no: "SC OS 03 of 2025",  parties: "In Re: Electoral Commission Matter",               division: "Original",        date: "2025-04-03", judge: "Chief Justice",      status: "Active",   nextAction: "Judgment 3 Apr 2025" },
  { no: "SCA 51 of 2023",    parties: "Rimbunan Hijau (PNG) Ltd v State",                 division: "Civil",           date: "2025-04-10", judge: "Kandakasi J",        status: "Active",   nextAction: "Mention 10 Apr 2025" },
  { no: "SCA 22 of 2024",    parties: "Somare v PNG Land Board",                          division: "Administrative",  date: "2025-04-10", judge: "Batari J",           status: "Active",   nextAction: "Hearing 10 Apr 2025" },
  { no: "SC REV 12 of 2024", parties: "Michael Kama v The State",                         division: "Constitutional",  date: "2025-04-03", judge: "Chief Justice",      status: "Active",   nextAction: "Mention 3 Apr 2025" },
  { no: "SCA 33 of 2023",    parties: "Morobe Provincial Govt v Kama",                    division: "Administrative",  date: "2025-04-03", judge: "Anis J (Lae)",       status: "Active",   nextAction: "Hearing 3 Apr 2025" },
  { no: "SCA 29 of 2024",    parties: "Telikom PNG Ltd v Rooney & Ors",                   division: "Commercial",      date: "2025-04-10", judge: "Batari J",           status: "Active",   nextAction: "Mention 10 Apr 2025" },
  { no: "SCA 40 of 2023",    parties: "Pacific MMI Insurance v Tobung",                   division: "Civil",           date: "2025-04-03", judge: "Anis J (Lae)",       status: "Active",   nextAction: "Mention 3 Apr 2025" },
  { no: "SCA 17 of 2022",    parties: "Papua New Guinea v Curtain Bros (PNG) Ltd",        division: "Commercial",      date: "2025-03-20", judge: "Hartshorn J",        status: "Determined", nextAction: "Judgment delivered" },
  { no: "SC EP 04 of 2022",  parties: "Marat v Nagle & Electoral Commission",             division: "Election Petition",date: "2025-03-15", judge: "Full Bench",         status: "Determined", nextAction: "Judgment delivered" },
  { no: "SCA 55 of 2022",    parties: "MRDC v Mineral Resources Authority",               division: "Administrative",  date: "2025-03-10", judge: "Makail J",           status: "Determined", nextAction: "Judgment delivered" },
]

const divisions = ["All Divisions", "Constitutional", "Civil", "Commercial", "Administrative", "Election Petition", "Original"]
const statuses  = ["All Status", "Active", "Determined"]

const statusColor: Record<string, string> = {
  Active:     "bg-green-50 text-green-700",
  Determined: "bg-gray-100 text-gray-500",
}

const divisionColor: Record<string, string> = {
  Constitutional:    "bg-red-50 text-red-700",
  Civil:             "bg-blue-50 text-blue-700",
  Commercial:        "bg-purple-50 text-purple-700",
  Administrative:    "bg-orange-50 text-orange-700",
  "Election Petition":"bg-amber-50 text-amber-700",
  Original:          "bg-teal-50 text-teal-700",
}

export default function SupremeCourtListingsPage() {
  const [search,   setSearch]   = useState("")
  const [division, setDivision] = useState("All Divisions")
  const [status,   setStatus]   = useState("All Status")

  const filtered = allListings.filter(l => {
    const q = search.toLowerCase()
    const matchSearch = !q || l.no.toLowerCase().includes(q) || l.parties.toLowerCase().includes(q) || l.judge.toLowerCase().includes(q)
    const matchDiv    = division === "All Divisions" || l.division === division
    const matchStatus = status  === "All Status"     || l.status   === status
    return matchSearch && matchDiv && matchStatus
  })

  return (
    <div>
      <PageHero
        badge="Supreme Court"
        title="Listings"
        subtitle="Active and recently determined Supreme Court matters, searchable by case number, parties, or judge."
        crumbs={[{ label: "Supreme Court", href: "/services#supreme-court" }, { label: "Listings" }]}
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start gap-8">
            <SectionNav section="supreme-court" />
            <div className="flex-1 min-w-0">

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 mb-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl h-10 bg-gray-50 focus-within:bg-white focus-within:border-[hsl(352,83%,44%)] transition-all px-3 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search case number, parties, judge…"
                className="flex-1 text-sm bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl h-10 px-3 bg-gray-50 text-sm text-gray-600">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select value={division} onChange={e => setDivision(e.target.value)} className="bg-transparent outline-none text-sm text-gray-700">
                {divisions.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl h-10 px-3 bg-gray-50 text-sm text-gray-600">
              <select value={status} onChange={e => setStatus(e.target.value)} className="bg-transparent outline-none text-sm text-gray-700">
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5 ml-auto text-xs text-gray-400">
              <CalendarDays className="w-3.5 h-3.5" />
              {filtered.length} matter{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Case No.</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Parties</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Division</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Judge</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden xl:table-cell">Next Action</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                        No matters found matching your search criteria.
                      </td>
                    </tr>
                  ) : filtered.map((l) => (
                    <tr key={l.no} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-5 py-3.5 font-mono text-xs text-[hsl(352,83%,44%)] font-semibold whitespace-nowrap">{l.no}</td>
                      <td className="px-5 py-3.5 text-gray-800 font-medium max-w-xs">
                        <span className="line-clamp-2">{l.parties}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${divisionColor[l.division] ?? "bg-gray-100 text-gray-600"}`}>
                          {l.division}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs hidden md:table-cell whitespace-nowrap">{l.judge}</td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs hidden xl:table-cell">{l.nextAction}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusColor[l.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Note */}
          <p className="mt-5 text-xs text-gray-400 px-1 flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3" />
            For certified copies of court orders or judgments, contact the Waigani Supreme Court Registry on +675 325 7902.
          </p>

        </div>
            </div>
          </div>
      </section>
    </div>
  )
}
