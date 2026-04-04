import Link from "next/link"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import { FileVideo, Phone, Mail, Clock, Download, AlertTriangle, ArrowRight, CheckCircle } from "lucide-react"

const SERVICES = [
  { title: "Transcript of Proceedings",    desc: "Verbatim transcript of court hearings, trials, and judgments delivered in the National Court and Supreme Court. Available in certified printed and digital formats." },
  { title: "Audio Recording",               desc: "Official audio recordings of proceedings where a court reporting officer is present. Recordings are the property of the court and access is controlled by the Registrar." },
  { title: "Judgment Transcription",        desc: "Transcription of ex tempore (oral) judgments delivered from the bench. Transcripts are certified and may be used for appeal or publication purposes." },
  { title: "Voir Dire Transcripts",         desc: "Specialised transcription of voir dire (trial within a trial) proceedings in criminal matters." },
  { title: "Expedited Transcript Service",  desc: "Priority transcript production for urgent matters such as bail appeals, sentence appeals, or interlocutory applications. Additional fees apply." },
]

const HOW_TO_ORDER = [
  { step: "01", title: "Identify the Proceedings",    desc: "Note the court file number, date of hearing, presiding judge, and approximate time of the proceedings you require." },
  { step: "02", title: "Complete Order Form",          desc: "Complete the Transcript Order Form available from the Registry or downloadable below. Specify whether you require a certified or draft copy." },
  { step: "03", title: "Pay the Fee",                  desc: "Pay the prescribed transcript fee at the Registry cashier. Fees are calculated per page or per hour of recorded proceedings." },
  { step: "04", title: "Collection or Delivery",       desc: "Transcripts are available for collection from the Registry or can be emailed in PDF format to the address provided on the order form." },
]

const FEES = [
  { item: "Standard transcript (per page)",            fee: "PGK 5.00" },
  { item: "Certified transcript (per page)",           fee: "PGK 8.00" },
  { item: "Expedited transcript — 24hr (per page)",    fee: "PGK 15.00" },
  { item: "Audio recording access (per hour)",         fee: "PGK 50.00" },
  { item: "Minimum order fee",                         fee: "PGK 20.00" },
]

export default function CourtReportingPage() {
  return (
    <div>
      <PageHero
        badge="National Court"
        crumbs={[
          { label: "National Court", href: "/national-court/daily-diary" },
          { label: "Court Reporting Service" },
        ]}
        title="Court Reporting Service"
        subtitle="Official transcription and recording services for National Court and Supreme Court proceedings."
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="national-court" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Services */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Services Offered</h2>
            <div className="flex flex-col gap-3">
              {SERVICES.map(s => (
                <div key={s.title} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 hover:border-gray-300 transition-colors">
                  <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-gray-900 text-[13.5px] mb-1">{s.title}</p>
                    <p className="text-[12px] text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to order */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">How to Order a Transcript</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {HOW_TO_ORDER.map(s => (
                <div key={s.step} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                  <div className="text-2xl font-extrabold text-gray-100 leading-none mb-2">{s.step}</div>
                  <p className="font-bold text-gray-900 text-[13.5px] mb-1">{s.title}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fees */}
          <div className="mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Transcript Fees</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {FEES.map((f, i) => (
                <div key={i} className={`flex items-center justify-between px-5 py-3.5 ${i < FEES.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}>
                  <span className="text-[13px] text-gray-700">{f.item}</span>
                  <span className="font-bold text-gray-900 text-[13px]">{f.fee}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">Fees are indicative. Confirm current fees with the Registry before ordering. Circuit court and out-of-town proceedings may attract additional charges.</p>
          </div>

          {/* Download form */}
          <div className="bg-gray-900 rounded-xl p-5 mb-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <FileVideo className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="font-bold text-white text-[13px]">Transcript Order Form</p>
                <p className="text-[11px] text-gray-400 mt-0.5">PDF — submit at the Waigani Registry</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a href="#" className="inline-flex items-center gap-2 h-9 px-4 rounded-lg text-[12px] font-semibold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors">
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-800 leading-relaxed">
              Standard transcripts take 5–10 working days. Allow additional time for lengthy trials or proceedings. The Court Reporting Service does not transcribe proceedings where no court reporter was present — audio recordings are only available for supported courtrooms.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-900 text-[13px] mb-1">Court Reporting Service</p>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+67532579040" className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-800 transition-colors"><Phone className="w-3.5 h-3.5" /> +675 325 7940</a>
                <a href="mailto:courtreporting@judiciary.gov.pg" className="flex items-center gap-1.5 text-[12px] text-gray-500 hover:text-gray-800 transition-colors"><Mail className="w-3.5 h-3.5" /> courtreporting@judiciary.gov.pg</a>
                <span className="flex items-center gap-1.5 text-[12px] text-gray-400"><Clock className="w-3.5 h-3.5" /> Mon–Fri 8AM–4PM</span>
              </div>
            </div>
            <Link href="/contact?dept=national-court" className="shrink-0 inline-flex items-center gap-2 h-9 px-5 rounded-lg text-[12px] font-semibold bg-blue-700 hover:bg-blue-800 text-white transition-colors">
              Order Transcript <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
