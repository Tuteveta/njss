import { Users, CheckCircle, ArrowRight, FileText, Shield, GraduationCap, Scale, Briefcase, Building2 } from "lucide-react"
import Link from "next/link"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"

const MEMBER_TYPES = [
  {
    icon: Scale,
    title: "Judges & Magistrates",
    description: "All serving judges of the Supreme Court and National Court, and magistrates of the District Courts.",
    access: "Full access – all collections, databases, and research services",
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    icon: Briefcase,
    title: "Legal Practitioners",
    description: "Lawyers admitted to practice in Papua New Guinea and registered with the PNG Law Society.",
    access: "Full access – all collections, databases, and interlibrary loans",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    icon: Building2,
    title: "NJSS Staff",
    description: "All staff of the National Judicial Staff Service across all locations and departments.",
    access: "Full access – all collections and services",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    icon: GraduationCap,
    title: "Law Students",
    description: "Students enrolled in a recognised law faculty or law school in Papua New Guinea.",
    access: "Reference access – in-library use only; borrowing with supervisor endorsement",
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    icon: Users,
    title: "Government Officers",
    description: "Officers of government departments, constitutional offices, and statutory bodies.",
    access: "Reference access – by prior arrangement with the Head Librarian",
    color: "bg-orange-50 text-orange-600 border-orange-200",
  },
  {
    icon: Shield,
    title: "Researchers",
    description: "Academic researchers, journalists, and members of the public with a legitimate legal research need.",
    access: "Limited reference access – supervised, by appointment only",
    color: "bg-gray-50 text-gray-600 border-gray-200",
  },
]

const BENEFITS = [
  "Access to the full NJSS legal collection including case law, legislation, and commentary",
  "Remote access to online legal databases (full members)",
  "Borrowing privileges for up to 5 items at a time (30-day loan period)",
  "Interlibrary loan services for materials not held in the NJSS collection",
  "Personalised legal research assistance from qualified librarians",
  "Access to current awareness services — new legislation and case law alerts",
  "Use of photocopy, print, and scanning facilities",
  "Access to all branch libraries across Papua New Guinea",
]

const HOW_TO_JOIN = [
  {
    step: "01",
    title: "Download Application Form",
    description: "Download the Library Membership Application Form below and complete all sections.",
  },
  {
    step: "02",
    title: "Attach Supporting Documents",
    description: "Attach a copy of your practising certificate, student ID, or employment letter as applicable.",
  },
  {
    step: "03",
    title: "Submit to Head Library",
    description: "Submit your completed form and documents in person or by email to library@judiciary.gov.pg.",
  },
  {
    step: "04",
    title: "Receive Membership Card",
    description: "Your application will be processed within 3–5 business days. Membership cards are issued at the Head Library.",
  },
]

export default function MembershipPage() {
  return (
    <div>
      <PageHero
        badge="Court Library"
        crumbs={[
          { label: "Court Library", href: "/library/branch-libraries" },
          { label: "Library Membership List" },
        ]}
        title="Library Membership List"
        subtitle="Membership provides access to PNG's most comprehensive legal collection — open to judges, practitioners, students, and researchers."
        image="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=80"
      />

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="library" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Member types */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Who Can Join</h2>
            <p className="text-sm text-gray-500 mb-5">Membership is open to the following categories. Access levels vary by category.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {MEMBER_TYPES.map(type => {
                const Icon = type.icon
                return (
                  <div key={type.title} className={`bg-white rounded-xl border p-5 ${type.color.split(" ")[2]}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${type.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-[14px]">{type.title}</h3>
                        <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{type.description}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        <span className="font-semibold text-gray-700">Access: </span>{type.access}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Membership Benefits</h2>
                <p className="text-sm text-gray-500 mt-0.5">What you get with NJSS Court Library membership</p>
              </div>
            </div>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {BENEFITS.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* How to join */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">How to Apply</h2>
            <p className="text-sm text-gray-500 mb-5">Membership applications take 3–5 business days to process.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HOW_TO_JOIN.map((step) => (
                <div key={step.step} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="text-3xl font-extrabold text-gray-100 mb-3 leading-none">{step.step}</div>
                  <h3 className="font-bold text-gray-900 text-[13.5px] mb-2">{step.title}</h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Application form CTA */}
          <div className="bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-bold text-white text-[14px]">Library Membership Application Form</p>
                <p className="text-[12px] text-gray-400 mt-0.5">PDF form — complete and submit to the Head Library</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/contact?dept=court-library"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-[13px] font-semibold border border-gray-600 text-gray-200 hover:bg-white/5 transition-colors"
              >
                Enquire
              </Link>
              <a
                href="#"
                className="inline-flex items-center gap-2 h-10 px-5 rounded-lg text-[13px] font-semibold bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white transition-colors"
              >
                Download Form <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Renewals note */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <Users className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-blue-800 leading-relaxed">
              <span className="font-semibold">Membership Renewal:</span> Membership is valid for one calendar year (January – December) and must be renewed annually. Renewal notices are sent by email 30 days before expiry. Contact <a href="mailto:library@judiciary.gov.pg" className="underline font-medium">library@judiciary.gov.pg</a> for assistance.
            </p>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
