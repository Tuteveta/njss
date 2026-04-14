import Link from "next/link"
import { BookOpen, Download, Calendar, Info, ArrowRight } from "lucide-react"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import SectionTabs from "@/components/SectionTabs"

const SITTINGS = [
  { term: "Term 1", period: "5 February – 29 March 2018",    weeks: 8,  note: "Includes Ash Wednesday recess (14 Feb)" },
  { term: "Term 2", period: "16 April – 22 June 2018",       weeks: 10, note: "Queen's Birthday recess (11 June)" },
  { term: "Term 3", period: "16 July – 14 September 2018",   weeks: 9,  note: "No public holidays" },
  { term: "Term 4", period: "8 October – 7 December 2018",   weeks: 9,  note: "Remembrance Day recess (23 July)" },
]

const HOLIDAYS = [
  { date: "1 January",   name: "New Year's Day" },
  { date: "14 February", name: "Ash Wednesday (PNG Courts recess)" },
  { date: "30 March",    name: "Good Friday" },
  { date: "2 April",     name: "Easter Monday" },
  { date: "11 June",     name: "Queen's Birthday" },
  { date: "23 July",     name: "Remembrance Day" },
  { date: "16 September",name: "PNG Independence Day" },
  { date: "26 October",  name: "Milne Bay Day (Provincial)" },
  { date: "25 December", name: "Christmas Day" },
  { date: "26 December", name: "Boxing Day" },
]

const VACATION_JUDGES = [
  { period: "January – February 2018",  judge: "Hartshorn J" },
  { period: "April 2018",               judge: "Murray J" },
  { period: "July 2018",                judge: "Cannings J" },
  { period: "October 2018",             judge: "Makail J" },
  { period: "December – January 2018/19", judge: "Shepherd J" },
]

export default function CourtCalendar2018() {
  return (
    <div>
      <PageHero
        badge="About the Courts"
        title="Court Calendar 2018"
        subtitle="The official 2018 sitting calendar for the Supreme Court and National Court of Papua New Guinea."
        crumbs={[{ label: "About the Courts", href: "/about" }, { label: "Court Calendar 2018" }]}
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />
      <SectionTabs section="about" />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="about" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Archive notice */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-8">
            <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-blue-800 leading-relaxed">
              This is an archived court calendar for the 2018 sitting year. For the current court year calendar and daily listings, refer to the <Link href="/about/daily-diary" className="font-semibold underline">Daily Court Diary</Link>.
            </p>
          </div>

          {/* Download */}
          <div className="bg-gray-900 rounded-xl p-4 flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-[13px]">Court Calendar 2018 — Official PDF</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Supreme Court & National Court · PNG Judiciary</p>
              </div>
            </div>
            <a href="#" className="shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-lg text-[12px] font-semibold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors">
              <Download className="w-3.5 h-3.5" /> Download PDF
            </a>
          </div>

          {/* Sitting Terms */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Sitting Terms 2018</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {SITTINGS.map((t) => (
                <div key={t.term} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[hsl(352,83%,44%)]/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-[hsl(352,83%,44%)]" />
                    </div>
                    <span className="font-bold text-gray-900 text-[14px]">{t.term}</span>
                    <span className="ml-auto text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{t.weeks} weeks</span>
                  </div>
                  <p className="text-sm text-gray-700 font-semibold mb-1">{t.period}</p>
                  <p className="text-[12px] text-gray-400">{t.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Public Holidays */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Public Holidays & Court Recesses 2018</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {HOLIDAYS.map((h, i) => (
                <div key={i} className={`flex items-center gap-6 px-5 py-3 text-sm ${i < HOLIDAYS.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}>
                  <span className="text-[12px] text-gray-500 w-32 shrink-0">{h.date}</span>
                  <span className="text-gray-800 font-medium">{h.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vacation Judges */}
          <div className="mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Vacation Judges 2018</h2>
            <p className="text-[12px] text-gray-500 mb-3">Judges assigned to deal with urgent vacation matters between terms.</p>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {VACATION_JUDGES.map((v, i) => (
                <div key={i} className={`flex items-center gap-6 px-5 py-3 text-sm ${i < VACATION_JUDGES.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}>
                  <span className="text-[12px] text-gray-600 w-52 shrink-0">{v.period}</span>
                  <span className="font-semibold text-gray-900">{v.judge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-right">
            <Link href="/about/daily-diary" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[hsl(352,83%,44%)] hover:underline">
              View current Daily Court Diary <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
