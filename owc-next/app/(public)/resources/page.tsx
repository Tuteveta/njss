"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileText, BookOpen, BarChart2, Scale, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from "lucide-react"
import PageHero from "@/components/PageHero"
import ScrollNav from "@/components/ScrollNav"

// ── Types ─────────────────────────────────────────────────────────────────────
interface FAQ { id: number; question: string; answer: string }
interface Doc {
  id: number
  title: string
  category: string
  url: string
  originalName: string
  fileSize: number
  uploadedAt: string
}

// ── Sections ──────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "forms",       label: "Claim Forms" },
  { id: "guides",      label: "Guides & Publications" },
  { id: "reports",     label: "Reports & Statistics" },
  { id: "legislation", label: "Legislation" },
  { id: "faq",         label: "FAQs" },
]

// ── Fallback data (shown when backend has no entries yet) ─────────────────────
const FALLBACK_FORMS: Doc[] = [
  { id: 1, title: "WCA Form 1 — Employee's Claim for Compensation",       category: "Form", url: "#", originalName: "WCA-Form-1.pdf",      fileSize: 214016,  uploadedAt: "" },
  { id: 2, title: "WCA Form 2 — Employer's Report of Work-Related Injury", category: "Form", url: "#", originalName: "WCA-Form-2.pdf",      fileSize: 187392,  uploadedAt: "" },
  { id: 3, title: "WCA Form 3 — Medical Certificate & Assessment Report",  category: "Form", url: "#", originalName: "WCA-Form-3.pdf",      fileSize: 229376,  uploadedAt: "" },
  { id: 4, title: "WCA Form 4 — Application for Rehabilitation Services",  category: "Form", url: "#", originalName: "WCA-Form-4.pdf",      fileSize: 196608,  uploadedAt: "" },
  { id: 5, title: "WCA Form 5 — Employer Registration Form",              category: "Form", url: "#", originalName: "WCA-Form-5.pdf",      fileSize: 172032,  uploadedAt: "" },
]

const FALLBACK_GUIDES: Doc[] = [
  { id: 6,  title: "Worker's Guide to Filing a Compensation Claim (2025)",          category: "Guide", url: "#", originalName: "OWC-Workers-Guide-2025.pdf",         fileSize: 1572864, uploadedAt: "" },
  { id: 7,  title: "Employer's Handbook on Workers Compensation Obligations (2025)", category: "Guide", url: "#", originalName: "OWC-Employer-Handbook-2025.pdf",        fileSize: 2097152, uploadedAt: "" },
  { id: 8,  title: "Rehabilitation & Return-to-Work Guidelines 2024",               category: "Guide", url: "#", originalName: "OWC-Rehab-Guidelines-2024.pdf",         fileSize: 1310720, uploadedAt: "" },
  { id: 9,  title: "Understanding Medical Benefits Under Workers Compensation",      category: "Guide", url: "#", originalName: "OWC-Medical-Benefits-Guide.pdf",        fileSize: 983040,  uploadedAt: "" },
]

const FALLBACK_REPORTS: Doc[] = [
  { id: 10, title: "OWC Annual Report 2025",           category: "Report", url: "#", originalName: "OWC-Annual-Report-2025.pdf",         fileSize: 5242880, uploadedAt: "" },
  { id: 11, title: "OWC Statistical Bulletin Q4 2025", category: "Report", url: "#", originalName: "OWC-Statistical-Bulletin-Q4-2025.pdf", fileSize: 2621440, uploadedAt: "" },
  { id: 12, title: "OWC Annual Report 2024",           category: "Report", url: "#", originalName: "OWC-Annual-Report-2024.pdf",         fileSize: 4718592, uploadedAt: "" },
]

const FALLBACK_LEGISLATION: Doc[] = [
  { id: 13, title: "Workers' Compensation Act 1978 (Consolidated 2023)",          category: "Regulation", url: "#", originalName: "WC-Act-1978-Consolidated-2023.pdf",        fileSize: 3670016, uploadedAt: "" },
  { id: 14, title: "Workers' Compensation (Medical Fees) Regulation 2025",        category: "Regulation", url: "#", originalName: "WC-Medical-Fees-Regulation-2025.pdf",       fileSize: 1048576, uploadedAt: "" },
  { id: 15, title: "Workers' Compensation (Claims Procedures) Regulation 2022",   category: "Regulation", url: "#", originalName: "WC-Claims-Procedures-Regulation-2022.pdf",  fileSize: 1310720, uploadedAt: "" },
]

const FALLBACK_FAQS: FAQ[] = [
  { id: 1, question: "Is compensation mandatory for all employers?",            answer: "Yes. All employers are required by law to insure their employees against work-related injury or death under the Workers' Compensation Act 1978." },
  { id: 2, question: "Can compensation be claimed for casual or informal workers?", answer: "Eligibility depends on the employment arrangement. OWC will assess each case individually — contact your nearest Provincial Labour Office or OWC HQ for guidance." },
  { id: 3, question: "How long does a claim take to be processed?",             answer: "Most claims are resolved within 60–90 days, depending on the completeness of documentation and availability of medical reports." },
  { id: 4, question: "Who is eligible for workers compensation?",               answer: "Any worker employed under a contract of service in PNG who suffers injury, disease, or death arising out of and in the course of employment is eligible." },
  { id: 5, question: "How long do I have to file a claim?",                     answer: "Claims must be lodged within 12 months of the injury date. Latent injury claims must be filed within 3 years of diagnosis." },
  { id: 6, question: "What if my employer refuses to report my injury?",        answer: "You can report directly to OWC. We will investigate and assist you in pursuing your claim." },
  { id: 7, question: "Do I need a lawyer to file a claim?",                     answer: "No, you can file directly with OWC. However, for complex disputes you may choose to engage legal representation." },
  { id: 8, question: "How is compensation calculated?",                         answer: "Weekly benefits are based on your pre-injury earnings. Lump sum amounts depend on the degree of permanent disability as assessed by a certified medical board." },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatSize(bytes: number) {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function isMockUrl(url: string) { return !url || url === "#" }

// ── Sub-components ────────────────────────────────────────────────────────────
function FaqItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${open ? "border-[hsl(210,70%,25%)]/30 shadow-sm" : "border-gray-100"}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${open ? "bg-[hsl(210,70%,25%)]/5" : "bg-white hover:bg-gray-50"}`}
      >
        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${open ? "bg-[hsl(210,70%,25%)] text-white" : "bg-gray-100 text-gray-500"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`flex-1 font-semibold text-sm leading-snug ${open ? "text-[hsl(210,70%,18%)]" : "text-gray-900"}`}>{faq.question}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-[hsl(210,70%,25%)] shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-3 text-sm text-gray-600 leading-relaxed border-t border-[hsl(210,70%,25%)]/10 bg-white">
          <div className="pl-11">{faq.answer}</div>
        </div>
      )}
    </div>
  )
}

function DocCard({ doc, accent = "red" }: { doc: Doc; accent?: "red" | "blue" | "emerald" | "purple" }) {
  const colors = {
    red:     { bg: "bg-red-50",     icon: "text-red-400" },
    blue:    { bg: "bg-blue-50",    icon: "text-blue-500" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-600" },
    purple:  { bg: "bg-purple-50",  icon: "text-purple-500" },
  }
  const c = colors[accent]
  const mock = isMockUrl(doc.url)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
        <FileText className={`w-5 h-5 ${c.icon}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-gray-900 leading-snug">{doc.title}</div>
        <div className="text-[11px] text-gray-400 mt-0.5 truncate">{doc.originalName}</div>
        {doc.fileSize > 0 && <div className="text-[11px] text-gray-400 mt-0.5">PDF · {formatSize(doc.fileSize)}</div>}
      </div>
      {mock ? (
        <Link
          href="/contact"
          className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(210,70%,25%)] hover:underline mt-0.5"
          title="Contact OWC to request this document"
        >
          Request <ArrowRight className="w-3 h-3" />
        </Link>
      ) : (
        <a
          href={doc.url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:border-[hsl(210,70%,25%)] hover:bg-[hsl(210,70%,25%)]/5 transition-colors"
          title="Download"
        >
          <Download className="w-3.5 h-3.5 text-gray-500" />
        </a>
      )}
    </div>
  )
}

function SectionHeader({ icon: Icon, label, description, color = "blue" }: {
  icon: React.ElementType; label: string; description: string; color?: string
}) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className={`w-11 h-11 rounded-xl bg-${color}-50 flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-900">{label}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Resources() {
  const [faqs,       setFaqs]       = useState<FAQ[]>(FALLBACK_FAQS)
  const [forms,      setForms]      = useState<Doc[]>(FALLBACK_FORMS)
  const [guides,     setGuides]     = useState<Doc[]>(FALLBACK_GUIDES)
  const [reports,    setReports]    = useState<Doc[]>(FALLBACK_REPORTS)
  const [legislation,setLegislation]= useState<Doc[]>(FALLBACK_LEGISLATION)

  useEffect(() => {
    fetch("/api/faqs")
      .then(r => r.json())
      .then((d: { faqs?: FAQ[] }) => { if (d.faqs?.length) setFaqs(d.faqs) })
      .catch(() => {})

    fetch("/api/documents")
      .then(r => r.json())
      .then((d: { documents?: Doc[] }) => {
        const docs = d.documents ?? []
        const f = docs.filter(doc => doc.category === "Form" || doc.category === "Forms")
        const g = docs.filter(doc => doc.category === "Guide" || doc.category === "Guides" || doc.category === "Publication")
        const r = docs.filter(doc => doc.category === "Report" || doc.category === "Reports")
        const l = docs.filter(doc => doc.category === "Regulation" || doc.category === "Policy")
        if (f.length) setForms(f)
        if (g.length) setGuides(g)
        if (r.length) setReports(r)
        if (l.length) setLegislation(l)
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      <PageHero
        badge="Downloads & Info"
        title="Resources & Forms"
        subtitle="Download official OWC claim forms, guides, reports and legislation. Find answers to frequently asked questions about workers compensation in PNG."
        crumbs={[{ label: "Resources" }]}
        image="https://images.unsplash.com/photo-1568667256549-094345857637?w=1920&q=80"
      />

      <ScrollNav sections={SECTIONS} />

      {/* Claim Forms */}
      <section id="forms" className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            icon={FileText}
            label="Downloadable Claim Forms"
            description="Official OWC forms for lodging compensation claims, reporting injuries, and employer registration. All forms are in PDF format."
            color="red"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {forms.map(f => <DocCard key={f.id} doc={f} accent="red" />)}
          </div>
          <p className="mt-5 text-xs text-gray-400">
            Need help completing a form? <Link href="/contact" className="text-[hsl(210,70%,25%)] hover:underline font-medium">Contact an OWC case officer →</Link>
          </p>
        </div>
      </section>

      {/* Guides & Publications */}
      <section id="guides" className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            icon={BookOpen}
            label="Guides & Publications"
            description="Plain-language guides for workers and employers on compensation entitlements, claim procedures, and rehabilitation services."
            color="blue"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {guides.map(g => <DocCard key={g.id} doc={g} accent="blue" />)}
          </div>
        </div>
      </section>

      {/* Reports & Statistics */}
      <section id="reports" className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            icon={BarChart2}
            label="Reports & Statistics"
            description="OWC annual reports, statistical bulletins, and performance data on workers compensation claims across Papua New Guinea."
            color="emerald"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reports.map(r => <DocCard key={r.id} doc={r} accent="emerald" />)}
          </div>
        </div>
      </section>

      {/* Legislation */}
      <section id="legislation" className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            icon={Scale}
            label="Legislation & Regulations"
            description="The primary legislation governing workers compensation in Papua New Guinea, including the Workers' Compensation Act 1978 and subsidiary regulations."
            color="purple"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {legislation.map(l => <DocCard key={l.id} doc={l} accent="purple" />)}
          </div>
          <div className="mt-6 bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-3">
            <Scale className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-xs text-purple-700 leading-relaxed">
              The full text of the Workers' Compensation Act 1978 is also available via the{" "}
              <a href="https://www.paclii.org" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                Pacific Islands Legal Information Institute (PacLII)
              </a>.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-14 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-start gap-4 mb-8">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
              <p className="text-sm text-gray-500 mt-0.5">Common questions about workers compensation in Papua New Guinea.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {faqs.map((f, i) => <FaqItem key={f.id} faq={f} index={i} />)}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-3">Can't find what you're looking for?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-semibold bg-[hsl(210,70%,22%)] hover:bg-[hsl(210,70%,18%)] text-white transition-colors"
            >
              Contact OWC <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
