"use client"
import PageHero from "@/components/PageHero"

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the National Judicial Staff Service (NJSS) website, you agree to be bound by these Terms of Use. If you do not agree to these terms, please discontinue use of this website immediately. The NJSS reserves the right to modify these terms at any time, and continued use of the website constitutes acceptance of any changes.`,
  },
  {
    title: "2. Purpose of the Website",
    content: `This website is maintained by the National Judicial Staff Service, a statutory service established under the National Judicial Staff Service Act 1987, on behalf of the Supreme Court and National Court of Papua New Guinea. It is intended to provide the public, legal practitioners, and other stakeholders with information about PNG's superior courts, court listings, registry services, and judicial resources.`,
  },
  {
    title: "3. Use of Information",
    content: `Information published on this website is provided for general public information purposes only. While the NJSS endeavours to ensure the accuracy and currency of all content:`,
    list: [
      "Content does not constitute legal advice and should not be relied upon as such",
      "The NJSS makes no warranties regarding the completeness, accuracy, or fitness for purpose of any content",
      "Users should seek independent legal advice from a qualified practitioner for their specific circumstances",
      "Legislation, court rules, practice directions, and listings are subject to change without notice",
      "Court listings and diary information are indicative only and subject to change — always confirm with the relevant Registry",
    ],
  },
  {
    title: "4. Court Forms and Documents",
    content: `When downloading or using forms obtained from this website:`,
    list: [
      "Forms are provided for convenience and must be completed accurately and in accordance with applicable rules",
      "Filing of a form or document does not by itself constitute acceptance by the Court",
      "The NJSS accepts no liability for errors resulting from the use of outdated or incorrectly completed forms",
      "For certified or current versions of court forms, contact the relevant registry directly",
      "You are responsible for retaining copies of all documents filed with the Court",
    ],
  },
  {
    title: "5. Intellectual Property",
    content: `All content on this website, including text, graphics, logos, images, court forms, and documents, is the property of the National Judicial Staff Service, the Government of Papua New Guinea, or its licensors. You may:`,
    list: [
      "Download and print content for personal, non-commercial, or professional legal use",
      "Share links to pages on this website",
      "Reproduce content with appropriate attribution to the NJSS and the PNG Judiciary",
    ],
  },
  {
    title: "6. Prohibited Activities",
    content: `You must not use this website to:`,
    list: [
      "Submit false, fraudulent, or misleading information",
      "Attempt to gain unauthorised access to court systems, case management platforms, or administrative databases",
      "Interfere with the operation, performance, or security of this website",
      "Harvest or collect personal information about court users or registry staff",
      "Transmit malware, viruses, or any harmful or disruptive code",
      "Misrepresent your identity or impersonate a judicial officer, registry staff member, or legal practitioner",
      "Engage in any activity that violates applicable PNG law or court rules",
    ],
  },
  {
    title: "7. Court Listings and Diary",
    content: `Court listing information published on this website is provided as a public service. The NJSS does not guarantee the accuracy or completeness of listings at any given time. Listings may be amended, adjourned, or vacated without prior notice. Parties, counsel, and the public must independently verify listings with the relevant Registry before attending court.`,
  },
  {
    title: "8. External Links",
    content: `This website contains links to external resources including PacLII, government agencies, the Law Reform Commission, and other judicial websites. The NJSS does not endorse or accept responsibility for the content, accuracy, or availability of those external sites. Links are provided for convenience and information purposes only.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `To the extent permitted by law, the NJSS and the Government of Papua New Guinea shall not be liable for any loss or damage arising from your use of, or reliance on, information published on this website. This includes direct, indirect, incidental, or consequential loss arising from inaccuracies, omissions, system downtime, listing changes, or unauthorised access to this website.`,
  },
  {
    title: "10. Privacy",
    content: `Your use of this website is also governed by our Privacy Policy, which is incorporated into these Terms of Use by reference. By using this website, you consent to the collection and handling of your information as described in the Privacy Policy.`,
  },
  {
    title: "11. Accessibility",
    content: `The NJSS is committed to making this website accessible to all users, including persons with disabilities, in accordance with the Web Content Accessibility Guidelines (WCAG) 2.1. If you experience any accessibility barriers, please contact us so we can assist you and work to resolve the issue.`,
  },
  {
    title: "12. Governing Law",
    content: `These Terms of Use are governed by the laws of the Independent State of Papua New Guinea. Any dispute arising from the use of this website shall be subject to the exclusive jurisdiction of the courts of Papua New Guinea.`,
  },
  {
    title: "13. Contact",
    content: `For enquiries regarding these Terms of Use, please contact:`,
    contact: {
      name: "National Judicial Staff Service — Web Administrator",
      address: "Waigani Court Complex, Waigani Drive, Waigani, NCD, Papua New Guinea",
      email: "info@judiciary.gov.pg",
      phone: "+675 325 7902",
    },
  },
]

export default function TermsOfUse() {
  return (
    <div>
      <PageHero
        badge="Legal"
        title="Terms of Use"
        subtitle="Please read these terms carefully before using the NJSS website and online services."
        crumbs={[{ label: "Terms of Use" }]}
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
