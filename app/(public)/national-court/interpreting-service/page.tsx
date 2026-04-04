import Link from "next/link"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import { Languages, Phone, Mail, CheckCircle, AlertTriangle, ArrowRight, Clock } from "lucide-react"

const LANGUAGES = [
  "Tok Pisin (Creole)",
  "Hiri Motu",
  "Kuanua (Tolai)",
  "Kâte",
  "Enga",
  "Melpa",
  "Kunimaipa",
  "Motu",
  "Dobu",
  "Kewa",
  "Chimbu (Kuman)",
  "Wahgi",
  "Taiap",
  "Yabem",
  "Anuki",
  "Mekeo",
]

const SERVICES = [
  { title: "Courtroom Interpreting",    desc: "Consecutive and simultaneous interpretation for accused persons, witnesses, and parties who do not speak English in National Court and Supreme Court proceedings." },
  { title: "Witness Examination",        desc: "Interpretation during examination-in-chief, cross-examination, and re-examination of witnesses testifying in Papua New Guinean languages." },
  { title: "Document Translation",       desc: "Translation of court documents, affidavits, and exhibits between English and PNG vernacular languages where required by the court." },
  { title: "Pre-Trial Conferences",      desc: "Interpreting services for pre-trial conferences, pleas, bail applications, and mention hearings involving non-English speakers." },
  { title: "Circuit Court Interpreting", desc: "Provision of interpreters for circuit court sittings in provincial centres and remote locations across Papua New Guinea." },
]

const HOW_TO_REQUEST = [
  { step: "01", title: "Identify Language Needed",  desc: "Confirm the specific language or dialect required. Where possible, identify this at the earliest stage of proceedings." },
  { step: "02", title: "Submit Request to Registry", desc: "File a written request for an interpreter with the National Court Registry, specifying the language, hearing date, and estimated duration." },
  { step: "03", title: "Minimum Notice Period",       desc: "Requests should be lodged at least 5 working days before the hearing. Urgent requests may be considered with shorter notice." },
  { step: "04", title: "Confirmation",               desc: "The Registry will confirm availability of a qualified interpreter and advise of any additional requirements." },
]

export default function InterpretingServicePage() {
  return (
    <div>
      <PageHero
        badge="National Court"
        crumbs={[
          { label: "National Court", href: "/national-court/daily-diary" },
          { label: "Interpreting Service" },
        ]}
        title="Interpreting Service"
        subtitle="Accredited court interpreting services for all National Court and Supreme Court proceedings."
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="national-court" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Notice */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-8">
            <Languages className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[12px] text-blue-800 leading-relaxed">
              Every person has the right to a fair trial. If an accused person or witness does not sufficiently understand English, the court must provide a qualified interpreter. Request interpreting services as early as possible to ensure availability.
            </p>
          </div>

          {/* Services */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Services Provided</h2>
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

          {/* Languages */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Languages Available</h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(l => (
                  <span key={l} className="text-[12px] bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">{l}</span>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-4">
                Additional languages may be available on request. Contact the Registry for languages not listed above. PNG has over 800 languages — the NJSS maintains a register of qualified interpreters.
              </p>
            </div>
          </div>

          {/* How to request */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">How to Request an Interpreter</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {HOW_TO_REQUEST.map(s => (
                <div key={s.step} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                  <div className="text-2xl font-extrabold text-gray-100 leading-none mb-2">{s.step}</div>
                  <p className="font-bold text-gray-900 text-[13.5px] mb-1">{s.title}</p>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-800 leading-relaxed">
              <strong>Minimum 5 working days notice required.</strong> Last-minute requests may result in adjournment of proceedings. Requests for circuit court interpreters require additional lead time.
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-white text-[13px] mb-1">Interpreting Services — Waigani Registry</p>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+67532579035" className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-white transition-colors"><Phone className="w-3.5 h-3.5" /> +675 325 7935</a>
                <a href="mailto:interpreting@judiciary.gov.pg" className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-white transition-colors"><Mail className="w-3.5 h-3.5" /> interpreting@judiciary.gov.pg</a>
                <span className="flex items-center gap-1.5 text-[12px] text-gray-400"><Clock className="w-3.5 h-3.5" /> Mon–Fri 8AM–4PM</span>
              </div>
            </div>
            <Link href="/contact?dept=national-court" className="shrink-0 inline-flex items-center gap-2 h-9 px-5 rounded-lg text-[12px] font-semibold bg-blue-700 hover:bg-blue-800 text-white transition-colors">
              Request Interpreter <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
