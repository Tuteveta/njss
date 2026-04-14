"use client"
import PageHero from "@/components/PageHero"

const sections = [
  {
    title: "1. Introduction",
    content: `The National Judicial Staff Service (NJSS) is committed to protecting the privacy of individuals who interact with our website and services. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information in accordance with the laws of the Independent State of Papua New Guinea, including applicable DICT policies and government data protection obligations.`,
  },
  {
    title: "2. Information We Collect",
    content: `We may collect the following types of personal information when you use this website or contact the NJSS:`,
    list: [
      "Identity information: full name, date of birth, gender, nationality",
      "Contact information: postal address, telephone number, email address",
      "Professional information: occupation, organisation, legal practitioner status",
      "Enquiry and correspondence details: messages submitted through our contact form",
      "Technical data: IP address, browser type, pages visited, and session duration (collected automatically via server logs)",
    ],
  },
  {
    title: "3. How We Use Your Information",
    content: `The NJSS uses your personal information for the following purposes:`,
    list: [
      "Responding to public enquiries and correspondence directed to the NJSS or its registries",
      "Administering court registry services and processing court-related requests",
      "Providing access to court documents, forms, and public judicial information",
      "Improving the accessibility and functionality of this website",
      "Complying with our obligations under PNG law, including the Constitution and judicial administration legislation",
      "Maintaining the security and integrity of our systems",
    ],
  },
  {
    title: "4. Disclosure of Information",
    content: `The NJSS does not sell, rent, or trade personal information. We may share information in the following limited circumstances:`,
    list: [
      "With other government agencies where required by law or court order",
      "With legal practitioners and parties to proceedings where disclosure is authorised under court rules",
      "With contracted ICT service providers who support our digital infrastructure, under strict confidentiality obligations",
      "In response to a lawful request from a law enforcement or regulatory authority",
    ],
  },
  {
    title: "5. Data Security",
    content: `The NJSS implements reasonable physical, electronic, and procedural safeguards to protect personal information from unauthorised access, disclosure, alteration, or destruction. These include HTTPS encryption, access controls, audit logging, and compliance with DICT security standards. Access to personal data is restricted to authorised NJSS personnel with a legitimate need.`,
  },
  {
    title: "6. Cookies & Website Analytics",
    content: `This website uses session cookies to support basic functionality. We do not use third-party tracking or advertising cookies. Server logs may capture aggregate usage data for performance and security monitoring. No personally identifiable information is sold or shared with analytics third parties. You may disable cookies in your browser settings; some website features may be affected.`,
  },
  {
    title: "7. Retention of Records",
    content: `Personal information collected through this website is retained only for as long as necessary to fulfil the stated purpose, or as required by applicable PNG law and government records management policies. General enquiry correspondence is typically retained for a minimum of three (3) years. Court records are governed by separate judicial records retention schedules.`,
  },
  {
    title: "8. Your Rights",
    content: `Subject to applicable law, you may have the right to:`,
    list: [
      "Request access to personal information the NJSS holds about you",
      "Request correction of inaccurate or out-of-date information",
      "Lodge a complaint if you believe your privacy rights have been breached",
      "Withdraw consent for uses of your information that are not required by law",
    ],
  },
  {
    title: "9. Third-Party Links",
    content: `This website contains links to external websites including PacLII, government agencies, and other judicial resources. The NJSS is not responsible for the privacy practices or content of those external sites. We encourage you to review their privacy policies before submitting any personal information.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `The NJSS may update this Privacy Policy from time to time to reflect changes in law, technology, or our operational practices. Any changes will be published on this page with an updated effective date. Continued use of this website after publication of changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "11. Contact — Privacy Officer",
    content: `If you have any questions, concerns, or requests relating to this Privacy Policy or the handling of your personal information, please contact:`,
    contact: {
      name: "National Judicial Staff Service — Privacy Officer",
      address: "Waigani Court Complex, Waigani Drive, Waigani, NCD, Papua New Guinea",
      email: "privacy@judiciary.gov.pg",
      phone: "+675 325 7902",
    },
  },
]

export default function PrivacyPolicy() {
  return (
    <div>
      <PageHero
        badge="Legal"
        title="Privacy Policy"
        subtitle="How the National Judicial Staff Service collects, uses, and protects your personal information."
        crumbs={[{ label: "Privacy Policy" }]}
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
            <p className="text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
              <strong>Effective Date:</strong> 1 January 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> 1 April 2026
            </p>

            <div className="space-y-10">
              {sections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-lg font-bold text-[hsl(352,83%,44%)] mb-3">{section.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>

                  {section.list && (
                    <ul className="mt-3 space-y-2" role="list">
                      {section.list.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(352,83%,44%)] mt-2 shrink-0" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.contact && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
                      <div className="font-medium text-gray-800">{section.contact.name}</div>
                      <div>{section.contact.address}</div>
                      <div>Email: <a href={`mailto:${section.contact.email}`} className="text-[hsl(352,83%,44%)] hover:underline">{section.contact.email}</a></div>
                      <div>Phone: <a href={`tel:${section.contact.phone}`} className="hover:underline">{section.contact.phone}</a></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
