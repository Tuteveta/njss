import Link from "next/link"
import { Calendar, ArrowRight, Info } from "lucide-react"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"

const WEEKS = [
  {
    week: "Week of 7 April 2025",
    days: [
      { day: "Monday 7 April",    matters: [
        { time: "09:00", matter: "WS 312/2024 — Breach of Contract",      judge: "Dingake J",  div: "Civil",      type: "Trial" },
        { time: "09:00", matter: "CR 88/2024 — State v Tau Peter",         judge: "Miviri J",   div: "Criminal",   type: "Trial" },
        { time: "10:30", matter: "OS 21/2025 — Originating Summons",       judge: "Carey J",    div: "OS",         type: "Mention" },
      ]},
      { day: "Tuesday 8 April",   matters: [
        { time: "09:30", matter: "Comm. 7/2025 — Mining Arbitration",      judge: "Narokobi J", div: "Commercial", type: "Hearing" },
        { time: "09:00", matter: "FMC 4/2025 — Custody Application",       judge: "Kassman J",  div: "Family",     type: "Mention" },
        { time: "13:00", matter: "CR 55/2024 — State v Simon Apa",         judge: "Toliken J",  div: "Criminal",   type: "Sentencing" },
      ]},
      { day: "Wednesday 9 April", matters: [
        { time: "09:00", matter: "WS 441/2023 — Judicial Review",          judge: "Berrigan J", div: "Civil",      type: "Hearing" },
        { time: "09:00", matter: "CR 102/2024 — State v Kila Ben",         judge: "Anis J",     div: "Criminal",   type: "Hearing" },
        { time: "10:00", matter: "WS 198/2024 — Negligence Claim",         judge: "Gavara-Nanu J", div: "Civil",  type: "Trial" },
      ]},
    ],
  },
]

const DIV_COLORS: Record<string, string> = {
  Civil:      "bg-blue-50 text-blue-700",
  Criminal:   "bg-red-50 text-red-700",
  Commercial: "bg-emerald-50 text-emerald-700",
  Family:     "bg-purple-50 text-purple-700",
  OS:         "bg-gray-100 text-gray-600",
}

const TYPE_COLORS: Record<string, string> = {
  Trial:      "bg-purple-50 text-purple-700",
  Hearing:    "bg-blue-50 text-blue-700",
  Mention:    "bg-gray-100 text-gray-600",
  Sentencing: "bg-orange-50 text-orange-700",
}

export default function ListingsPage() {
  return (
    <div>
      <PageHero
        badge="National Court"
        crumbs={[
          { label: "National Court", href: "/national-court/daily-diary" },
          { label: "Listings" },
        ]}
        title="Listings"
        subtitle="Weekly case listings for the National Court at Waigani, organised by day and division. Updated each Friday for the following week."
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="national-court" />
            <div className="flex-1 min-w-0 space-y-12">

      {/* Division filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(DIV_COLORS).map(([div, cls]) => (
          <span key={div} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full cursor-pointer ${cls}`}>{div}</span>
        ))}
      </div>

      {WEEKS.map(week => (
        <div key={week.week} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-blue-700" />
            <h2 className="font-bold text-gray-900 text-[14px]">{week.week}</h2>
          </div>
          <div className="space-y-4">
            {week.days.map(day => (
              <div key={day.day}>
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">{day.day}</p>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {day.matters.map((m, i) => (
                    <div key={i} className={`grid grid-cols-[55px_1fr_120px_80px_80px] gap-0 px-4 py-3 text-sm ${i < day.matters.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}>
                      <div className="font-mono text-[11.5px] font-semibold text-gray-500">{m.time}</div>
                      <div className="min-w-0 pr-3">
                        <p className="font-semibold text-gray-900 text-[13px] leading-snug truncate">{m.matter}</p>
                      </div>
                      <div className="text-[11.5px] text-gray-500">{m.judge}</div>
                      <div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIV_COLORS[m.div] ?? "bg-gray-100 text-gray-600"}`}>{m.div}</span></div>
                      <div><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[m.type] ?? "bg-gray-100 text-gray-600"}`}>{m.type}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-4">
        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[12px] text-amber-800 leading-relaxed">
          Listings are subject to change without notice. Confirm hearing details directly with the Registry on <a href="tel:+67532579002" className="font-semibold underline">+675 325 7902</a> before attending court.
        </p>
      </div>

      <div className="text-right">
        <Link href="/national-court/daily-diary" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-700 hover:underline">
          View today's diary <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
