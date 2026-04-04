"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import PageHero from "@/components/PageHero"
import { Shield, ChevronRight, Mail, Phone, MapPin, FileText } from "lucide-react"

const SECTIONS = [
  { id: "introduction",    title: "1. Introduction" },
  { id: "collection",      title: "2. Information We Collect" },
  { id: "use",             title: "3. How We Use Your Information" },
  { id: "disclosure",      title: "4. Disclosure of Information" },
  { id: "security",        title: "5. Data Security" },
  { id: "cookies",         title: "6. Cookies & Analytics" },
  { id: "retention",       title: "7. Retention of Records" },
  { id: "rights",          title: "8. Your Rights" },
  { id: "third-party",     title: "9. Third-Party Links" },
  { id: "changes",         title: "10. Changes to This Policy" },
  { id: "contact",         title: "11. Contact — Privacy Officer" },
]

function TableOfContents({ activeId }: { activeId: string }) {
  return (
    <nav className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2 px-3 py-2.5 mb-1 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-[hsl(352,83%,44%)]/10 flex items-center justify-center shrink-0">
          <Shield className="w-3.5 h-3.5 text-[hsl(352,83%,44%)]" />
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
        <Link href="/disclaimer" className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[hsl(352,83%,44%)] transition-colors">
          <FileText className="w-3 h-3" /> View Disclaimer <ChevronRight className="w-3 h-3 ml-auto" />
        </Link>
        <Link href="/terms" className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[hsl(352,83%,44%)] transition-colors mt-2">
          <FileText className="w-3 h-3" /> Terms of Use <ChevronRight className="w-3 h-3 ml-auto" />
        </Link>
      </div>
    </nav>
  )
}

export default function PrivacyPolicy() {
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
        title="Privacy Policy"
        subtitle="How the National Judicial Staff Service collects, uses, and protects your personal information."
        crumbs={[{ label: "Privacy Policy" }]}
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
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header strip */}
                <div className="h-1 bg-linear-to-r from-[hsl(352,83%,44%)] via-amber-400 to-[hsl(352,83%,44%)]" />
                <div className="px-6 md:px-10 py-8">

                  {/* Mobile date + related links */}
                  <div className="lg:hidden flex flex-wrap items-center justify-between gap-3 mb-6 pb-6 border-b border-gray-100">
                    <p className="text-xs text-gray-400">
                      <strong className="text-gray-600">Effective:</strong> 1 January 2026 &nbsp;·&nbsp; <strong className="text-gray-600">Updated:</strong> 1 April 2026
                    </p>
                    <div className="flex gap-3 text-xs">
                      <Link href="/disclaimer" className="text-[hsl(352,83%,44%)] hover:underline">Disclaimer</Link>
                      <Link href="/terms" className="text-[hsl(352,83%,44%)] hover:underline">Terms of Use</Link>
                    </div>
                  </div>

                  <div className="space-y-12">

                    <section id="introduction">
                      <h2 className="text-base font-bold text-[hsl(352,83%,44%)] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] text-[10px] font-extrabold flex items-center justify-center shrink-0">1</span>
                        Introduction
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        The National Judicial Staff Service (NJSS) is committed to protecting the privacy of individuals who interact with our website and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information in accordance with the laws of the Independent State of Papua New Guinea, including applicable DICT policies and government data protection obligations.
                      </p>
                    </section>

                    <section id="collection">
                      <h2 className="text-base font-bold text-[hsl(352,83%,44%)] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] text-[10px] font-extrabold flex items-center justify-center shrink-0">2</span>
                        Information We Collect
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">We may collect the following types of personal information when you use this website or contact the NJSS:</p>
                      <ul className="space-y-2">
                        {[
                          "Identity information: full name, date of birth, gender, nationality",
                          "Contact information: postal address, telephone number, email address",
                          "Professional information: occupation, organisation, legal practitioner status",
                          "Enquiry and correspondence details: messages submitted through our contact form",
                          "Technical data: IP address, browser type, pages visited, and session duration (collected automatically via server logs)",
                        ].map(item => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(352,83%,44%)] mt-2 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section id="use">
                      <h2 className="text-base font-bold text-[hsl(352,83%,44%)] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] text-[10px] font-extrabold flex items-center justify-center shrink-0">3</span>
                        How We Use Your Information
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">The NJSS uses your personal information for the following purposes:</p>
                      <ul className="space-y-2">
                        {[
                          "Responding to public enquiries and correspondence directed to the NJSS or its registries",
                          "Administering court registry services and processing court-related requests",
                          "Providing access to court documents, forms, and public judicial information",
                          "Improving the accessibility and functionality of this website",
                          "Complying with our obligations under PNG law, including the Constitution and judicial administration legislation",
                          "Maintaining the security and integrity of our systems",
                        ].map(item => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(352,83%,44%)] mt-2 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section id="disclosure">
                      <h2 className="text-base font-bold text-[hsl(352,83%,44%)] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] text-[10px] font-extrabold flex items-center justify-center shrink-0">4</span>
                        Disclosure of Information
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">The NJSS does not sell, rent, or trade personal information. We may share information in the following limited circumstances:</p>
                      <ul className="space-y-2">
                        {[
                          "With other government agencies where required by law or court order",
                          "With legal practitioners and parties to proceedings where disclosure is authorised under court rules",
                          "With contracted ICT service providers who support our digital infrastructure, under strict confidentiality obligations",
                          "In response to a lawful request from a law enforcement or regulatory authority",
                        ].map(item => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(352,83%,44%)] mt-2 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section id="security">
                      <h2 className="text-base font-bold text-[hsl(352,83%,44%)] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] text-[10px] font-extrabold flex items-center justify-center shrink-0">5</span>
                        Data Security
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        The NJSS implements reasonable physical, electronic, and procedural safeguards to protect personal information from unauthorised access, disclosure, alteration, or destruction. These include HTTPS encryption, access controls, audit logging, and compliance with DICT security standards. Access to personal data is restricted to authorised NJSS personnel with a legitimate need.
                      </p>
                    </section>

                    <section id="cookies">
                      <h2 className="text-base font-bold text-[hsl(352,83%,44%)] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] text-[10px] font-extrabold flex items-center justify-center shrink-0">6</span>
                        Cookies &amp; Website Analytics
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        This website uses session cookies to support basic functionality. We do not use third-party tracking or advertising cookies. Server logs may capture aggregate usage data for performance and security monitoring. No personally identifiable information is sold or shared with analytics third parties. You may disable cookies in your browser settings; some website features may be affected.
                      </p>
                    </section>

                    <section id="retention">
                      <h2 className="text-base font-bold text-[hsl(352,83%,44%)] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] text-[10px] font-extrabold flex items-center justify-center shrink-0">7</span>
                        Retention of Records
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Personal information collected through this website is retained only for as long as necessary to fulfil the stated purpose, or as required by applicable PNG law and government records management policies. General enquiry correspondence is typically retained for a minimum of three (3) years. Court records are governed by separate judicial records retention schedules.
                      </p>
                    </section>

                    <section id="rights">
                      <h2 className="text-base font-bold text-[hsl(352,83%,44%)] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] text-[10px] font-extrabold flex items-center justify-center shrink-0">8</span>
                        Your Rights
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">Subject to applicable law, you may have the right to:</p>
                      <ul className="space-y-2">
                        {[
                          "Request access to personal information the NJSS holds about you",
                          "Request correction of inaccurate or out-of-date information",
                          "Lodge a complaint if you believe your privacy rights have been breached",
                          "Withdraw consent for uses of your information that are not required by law",
                        ].map(item => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(352,83%,44%)] mt-2 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section id="third-party">
                      <h2 className="text-base font-bold text-[hsl(352,83%,44%)] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] text-[10px] font-extrabold flex items-center justify-center shrink-0">9</span>
                        Third-Party Links
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        This website contains links to external websites including PacLII, government agencies, and other judicial resources. The NJSS is not responsible for the privacy practices or content of those external sites. We encourage you to review their privacy policies before submitting any personal information.
                      </p>
                    </section>

                    <section id="changes">
                      <h2 className="text-base font-bold text-[hsl(352,83%,44%)] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] text-[10px] font-extrabold flex items-center justify-center shrink-0">10</span>
                        Changes to This Policy
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        The NJSS may update this Privacy Policy from time to time to reflect changes in law, technology, or our operational practices. Any changes will be published on this page with an updated effective date. Continued use of this website after publication of changes constitutes acceptance of the updated policy.
                      </p>
                    </section>

                    <section id="contact">
                      <h2 className="text-base font-bold text-[hsl(352,83%,44%)] mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[hsl(352,83%,44%)]/10 text-[hsl(352,83%,44%)] text-[10px] font-extrabold flex items-center justify-center shrink-0">11</span>
                        Contact — Privacy Officer
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">
                        If you have any questions, concerns, or requests relating to this Privacy Policy or the handling of your personal information, please contact:
                      </p>
                      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-3">
                        <p className="font-semibold text-gray-800 text-sm">National Judicial Staff Service — Privacy Officer</p>
                        <div className="flex items-start gap-2.5 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          Waigani Court Complex, Waigani Drive, Waigani, NCD, Papua New Guinea
                        </div>
                        <a href="mailto:privacy@judiciary.gov.pg" className="flex items-center gap-2.5 text-sm text-gray-600 hover:text-[hsl(352,83%,44%)] transition-colors">
                          <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                          privacy@judiciary.gov.pg
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
