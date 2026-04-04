import Link from "next/link"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import { Shield, Phone, Mail, AlertTriangle, ArrowRight } from "lucide-react"

const SERVICES = [
  { title: "Service of Court Documents",      desc: "Personal service of writs, summons, notices of motion, subpoenas, and other court process on parties and witnesses as directed by the court or a party." },
  { title: "Execution of Court Orders",        desc: "Enforcement of court orders including writs of execution, warrants of commitment, and orders for seizure and sale of property." },
  { title: "Seizure and Sale of Property",     desc: "Seizure of judgment debtor's goods, chattels and property under a writ of levy of property, and conduct of public auction sales." },
  { title: "Eviction and Vacant Possession",   desc: "Execution of writs of possession to recover land, premises, or vacant possession as ordered by the court." },
  { title: "Arrest Warrants",                  desc: "Execution of bench warrants and arrest warrants issued by the National Court and Supreme Court for failure to attend court." },
  { title: "Security for Court Proceedings",   desc: "Provision of security services within the Waigani Court Complex and at circuit court venues across Papua New Guinea." },
]

const PROCESS = [
  { step: "01", title: "Obtain Court Order or Document", desc: "Obtain the signed court order, writ, or document to be served from the Registry. Ensure it is sealed by the court." },
  { step: "02", title: "Complete Sheriff's Request Form",  desc: "Complete the Sheriff's Request for Service or Execution form, available from the Sheriff's Office or this website." },
  { step: "03", title: "Pay Applicable Fees",             desc: "Pay the prescribed service or execution fee at the Waigani Registry cashier. Fees vary by document type and location." },
  { step: "04", title: "Lodge with Sheriff's Office",     desc: "Lodge your completed form, the document for service, and the fee receipt with the Sheriff's Office." },
  { step: "05", title: "Receive Proof of Service",        desc: "After service is effected, the Sheriff will provide an Affidavit of Service or Return of Service for filing in the court proceedings." },
]

export default function SheriffPage() {
  return (
    <div>
      <PageHero
        badge="National Court"
        crumbs={[
          { label: "National Court", href: "/national-court/daily-diary" },
          { label: "Sheriff" },
        ]}
        title="Sheriff"
        subtitle="Service of court process, execution of court orders, seizure and sale of property, and court security services."
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="national-court" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Services */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Sheriff's Services</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {SERVICES.map(s => (
                <div key={s.title} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-[13.5px] mb-1">{s.title}</h3>
                      <p className="text-[12px] text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to request */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">How to Request Sheriff's Services</h2>
            <div className="flex flex-col gap-3">
              {PROCESS.map(s => (
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

          {/* Important note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-800 leading-relaxed">
              The Sheriff does not accept instructions directly from parties without a court document authorising service or execution. All requests must be supported by a sealed court order or process.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-gray-900 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-[13px] mb-1">Sheriff's Office — Waigani</p>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+67532579030" className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-white transition-colors"><Phone className="w-3.5 h-3.5" /> +675 325 7930</a>
                <a href="mailto:sheriff@judiciary.gov.pg" className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-white transition-colors"><Mail className="w-3.5 h-3.5" /> sheriff@judiciary.gov.pg</a>
              </div>
            </div>
            <Link href="/contact?dept=national-court" className="shrink-0 inline-flex items-center gap-2 h-9 px-5 rounded-lg text-[12px] font-semibold bg-blue-700 hover:bg-blue-800 text-white transition-colors">
              Make Enquiry <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
