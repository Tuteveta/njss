import Link from "next/link"
import { MessageSquareWarning, CheckCircle, AlertTriangle, ArrowRight, Mail, Phone, FileText, XCircle, Clock } from "lucide-react"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import SectionTabs from "@/components/SectionTabs"

const PROCESS_STEPS = [
  { step: "01", title: "Check Eligibility",        desc: "Confirm your complaint relates to judicial conduct — not the outcome of a case, a legal argument, or a sentence. The Committee cannot review decisions made by judges in their judicial capacity." },
  { step: "02", title: "Complete the Form",         desc: "Download and complete the Judicial Conduct Complaint Form. Provide full details of the incident, the judicial officer involved, and any supporting documents." },
  { step: "03", title: "Submit Your Complaint",     desc: "Submit the completed form by post or email to the Judicial Complaints Committee Secretariat. All complaints must be in writing." },
  { step: "04", title: "Acknowledgement",           desc: "You will receive a written acknowledgement within 10 business days confirming receipt of your complaint and a reference number." },
  { step: "05", title: "Assessment",                desc: "The Committee will assess whether the complaint falls within its jurisdiction. Complaints outside jurisdiction will be referred to the appropriate authority." },
  { step: "06", title: "Investigation",             desc: "If the complaint is accepted, the Committee will investigate and may request additional information from you and the judicial officer concerned." },
  { step: "07", title: "Outcome",                   desc: "You will be informed in writing of the Committee's findings and any action taken. The Committee's proceedings are confidential." },
]

const CAN_COMPLAIN = [
  "Discourteous, insulting, or threatening conduct in court",
  "Bias or apparent bias in the conduct of proceedings",
  "Improper use of judicial office for personal benefit",
  "Failure to disclose a conflict of interest",
  "Conduct unbecoming of a judicial officer outside of court",
  "Serious and unexplained delays in delivering judgments",
]

const CANNOT_COMPLAIN = [
  "Disagreement with a judicial decision or order",
  "Errors of law or procedure (appeal is the appropriate remedy)",
  "The length of a sentence imposed",
  "The outcome of a case decided on the evidence",
  "Actions of lawyers, registry staff, or other court officers",
  "Matters already pending before or decided by a court",
]

const COMMITTEE_MEMBERS = [
  { role: "Chairperson",    name: "Hon. Chief Justice (or nominee)", note: "Ex officio" },
  { role: "Member",         name: "Senior Judge of the National Court", note: "Appointed by Judicial Services Commission" },
  { role: "Member",         name: "Law Society Representative",          note: "Appointed by PNG Law Society" },
  { role: "Member",         name: "Public Member",                        note: "Appointed by the Minister for Justice" },
]

export default function ComplaintsCommitteePage() {
  return (
    <div>
      <PageHero
        badge="About the Courts"
        title="Judicial Complaints Committee"
        subtitle="An independent mechanism for raising concerns about the conduct of judicial officers of the Supreme Court and National Court."
        crumbs={[{ label: "About the Courts", href: "/about" }, { label: "Judicial Complaints Committee" }]}
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />
      <SectionTabs section="about" />
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="about" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Important notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-8">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-800 leading-relaxed">
              The Judicial Complaints Committee deals with <strong>judicial conduct</strong> only — not legal decisions. If you believe a judge made a legal error, the correct remedy is to <strong>appeal</strong> the decision through the courts, not to lodge a complaint with this Committee.
            </p>
          </div>

          {/* What you can/cannot complain about */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-white rounded-xl border border-emerald-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <h2 className="font-bold text-gray-900 text-[13.5px]">You CAN complain about</h2>
              </div>
              <ul className="space-y-2">
                {CAN_COMPLAIN.map(item => (
                  <li key={item} className="flex items-start gap-2 text-[12px] text-gray-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-red-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-red-500" />
                <h2 className="font-bold text-gray-900 text-[13.5px]">You CANNOT complain about</h2>
              </div>
              <ul className="space-y-2">
                {CANNOT_COMPLAIN.map(item => (
                  <li key={item} className="flex items-start gap-2 text-[12px] text-gray-600">
                    <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Process */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">How to Make a Complaint</h2>
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

          {/* Timeframes */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Timeframes</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {[
                { stage: "Complaint lodged",                 time: "Day 0" },
                { stage: "Acknowledgement sent",             time: "Within 10 business days" },
                { stage: "Jurisdictional assessment",        time: "Within 20 business days" },
                { stage: "Investigation (if accepted)",      time: "60 – 90 business days" },
                { stage: "Outcome notification",             time: "Within 10 days of determination" },
              ].map((row, i, arr) => (
                <div key={row.stage} className={`flex items-center justify-between px-5 py-3.5 ${i < arr.length - 1 ? "border-b border-gray-100" : ""} hover:bg-gray-50 transition-colors`}>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                    <span className="text-[13px] text-gray-700">{row.stage}</span>
                  </div>
                  <span className="text-[12px] font-semibold text-gray-500">{row.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Committee Composition */}
          <div className="mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Committee Composition</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {COMMITTEE_MEMBERS.map((m, i) => (
                <div key={i} className={`flex items-center justify-between px-5 py-3.5 ${i < COMMITTEE_MEMBERS.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{m.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{m.note}</p>
                  </div>
                  <span className="text-[11px] font-bold bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] px-2.5 py-0.5 rounded-full">{m.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download & Contact */}
          <div className="bg-gray-900 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-[13px]">Judicial Conduct Complaint Form</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">PDF — must be submitted in writing</p>
                </div>
              </div>
              <a href="#" className="shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-lg text-[12px] font-semibold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors">
                <FileText className="w-3.5 h-3.5" /> Download Form
              </a>
            </div>
            <div className="border-t border-white/10 pt-4 flex flex-wrap gap-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-full">Committee Secretariat</p>
              <a href="mailto:complaints@judiciary.gov.pg" className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5" /> complaints@judiciary.gov.pg
              </a>
              <a href="tel:+67532579020" className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5" /> +675 325 7920
              </a>
              <Link href="/contact?dept=complaints-committee" className="flex items-center gap-1.5 text-[12px] text-[hsl(352,83%,60%)] hover:text-white transition-colors">
                Online Enquiry <ArrowRight className="w-3.5 h-3.5" />
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
