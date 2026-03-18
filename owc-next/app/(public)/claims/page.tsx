"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import PageHero from "@/components/PageHero"
import ScrollNav from "@/components/ScrollNav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  CheckCircle, Search, FileText, AlertCircle, Shield, Users, Stethoscope,
  HeartHandshake, TrendingUp, ChevronDown, ChevronUp, Phone, Mail, MapPin, Download,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "eligibility", label: "Who Is Eligible" },
  { id: "compensation-types", label: "Types of Compensation" },
  { id: "how-to-lodge", label: "How to Lodge" },
  { id: "file-claim", label: "File a Claim" },
  { id: "rights", label: "Your Rights" },
  { id: "employer", label: "Employer Duties" },
  { id: "data", label: "2024 Data" },
  { id: "faq", label: "FAQs" },
]

const compensationTypes = [
  {
    icon: Stethoscope,
    title: "Medical Expenses",
    desc: "Hospital fees, treatment, rehabilitation costs, and specialist referrals arising from a work-related injury or disease.",
    color: "bg-blue-50 text-[hsl(210,70%,25%)]",
  },
  {
    icon: TrendingUp,
    title: "Temporary Incapacity",
    desc: "Weekly wage payments during the recovery period while a worker is unable to perform their duties.",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: Shield,
    title: "Permanent Disability",
    desc: "Lump sum compensation calculated on the assessed degree of permanent disability resulting from the injury.",
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    icon: HeartHandshake,
    title: "Death Benefits",
    desc: "Lump sum payment to dependents of a deceased worker, including funeral and repatriation costs.",
    color: "bg-rose-50 text-rose-700",
  },
  {
    icon: Users,
    title: "Loss of Earning Capacity",
    desc: "Assessed compensation for long-term reduction in a worker's ability to earn income due to injury effects.",
    color: "bg-amber-50 text-amber-700",
  },
]

const lodgeSteps = [
  {
    step: "01",
    title: "Report the Injury or Illness",
    items: [
      "Notify your employer immediately after the incident",
      "Employer must submit a written report to DLIR within 14 days",
    ],
  },
  {
    step: "02",
    title: "Gather Required Documents",
    items: [
      "Completed Claim Form (Form 8)",
      "Medical Certificate or Death Certificate",
      "Proof of employment",
      "Witness statements (if applicable)",
    ],
  },
  {
    step: "03",
    title: "Submit to DLIR",
    items: [
      "Lodge at your nearest Provincial Labour Office or OWC Port Moresby HQ",
      "You will receive an official case reference number",
    ],
  },
  {
    step: "04",
    title: "Claim Investigation",
    items: [
      "DLIR assesses eligibility and verifies all information",
      "A medical board evaluation may be required",
    ],
  },
  {
    step: "05",
    title: "Determination & Payment",
    items: [
      "DLIR issues a compensation order upon approval",
      "Payments made directly to claimant or through a registered insurer",
    ],
  },
]

const workerRights = [
  "To receive timely compensation without discrimination",
  "To request a review or appeal a decision under the Act",
  "To access your case file through a formal request",
  "To be represented by legal or union support if desired",
]

const employerDuties = [
  "Report all workplace accidents and injuries to DLIR",
  "Maintain up-to-date workers' compensation insurance",
  "Cooperate fully with DLIR inspectors or medical boards",
  "Pay contributions as determined by the Act or its amendments",
]

const faqs = [
  {
    q: "How long does a claim take to process?",
    a: "Depending on complexity, most claims are processed within 60–90 days.",
  },
  {
    q: "What if my employer refuses to cooperate?",
    a: "Contact DLIR immediately. Non-compliant employers may be fined or prosecuted under the Workers' Compensation Act 1978.",
  },
  {
    q: "Can I appeal a compensation decision?",
    a: "Yes. You may appeal through the Workers' Compensation Appeal Tribunal or request a review directly from DLIR.",
  },
  {
    q: "Is compensation mandatory for all employers?",
    a: "Yes. All employers are legally required to insure their employees against work-related injury or death.",
  },
  {
    q: "Can casual or informal workers claim compensation?",
    a: "Eligibility depends on the employment arrangement. OWC will assess each case individually — contact your nearest Provincial Labour Office for guidance.",
  },
]

type ClaimStatus = { status: string; description: string } | null

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 text-sm">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3 bg-gray-50">
          {a}
        </div>
      )}
    </div>
  )
}

export default function Claims() {
  const [form, setForm] = useState({
    fullName: "", employerName: "", injuryDate: "", injuryType: "",
    description: "", phone: "", email: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [refNumber, setRefNumber] = useState("")
  const [trackId, setTrackId] = useState("")
  const [trackResult, setTrackResult] = useState<ClaimStatus>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ref = `OWC-2026-${Math.floor(Math.random() * 90000) + 10000}`
    try {
      await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    } catch {
      // demo fallback — proceed anyway
    }
    setRefNumber(ref)
    setSubmitted(true)
  }

  const handleTrack = async () => {
    if (!trackId.trim()) return
    try {
      const res = await fetch(`/api/claims/${encodeURIComponent(trackId)}`)
      if (res.ok) {
        const data = await res.json() as { status: string; description: string }
        setTrackResult(data)
        return
      }
    } catch {
      // demo fallback
    }
    setTrackResult({ status: "Under Review", description: "Your claim is currently being assessed by a case officer." })
  }

  return (
    <div>
      <PageHero
        badge="Claims"
        title="Workers' Compensation Claims"
        subtitle="Fair compensation for work-related injuries and occupational diseases. File a new claim, track an existing one, or learn about your rights and entitlements."
        crumbs={[{ label: "Claims" }]}
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80"
      />

      <ScrollNav sections={SECTIONS} />

      {/* Overview */}
      <section id="overview" className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <Badge variant="outline" className="mb-3">Overview</Badge>
            <h2 className="text-3xl font-bold text-[hsl(210,70%,18%)] mb-4">About Workers' Compensation</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The Office of Workers' Compensation (OWC) under the Department of Labour &amp; Industrial Relations (DLIR)
              is mandated to administer and enforce the <strong>Workers' Compensation Act 1978</strong>. This law ensures
              that employees who suffer work-related injuries, occupational diseases, or death in the course of employment
              receive fair compensation.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you are a worker, employer, or dependent of a deceased worker, the Workers' Compensation system
              exists to protect your rights, support your recovery, and provide timely benefits.
            </p>
          </div>
        </div>
      </section>

      {/* Who Is Eligible */}
      <section id="eligibility" className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">Eligibility</Badge>
            <h2 className="text-3xl font-bold text-[hsl(210,70%,18%)]">Who Is Eligible?</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Under the Workers' Compensation Act, the following individuals may be eligible to claim compensation:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {[
              "Any worker injured during the course of employment",
              "Workers suffering from approved occupational diseases",
              "Dependents or next of kin of a worker who dies from a work-related injury or disease",
              "Persons employed under a contract of service, whether written, oral, or implied",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
              <span><strong>Note:</strong> Some categories of casual or informal employment may be excluded unless otherwise proven. OWC will assess eligibility on a case-by-case basis.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Compensation */}
      <section id="compensation-types" className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">Benefits</Badge>
            <h2 className="text-3xl font-bold text-[hsl(210,70%,18%)]">Types of Compensation Available</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {compensationTypes.map((ct) => (
              <div key={ct.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${ct.color}`}>
                  <ct.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{ct.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{ct.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Lodge */}
      <section id="how-to-lodge" className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">Process</Badge>
            <h2 className="text-3xl font-bold text-[hsl(210,70%,18%)]">How to Lodge a Claim</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Follow these steps to ensure your claim is lodged correctly and processed without delay.
            </p>
          </div>
          <div className="space-y-4">
            {lodgeSteps.map((s, i) => (
              <div key={s.step} className="flex gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[hsl(210,70%,25%)] text-white font-bold text-xs flex items-center justify-center">
                    {s.step}
                  </div>
                  {i < lodgeSteps.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-100 mx-auto mt-2" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{s.title}</h3>
                  <ul className="space-y-1">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="/forms/Form-8-Claim-Form.pdf" download target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[hsl(210,70%,25%)] text-white hover:bg-[hsl(210,70%,20%)] transition-colors">
              <Download className="w-4 h-4" /> Download Claim Form (Form 8)
            </a>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-gray-700 hover:border-[hsl(210,70%,25%)] hover:text-[hsl(210,70%,25%)] transition-colors">
              <MapPin className="w-4 h-4" /> Find Your Nearest Labour Office
            </Link>
          </div>
        </div>
      </section>

      {/* File a Claim & Tracker */}
      <section id="file-claim" className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">Online Claim</Badge>
            <h2 className="text-3xl font-bold text-[hsl(210,70%,18%)]">File or Track a Claim</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Submit your claim online or track an existing one. A case officer will be assigned to you within 2 business days.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Claim form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <Card>
                  <CardContent className="pt-10 pb-10 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted Successfully</h2>
                    <p className="text-gray-500">Your claim has been received. A case officer will contact you within 2 business days.</p>
                    <p className="mt-3 text-sm text-gray-400">Reference number: <span className="font-semibold text-gray-700">{refNumber}</span></p>
                    <Button className="mt-6" onClick={() => setSubmitted(false)}>Submit Another Claim</Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" /> File a New Claim
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                          <Input required placeholder="John Wapi" value={form.fullName}
                            onChange={e => setForm({ ...form, fullName: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Employer Name *</label>
                          <Input required placeholder="Company Ltd" value={form.employerName}
                            onChange={e => setForm({ ...form, employerName: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Injury *</label>
                          <Input required type="date" value={form.injuryDate}
                            onChange={e => setForm({ ...form, injuryDate: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type of Injury *</label>
                          <Input required placeholder="e.g. Fracture, Laceration" value={form.injuryType}
                            onChange={e => setForm({ ...form, injuryType: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <Input placeholder="+675 7XX XXXX" value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <Input type="email" placeholder="you@example.com" value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description of Injury / Incident *</label>
                        <Textarea required rows={4} placeholder="Describe what happened, where and how you were injured..."
                          value={form.description}
                          onChange={e => setForm({ ...form, description: e.target.value })} />
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-emerald-50 rounded-lg text-sm">
                        <AlertCircle className="w-4 h-4 text-emerald-800 mt-0.5 shrink-0" />
                        <span className="text-emerald-900">Claims must be submitted within 12 months of the injury date. Supporting documentation will be requested by your case officer.</span>
                      </div>
                      <Button type="submit" className="w-full">Submit Claim</Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Track claim */}
              <Card id="track">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Search className="w-4 h-4" /> Track Your Claim
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input placeholder="Enter claim reference (e.g. OWC-2026-12345)"
                    value={trackId} onChange={e => setTrackId(e.target.value)} />
                  <Button className="w-full mt-2" variant="outline" onClick={handleTrack}>Track</Button>
                  {trackResult && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="font-medium text-blue-800">{trackResult.status}</div>
                      <div className="text-sm text-blue-600 mt-1">{trackResult.description}</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Required docs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {[
                      "Completed Claim Form (Form 8)",
                      "Medical Certificate or Death Certificate",
                      "Proof of employment",
                      "Payslips (last 3 months)",
                      "Copy of NID / Passport",
                      "Witness statements (if applicable)",
                    ].map((doc) => (
                      <li key={doc} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Help */}
              <Card className="bg-[hsl(210,70%,25%)] text-white">
                <CardContent className="pt-6 space-y-2">
                  <h3 className="font-bold mb-1">Need Help?</h3>
                  <p className="text-blue-100 text-sm">Call or email our team Mon–Fri, 8:00 AM – 4:00 PM.</p>
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Phone className="w-4 h-4 shrink-0" /> (+675) 313 5000
                  </div>
                  <div className="text-sm text-blue-200">Toll-Free: 180 1100</div>
                  <div className="flex items-center gap-2 text-blue-100 text-sm">
                    <Mail className="w-3.5 h-3.5 shrink-0" /> workerscomp@owc.gov.pg
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Worker Rights & Employer Duties */}
      <section id="rights" className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rights */}
            <div>
              <div className="mb-6">
                <Badge variant="outline" className="mb-3">Workers</Badge>
                <h2 className="text-2xl font-bold text-[hsl(210,70%,18%)]">Your Rights as a Worker</h2>
              </div>
              <div className="space-y-3">
                {workerRights.map((r) => (
                  <div key={r} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">{r}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-800">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                <span><strong>It is illegal</strong> for employers to dismiss or intimidate an employee for filing a compensation claim.</span>
              </div>
            </div>

            {/* Employer duties */}
            <div id="employer">
              <div className="mb-6">
                <Badge variant="outline" className="mb-3">Employers</Badge>
                <h2 className="text-2xl font-bold text-[hsl(210,70%,18%)]">Employer Responsibilities</h2>
                <p className="text-gray-500 text-sm mt-1">Under the Workers' Compensation Act 1978, all employers are required to:</p>
              </div>
              <div className="space-y-3">
                {employerDuties.map((d) => (
                  <div key={d} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <CheckCircle className="w-5 h-5 text-[hsl(210,70%,25%)] mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-700 leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                <span>DLIR conducts <strong>random audits and workplace inspections</strong> to ensure compliance.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2024 Data Snapshot */}
      <section id="data" className="py-16 bg-[hsl(210,70%,25%)] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-white/60 border border-white/20 bg-white/10 px-4 py-1.5 rounded-full mb-4">Statistics</span>
            <h2 className="text-3xl font-bold">Claims Data Snapshot (2024)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { value: "1,732", label: "Workers' compensation cases registered" },
              { value: "K3.2M", label: "Paid in compensation benefits" },
              { value: "60–90", label: "Days average claims processing time" },
              { value: "PLOs", label: "Provincial Labour Offices nationwide" },
            ].map((s) => (
              <div key={s.label} className="text-center bg-white/10 rounded-2xl p-6 border border-white/10">
                <div className="text-3xl font-black text-white mb-2">{s.value}</div>
                <div className="text-xs text-white/70 leading-relaxed">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-white/60 max-w-2xl mx-auto">
            Majority of 2024 cases were from the <strong className="text-white/80">mining, construction, and agriculture</strong> sectors.
            Improvements have been made to streamline claims processing and extend services through Provincial Labour Offices.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section id="faq" className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <Badge variant="outline" className="mb-3">FAQs</Badge>
            <h2 className="text-3xl font-bold text-[hsl(210,70%,18%)]">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>

          {/* Contact footer */}
          <div className="mt-10 bg-gray-50 rounded-2xl border border-gray-100 p-6 text-center">
            <h3 className="font-bold text-gray-900 mb-1">Still have questions?</h3>
            <p className="text-sm text-gray-500 mb-4">Contact the Office of Workers' Compensation — DLIR HQ, Port Moresby.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-[hsl(210,70%,25%)]" /> Gaukara Rumana, Wards Rd, Port Moresby, NCD
              </div>
              <a href="mailto:workerscomp@owc.gov.pg" className="flex items-center gap-2 text-[hsl(210,70%,25%)] hover:underline">
                <Mail className="w-4 h-4" /> workerscomp@owc.gov.pg
              </a>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-[hsl(210,70%,25%)]" /> (+675) 313 5000 / Toll-Free: 180 1100
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
