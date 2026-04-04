"use client"
import { useState } from "react"
import Link from "next/link"
import PageHero from "@/components/PageHero"
import ScrollNav from "@/components/ScrollNav"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle, Search, FileText, AlertCircle, Scale, Users,
  BookOpen, ChevronDown, ChevronUp, Phone, Mail, MapPin, Download,
  ArrowRight, ClipboardList, Gavel, Building2, Shield,
} from "lucide-react"

const SECTIONS = [
  { id: "overview",     label: "Overview" },
  { id: "eligibility",  label: "Who Can File" },
  { id: "matter-types", label: "Types of Matters" },
  { id: "how-to-file",  label: "How to File" },
  { id: "lodge",        label: "Lodge a Matter" },
  { id: "rights",       label: "Your Rights" },
  { id: "data",         label: "Court Data" },
  { id: "faq",          label: "FAQs" },
]

const MATTER_TYPES = [
  {
    icon: Gavel,
    title: "Civil Proceedings",
    desc: "Disputes between private parties including contractual disagreements, property matters, debt recovery, and torts.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Shield,
    title: "Criminal Matters",
    desc: "Offences against the State prosecuted under the Criminal Code Act, including indictable and summary offences.",
    color: "bg-red-50 text-[hsl(352,83%,44%)]",
  },
  {
    icon: Scale,
    title: "Constitutional References",
    desc: "Matters referred to the Supreme Court involving interpretation of the Constitution or organic laws.",
    color: "bg-amber-50 text-amber-700",
  },
  {
    icon: BookOpen,
    title: "Election Petitions",
    desc: "Petitions challenging the validity of elections under the Organic Law on National and Local-level Government Elections.",
    color: "bg-purple-50 text-purple-700",
  },
  {
    icon: Building2,
    title: "Judicial Review",
    desc: "Review of administrative decisions and actions by public bodies, government agencies, or statutory authorities.",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: ClipboardList,
    title: "Appeals",
    desc: "Appeals from the National Court to the Supreme Court, or from District Courts to the National Court.",
    color: "bg-gray-50 text-gray-700",
  },
]

const FILING_STEPS = [
  {
    step: "01",
    title: "Prepare Your Documents",
    items: [
      "Draft the originating process (Writ, Originating Summons, or Notice of Motion)",
      "Prepare supporting affidavits and annexures",
      "Obtain certified copies of relevant documents",
    ],
  },
  {
    step: "02",
    title: "Calculate and Pay Court Fees",
    items: [
      "Check the current Court Fees Schedule at the Registry",
      "Payment accepted at the Registry cashier — cash or bank cheque",
      "Retain your receipt — it is required for filing",
    ],
  },
  {
    step: "03",
    title: "Lodge at the Registry",
    items: [
      "Present all documents to the Registry counter",
      "Registry staff will stamp, date, and assign a case number",
      "Obtain your sealed copy — keep it for your records",
    ],
  },
  {
    step: "04",
    title: "Serve the Other Party",
    items: [
      "Serve sealed documents on the respondent/defendant within prescribed time limits",
      "File proof of service (affidavit of service) with the Registry",
    ],
  },
  {
    step: "05",
    title: "Attend Directions Hearing",
    items: [
      "The matter is listed before a judge for first directions",
      "Parties confirm readiness, agree timetables, and set hearing dates",
    ],
  },
]

const PARTY_RIGHTS = [
  "To have your matter heard fairly and without unreasonable delay",
  "To be represented by a qualified legal practitioner of your choice",
  "To access court records and obtain certified copies of orders",
  "To appeal any decision to the appropriate appellate court",
  "To apply for legal aid through the Public Solicitor's Office if eligible",
]

const REGISTRY_DUTIES = [
  "Accept and process all documents filed in accordance with the Rules",
  "Assign matter numbers and maintain accurate court records",
  "List matters before the Court within prescribed timeframes",
  "Issue seals, certified copies, and court orders as directed",
]

const FAQS = [
  {
    q: "Do I need a lawyer to file a court matter?",
    a: "For most civil and criminal matters in the National Court and Supreme Court you are strongly advised to engage a lawyer. However, self-represented litigants are permitted. The Public Solicitor's Office provides free legal assistance to those who qualify.",
  },
  {
    q: "How long will my matter take?",
    a: "Timeframes vary by matter type. Simple interlocutory applications may be heard within weeks; full trials can take months or years. The judge assigned to your matter will set a timetable at the directions hearing.",
  },
  {
    q: "What are the court filing fees?",
    a: "Fees are set by regulation and depend on the type of proceeding. The current schedule is available at any Registry counter. Fee waivers may be available in certain circumstances — enquire at the Registry.",
  },
  {
    q: "Can I appeal a court decision?",
    a: "Yes. National Court decisions may be appealed to the Supreme Court. Time limits apply — usually 40 days from the date of judgment. Seek legal advice promptly if you intend to appeal.",
  },
  {
    q: "How do I get a certified copy of a court order?",
    a: "Apply in writing at the relevant Registry, pay the prescribed fee, and allow 2–5 business days for processing. Urgent certified copies may be available on the same day at an additional fee.",
  },
  {
    q: "Where can I find out when my matter is listed?",
    a: "Court listings are published daily on the court noticeboards at Waigani Court Complex and at each provincial registry. You can also enquire by phone or email with your case number.",
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900 text-sm pr-4">{q}</span>
        <span className="shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
          {open
            ? <ChevronUp className="w-4 h-4 text-gray-500" />
            : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 bg-gray-50/60">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FilingsPage() {
  const [form, setForm] = useState({
    fullName: "", partyType: "", matterType: "", description: "", phone: "", email: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [refNumber, setRefNumber] = useState("")
  const [trackId, setTrackId] = useState("")
  const [trackResult, setTrackResult] = useState<{ status: string; description: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ref = `NJSS-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 10000}`
    setRefNumber(ref)
    setSubmitted(true)
  }

  const handleTrack = () => {
    if (!trackId.trim()) return
    setTrackResult({ status: "Matter Listed", description: "Your matter has been accepted and is listed before the Court. Check the daily court listings for your hearing date." })
  }

  return (
    <div>
      <PageHero
        badge="Court Filings"
        title="File a Court Matter"
        subtitle="Guidance on filing proceedings in the Supreme Court and National Court of Papua New Guinea — from preparing documents to attending your first directions hearing."
        crumbs={[{ label: "Court Filings" }]}
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80"
      />

      <ScrollNav sections={SECTIONS} />

      {/* Overview */}
      <section id="overview" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-3">Overview</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Court Filings</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The National Judicial Staff Service (NJSS) supports the <strong>Supreme Court</strong> and <strong>National Court</strong> of Papua New Guinea in administering court proceedings. Our Registry officers are available at all major court complexes to assist legal practitioners and self-represented litigants with filing, processing, and managing court documents.
            </p>
            <p className="text-gray-600 leading-relaxed">
              This page guides you through the process of initiating proceedings, lodging documents, understanding your rights, and tracking the progress of your matter before the Court.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#lodge" className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white text-sm font-semibold transition-colors">
                Lodge a Matter <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border border-gray-200 text-gray-700 hover:border-[hsl(352,83%,44%)] text-sm font-semibold transition-colors">
                Contact a Registry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can File */}
      <section id="eligibility" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">Eligibility</Badge>
            <h2 className="text-3xl font-bold text-gray-900">Who Can File?</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-2xl">
              The following persons may initiate or participate in proceedings before the Supreme Court or National Court:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {[
              "Any natural person (citizen or non-citizen) with legal standing to bring a claim",
              "Registered companies, corporations, and statutory bodies",
              "The State, acting through the Solicitor General's Office",
              "Legal practitioners admitted to practice in Papua New Guinea",
              "Self-represented litigants (in person) with leave of the Court",
              "Public interest litigants where constitutional rights are at issue",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
            <span><strong>Note:</strong> Certain proceedings require leave of the Court before they may be filed. Seek legal advice if you are unsure whether your matter can proceed.</span>
          </div>
        </div>
      </section>

      {/* Types of Matters */}
      <section id="matter-types" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">Proceedings</Badge>
            <h2 className="text-3xl font-bold text-gray-900">Types of Court Matters</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MATTER_TYPES.map((m) => (
              <div key={m.title} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col gap-4 hover:-translate-y-0.5 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.color}`}>
                  <m.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{m.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to File */}
      <section id="how-to-file" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">Process</Badge>
            <h2 className="text-3xl font-bold text-gray-900">How to File a Court Matter</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-2xl">
              Follow these steps to ensure your matter is correctly filed and accepted by the Registry without delay.
            </p>
          </div>
          <div className="space-y-4 max-w-3xl">
            {FILING_STEPS.map((s, i) => (
              <div key={s.step} className="flex gap-5 bg-white rounded-2xl border border-gray-200 p-5">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[hsl(352,83%,44%)] text-white font-bold text-xs flex items-center justify-center">
                    {s.step}
                  </div>
                  {i < FILING_STEPS.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-100 mx-auto mt-2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{s.title}</h3>
                  <ul className="space-y-1">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(352,83%,44%)] mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/resources"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[hsl(352,83%,44%)] text-white hover:bg-[hsl(352,83%,38%)] transition-colors"
            >
              <Download className="w-4 h-4" /> Download Court Forms
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:border-[hsl(352,83%,44%)] hover:text-[hsl(352,83%,44%)] transition-colors"
            >
              <MapPin className="w-4 h-4" /> Find Your Nearest Registry
            </Link>
          </div>
        </div>
      </section>

      {/* Lodge a Matter + Tracker */}
      <section id="lodge" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">Online Enquiry</Badge>
            <h2 className="text-3xl font-bold text-gray-900">Lodge a Filing Enquiry</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-2xl">
              Submit a pre-filing enquiry and a Registry officer will contact you within 2 business days to assist with your matter.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Enquiry form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Enquiry Submitted</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">A Registry officer will contact you within 2 business days regarding your matter.</p>
                  <p className="mt-3 text-xs text-gray-400">Reference: <span className="font-semibold text-gray-700">{refNumber}</span></p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ fullName: "", partyType: "", matterType: "", description: "", phone: "", email: "" }) }}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(352,83%,44%)] hover:gap-3 transition-all"
                  >
                    Submit another enquiry <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-7 space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-[hsl(352,83%,44%)]">*</span>
                      </label>
                      <input
                        required value={form.fullName}
                        onChange={e => setForm({ ...form, fullName: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none transition-colors"
                        placeholder="e.g. John Kapi"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                        Party Type <span className="text-[hsl(352,83%,44%)]">*</span>
                      </label>
                      <select
                        required value={form.partyType}
                        onChange={e => setForm({ ...form, partyType: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none transition-colors"
                      >
                        <option value="">Select…</option>
                        <option>Plaintiff / Applicant</option>
                        <option>Defendant / Respondent</option>
                        <option>Legal Practitioner</option>
                        <option>Self-Represented</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                        Type of Matter <span className="text-[hsl(352,83%,44%)]">*</span>
                      </label>
                      <select
                        required value={form.matterType}
                        onChange={e => setForm({ ...form, matterType: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none transition-colors"
                      >
                        <option value="">Select…</option>
                        <option>Civil Proceedings</option>
                        <option>Criminal Matter</option>
                        <option>Constitutional Reference</option>
                        <option>Election Petition</option>
                        <option>Judicial Review</option>
                        <option>Appeal</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                      <input
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none transition-colors"
                        placeholder="+675 7XX XXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Brief Description <span className="text-[hsl(352,83%,44%)]">*</span>
                    </label>
                    <textarea
                      required rows={4} value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none transition-colors resize-none"
                      placeholder="Briefly describe the nature of your matter and what assistance you require from the Registry…"
                    />
                  </div>
                  <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-xl text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <span className="text-amber-900">This form is for enquiries only — it does not constitute the formal filing of proceedings. All documents must be lodged in person at a Registry.</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Submit Enquiry
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Track */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4 text-[hsl(352,83%,44%)]" /> Track Your Matter
                </h3>
                <input
                  value={trackId}
                  onChange={e => setTrackId(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none mb-2"
                  placeholder="e.g. NJSS-2026-12345"
                />
                <button
                  onClick={handleTrack}
                  className="w-full h-9 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:border-[hsl(352,83%,44%)] hover:text-[hsl(352,83%,44%)] transition-colors"
                >
                  Track
                </button>
                {trackResult && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-800 text-sm">{trackResult.status}</div>
                    <div className="text-xs text-blue-600 mt-1">{trackResult.description}</div>
                  </div>
                )}
              </div>

              {/* Required docs */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Required at Filing</h3>
                <ul className="space-y-2">
                  {[
                    "Original + 3 copies of originating process",
                    "Supporting affidavits (signed & commissioned)",
                    "Annexures (certified copies)",
                    "Court fee receipt",
                    "Filed copy of any consent orders",
                    "Proof of service (if applicable)",
                  ].map((doc) => (
                    <li key={doc} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Help */}
              <div className="bg-gray-900 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-white text-sm">Registry Assistance</h3>
                <p className="text-gray-400 text-xs leading-relaxed">Our Registry officers can assist with filing procedures Mon–Fri, 8:00 AM – 4:00 PM.</p>
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" /> +675 325 7902
                </div>
                <a href="mailto:info@judiciary.gov.pg" className="flex items-center gap-2 text-gray-300 text-sm hover:text-amber-400 transition-colors">
                  <Mail className="w-4 h-4 shrink-0" /> info@judiciary.gov.pg
                </a>
                <Link href="/contact" className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                  All Registries <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rights & Registry Duties */}
      <section id="rights" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <Badge variant="outline" className="mb-3">Parties</Badge>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights Before the Court</h2>
              <div className="space-y-3">
                {PARTY_RIGHTS.map((r) => (
                  <div key={r} className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">{r}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Badge variant="outline" className="mb-3">Registry</Badge>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Registry Obligations</h2>
              <div className="space-y-3">
                {REGISTRY_DUTIES.map((d) => (
                  <div key={d} className="flex items-start gap-3 bg-white rounded-xl border border-gray-200 p-4">
                    <CheckCircle className="w-5 h-5 text-[hsl(352,83%,44%)] mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-800">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[hsl(352,83%,44%)]" />
                <span>Any party who experiences delays or irregularities in Registry processing may lodge a formal complaint with the Registrar of the National Court.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Court Data */}
      <section id="data" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-400/80 border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 rounded-full mb-4">Statistics</span>
            <h2 className="text-3xl font-bold">Court Filing Data (2025)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { value: "12,400+", label: "Matters filed across all courts" },
              { value: "3,200+",  label: "Judgments and orders delivered" },
              { value: "22",      label: "Provincial registries nationwide" },
              { value: "120+",    label: "Judicial officers and support staff" },
            ].map((s) => (
              <div key={s.label} className="text-center bg-white/8 rounded-2xl p-6 border border-white/10">
                <div className="text-3xl font-black text-white mb-2">{s.value}</div>
                <div className="text-xs text-gray-400 leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 max-w-2xl mx-auto">
            The majority of 2025 filings were <strong className="text-gray-300">civil matters, judicial reviews, and election petitions</strong>. The NJSS continues to invest in digitising court records and improving filing processes across all provincial registries.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">FAQs</Badge>
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>

          <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-1">Still have questions?</h3>
            <p className="text-sm text-gray-500 mb-5">Contact the Waigani Court Registry — our staff are available Monday to Friday.</p>
            <div className="flex flex-wrap items-center justify-center gap-5 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-[hsl(352,83%,44%)]" />
                Waigani Court Complex, Waigani Drive, NCD
              </div>
              <a href="mailto:info@judiciary.gov.pg" className="flex items-center gap-2 text-[hsl(352,83%,44%)] hover:underline">
                <Mail className="w-4 h-4" /> info@judiciary.gov.pg
              </a>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-[hsl(352,83%,44%)]" /> +675 325 7902
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
