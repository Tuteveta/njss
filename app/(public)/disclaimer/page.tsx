"use client"
import PageHero from "@/components/PageHero"

const sections = [
  {
    title: "1. General Disclaimer",
    content: `The National Judicial Staff Service (NJSS) maintains this website on behalf of the Supreme Court and National Court of Papua New Guinea for the purpose of providing public access to judicial information, court services, and registry resources. While every effort is made to ensure the accuracy and currency of content published on this website, the NJSS provides all information on an "as is" basis without warranty of any kind, express or implied.`,
    extra: `By accessing and using this website, you acknowledge and agree to the terms of this Disclaimer. If you do not accept these terms, you should discontinue use of this website immediately.`,
  },
  {
    title: "2. Not Legal Advice",
    content: `Nothing on this website constitutes legal advice. All content — including court listings, legislation summaries, procedural guides, court forms, library resources, and general information — is provided for general reference purposes only. The NJSS strongly advises:`,
    list: [
      "Individuals involved in legal proceedings should seek independent legal advice from a qualified legal practitioner registered with the Papua New Guinea Law Society",
      "Court forms, rules, and procedures change over time — always confirm current requirements with the relevant Registry before filing",
      "Information about court listings and hearing dates is provided for convenience only and must be verified directly with the Registry",
      "Summaries of legislation or case law on this website are not authoritative and should not be relied upon in place of the primary source",
    ],
  },
  {
    title: "3. Accuracy of Information",
    content: `The NJSS takes reasonable care to publish accurate and current information. However:`,
    list: [
      "Information may not reflect the most recent legislative amendments, court rules, or practice directions at the time of viewing",
      "Judicial decisions, listings, and diary information are subject to amendment, adjournment, or variation without notice",
      "The NJSS does not warrant that any content on this website is free from errors, omissions, or inaccuracies",
      "Users are responsible for independently verifying any information before acting upon it",
      "For official certified copies of court documents and orders, contact the relevant Registry directly",
    ],
  },
  {
    title: "4. Court Listings & Diary",
    content: `Court listing information and court diary entries published on this website are provided as a public convenience service only. The NJSS does not guarantee that listings are complete, accurate, or current at the time of viewing. Matters may be adjourned, vacated, relisted, or otherwise amended at any time without prior notice on this website. Parties, counsel, and members of the public must independently confirm listing details with the relevant court Registry before attending any hearing.`,
    warning: `Reliance on court diary or listing information published on this website as the sole basis for attending or not attending a court hearing is done entirely at the user's own risk.`,
  },
  {
    title: "5. Court Forms & Documents",
    content: `Court forms published on this website are provided for the convenience of users. When downloading and using these forms:`,
    list: [
      "Forms may have been updated since publication on this website — always confirm currency with the Registry",
      "Completing and lodging a form does not by itself constitute acceptance of the filing by the Court",
      "Incorrectly completed forms may be rejected by the Registry and may affect your legal rights",
      "The NJSS accepts no responsibility for consequences arising from the use of outdated, incorrectly completed, or improperly filed forms",
      "For certified, authenticated, or official copies of court documents, contact the Registry directly",
    ],
  },
  {
    title: "6. External Links",
    content: `This website contains links to external websites including PacLII, the National Parliament of Papua New Guinea, the Law Reform Commission, the PNG Law Society, and other government and judicial websites. These links are provided for the convenience and information of users only. The NJSS does not endorse, control, or accept any responsibility for the content, accuracy, legality, availability, or privacy practices of any external website. The NJSS is not responsible for any loss or damage arising from your use of, or reliance on, any external website accessible through links on this site.`,
  },
  {
    title: "7. Website Availability",
    content: `The NJSS does not guarantee continuous, uninterrupted access to this website. The website may be temporarily unavailable due to scheduled maintenance, technical difficulties, network outages, power failures, or other circumstances beyond the control of the NJSS. The NJSS shall not be liable for any loss, inconvenience, or damage caused by any period of unavailability of this website.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `To the maximum extent permitted by the laws of Papua New Guinea, the NJSS and the Independent State of Papua New Guinea expressly disclaim all liability for any loss or damage of any kind arising from:`,
    list: [
      "Reliance on any information published on this website",
      "Errors, omissions, or inaccuracies in any content on this website",
      "Interruption, unavailability, or technical failures of this website",
      "Unauthorised access to or alteration of content on this website",
      "Actions taken or not taken on the basis of court listings, diary information, or forms",
      "Loss of data or system damage resulting from accessing this website or any linked external site",
    ],
    extra: `This limitation applies to direct, indirect, incidental, consequential, and special damages, whether in contract, tort, or otherwise.`,
  },
  {
    title: "9. Governing Law",
    content: `This Disclaimer is governed by and construed in accordance with the laws of the Independent State of Papua New Guinea. Any dispute arising in connection with this Disclaimer or the use of this website shall be subject to the exclusive jurisdiction of the courts of Papua New Guinea.`,
  },
  {
    title: "10. Contact",
    content: `For enquiries regarding this Disclaimer or the content of this website, please contact:`,
    contact: {
      name: "National Judicial Staff Service — Web Administrator",
      address: "Waigani Court Complex, Waigani Drive, Waigani, NCD, Papua New Guinea",
      email: "info@judiciary.gov.pg",
      phone: "+675 325 7902",
    },
  },
]

export default function Disclaimer() {
  return (
    <div>
      <PageHero
        badge="Legal"
        title="Disclaimer"
        subtitle="Important information about the limitations and intended use of information published on the NJSS website."
        crumbs={[{ label: "Disclaimer" }]}
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

                  {section.extra && (
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">{section.extra}</p>
                  )}

                  {section.warning && (
                    <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-4">
                      <p className="text-sm text-red-800 font-semibold mb-1">Important Notice</p>
                      <p className="text-sm text-red-700 leading-relaxed">{section.warning}</p>
                    </div>
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
