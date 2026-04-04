import Link from "next/link"
import { Briefcase, FileText, Clock, CheckCircle, AlertTriangle, ArrowRight, Download, Mail, Phone } from "lucide-react"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import SectionTabs from "@/components/SectionTabs"

const CURRENT_TENDERS = [
  {
    ref: "NJSS-T-001-2025",
    title: "Supply and Delivery of Office Furniture and Equipment — Waigani Complex",
    category: "Goods",
    value: "PGK 250,000 – 500,000",
    issued: "10 March 2025",
    closes: "10 April 2025",
    status: "Open",
  },
  {
    ref: "NJSS-T-002-2025",
    title: "Provision of Security Services — Waigani Court Complex and Provincial Registries",
    category: "Services",
    value: "PGK 500,000 – 1,000,000",
    issued: "15 March 2025",
    closes: "15 April 2025",
    status: "Open",
  },
  {
    ref: "NJSS-T-003-2025",
    title: "Renovation and Refurbishment of Mt Hagen National Court Registry",
    category: "Works",
    value: "PGK 800,000 – 1,500,000",
    issued: "20 March 2025",
    closes: "20 April 2025",
    status: "Open",
  },
  {
    ref: "NJSS-T-004-2025",
    title: "Supply of ICT Equipment and Software Licences",
    category: "Goods",
    value: "PGK 150,000 – 300,000",
    issued: "1 March 2025",
    closes: "28 March 2025",
    status: "Closed",
  },
]

const PROCESS_STEPS = [
  { step: "01", title: "Notice Published",      desc: "Tenders are advertised in the Post-Courier, National newspaper, and on this website." },
  { step: "02", title: "Obtain Tender Documents", desc: "Collect tender documents from the NJSS Procurement Unit at Waigani or download from this page." },
  { step: "03", title: "Attend Briefing",        desc: "Attend the mandatory pre-bid briefing (where applicable) at the date and time specified in the tender notice." },
  { step: "04", title: "Submit Tender",          desc: "Lodge sealed tenders in the NJSS Tender Box at Waigani Court Complex before the closing date and time." },
  { step: "05", title: "Evaluation",             desc: "The Tenders Board evaluates submissions against the published criteria. Tenderers will be notified of the outcome." },
]

const STATUS_COLORS: Record<string, string> = {
  Open:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Closed: "bg-gray-100 text-gray-500 border-gray-200",
  Awarded:"bg-blue-50 text-blue-700 border-blue-200",
}

const CAT_COLORS: Record<string, string> = {
  Goods:    "bg-amber-50 text-amber-700",
  Services: "bg-blue-50 text-blue-700",
  Works:    "bg-purple-50 text-purple-700",
}

export default function TendersBoardPage() {
  return (
    <div>
      <PageHero
        badge="About the Courts"
        title="NJSS Tenders Board"
        subtitle="Procurement of goods, services, and works for the NJSS in compliance with the Public Finances (Management) Act 1995."
        crumbs={[{ label: "About the Courts", href: "/about" }, { label: "NJSS Tenders Board" }]}
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />
      <SectionTabs section="about" />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="about" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Current Tenders */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Current Tenders</h2>
              <span className="text-[11px] text-gray-400">{CURRENT_TENDERS.filter(t => t.status === "Open").length} open</span>
            </div>
            <div className="flex flex-col gap-4">
              {CURRENT_TENDERS.map(tender => (
                <div key={tender.ref} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] text-gray-400">{tender.ref}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CAT_COLORS[tender.category] ?? "bg-gray-100 text-gray-600"}`}>{tender.category}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[tender.status]}`}>{tender.status}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-[14px] leading-snug mb-3">{tender.title}</h3>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11.5px] text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {tender.value}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Issued {tender.issued}</span>
                    <span className={`flex items-center gap-1 font-semibold ${tender.status === "Open" ? "text-[hsl(352,83%,44%)]" : "text-gray-400"}`}>
                      <Clock className="w-3 h-3" /> Closes {tender.closes}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a href="#" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[hsl(352,83%,44%)] hover:underline">
                      <Download className="w-3.5 h-3.5" /> Download Tender Documents
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">How to Tender</h2>
            <div className="flex flex-col gap-3">
              {PROCESS_STEPS.map(s => (
                <div key={s.step} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4 hover:border-gray-300 transition-colors">
                  <div className="text-2xl font-extrabold text-gray-100 leading-none shrink-0 w-9 text-center">{s.step}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-[13.5px] mb-1">{s.title}</p>
                    <p className="text-[12px] text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-semibold text-amber-800 mb-1">Important Rules for Tenderers</p>
              <ul className="space-y-1">
                {[
                  "Late submissions will not be accepted under any circumstances",
                  "Tenderers must not approach Board members directly — doing so will disqualify the tender",
                  "All tenders must be submitted in a sealed envelope clearly marked with the tender reference number",
                  "The NJSS is not bound to accept the lowest or any tender",
                ].map(rule => (
                  <li key={rule} className="flex items-start gap-2 text-[12px] text-amber-800">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" /> {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gray-900 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-[13px] mb-0.5">Tenders Board Secretariat</p>
              <div className="flex flex-wrap gap-3 text-[11.5px] mt-2">
                <a href="tel:+67532579015" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"><Phone className="w-3 h-3" /> +675 325 7915</a>
                <a href="mailto:tenders@judiciary.gov.pg" className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"><Mail className="w-3 h-3" /> tenders@judiciary.gov.pg</a>
              </div>
            </div>
            <Link href="/contact?dept=tenders-board" className="shrink-0 inline-flex items-center gap-2 h-9 px-5 rounded-lg text-[12px] font-semibold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors">
              Submit Enquiry <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
