"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import PageHero from "@/components/PageHero"
import { AlertTriangle, ChevronRight, Mail, Phone, MapPin, FileText, Shield } from "lucide-react"

const SECTIONS = [
  { id: "general",         title: "1. General Disclaimer" },
  { id: "no-legal-advice", title: "2. Not Legal Advice" },
  { id: "accuracy",        title: "3. Accuracy of Information" },
  { id: "listings",        title: "4. Court Listings & Diary" },
  { id: "forms",           title: "5. Court Forms & Documents" },
  { id: "external-links",  title: "6. External Links" },
  { id: "availability",    title: "7. Website Availability" },
  { id: "liability",       title: "8. Limitation of Liability" },
  { id: "jurisdiction",    title: "9. Governing Law" },
  { id: "contact",         title: "10. Contact" },
]

function TableOfContents({ activeId }: { activeId: string }) {
  return (
    <nav className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2 px-3 py-2.5 mb-1 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Contents</span>
      </div>
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`px-3 py-2 rounded-lg text-[12px] transition-all duration-100 leading-snug ${
            activeId === s.id
              ? "bg-[hsl(352,83%,44%)]/8 text-[hsl(352,83%,40%)] font-semibold"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
          }`}
        >
          {s.title}
        </a>
      ))}
      <div className="mt-3 pt-3 border-t border-gray-100 px-3">
        <Link href="/privacy" className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[hsl(352,83%,44%)] transition-colors">
          <Shield className="w-3 h-3" /> Privacy Policy <ChevronRight className="w-3 h-3 ml-auto" />
        </Link>
        <Link href="/terms" className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[hsl(352,83%,44%)] transition-colors mt-2">
          <FileText className="w-3 h-3" /> Terms of Use <ChevronRight className="w-3 h-3 ml-auto" />
        </Link>
      </div>
    </nav>
  )
}

function SectionHeading({ n, title }: { n: string; title: string }) {
  return (
    <h2 className="text-base font-bold text-[hsl(352,83%,44%)] mb-3 flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] text-[10px] font-extrabold flex items-center justify-center shrink-0">{n}</span>
      {title}
    </h2>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mt-3">
      {items.map(item => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(352,83%,44%)] mt-2 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function Disclaimer() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    )
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div>
      <PageHero
        badge="Legal"
        title="Disclaimer"
        subtitle="Important information about the limitations and intended use of information published on the NJSS website."
        crumbs={[{ label: "Disclaimer" }]}
      />

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 py-10 lg:py-14">
          <div className="flex gap-8 lg:gap-12 items-start">

            {/* Sticky TOC */}
            <aside className="hidden lg:block w-60 shrink-0 sticky top-24 self-start">
              <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm">
                <TableOfContents activeId={activeId} />
              </div>
              <div className="mt-4 bg-gray-900 rounded-2xl p-4 text-center">
                <p className="text-[11px] text-gray-400 mb-1 font-semibold uppercase tracking-wider">Effective Date</p>
                <p className="text-white text-sm font-bold">1 January 2026</p>
                <p className="text-[11px] text-gray-500 mt-1">Last updated 1 April 2026</p>
              </div>
            </aside>

            {/* Content */}
            <main className="flex-1 min-w-0">
              {/* Prominent notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>Important:</strong> Information on this website is for general reference only and does not constitute legal advice. Always consult a qualified legal practitioner for advice on your specific circumstances.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="h-1 bg-linear-to-r from-[hsl(352,83%,44%)] via-amber-400 to-[hsl(352,83%,44%)]" />
                <div className="px-6 md:px-10 py-8">

                  {/* Mobile date + links */}
                  <div className="lg:hidden flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-gray-100">
                    <p className="text-xs text-gray-400">
                      <strong className="text-gray-600">Effective:</strong> 1 January 2026 &nbsp;·&nbsp; <strong className="text-gray-600">Updated:</strong> 1 April 2026
                    </p>
                    <div className="flex gap-3 text-xs">
                      <Link href="/privacy" className="text-[hsl(352,83%,44%)] hover:underline">Privacy Policy</Link>
                      <Link href="/terms" className="text-[hsl(352,83%,44%)] hover:underline">Terms of Use</Link>
                    </div>
                  </div>

                  <div className="space-y-12">

                    <section id="general">
                      <SectionHeading n="1" title="General Disclaimer" />
                      <p className="text-sm text-gray-600 leading-relaxed">
                        The National Judicial Staff Service (NJSS) maintains this website on behalf of the Supreme Court and National Court of Papua New Guinea for the purpose of providing public access to judicial information, court services, and registry resources. While every effort is made to ensure the accuracy and currency of content published on this website, the NJSS provides all information on an "as is" basis without warranty of any kind, express or implied.
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed mt-3">
                        By accessing and using this website, you acknowledge and agree to the terms of this Disclaimer. If you do not accept these terms, you should discontinue use of this website immediately.
                      </p>
                    </section>

                    <section id="no-legal-advice">
                      <SectionHeading n="2" title="Not Legal Advice" />
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        Nothing on this website constitutes legal advice. All content — including court listings, legislation summaries, procedural guides, court forms, library resources, and general information — is provided for general reference purposes only. The NJSS strongly advises:
                      </p>
                      <BulletList items={[
                        "Individuals involved in legal proceedings should seek independent legal advice from a qualified legal practitioner registered with the Papua New Guinea Law Society",
                        "Court forms, rules, and procedures change over time — always confirm current requirements with the relevant Registry before filing",
                        "Information about court listings and hearing dates is provided for convenience only and must be verified directly with the Registry",
                        "Summaries of legislation or case law on this website are not authoritative and should not be relied upon in place of the primary source",
                      ]} />
                    </section>

                    <section id="accuracy">
                      <SectionHeading n="3" title="Accuracy of Information" />
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        The NJSS takes reasonable care to publish accurate and current information. However:
                      </p>
                      <BulletList items={[
                        "Information may not reflect the most recent legislative amendments, court rules, or practice directions at the time of viewing",
                        "Judicial decisions, listings, and diary information are subject to amendment, adjournment, or variation without notice",
                        "The NJSS does not warrant that any content on this website is free from errors, omissions, or inaccuracies",
                        "Users are responsible for independently verifying any information before acting upon it",
                        "For official certified copies of court documents and orders, contact the relevant Registry directly",
                      ]} />
                    </section>

                    <section id="listings">
                      <SectionHeading n="4" title="Court Listings &amp; Diary" />
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Court listing information and court diary entries published on this website are provided as a public convenience service only. The NJSS does not guarantee that listings are complete, accurate, or current at the time of viewing. Matters may be adjourned, vacated, relisted, or otherwise amended at any time without prior notice on this website. Parties, counsel, and members of the public must independently confirm listing details with the relevant court Registry before attending any hearing.
                      </p>
                      <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-4">
                        <p className="text-sm text-red-800 font-semibold mb-1">Important Notice</p>
                        <p className="text-sm text-red-700 leading-relaxed">
                          Reliance on court diary or listing information published on this website as the sole basis for attending or not attending a court hearing is done entirely at the user's own risk.
                        </p>
                      </div>
                    </section>

                    <section id="forms">
                      <SectionHeading n="5" title="Court Forms &amp; Documents" />
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        Court forms published on this website are provided for the convenience of users. When downloading and using these forms:
                      </p>
                      <BulletList items={[
                        "Forms may have been updated since publication on this website — always confirm currency with the Registry",
                        "Completing and lodging a form does not by itself constitute acceptance of the filing by the Court",
                        "Incorrectly completed forms may be rejected by the Registry and may affect your legal rights",
                        "The NJSS accepts no responsibility for consequences arising from the use of outdated, incorrectly completed, or improperly filed forms",
                        "For certified, authenticated, or official copies of court documents, contact the Registry directly",
                      ]} />
                    </section>

                    <section id="external-links">
                      <SectionHeading n="6" title="External Links" />
                      <p className="text-sm text-gray-600 leading-relaxed">
                        This website contains links to external websites including PacLII, the National Parliament of Papua New Guinea, the Law Reform Commission, the PNG Law Society, and other government and judicial websites. These links are provided for the convenience and information of users only. The NJSS does not endorse, control, or accept any responsibility for the content, accuracy, legality, availability, or privacy practices of any external website. The NJSS is not responsible for any loss or damage arising from your use of, or reliance on, any external website accessible through links on this site.
                      </p>
                    </section>

                    <section id="availability">
                      <SectionHeading n="7" title="Website Availability" />
                      <p className="text-sm text-gray-600 leading-relaxed">
                        The NJSS does not guarantee continuous, uninterrupted access to this website. The website may be temporarily unavailable due to scheduled maintenance, technical difficulties, network outages, power failures, or other circumstances beyond the control of the NJSS. The NJSS shall not be liable for any loss, inconvenience, or damage caused by any period of unavailability of this website.
                      </p>
                    </section>

                    <section id="liability">
                      <SectionHeading n="8" title="Limitation of Liability" />
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">
                        To the maximum extent permitted by the laws of Papua New Guinea, the NJSS and the Independent State of Papua New Guinea expressly disclaim all liability for any loss or damage of any kind arising from:
                      </p>
                      <BulletList items={[
                        "Reliance on any information published on this website",
                        "Errors, omissions, or inaccuracies in any content on this website",
                        "Interruption, unavailability, or technical failures of this website",
                        "Unauthorised access to or alteration of content on this website",
                        "Actions taken or not taken on the basis of court listings, diary information, or forms",
                        "Loss of data or system damage resulting from accessing this website or any linked external site",
                      ]} />
                      <p className="text-sm text-gray-600 leading-relaxed mt-3">
                        This limitation applies to direct, indirect, incidental, consequential, and special damages, whether in contract, tort, or otherwise.
                      </p>
                    </section>

                    <section id="jurisdiction">
                      <SectionHeading n="9" title="Governing Law" />
                      <p className="text-sm text-gray-600 leading-relaxed">
                        This Disclaimer is governed by and construed in accordance with the laws of the Independent State of Papua New Guinea. Any dispute arising in connection with this Disclaimer or the use of this website shall be subject to the exclusive jurisdiction of the courts of Papua New Guinea.
                      </p>
                    </section>

                    <section id="contact">
                      <SectionHeading n="10" title="Contact" />
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        For enquiries regarding this Disclaimer or the content of this website, please contact:
                      </p>
                      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-3">
                        <p className="font-semibold text-gray-800 text-sm">National Judicial Staff Service — Web Administrator</p>
                        <div className="flex items-start gap-2.5 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          Waigani Court Complex, Waigani Drive, Waigani, NCD, Papua New Guinea
                        </div>
                        <a href="mailto:info@judiciary.gov.pg" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[hsl(352,83%,44%)] transition-colors">
                          <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                          info@judiciary.gov.pg
                        </a>
                        <a href="tel:+67532579002" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[hsl(352,83%,44%)] transition-colors">
                          <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                          +675 325 7902
                        </a>
                      </div>
                    </section>

                  </div>
                </div>
              </div>
            </main>

          </div>
        </div>
      </div>
    </div>
  )
}
