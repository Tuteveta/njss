import { ExternalLink, Lock, Globe, CheckCircle, ArrowRight, Shield, ChevronRight } from "lucide-react"
import Link from "next/link"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import SectionTabs from "@/components/SectionTabs"

const DATABASES = [
  {
    name: "PacLII",
    fullName: "Pacific Islands Legal Information Institute",
    url: "https://www.paclii.org",
    description: "Free access to primary legal materials from Pacific Island countries. Includes Supreme Court and National Court decisions from PNG, legislation, and related materials.",
    coverage: "PNG cases from 1975 · Full text · Free access",
    access: "public",
    tags: ["Case Law", "Legislation", "Free"],
    highlight: true,
  },
  {
    name: "PNG Online Legislation",
    fullName: "National Parliament of PNG — Legislation",
    url: "https://www.parliament.gov.pg",
    description: "Access to consolidated Acts of Parliament and subsidiary legislation from the National Parliament of Papua New Guinea.",
    coverage: "Current legislation · Consolidated versions",
    access: "public",
    tags: ["Legislation", "Free"],
    highlight: false,
  },
  {
    name: "AustLII",
    fullName: "Australasian Legal Information Institute",
    url: "https://www.austlii.edu.au",
    description: "Comprehensive free access to Australian, New Zealand, and Pacific legal materials. Useful for persuasive authority and comparative research.",
    coverage: "Australia, NZ, Pacific · Free access",
    access: "public",
    tags: ["Case Law", "Legislation", "Comparative"],
    highlight: false,
  },
  {
    name: "LexisNexis Pacific",
    fullName: "LexisNexis — Pacific Edition",
    url: "#",
    description: "Commercial legal database with comprehensive coverage of PNG, Australian, and New Zealand case law, legislation, and secondary legal sources.",
    coverage: "PNG & regional · Full text · Updated daily",
    access: "members",
    tags: ["Case Law", "Secondary Sources", "Members Only"],
    highlight: false,
  },
  {
    name: "Westlaw Australia",
    fullName: "Thomson Reuters Westlaw — Australia & Pacific",
    url: "#",
    description: "Comprehensive commercial legal database including case law, legislation, journals, and practice materials with advanced search tools.",
    coverage: "Regional · Full text · Advanced search",
    access: "members",
    tags: ["Case Law", "Journals", "Members Only"],
    highlight: false,
  },
  {
    name: "HeinOnline",
    fullName: "William S. Hein & Co. — Law Journal Library",
    url: "#",
    description: "The world's largest fully searchable collection of legal journals, law reviews, and bar association publications.",
    coverage: "International · Journals & law reviews",
    access: "members",
    tags: ["Journals", "International", "Members Only"],
    highlight: false,
  },
]

const ACCESS_TYPES = [
  {
    type: "public",
    label: "Free Public Access",
    desc: "Available to anyone with an internet connection — no membership required.",
    icon: Globe,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    type: "members",
    label: "Members Only",
    desc: "Access restricted to registered NJSS Library members. Use the library terminals or remote access with your member credentials.",
    icon: Lock,
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
]

const TAG_COLORS: Record<string, string> = {
  "Case Law":        "bg-blue-50 text-blue-700",
  "Legislation":     "bg-emerald-50 text-emerald-700",
  "Free":            "bg-green-50 text-green-700",
  "Comparative":     "bg-purple-50 text-purple-700",
  "Members Only":    "bg-amber-50 text-amber-700",
  "Secondary Sources": "bg-gray-100 text-gray-600",
  "Journals":        "bg-indigo-50 text-indigo-700",
  "International":   "bg-pink-50 text-pink-700",
}

export default function DatabasesPage() {
  const publicDBs  = DATABASES.filter(d => d.access === "public")
  const memberDBs  = DATABASES.filter(d => d.access === "members")

  return (
    <div>
      <PageHero
        badge="Court Library"
        crumbs={[
          { label: "Court Library", href: "/library/branch-libraries" },
          { label: "Library Databases" },
        ]}
        title="Library Databases"
        subtitle="Online legal databases available to NJSS Court Library members and the public — PNG case law, legislation, journals, and comparative materials."
        image="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=80"
      />
      <SectionTabs section="library" />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="library" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Access legend */}
          <div className="grid sm:grid-cols-2 gap-4">
            {ACCESS_TYPES.map(a => {
              const Icon = a.icon
              return (
                <div key={a.type} className={`rounded-xl border p-4 flex items-start gap-3 ${a.color}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-[13px]">{a.label}</p>
                    <p className="text-[12px] mt-0.5 opacity-80 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Free / Public Databases */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-emerald-600" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Free Public Databases</h2>
            </div>
            <div className="flex flex-col gap-4">
              {publicDBs.map(db => (
                <div key={db.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                  {db.highlight && (
                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full mb-3">
                      Recommended
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-gray-900 text-[15px]">{db.name}</span>
                        <span className="text-[12px] text-gray-400">{db.fullName}</span>
                      </div>
                      <p className="text-[12.5px] text-gray-500 leading-relaxed mb-3">{db.description}</p>
                      <p className="text-[11px] text-gray-400 mb-3">{db.coverage}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {db.tags.map(tag => (
                          <span key={tag} className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${TAG_COLORS[tag] ?? "bg-gray-100 text-gray-600"}`}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={db.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-lg text-[12px] font-semibold border border-gray-200 text-gray-700 hover:border-[hsl(352,83%,44%)] hover:text-[hsl(352,83%,44%)] transition-colors"
                    >
                      Visit <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Members-only databases */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-amber-500" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Members-Only Databases</h2>
            </div>
            <div className="flex flex-col gap-4">
              {memberDBs.map(db => (
                <div key={db.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-gray-900 text-[15px]">{db.name}</span>
                        <span className="text-[12px] text-gray-400">{db.fullName}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <Lock className="w-2.5 h-2.5" /> Members Only
                        </span>
                      </div>
                      <p className="text-[12.5px] text-gray-500 leading-relaxed mb-3">{db.description}</p>
                      <p className="text-[11px] text-gray-400 mb-3">{db.coverage}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {db.tags.filter(t => t !== "Members Only").map(tag => (
                          <span key={tag} className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${TAG_COLORS[tag] ?? "bg-gray-100 text-gray-600"}`}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href="/library/membership"
                      className="shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-lg text-[12px] font-semibold border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors"
                    >
                      Members Only
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access info */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-[14px]">How to Access Members-Only Databases</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">Three options for registered library members</p>
              </div>
            </div>
            <ul className="space-y-3 mb-5">
              {[
                "Visit any NJSS branch library and use the dedicated database terminals (no login required on-site)",
                "Log in remotely with your member credentials at the library portal (contact the library for your login)",
                "Request a research session with an NJSS librarian who can assist with database searches",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[12.5px] text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/library/membership"
                className="inline-flex items-center gap-2 h-9 px-5 rounded-lg text-[12px] font-semibold border border-gray-600 text-gray-200 hover:bg-white/5 transition-colors"
              >
                Apply for Membership <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact?dept=court-library"
                className="inline-flex items-center gap-2 h-9 px-5 rounded-lg text-[12px] font-semibold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors"
              >
                Database Access Help <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
