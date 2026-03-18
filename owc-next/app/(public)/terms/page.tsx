"use client"
import PageHero from "@/components/PageHero"

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Office of Workers Compensation (OWC) website and online services, you agree to be bound by these Terms of Use. If you do not agree to these terms, please discontinue use of this website immediately. OWC reserves the right to modify these terms at any time, and continued use of the website constitutes acceptance of any changes.`,
  },
  {
    title: "2. Purpose of the Website",
    content: `This website is maintained by the Office of Workers Compensation, an agency of the Independent State of Papua New Guinea, to provide information and services relating to workers compensation under the Workers Compensation Act 1978. The website is intended for use by workers, employers, medical providers, and the general public seeking information about workers compensation in Papua New Guinea.`,
  },
  {
    title: "3. Use of Information",
    content: `The information provided on this website is for general informational purposes only. While OWC endeavours to ensure the accuracy and currency of all content:`,
    list: [
      "Content does not constitute legal advice and should not be relied upon as such",
      "OWC makes no warranties regarding the completeness, accuracy, or fitness for purpose of any content",
      "Users should seek independent legal or professional advice for their specific circumstances",
      "Legislation, regulations, and policy information may be subject to change",
    ],
  },
  {
    title: "4. Online Claims and Forms",
    content: `When submitting a claim or form through this website:`,
    list: [
      "You must provide accurate, complete, and truthful information",
      "Providing false or misleading information is an offence under the Workers Compensation Act 1978 and may result in prosecution",
      "Submission of a form does not guarantee approval of a claim",
      "OWC may request additional documentation to support your submission",
      "You are responsible for retaining copies of all documents submitted",
    ],
  },
  {
    title: "5. Intellectual Property",
    content: `All content on this website, including text, graphics, logos, images, and downloadable forms, is the property of the Office of Workers Compensation or the Government of Papua New Guinea. You may:`,
    list: [
      "Download and print content for personal, non-commercial use",
      "Share links to this website",
    ],
  },
  {
    title: "6. Prohibited Activities",
    content: `You must not use this website to:`,
    list: [
      "Submit fraudulent, false, or misleading information",
      "Attempt to gain unauthorised access to any systems or data",
      "Interfere with the website's operation or security",
      "Harvest or collect information about other users",
      "Transmit any malware, viruses, or harmful code",
      "Engage in any activity that violates applicable Papua New Guinea law",
    ],
  },
  {
    title: "7. External Links",
    content: `This website may contain links to external websites operated by third parties, including other government agencies. OWC does not endorse or accept responsibility for the content, accuracy, or availability of those external sites. Links are provided for convenience only.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `To the extent permitted by law, OWC and the Government of Papua New Guinea shall not be liable for any loss or damage arising from your use of, or reliance on, information published on this website. This includes direct, indirect, incidental, or consequential damages arising from errors, omissions, system downtime, or unauthorised access.`,
  },
  {
    title: "9. Privacy",
    content: `Your use of this website is also governed by our Privacy Policy, which is incorporated into these Terms of Use by reference. By using this website, you consent to the collection and use of your information as described in the Privacy Policy.`,
  },
  {
    title: "10. Governing Law",
    content: `These Terms of Use are governed by the laws of the Independent State of Papua New Guinea. Any disputes arising in connection with the use of this website shall be subject to the exclusive jurisdiction of the courts of Papua New Guinea.`,
  },
  {
    title: "11. Contact",
    content: `For enquiries regarding these Terms of Use, please contact:`,
    contact: {
      name: "Office of Workers Compensation",
      address: "Level 6, Kina House, Douglas Street, Port Moresby, NCD",
      email: "info@owc.gov.pg",
      phone: "+675 321 0000",
    },
  },
]

export default function TermsOfUse() {
  return (
    <div>
      <PageHero
        badge="Legal"
        title="Terms of Use"
        subtitle="Please read these terms carefully before using the OWC website and online services."
        crumbs={[{ label: "Terms of Use" }]}
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12">
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
