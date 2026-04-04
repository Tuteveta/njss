"use client"
import { useState, useEffect } from "react"
import PageHero from "@/components/PageHero"
import {
  MapPin, Phone, Mail, Clock, CheckCircle, Send, ChevronRight,
  Scale, Building2, BookOpen, Info, Briefcase, MessageSquareWarning,
} from "lucide-react"

interface Office { id: number; name: string; address: string; phone: string; email: string; hours: string }

const FALLBACK_OFFICES: Office[] = [
  { id: 1, name: "Waigani Court Complex — Head Registry", address: "Waigani Drive, Waigani, NCD, Papua New Guinea", phone: "+675 325 7902", email: "info@judiciary.gov.pg", hours: "Mon–Fri: 8:00 AM – 4:00 PM" },
  { id: 2, name: "Lae National Court Registry", address: "Lae National Court, Morobe Province", phone: "+675 472 1855", email: "lae.registry@judiciary.gov.pg", hours: "Mon–Fri: 8:00 AM – 4:00 PM" },
  { id: 3, name: "Mt Hagen National Court Registry", address: "Mt Hagen Court, Western Highlands Province", phone: "+675 542 1600", email: "mthagen.registry@judiciary.gov.pg", hours: "Mon–Fri: 8:00 AM – 4:00 PM" },
]

const QUICK_CONTACTS = [
  { icon: Phone,  label: "Main Registry",      value: "+675 325 7902",         sub: "Mon–Fri, 8 AM–4 PM" },
  { icon: Mail,   label: "General Enquiries",  value: "info@judiciary.gov.pg", sub: "Response within 2 business days" },
  { icon: MapPin, label: "Head Office",        value: "Waigani Court Complex", sub: "Waigani Drive, NCD" },
]

const COURT_TYPES = [
  {
    id: "supreme-court",
    label: "Supreme Court",
    icon: Scale,
    email: "supremecourt@judiciary.gov.pg",
    desc: "Appeals, constitutional matters, and original jurisdiction",
    color: "border-[hsl(352,83%,44%)]/40 bg-[hsl(352,83%,44%)]/5",
    activeColor: "border-[hsl(352,83%,44%)] bg-[hsl(352,83%,44%)]/10",
    iconColor: "text-[hsl(352,83%,44%)]",
  },
  {
    id: "national-court",
    label: "National Court",
    icon: Building2,
    email: "nationalcourt@judiciary.gov.pg",
    desc: "Civil and criminal trials, judicial reviews",
    color: "border-blue-200 bg-blue-50/50",
    activeColor: "border-blue-500 bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "court-library",
    label: "Court Library",
    icon: BookOpen,
    email: "library@judiciary.gov.pg",
    desc: "Legal research, publications and databases",
    color: "border-amber-200 bg-amber-50/50",
    activeColor: "border-amber-500 bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    id: "information-desk",
    label: "Information Desk",
    icon: Info,
    email: "info@judiciary.gov.pg",
    desc: "General enquiries, directions and public assistance",
    color: "border-emerald-200 bg-emerald-50/50",
    activeColor: "border-emerald-500 bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "tenders-board",
    label: "Tenders Board",
    icon: Briefcase,
    email: "tenders@judiciary.gov.pg",
    desc: "Procurement, contracts and tender submissions",
    color: "border-purple-200 bg-purple-50/50",
    activeColor: "border-purple-500 bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    id: "complaints-committee",
    label: "Complaints Committee",
    icon: MessageSquareWarning,
    email: "complaints@judiciary.gov.pg",
    desc: "Registry complaints, conduct issues and feedback",
    color: "border-orange-200 bg-orange-50/50",
    activeColor: "border-orange-500 bg-orange-50",
    iconColor: "text-orange-600",
  },
]

export default function Contact() {
  const [selectedCourt, setSelectedCourt] = useState("")
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [offices, setOffices] = useState<Office[]>(FALLBACK_OFFICES)

  useEffect(() => {
    fetch("/api/offices")
      .then(r => r.json())
      .then((d: { offices?: Office[] }) => { if (d.offices?.length) setOffices(d.offices) })
      .catch(() => {})
  }, [])

  const activeCourt = COURT_TYPES.find(c => c.id === selectedCourt)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourt) return
    setSending(true)
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          subject: `[${activeCourt?.label}] ${form.subject}`,
        }),
      })
    } catch { /* demo fallback */ }
    setSending(false)
    setSent(true)
  }

  return (
    <div>
      <PageHero
        badge="Get in Touch"
        title="Contact Us"
        subtitle="Select the court or department you wish to contact, then complete the form and a member of our team will respond within 2 business days."
        crumbs={[{ label: "Contact" }]}
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
      />

      {/* Quick contact strip */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-800">
            {QUICK_CONTACTS.map(({ icon: Icon, label, value, sub }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-5">
                <div className="w-9 h-9 rounded-lg bg-[hsl(352,83%,44%)]/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[hsl(352,83%,55%)]" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold">{label}</p>
                  <p className="text-sm font-semibold text-white">{value}</p>
                  <p className="text-[11px] text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left — court selector + form */}
            <div className="lg:col-span-3 space-y-7">

              {/* Step 1 — Select court/department */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)] text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[hsl(352,83%,44%)]">Select Department</p>
                    <p className="text-gray-500 text-xs mt-0.5">Choose which court or office you'd like to contact</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COURT_TYPES.map((court) => {
                    const isActive = selectedCourt === court.id
                    const Icon = court.icon
                    return (
                      <button
                        key={court.id}
                        type="button"
                        onClick={() => setSelectedCourt(court.id)}
                        className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                          isActive ? court.activeColor + " shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isActive ? "bg-white/70" : "bg-gray-50"}`}>
                          <Icon className={`w-4.5 h-4.5 ${isActive ? court.iconColor : "text-gray-400"}`} />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-bold leading-tight ${isActive ? "text-gray-900" : "text-gray-700"}`}>
                            {court.label}
                          </p>
                          <p className="text-[11px] text-gray-400 leading-snug mt-0.5">{court.desc}</p>
                          {isActive && (
                            <p className="text-[10px] font-medium text-gray-500 mt-1 truncate">{court.email}</p>
                          )}
                        </div>
                        {isActive && (
                          <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ml-auto ${court.iconColor}`} />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 2 — Message form */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors ${selectedCourt ? "bg-[hsl(352,83%,44%)] text-white" : "bg-gray-200 text-gray-400"}`}>2</span>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-[0.15em] transition-colors ${selectedCourt ? "text-[hsl(352,83%,44%)]" : "text-gray-400"}`}>
                      Send a Message
                      {activeCourt && <span className="ml-2 normal-case font-normal text-gray-500">— {activeCourt.label}</span>}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {selectedCourt ? "Complete the form below" : "Select a department above to continue"}
                    </p>
                  </div>
                </div>

                {sent ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent</h3>
                    {activeCourt && (
                      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{activeCourt.label}</p>
                    )}
                    <p className="text-sm text-gray-500 max-w-sm mx-auto">Thank you for contacting us. A member of our team will respond within 2 business days.</p>
                    <button
                      onClick={() => {
                        setSent(false)
                        setForm({ name: "", email: "", subject: "", message: "" })
                        setSelectedCourt("")
                      }}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[hsl(352,83%,44%)] hover:gap-3 transition-all"
                    >
                      Send another message <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className={`bg-white rounded-2xl border-2 p-7 space-y-5 transition-all ${
                      selectedCourt ? "border-gray-200" : "border-dashed border-gray-200 opacity-60 pointer-events-none"
                    }`}
                    noValidate
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                          Full Name <span className="text-[hsl(352,83%,44%)]">*</span>
                        </label>
                        <input
                          required autoComplete="name" value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          maxLength={200}
                          className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                          Email Address <span className="text-[hsl(352,83%,44%)]">*</span>
                        </label>
                        <input
                          required type="email" autoComplete="email" value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          maxLength={200}
                          className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none transition-colors"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                        Subject <span className="text-[hsl(352,83%,44%)]">*</span>
                      </label>
                      <input
                        required value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        maxLength={300}
                        className="w-full h-10 px-3.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none transition-colors"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                        Message <span className="text-[hsl(352,83%,44%)]">*</span>
                      </label>
                      <textarea
                        required rows={5} value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        maxLength={2000}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none transition-colors resize-none"
                        placeholder="Describe your enquiry in detail…"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending || !selectedCourt}
                      className="w-full h-11 rounded-xl bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" />
                      {sending ? "Sending…" : activeCourt ? `Send to ${activeCourt.label}` : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right — Registry offices */}
            <div className="lg:col-span-2 space-y-4">
              <div className="mb-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[hsl(352,83%,44%)] mb-1">Court Registries</p>
                <h2 className="text-2xl font-extrabold text-gray-900">Visit Us in Person</h2>
                <p className="text-sm text-gray-500 mt-1">Registry offices are open Monday to Friday.</p>
              </div>

              {offices.map((o) => (
                <div key={o.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 text-sm mb-3 leading-snug">{o.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-[hsl(352,83%,44%)] mt-0.5 shrink-0" />
                      <span>{o.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-[hsl(352,83%,44%)] shrink-0" />
                      <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="hover:text-[hsl(352,83%,44%)] transition-colors">{o.phone}</a>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-[hsl(352,83%,44%)] shrink-0" />
                      <a href={`mailto:${o.email}`} className="hover:text-[hsl(352,83%,44%)] transition-colors break-all">{o.email}</a>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-400 pt-1 border-t border-gray-100">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>{o.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
