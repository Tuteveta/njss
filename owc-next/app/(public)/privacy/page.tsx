"use client"
import PageHero from "@/components/PageHero"

const sections = [
  {
    title: "1. Introduction",
    content: `The Office of Workers Compensation (OWC) is committed to protecting the privacy of individuals who interact with our services. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information in accordance with applicable Papua New Guinea laws and regulations.`,
  },
  {
    title: "2. Information We Collect",
    content: `We may collect the following types of personal information:`,
    list: [
      "Identity information: full name, date of birth, gender, nationality",
      "Contact information: postal address, phone number, email address",
      "Employment information: employer name, occupation, workplace location",
      "Injury and medical information: nature of injury, medical reports, treatment records",
      "Financial information: bank account details for compensation payments",
      "Claim-related documents: police reports, witness statements, medical certificates",
    ],
  },
  {
    title: "3. How We Use Your Information",
    content: `OWC uses your personal information for the following purposes:`,
    list: [
      "Processing and administering workers compensation claims",
      "Assessing eligibility for compensation and rehabilitation services",
      "Communicating with you about your claim or enquiry",
      "Complying with our obligations under the Workers Compensation Act 1978",
      "Conducting medical assessments and coordinating rehabilitation programs",
      "Detecting and preventing fraudulent claims",
      "Improving our services and systems",
    ],
  },
  {
    title: "4. Disclosure of Information",
    content: `We may share your personal information with:`,
    list: [
      "Accredited medical examiners and rehabilitation providers",
      "Your employer or their authorised insurer",
      "The Workers Compensation Tribunal and other relevant courts",
      "Government agencies where required by law",
      "Third-party service providers engaged to support OWC operations, under strict confidentiality agreements",
    ],
  },
  {
    title: "5. Data Security",
    content: `OWC takes reasonable steps to protect your personal information from unauthorised access, disclosure, alteration, or destruction. We maintain physical, electronic, and procedural safeguards consistent with applicable government security standards. Access to personal information is restricted to authorised personnel who need it to perform their duties.`,
  },
  {
    title: "6. Retention of Records",
    content: `Personal information held by OWC is retained for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. Claim records are generally retained for a minimum of seven (7) years following the closure of a claim.`,
  },
  {
    title: "7. Your Rights",
    content: `You have the right to:`,
    list: [
      "Request access to personal information we hold about you",
      "Request correction of inaccurate or incomplete information",
      "Lodge a complaint if you believe your privacy has been breached",
    ],
  },
  {
    title: "8. Cookies and Website Analytics",
    content: `Our website may use cookies and similar technologies to improve your browsing experience and gather aggregate usage statistics. No personally identifiable information is collected through cookies without your consent. You may disable cookies through your browser settings, though this may affect certain website functionality.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `OWC reserves the right to update this Privacy Policy at any time. Any changes will be published on this page with an updated effective date. We encourage you to review this policy periodically.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions or concerns regarding this Privacy Policy or your personal information, please contact us at:`,
    contact: {
      name: "Office of Workers Compensation — Privacy Officer",
      address: "Level 6, Kina House, Douglas Street, Port Moresby, NCD",
      email: "privacy@owc.gov.pg",
      phone: "+675 321 0000",
    },
  },
]

export default function PrivacyPolicy() {
  return (
    <div>
      <PageHero
        badge="Legal"
        title="Privacy Policy"
        subtitle="How the Office of Workers Compensation collects, uses, and protects your personal information."
        crumbs={[{ label: "Privacy Policy" }]}
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
            <p className="text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
              <strong>Effective Date:</strong> 1 January 2026 &nbsp;|&nbsp; <strong>Last Updated:</strong> 1 January 2026
            </p>

            <div className="space-y-10">
              {sections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-lg font-bold text-[hsl(210,70%,25%)] mb-3">{section.title}</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>

                  {section.list && (
                    <ul className="mt-3 space-y-2">
                      {section.list.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.contact && (
                    <div className="mt-3 bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
                      <div className="font-medium text-gray-800">{section.contact.name}</div>
                      <div>{section.contact.address}</div>
                      <div>Email: <a href={`mailto:${section.contact.email}`} className="text-[hsl(210,70%,25%)] hover:underline">{section.contact.email}</a></div>
                      <div>Phone: {section.contact.phone}</div>
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
