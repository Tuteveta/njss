import { BookOpen, ArrowRight, Lightbulb, List, FileSearch, Scale, Globe, ChevronRight } from "lucide-react"
import Link from "next/link"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import SectionTabs from "@/components/SectionTabs"

const RESEARCH_GUIDES = [
  {
    title: "How to Research PNG Case Law",
    description: "A step-by-step guide to finding case law from the Supreme Court and National Court of Papua New Guinea, including how to use NJSS databases and PacLII.",
    level: "Beginner",
    icon: FileSearch,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Researching PNG Legislation",
    description: "How to locate and interpret Acts of Parliament, subsidiary legislation, and constitutional provisions applicable in Papua New Guinea.",
    level: "Beginner",
    icon: Scale,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Legal Citation in PNG",
    description: "The standard citation format used in Papua New Guinea courts — how to cite cases, legislation, secondary sources, and international materials.",
    level: "Intermediate",
    icon: List,
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Comparative & International Law Research",
    description: "Strategies for finding persuasive authorities from other common law jurisdictions — Australia, UK, New Zealand, and the Pacific Islands.",
    level: "Intermediate",
    icon: Globe,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Advanced Legal Research Methodology",
    description: "In-depth coverage of Boolean search operators, advanced database searching, secondary source analysis, and constructing a comprehensive research memorandum.",
    level: "Advanced",
    icon: BookOpen,
    color: "bg-red-50 text-red-500",
  },
]

const LEVEL_COLORS: Record<string, string> = {
  Beginner:     "text-emerald-700 bg-emerald-50 border-emerald-200",
  Intermediate: "text-blue-700 bg-blue-50 border-blue-200",
  Advanced:     "text-red-700 bg-red-50 border-red-200",
}

const INDEXES = [
  {
    name: "PNG Case Law Index",
    description: "Subject and party-name index to Supreme Court and National Court decisions from 1975 to present.",
    coverage: "1975 – present",
    format: "Print & digital",
  },
  {
    name: "PNG Legislation Index",
    description: "Alphabetical and subject index to all Acts of Parliament and subsidiary legislation in force in Papua New Guinea.",
    coverage: "Current",
    format: "Digital",
  },
  {
    name: "Words & Phrases — PNG Edition",
    description: "Judicial definitions of legal words and phrases as interpreted by PNG courts, with citations.",
    coverage: "1980 – present",
    format: "Print",
  },
  {
    name: "PNG Digest of Cases",
    description: "Topical digest of headnotes from reported PNG decisions organised by area of law.",
    coverage: "1975 – 2020",
    format: "Print",
  },
]

const TIPS = [
  {
    icon: "01",
    title: "Start with a finding tool",
    body: "Use the PNG Case Law Index or PacLII to identify relevant cases before accessing the full text in a database.",
  },
  {
    icon: "02",
    title: "Check the currency of legislation",
    body: "Always verify that the version of an Act you are reading is current. Use the PNG Legislation Database for up-to-date consolidated versions.",
  },
  {
    icon: "03",
    title: "Use citators to check cases",
    body: "Before relying on a decision, use a citator to confirm it has not been overruled, distinguished, or appealed.",
  },
  {
    icon: "04",
    title: "Ask the library",
    body: "NJSS librarians are qualified legal research specialists. Request a research consultation if you are having difficulty finding authoritative sources.",
  },
]

export default function ResearchToolsPage() {
  return (
    <div>
      <PageHero
        badge="Court Library"
        crumbs={[
          { label: "Court Library", href: "/library/branch-libraries" },
          { label: "Legal Research Tools" },
        ]}
        title="Legal Research Tools"
        subtitle="Guides, indexes, and resources to help legal practitioners, students, and researchers conduct effective legal research in Papua New Guinea."
        image="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=80"
      />
      <SectionTabs section="library" />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="library" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Research Guides */}
          <div>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Research Guides</h2>
                <p className="text-sm text-gray-500 mt-0.5">Step-by-step guides for researching PNG law at every level</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {RESEARCH_GUIDES.map(guide => {
                const Icon = guide.icon
                return (
                  <div key={guide.title} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:border-gray-300 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${guide.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-gray-900 text-[14px]">{guide.title}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${LEVEL_COLORS[guide.level]}`}>
                          {guide.level}
                        </span>
                      </div>
                      <p className="text-[12.5px] text-gray-500 leading-relaxed">{guide.description}</p>
                    </div>
                    <Link
                      href="/contact?dept=court-library"
                      className="shrink-0 inline-flex items-center gap-1 text-[12px] font-semibold text-[hsl(352,83%,44%)] hover:underline mt-1 whitespace-nowrap"
                    >
                      Request <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Indexes */}
          <div>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <List className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Legal Indexes & Finding Aids</h2>
                <p className="text-sm text-gray-500 mt-0.5">Indexes held in the NJSS Court Library collection</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {INDEXES.map(index => (
                <div key={index.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                  <h3 className="font-bold text-gray-900 text-[14px] mb-1.5">{index.name}</h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed mb-4">{index.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                    <span><span className="font-semibold text-gray-600">Coverage:</span> {index.coverage}</span>
                    <span><span className="font-semibold text-gray-600">Format:</span> {index.format}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Tips */}
          <div>
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Research Tips</h2>
                <p className="text-sm text-gray-500 mt-0.5">Best practices for effective legal research in PNG</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {TIPS.map(tip => (
                <div key={tip.icon} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 hover:border-gray-300 transition-colors">
                  <div className="text-2xl font-extrabold text-gray-100 leading-none shrink-0 w-9 text-center">{tip.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-[13.5px] mb-1">{tip.title}</h3>
                    <p className="text-[12px] text-gray-500 leading-relaxed">{tip.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Research Consultation CTA */}
          <div className="bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-bold text-white text-[14px]">Book a Research Consultation</p>
                <p className="text-[12px] text-gray-400 mt-0.5">NJSS librarians offer one-on-one research sessions for practitioners and students.</p>
              </div>
            </div>
            <Link
              href="/contact?dept=court-library"
              className="shrink-0 inline-flex items-center gap-2 h-10 px-6 rounded-lg text-[13px] font-semibold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors"
            >
              Book a Session <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
