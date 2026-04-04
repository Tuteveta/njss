import Link from "next/link"
import { Calendar, Clock, MapPin, Info, ArrowRight } from "lucide-react"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"

const COURTS = [
  { name: "Supreme Court", color: "bg-[hsl(352,83%,44%)]", short: "SC" },
  { name: "National Court", color: "bg-blue-700", short: "NC" },
]

const LISTINGS = [
  { court: "SC", division: "Full Court", judge: "Cannings J, Shepherd J, Makail J", time: "09:30", matter: "SCR No. 1 of 2025 — Constitutional Reference (Electoral Rolls)", type: "Hearing", room: "Court Room 1", status: "Confirmed" },
  { court: "SC", division: "Supreme Court", judge: "Hartshorn J", time: "10:00", matter: "SCA No. 44 of 2024 — Application for Leave to Appeal", type: "Leave", room: "Court Room 2", status: "Confirmed" },
  { court: "SC", division: "Supreme Court", judge: "Murray J", time: "10:30", matter: "SCA No. 87 of 2024 — Appeal against Sentence", type: "Appeal", room: "Court Room 3", status: "Confirmed" },
  { court: "NC", division: "Civil", judge: "Dingake J", time: "09:00", matter: "WS No. 312 of 2024 — Writ of Summons (Breach of Contract)", type: "Trial", room: "Court Room 4", status: "Confirmed" },
  { court: "NC", division: "Criminal", judge: "Miviri J", time: "09:00", matter: "CR No. 88 of 2024 — The State v Tau Peter (Armed Robbery)", type: "Trial", room: "Court Room 5", status: "Confirmed" },
  { court: "NC", division: "OS", judge: "Carey J", time: "10:00", matter: "OS No. 21 of 2025 — Originating Summons (Land Dispute)", type: "Mention", room: "Court Room 6", status: "Confirmed" },
  { court: "NC", division: "Commercial", judge: "Narokobi J", time: "10:30", matter: "Comm. No. 7 of 2025 — Commercial Arbitration (Mining)", type: "Hearing", room: "Court Room 7", status: "Part Heard" },
  { court: "NC", division: "Family", judge: "Kassman J", time: "09:30", matter: "FMC No. 4 of 2025 — Family Matter (Custody Application)", type: "Mention", room: "Court Room 8", status: "Confirmed" },
]

const TYPE_COLORS: Record<string, string> = {
  Hearing:  "bg-blue-50 text-blue-700",
  Trial:    "bg-purple-50 text-purple-700",
  Leave:    "bg-amber-50 text-amber-700",
  Appeal:   "bg-orange-50 text-orange-700",
  Mention:  "bg-gray-100 text-gray-600",
}

const STATUS_COLORS: Record<string, string> = {
  Confirmed:   "bg-emerald-50 text-emerald-700",
  "Part Heard":"bg-blue-50 text-blue-700",
  Adjourned:   "bg-red-50 text-red-600",
}

const today = new Date().toLocaleDateString("en-PG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

export default function DailyCourtDiary() {
  const sc = LISTINGS.filter(l => l.court === "SC")
  const nc = LISTINGS.filter(l => l.court === "NC")

  return (
    <div>
      <PageHero
        badge="About the Courts"
        title="Daily Court Diary"
        subtitle="Today's scheduled sittings and appearances across the Supreme Court and National Court at Waigani."
        crumbs={[{ label: "About the Courts", href: "/about" }, { label: "Daily Court Diary" }]}
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="about" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Date / info bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[hsl(352,83%,44%)]/10 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-[hsl(352,83%,44%)]" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Today</p>
                <p className="text-sm font-bold text-gray-900">{today}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                Court hours: 9:00 AM – 4:00 PM
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                Waigani Court Complex
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(TYPE_COLORS).map(([type, cls]) => (
              <span key={type} className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cls}`}>{type}</span>
            ))}
          </div>

          {/* Supreme Court */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[hsl(352,83%,44%)]" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Supreme Court — {sc.length} matter{sc.length !== 1 ? "s" : ""}</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="hidden md:grid grid-cols-[70px_1fr_140px_100px_80px] text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                <span>Time</span><span>Matter</span><span>Judge</span><span>Type</span><span>Status</span>
              </div>
              {sc.map((l, i) => (
                <div key={i} className={`grid md:grid-cols-[70px_1fr_140px_100px_80px] gap-2 md:gap-0 px-4 py-3.5 text-sm ${i < sc.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}>
                  <div className="font-mono font-semibold text-gray-700 text-[12px]">{l.time}</div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-[13px] leading-snug">{l.matter}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{l.division} · {l.room}</p>
                  </div>
                  <div className="text-[12px] text-gray-500 md:px-2">{l.judge}</div>
                  <div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[l.type] ?? "bg-gray-100 text-gray-600"}`}>{l.type}</span></div>
                  <div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[l.status] ?? "bg-gray-100 text-gray-600"}`}>{l.status}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* National Court */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-700" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500">National Court — {nc.length} matter{nc.length !== 1 ? "s" : ""}</h2>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="hidden md:grid grid-cols-[70px_1fr_140px_100px_80px] text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                <span>Time</span><span>Matter</span><span>Judge</span><span>Type</span><span>Status</span>
              </div>
              {nc.map((l, i) => (
                <div key={i} className={`grid md:grid-cols-[70px_1fr_140px_100px_80px] gap-2 md:gap-0 px-4 py-3.5 text-sm ${i < nc.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}>
                  <div className="font-mono font-semibold text-gray-700 text-[12px]">{l.time}</div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-[13px] leading-snug">{l.matter}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{l.division} · {l.room}</p>
                  </div>
                  <div className="text-[12px] text-gray-500 md:px-2">{l.judge}</div>
                  <div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[l.type] ?? "bg-gray-100 text-gray-600"}`}>{l.type}</span></div>
                  <div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[l.status] ?? "bg-gray-100 text-gray-600"}`}>{l.status}</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-800 leading-relaxed">
              Court diary listings are indicative only and subject to change without notice. Parties and counsel must confirm hearing details directly with the relevant Registry before attending court. For enquiries call <a href="tel:+67532579002" className="font-semibold underline">+675 325 7902</a>.
            </p>
          </div>

          <div className="mt-4 text-right">
            <Link href="/filings" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[hsl(352,83%,44%)] hover:underline">
              View full Court Filings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
