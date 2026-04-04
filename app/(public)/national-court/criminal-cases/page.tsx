import Link from "next/link"
import PageHero from "@/components/PageHero"
import SectionNav from "@/components/SectionNav"
import { Gavel, Scale, BookOpen, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react"

const JURISDICTION = [
  "All indictable criminal offences under the Criminal Code Act (Chapter 262)",
  "Drug trafficking and serious drug offences under the Dangerous Drugs Act",
  "Corruption and serious fraud matters referred from the Committal Court",
  "Wilful murder, murder, manslaughter, and serious assault matters",
  "Robbery, breaking and entering, misappropriation, and forgery",
  "Sexual offences including rape, incest, and child sexual abuse",
  "Appeals from the District Court on sentence and conviction",
  "Applications for bail, habeas corpus, and judicial review in criminal matters",
]

const PROCEDURE_STEPS = [
  { step: "01", title: "Committal Proceedings",    desc: "Criminal matters begin in the District (Committal) Court. The prosecution presents evidence to establish a prima facie case for trial. If committed for trial, the matter is referred to the National Court." },
  { step: "02", title: "Indictment Filed",          desc: "The Public Prosecutor files an indictment in the National Court Registry within the prescribed timeframe following committal." },
  { step: "03", title: "Arraignment",               desc: "The accused appears before a National Court judge and is formally arraigned — the indictment is read and a plea entered." },
  { step: "04", title: "Pre-Trial Conference",      desc: "A pre-trial conference is held to identify issues, admit agreed facts, and set a trial date or sentence date." },
  { step: "05", title: "Trial or Sentence Hearing", desc: "If the accused pleads not guilty, a trial is conducted before a judge (without jury). If guilty, a sentence hearing follows." },
  { step: "06", title: "Verdict and Sentence",      desc: "The judge delivers a verdict after trial, or imposes sentence after a plea of guilty or finding of guilt." },
]

const DIVISIONS = [
  { name: "General Criminal",   desc: "Handles the majority of indictable criminal matters including murder, robbery, rape, and serious assaults." },
  { name: "Drug Court Division", desc: "Specialised division for drug-related offences, with a focus on rehabilitation for eligible offenders." },
  { name: "Appeal Division",     desc: "Hears appeals against conviction and sentence from the District Court and Committal Court." },
]

const KEY_LINKS = [
  { label: "Criminal Code Act (Chapter 262)", href: "/national-court/acts-rules" },
  { label: "District Courts Act (Chapter 40)",  href: "/national-court/acts-rules" },
  { label: "Bail Act (Chapter 340)",            href: "/national-court/acts-rules" },
  { label: "National Court Criminal Listings",  href: "/national-court/listings" },
]

export default function CriminalCasesPage() {
  return (
    <div>
      <PageHero
        badge="National Court"
        crumbs={[
          { label: "National Court", href: "/national-court/daily-diary" },
          { label: "Criminal Cases" },
        ]}
        title="Criminal Cases"
        subtitle="The National Court has unlimited criminal jurisdiction and hears all serious indictable offences in Papua New Guinea."
        image="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80"
      />

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-12">
          <div className="flex items-start gap-8">
            <SectionNav section="national-court" />
            <div className="flex-1 min-w-0 space-y-12">

          {/* Legal advice note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-8">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[12px] text-amber-800 leading-relaxed">
              If you are charged with a criminal offence, you have the right to legal representation. Contact the <strong>Public Solicitor's Office</strong> at +675 322 5300 if you cannot afford a private lawyer.
            </p>
          </div>

          {/* Jurisdiction */}
          <div className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-[15px]">Criminal Jurisdiction</h2>
                <p className="text-[12px] text-gray-500 mt-0.5">Matters the National Court is empowered to hear</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {JURISDICTION.map(j => (
                <div key={j} className="flex items-start gap-2.5 bg-white rounded-lg border border-gray-200 px-4 py-3">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-[12.5px] text-gray-700">{j}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divisions */}
          <div className="mb-10">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">Criminal Divisions</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {DIVISIONS.map(d => (
                <div key={d.name} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                    <Gavel className="w-4 h-4 text-blue-700" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-[13.5px] mb-1">{d.name}</h3>
                  <p className="text-[12px] text-gray-500 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Procedure */}
          <div className="mb-10">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-[15px]">Criminal Procedure</h2>
                <p className="text-[12px] text-gray-500 mt-0.5">How a criminal matter progresses through the National Court</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {PROCEDURE_STEPS.map(s => (
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

          {/* Key Links */}
          <div className="mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">Relevant Legislation &amp; Resources</h2>
            <div className="flex flex-col gap-2">
              {KEY_LINKS.map(l => (
                <Link key={l.label} href={l.href} className="flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3 hover:border-blue-200 transition-colors group">
                  <span className="text-[13px] text-gray-700 group-hover:text-blue-700 font-medium">{l.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
