import Link from "next/link"
import { Scale, Users, Building2 } from "lucide-react"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import SectionTabs from "@/components/SectionTabs"

const SUPREME_COURT_JUDGES = [
  { name: "Hon. Sir Gibbs Salika",       title: "Chief Justice",                    appointed: "2017", division: "Full Court" },
  { name: "Hon. Justice Gibuma Gora",    title: "Deputy Chief Justice",             appointed: "2018", division: "Full Court" },
  { name: "Hon. Justice Ambeng Kandakasi", title: "Justice of the Supreme Court",   appointed: "2004", division: "Full Court" },
  { name: "Hon. Justice Hartshorn",      title: "Justice of the Supreme Court",     appointed: "2011", division: "Full Court" },
  { name: "Hon. Justice Murray",         title: "Justice of the Supreme Court",     appointed: "2012", division: "Full Court" },
  { name: "Hon. Justice Cannings",       title: "Justice of the Supreme Court",     appointed: "2010", division: "Full Court" },
  { name: "Hon. Justice Shepherd",       title: "Justice of the Supreme Court",     appointed: "2014", division: "Full Court" },
  { name: "Hon. Justice Makail",         title: "Justice of the Supreme Court",     appointed: "2013", division: "Full Court" },
]

const NATIONAL_COURT_JUDGES = [
  { name: "Hon. Justice Dingake",        title: "Judge of the National Court",      appointed: "2015", division: "Civil" },
  { name: "Hon. Justice Miviri",         title: "Judge of the National Court",      appointed: "2016", division: "Criminal" },
  { name: "Hon. Justice Carey",          title: "Judge of the National Court",      appointed: "2018", division: "OS/General" },
  { name: "Hon. Justice Narokobi",       title: "Judge of the National Court",      appointed: "2019", division: "Commercial" },
  { name: "Hon. Justice Kassman",        title: "Judge of the National Court",      appointed: "2012", division: "Family" },
  { name: "Hon. Justice Anis",           title: "Judge of the National Court",      appointed: "2020", division: "Criminal" },
  { name: "Hon. Justice Gavara-Nanu",    title: "Judge of the National Court",      appointed: "2007", division: "Civil" },
  { name: "Hon. Justice Toliken",        title: "Judge of the National Court",      appointed: "2010", division: "Criminal" },
  { name: "Hon. Justice Berrigan",       title: "Judge of the National Court",      appointed: "2018", division: "Civil" },
  { name: "Hon. Justice Kaumi",          title: "Judge of the National Court",      appointed: "2011", division: "OS/General" },
]

const DIVISION_COLORS: Record<string, string> = {
  "Full Court":  "bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)]",
  "Civil":       "bg-blue-50 text-blue-700",
  "Criminal":    "bg-red-50 text-red-700",
  "Commercial":  "bg-emerald-50 text-emerald-700",
  "Family":      "bg-purple-50 text-purple-700",
  "OS/General":  "bg-gray-100 text-gray-600",
}

function JudgeCard({ judge }: { judge: { name: string; title: string; appointed: string; division: string } }) {
  const initials = judge.name.replace(/^Hon\.\s*(Justice|Sir)\s*/, "").split(" ").map(n => n[0]).slice(0, 2).join("")
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 hover:border-gray-300 transition-colors">
      <div className="w-10 h-10 rounded-full bg-[hsl(352,83%,44%)]/10 flex items-center justify-center shrink-0 text-[hsl(352,83%,44%)] font-bold text-[13px]">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-[13.5px] leading-snug">{judge.name}</p>
        <p className="text-[11.5px] text-gray-500 mt-0.5">{judge.title}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIVISION_COLORS[judge.division] ?? "bg-gray-100 text-gray-600"}`}>
            {judge.division}
          </span>
          <span className="text-[10px] text-gray-400">Appointed {judge.appointed}</span>
        </div>
      </div>
    </div>
  )
}

export default function JudgesPage() {
  return (
    <div>
      <PageHero
        badge="About the Courts"
        title="Judges"
        subtitle="Current judicial appointments of the Supreme Court and National Court of Papua New Guinea."
        crumbs={[{ label: "About the Courts", href: "/about" }, { label: "Judges" }]}
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />
      <SectionTabs section="about" />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="about" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Supreme Court Judges", count: SUPREME_COURT_JUDGES.length, icon: Scale, color: "bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)]" },
              { label: "National Court Judges", count: NATIONAL_COURT_JUDGES.length, icon: Users, color: "bg-blue-50 text-blue-700" },
              { label: "Total Judicial Officers", count: SUPREME_COURT_JUDGES.length + NATIONAL_COURT_JUDGES.length, icon: Building2, color: "bg-gray-100 text-gray-700" },
            ].map(stat => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2 ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-extrabold text-gray-900">{stat.count}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5 leading-tight">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Supreme Court */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[hsl(352,83%,44%)]" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Supreme Court</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {SUPREME_COURT_JUDGES.map(j => <JudgeCard key={j.name} judge={j} />)}
            </div>
          </div>

          {/* National Court */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-700" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500">National Court</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {NATIONAL_COURT_JUDGES.map(j => <JudgeCard key={j.name} judge={j} />)}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-start gap-3">
            <Scale className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-[12px] text-gray-600 leading-relaxed">
              Judges of the Supreme Court are appointed by the Head of State on the advice of the Judicial and Legal Services Commission in accordance with the Constitution of Papua New Guinea and the Judicial Services Act 1999. This list reflects current appointments and may be updated as new appointments are made.
            </p>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
