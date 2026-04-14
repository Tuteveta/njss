import Link from "next/link"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import SectionTabs from "@/components/SectionTabs"
import { Calendar, Clock, MapPin, Info, ArrowRight } from "lucide-react"

const LISTINGS = [
  { judge: "Dingake J",     time: "09:00", matter: "WS No. 312 of 2024 — Breach of Contract (Trial)",         division: "Civil",      room: "CR 4", type: "Trial",   status: "Confirmed" },
  { judge: "Miviri J",      time: "09:00", matter: "CR No. 88 of 2024 — State v Tau Peter (Armed Robbery)",   division: "Criminal",   room: "CR 5", type: "Trial",   status: "Confirmed" },
  { judge: "Carey J",       time: "10:00", matter: "OS No. 21 of 2025 — Originating Summons (Land Dispute)",  division: "OS",         room: "CR 6", type: "Mention", status: "Confirmed" },
  { judge: "Narokobi J",    time: "10:30", matter: "Comm. No. 7 of 2025 — Commercial Arbitration (Mining)",   division: "Commercial", room: "CR 7", type: "Hearing", status: "Part Heard" },
  { judge: "Kassman J",     time: "09:30", matter: "FMC No. 4 of 2025 — Custody Application",                 division: "Family",     room: "CR 8", type: "Mention", status: "Confirmed" },
  { judge: "Anis J",        time: "09:00", matter: "CR No. 102 of 2024 — State v Kila Ben (Drug Offences)",   division: "Criminal",   room: "CR 9", type: "Hearing", status: "Confirmed" },
  { judge: "Gavara-Nanu J", time: "10:00", matter: "WS No. 198 of 2024 — Negligence Claim",                   division: "Civil",      room: "CR 10", type: "Trial",  status: "Confirmed" },
  { judge: "Toliken J",     time: "13:00", matter: "CR No. 55 of 2024 — State v Simon Apa (Manslaughter)",    division: "Criminal",   room: "CR 5", type: "Sentencing", status: "Confirmed" },
  { judge: "Berrigan J",    time: "09:30", matter: "WS No. 441 of 2023 — Judicial Review (Employment)",       division: "Civil",      room: "CR 11", type: "Hearing", status: "Confirmed" },
  { judge: "Kaumi J",       time: "14:00", matter: "OS No. 88 of 2024 — Constitutional Reference",            division: "OS",         room: "CR 12", type: "Hearing", status: "Adjourned" },
]

const TYPE_COLORS: Record<string, string> = {
  Trial:      "bg-purple-50 text-purple-700",
  Hearing:    "bg-blue-50 text-blue-700",
  Mention:    "bg-gray-100 text-gray-600",
  Sentencing: "bg-orange-50 text-orange-700",
}
const STATUS_COLORS: Record<string, string> = {
  Confirmed:    "bg-emerald-50 text-emerald-700",
  "Part Heard": "bg-blue-50 text-blue-700",
  Adjourned:    "bg-red-50 text-red-600",
}
const DIV_COLORS: Record<string, string> = {
  Civil:      "text-blue-600",
  Criminal:   "text-red-600",
  Commercial: "text-emerald-600",
  Family:     "text-purple-600",
  OS:         "text-gray-600",
}

const today = new Date().toLocaleDateString("en-PG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

export default function NCDailyDiary() {
  return (
    <div>
      <PageHero
        badge="National Court"
        crumbs={[
          { label: "National Court", href: "/national-court/daily-diary" },
          { label: "Daily Court Diary" },
        ]}
        title="Daily Court Diary"
        subtitle="Today's scheduled sittings across all National Court divisions at Waigani."
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />
      <SectionTabs section="national-court" />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="national-court" />
            <div className="flex-1 min-w-0 space-y-12">

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Today</p>
                <p className="text-sm font-bold text-gray-900">{today}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-[12px] text-gray-500">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 9:00 AM – 4:00 PM</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Waigani Court Complex</span>
              <span className="font-semibold text-blue-700">{LISTINGS.filter(l => l.status !== "Adjourned").length} active matters</span>
            </div>
          </div>

          {/* Division filter legend */}
          <div className="flex flex-wrap gap-2 mb-5">
            {Object.entries(DIV_COLORS).map(([div, cls]) => (
              <span key={div} className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 ${cls}`}>{div}</span>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            <div className="hidden md:grid grid-cols-[65px_80px_1fr_110px_90px_80px] text-[10px] font-bold uppercase tracking-wider text-gray-400 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
              <span>Time</span><span>Room</span><span>Matter</span><span>Judge</span><span>Type</span><span>Status</span>
            </div>
            {LISTINGS.map((l, i) => (
              <div key={i} className={`grid md:grid-cols-[65px_80px_1fr_110px_90px_80px] gap-1 md:gap-0 px-4 py-3.5 ${i < LISTINGS.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}>
                <div className="font-semibold text-gray-700 text-[12px]">{l.time}</div>
                <div className="text-[12px] text-gray-400 font-medium">{l.room}</div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-[13px] leading-snug">{l.matter}</p>
                  <p className={`text-[11px] font-semibold mt-0.5 ${DIV_COLORS[l.division] ?? "text-gray-400"}`}>{l.division}</p>
                </div>
                <div className="text-[12px] text-gray-500 md:px-2">{l.judge}</div>
                <div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[l.type] ?? "bg-gray-100 text-gray-600"}`}>{l.type}</span></div>
                <div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[l.status] ?? "bg-gray-100 text-gray-600"}`}>{l.status}</span></div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-4">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-800 leading-relaxed">
              Listings are indicative only and subject to change without notice. Always confirm with the relevant Registry before attending. Call <a href="tel:+67532579002" className="font-semibold underline">+675 325 7902</a> or visit the Waigani Registry.
            </p>
          </div>
          <div className="text-right">
            <Link href="/national-court/listings" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-700 hover:underline">
              Full weekly listings <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
