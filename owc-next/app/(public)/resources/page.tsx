"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  { id: "forms",       label: "Court Forms" },
  { id: "guides",      label: "Guides & Publications" },
  { id: "reports",     label: "Reports & Statistics" },
  { id: "legislation", label: "Legislation" },
  { id: "faq",         label: "FAQs" },
]

// ── Fallback data (shown when backend has no entries yet) ─────────────────────
const FALLBACK_FORMS: Doc[] = [
  { id: 1, title: "SC Form 1 — Notice of Appeal (Supreme Court)",             category: "Form", url: "#", originalName: "SC-Form-1-Notice-of-Appeal.pdf",      fileSize: 214016,  uploadedAt: "" },
  { id: 2, title: "SC Form 2 — Application for Leave to Appeal",              category: "Form", url: "#", originalName: "SC-Form-2-Leave-to-Appeal.pdf",        fileSize: 187392,  uploadedAt: "" },
  { id: 3, title: "NC Form 1 — Writ of Summons (National Court)",             category: "Form", url: "#", originalName: "NC-Form-1-Writ-of-Summons.pdf",        fileSize: 229376,  uploadedAt: "" },
  { id: 4, title: "NC Form 2 — Statement of Claim",                           category: "Form", url: "#", originalName: "NC-Form-2-Statement-of-Claim.pdf",     fileSize: 196608,  uploadedAt: "" },
  { id: 5, title: "NC Form 3 — Notice of Motion",                             category: "Form", url: "#", originalName: "NC-Form-3-Notice-of-Motion.pdf",       fileSize: 172032,  uploadedAt: "" },
  { id: 6, title: "Registry Form — Request for Certified Copy of Judgment",   category: "Form", url: "#", originalName: "Registry-Certified-Copy-Request.pdf",  fileSize: 158720,  uploadedAt: "" },
]

const FALLBACK_GUIDES: Doc[] = [
  { id: 7,  title: "Guide to Filing in the National Court (2025)",            category: "Guide", url: "#", originalName: "NJSS-National-Court-Filing-Guide-2025.pdf",  fileSize: 1572864, uploadedAt: "" },
  { id: 8,  title: "Self-Represented Litigants Handbook (2025)",              category: "Guide", url: "#", originalName: "NJSS-Self-Rep-Handbook-2025.pdf",             fileSize: 2097152, uploadedAt: "" },
  { id: 9,  title: "Guide to Mediation & Alternative Dispute Resolution",     category: "Guide", url: "#", originalName: "NJSS-Mediation-Guide-2024.pdf",               fileSize: 1310720, uploadedAt: "" },
  { id: 10, title: "Court Fees Schedule 2025",                                category: "Guide", url: "#", originalName: "NJSS-Court-Fees-Schedule-2025.pdf",           fileSize: 983040,  uploadedAt: "" },
]

const FALLBACK_REPORTS: Doc[] = [
  { id: 11, title: "NJSS Annual Report 2025",               category: "Report", url: "#", originalName: "NJSS-Annual-Report-2025.pdf",          fileSize: 5242880, uploadedAt: "" },
  { id: 12, title: "PNG Judiciary Statistical Bulletin Q4 2025", category: "Report", url: "#", originalName: "NJSS-Statistical-Bulletin-Q4-2025.pdf", fileSize: 2621440, uploadedAt: "" },
  { id: 13, title: "NJSS Annual Report 2024",               category: "Report", url: "#", originalName: "NJSS-Annual-Report-2024.pdf",          fileSize: 4718592, uploadedAt: "" },
]

const FALLBACK_LEGISLATION: Doc[] = [
  { id: 14, title: "Supreme Court Act (Chapter 37)",                          category: "Regulation", url: "#", originalName: "Supreme-Court-Act-Ch37.pdf",            fileSize: 3670016, uploadedAt: "" },
  { id: 15, title: "National Court Act (Chapter 38)",                         category: "Regulation", url: "#", originalName: "National-Court-Act-Ch38.pdf",           fileSize: 1048576, uploadedAt: "" },
  { id: 16, title: "National Judicial Staff Service Act 1987",                category: "Regulation", url: "#", originalName: "NJSS-Act-1987.pdf",                     fileSize: 1310720, uploadedAt: "" },
  { id: 17, title: "Evidence Act (Chapter 48)",                               category: "Regulation", url: "#", originalName: "Evidence-Act-Ch48.pdf",                 fileSize: 983040,  uploadedAt: "" },
]

const FALLBACK_FAQS: FAQ[] = [
  { id: 1, question: "How do I file a matter in the National Court?",         answer: "You can file in person at any National Court Registry. Complete the relevant court form, attach supporting documents, and pay the applicable filing fee. Registry staff can assist with the process." },
  { id: 2, question: "Where is the Waigani Court Complex?",                   answer: "The Waigani Court Complex is located on Waigani Drive, Waigani, National Capital District. It houses the Supreme Court and National Court Head Registry." },
  { id: 3, question: "How can I get a certified copy of a court order?",      answer: "Submit a Request for Certified Copy form at the Registry, pay the applicable fee, and allow 3–5 business days for processing. Contact the Registry for current fee schedules." },
  { id: 4, question: "Can I represent myself in the National Court?",         answer: "Yes. Self-represented litigants are entitled to appear before the National Court. Download our Self-Represented Litigants Handbook for guidance on court procedures and filing requirements." },
  { id: 5, question: "How do I find out when my case is listed?",             answer: "Check the Daily Court Diary on this website or contact the relevant Registry with your case number. You can also check directly with the associate of the presiding judge." },
  { id: 6, question: "What are the court filing fees?",                       answer: "Filing fees vary by matter type and court. Download the current Court Fees Schedule from the Resources section or contact the Registry for the latest fee information." },
  { id: 7, question: "How do I appeal a National Court decision?",            answer: "Appeals from the National Court lie to the Supreme Court. You must file a Notice of Appeal (SC Form 1) within the prescribed time limit — generally 40 days from the date of judgment. Legal advice is strongly recommended." },
  { id: 8, question: "How do I contact a specific Registry?",                 answer: "Contact details for all NJSS registries are listed on the Contact Us page. The Waigani Head Registry can be reached on +675 325 7902 or info@judiciary.gov.pg." },
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
function FaqItem({ faq }: { faq: FAQ }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${open ? "border-[hsl(352,83%,44%)]/25 bg-white" : "border-gray-200 bg-white hover:border-gray-300"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className={`flex-1 font-semibold text-[15px] leading-snug transition-colors ${open ? "text-[hsl(352,83%,38%)]" : "text-gray-800"}`}>
          {faq.question}
        </span>
        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${open ? "bg-[hsl(352,83%,44%)] text-white" : "bg-gray-100 text-gray-400"}`} aria-hidden="true">
          {open
            ? <ChevronUp className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">
          <div className="pt-4 border-t border-gray-100">{faq.answer}</div>
        </div>
      )}
    </div>
  )
}

function DocCard({ doc, accent = "red" }: { doc: Doc; accent?: "red" | "blue" | "emerald" | "purple" }) {
  const colors = {
    red:     { bg: "bg-red-50",     icon: "text-red-400" },
    blue:    { bg: "bg-red-50",     icon: "text-blue-500" },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-600" },
    purple:  { bg: "bg-purple-50",  icon: "text-purple-500" },
  }
  const c = colors[accent]
  const mock = isMockUrl(doc.url)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 hover:border-gray-300 transition-all">
      <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
        <FileText className={`w-5 h-5 ${c.icon}`} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-gray-900 leading-snug">{doc.title}</div>
        <div className="text-[11px] text-gray-400 mt-0.5 truncate">{doc.originalName}</div>
        {doc.fileSize > 0 && <div className="text-[11px] text-gray-400 mt-0.5">PDF · {formatSize(doc.fileSize)}</div>}
      </div>
      {mock ? (
        <Link
          href="/contact"
          className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(352,83%,48%)] hover:underline mt-0.5"
          title="Contact the Registry to request this document"
        >
          Request <ArrowRight className="w-3 h-3" />
        </Link>
      ) : (
        <a
          href={doc.url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:border-[hsl(352,83%,48%)] hover:bg-[hsl(352,83%,48%)]/5 transition-colors"
          title="Download"
          aria-label={`Download ${doc.title}`}
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
        <Icon className={`w-5 h-5 text-${color}-600`} aria-hidden="true" />
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
  const [faqs,        setFaqs]        = useState<FAQ[]>(FALLBACK_FAQS)
  const [forms,       setForms]       = useState<Doc[]>(FALLBACK_FORMS)
  const [guides,      setGuides]      = useState<Doc[]>(FALLBACK_GUIDES)
  const [reports,     setReports]     = useState<Doc[]>(FALLBACK_REPORTS)
  const [legislation, setLegislation] = useState<Doc[]>(FALLBACK_LEGISLATION)

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
        title="Resources & Court Forms"
        subtitle="Download official court forms, guides, annual reports, and legislation. Find answers to frequently asked questions about the PNG Judiciary."
        crumbs={[{ label: "Resources" }]}
        image="https://images.unsplash.com/photo-1568667256549-094345857637?w=1920&q=80"
      />

      <ScrollNav sections={SECTIONS} />

      {/* Court Forms */}
      <section id="forms" className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            icon={FileText}
            label="Downloadable Court Forms"
            description="Official Supreme Court and National Court forms for filing appeals, originating processes, motions, and registry requests. All forms are in PDF format."
            color="red"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {forms.map(f => <DocCard key={f.id} doc={f} accent="red" />)}
          </div>
          <p className="mt-5 text-xs text-gray-400">
            Need help completing a form? <Link href="/contact" className="text-[hsl(352,83%,48%)] hover:underline font-medium">Contact your nearest Registry →</Link>
          </p>
        </div>
      </section>

      {/* Guides & Publications */}
      <section id="guides" className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            icon={BookOpen}
            label="Guides & Publications"
            description="Plain-language guides for litigants, self-represented parties, and legal practitioners on court procedures, filing requirements, and mediation services."
            color="blue"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {guides.map(g => <DocCard key={g.id} doc={g} accent="blue" />)}
          </div>
        </div>
      </section>

      {/* Reports & Statistics */}
      <section id="reports" className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            icon={BarChart2}
            label="Reports & Statistics"
            description="NJSS annual reports, statistical bulletins, and performance data on court operations and judicial services across Papua New Guinea."
            color="emerald"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reports.map(r => <DocCard key={r.id} doc={r} accent="emerald" />)}
          </div>
        </div>
      </section>

      {/* Legislation */}
      <section id="legislation" className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            icon={Scale}
            label="Legislation & Regulations"
            description="Primary legislation governing the Supreme Court, National Court, and the National Judicial Staff Service of Papua New Guinea."
            color="purple"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {legislation.map(l => <DocCard key={l.id} doc={l} accent="purple" />)}
          </div>
          <div className="mt-6 bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-start gap-3">
            <Scale className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-purple-700 leading-relaxed">
              Full text legislation is freely available via the{" "}
              <a href="https://www.paclii.org/pg/" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                Pacific Islands Legal Information Institute (PacLII)
              </a>.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-10">
            <Badge variant="outline" className="mb-2">Frequently Asked Questions</Badge>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-3">Common Questions</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Common questions about the PNG courts, filing procedures, and registry services.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((f) => <FaqItem key={f.id} faq={f} />)}
          </div>
          <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-800 text-sm">Can't find what you're looking for?</p>
              <p className="text-xs text-gray-500 mt-0.5">Our registry staff are available Monday to Friday, 8:00 AM – 4:00 PM.</p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2 h-10 px-6 rounded-lg text-sm font-semibold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors"
            >
              Contact the Registry <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
