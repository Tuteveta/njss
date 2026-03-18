export interface NewsArticle {
  id: number
  slug: string
  date: string
  month: string
  year: string
  category: string
  title: string
  excerpt: string
  image: string
  body: { heading?: string; text: string }[]
  author: string
  readTime: string
}

export const allNews: NewsArticle[] = [
  {
    id: 1,
    slug: "owc-launches-new-online-claims-portal-2026",
    date: "March 5, 2026",
    month: "March 2026",
    year: "2026",
    category: "Technology",
    title: "OWC Launches New Online Claims Portal for 2026",
    excerpt: "The Office of Workers Compensation is pleased to announce the launch of our improved digital claims system, allowing injured workers to submit and track claims from anywhere.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
    author: "OWC Communications",
    readTime: "3 min read",
    body: [
      {
        text: "The Office of Workers Compensation (OWC) is proud to announce the official launch of its redesigned online claims portal, effective 1 March 2026. The new system represents a significant upgrade to how injured workers and employers interact with OWC and manage their claims.",
      },
      {
        heading: "Key Features of the New Portal",
        text: "The upgraded portal introduces a streamlined claim submission process, real-time status tracking, and secure document upload capabilities. Workers can now complete and submit their initial claim form entirely online without the need to visit an OWC office in person.",
      },
      {
        text: "Employers also benefit from a dedicated dashboard that allows them to view and respond to active claims, submit required documentation, and receive notifications at each stage of the process.",
      },
      {
        heading: "Improved Accessibility",
        text: "Recognising the diverse nature of Papua New Guinea's workforce, the portal has been designed to function on low-bandwidth connections and is compatible with mobile devices. This ensures workers in regional and remote areas can access services without needing high-speed internet.",
      },
      {
        heading: "How to Access the Portal",
        text: "Workers and employers can access the new portal at owc.gov.pg/claims. First-time users will need to register an account using their OWC reference number or employer registration ID. Existing users can log in with their previous credentials.",
      },
      {
        text: "OWC case officers remain available Monday to Friday to assist with any technical difficulties or claim enquiries. Call +675 321 0000 or email support@owc.gov.pg.",
      },
    ],
  },
  {
    id: 2,
    slug: "employer-awareness-workshop-port-moresby-2026",
    date: "February 18, 2026",
    month: "February 2026",
    year: "2026",
    category: "Workshop",
    title: "Employer Awareness Workshop — Port Moresby",
    excerpt: "Join us for a free workshop on employer obligations under the Workers Compensation Act 1978. Register online or at any OWC office.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
    author: "OWC Training Division",
    readTime: "4 min read",
    body: [
      {
        text: "The Office of Workers Compensation will host a free Employer Awareness Workshop in Port Moresby on 18 February 2026. The workshop is designed for business owners, HR managers, and payroll officers who want to better understand their obligations under the Workers Compensation Act 1978.",
      },
      {
        heading: "Workshop Overview",
        text: "The half-day session will cover employer registration requirements, levy assessment and payment obligations, incident reporting procedures, and how to manage a compensation claim effectively. Practical case studies will be used throughout to illustrate common scenarios and correct practices.",
      },
      {
        heading: "Who Should Attend",
        text: "The workshop is open to all employers operating in Papua New Guinea. Attendance is free of charge and lunch will be provided. Priority registration is encouraged as spaces are limited to 80 participants per session.",
      },
      {
        heading: "Event Details",
        text: "The workshop will be held at the Airways Hotel, Jackson Parade, Port Moresby. Registration commences at 7:30 AM and the session begins at 8:00 AM, concluding at approximately 1:00 PM. Certificates of attendance will be issued to all participants.",
      },
      {
        heading: "How to Register",
        text: "Employers can register online through the OWC website, by calling +675 321 0000, or by visiting any OWC office. A confirmation email with venue directions and session materials will be sent upon registration.",
      },
      {
        text: "OWC will conduct similar workshops in Lae and Mt Hagen in March 2026. Details will be announced on the OWC website and social media channels.",
      },
    ],
  },
  {
    id: 3,
    slug: "updated-medical-assessment-fee-schedules-2026",
    date: "February 1, 2026",
    month: "February 2026",
    year: "2026",
    category: "Policy",
    title: "Updated Medical Assessment Fee Schedules for 2026",
    excerpt: "New medical fee schedules have been gazetted and take effect from February 1, 2026. All medical providers must use the updated schedule.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=80",
    author: "OWC Policy Unit",
    readTime: "3 min read",
    body: [
      {
        text: "The Office of Workers Compensation advises that updated medical assessment fee schedules have been gazetted by the Government of Papua New Guinea and take effect from 1 February 2026. All OWC-accredited medical providers and practitioners must apply the new schedule when billing for services related to workers compensation assessments.",
      },
      {
        heading: "What Has Changed",
        text: "The revised schedule reflects updated rates for general practitioner consultations, specialist assessments, physiotherapy sessions, occupational therapy evaluations, and diagnostic imaging. The changes align compensation rates with current market costs to ensure continued access to quality medical services for injured workers.",
      },
      {
        heading: "Key Rate Adjustments",
        text: "Initial injury consultations have been adjusted upward by 12%. Independent Medical Examinations (IMEs) conducted by accredited examiners now attract a revised flat rate per specialty. Radiology fees have been updated to reflect current provider costs in both metropolitan and regional areas.",
      },
      {
        heading: "Obligations for Medical Providers",
        text: "All medical providers billing OWC or employer insurers must use the updated fee schedule immediately. Claims submitted using the 2025 schedule after 1 February 2026 will be re-assessed under the new rates. Providers should ensure their practice management systems are updated accordingly.",
      },
      {
        heading: "Accessing the Updated Schedule",
        text: "The full gazetted fee schedule is available for download from the Resources section of the OWC website. Printed copies are available at all OWC offices. For clarification on specific line items, contact the OWC Medical Services team at medical@owc.gov.pg.",
      },
    ],
  },
  {
    id: 4,
    slug: "owc-celebrates-48-years-of-service",
    date: "January 15, 2026",
    month: "January 2026",
    year: "2026",
    category: "Announcement",
    title: "OWC Celebrates 48 Years of Service",
    excerpt: "Established in 1978, the Office of Workers Compensation marks 48 years of protecting Papua New Guinea's workforce.",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80",
    author: "OWC Communications",
    readTime: "5 min read",
    body: [
      {
        text: "The Office of Workers Compensation marks its 48th anniversary in January 2026, reflecting on nearly five decades of service to Papua New Guinea's workforce. Established under the Workers Compensation Act 1978, OWC has grown from a small administrative unit into a fully-fledged statutory agency protecting hundreds of thousands of workers across the country.",
      },
      {
        heading: "A History of Service",
        text: "When the Workers Compensation Act came into force in 1978, PNG was a newly independent nation building its institutional capacity. The legislation recognised that workers injured in the course of employment deserved financial protection and access to medical care — principles that remain at the core of OWC's mandate today.",
      },
      {
        heading: "Key Milestones",
        text: "Over the past 48 years, OWC has processed more than 120,000 compensation claims, established regional offices in Lae, Mt Hagen, Kokopo, and Madang, introduced medical assessment panels, and launched rehabilitation programs to help injured workers return to employment.",
      },
      {
        heading: "Looking Ahead",
        text: "OWC's Commissioner acknowledged the anniversary with a commitment to continued modernisation, including the rollout of the new digital claims portal in 2026, expanded regional outreach, and the review of compensation rates to keep pace with economic conditions.",
      },
      {
        text: "OWC thanks all workers, employers, medical providers, and partners for their contribution to building a fair and effective workers compensation system in Papua New Guinea. We remain committed to our mission of protecting every worker's right to fair compensation and safe return to work.",
      },
    ],
  },
  {
    id: 5,
    slug: "employer-registration-deadline-december-2025",
    date: "December 10, 2025",
    month: "December 2025",
    year: "2025",
    category: "Compliance",
    title: "Employer Registration Deadline — December 31",
    excerpt: "All employers must ensure their registration is current. Penalties apply for non-compliance under the Workers Compensation Act 1978.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80",
    author: "OWC Compliance Unit",
    readTime: "3 min read",
    body: [
      {
        text: "The Office of Workers Compensation reminds all employers operating in Papua New Guinea that the annual employer registration renewal deadline is 31 December 2025. Employers who fail to renew their registration by this date will be in breach of the Workers Compensation Act 1978 and may be subject to penalties.",
      },
      {
        heading: "Who Must Register",
        text: "Under the Workers Compensation Act 1978, every employer who employs one or more workers under a contract of service is legally required to be registered with OWC. This includes businesses, government bodies, non-government organisations, and sole traders with employees.",
      },
      {
        heading: "Penalties for Non-Compliance",
        text: "Employers who fail to maintain a current registration risk fines of up to K10,000, personal liability for compensation payments in the event of a workplace injury, and ineligibility to obtain compliance certificates required for government contracts and tenders.",
      },
      {
        heading: "How to Renew",
        text: "Renewals can be completed online through the OWC employer portal, in person at any OWC office, or by post. Employers will need their current registration number, updated payroll information for levy assessment, and payment of any outstanding levies.",
      },
      {
        heading: "New Registrations",
        text: "Businesses that have commenced operations in 2025 and have not yet registered should do so immediately. New registrations can be completed online. A registration certificate will be issued within 5 business days of a complete application being received.",
      },
      {
        text: "For assistance with registration, contact OWC on +675 321 0000 or visit your nearest OWC office. The compliance team is available to assist employers in understanding their obligations.",
      },
    ],
  },
  {
    id: 6,
    slug: "workers-rights-awareness-campaign-highlands-2025",
    date: "November 22, 2025",
    month: "November 2025",
    year: "2025",
    category: "Workshop",
    title: "Workers Rights Awareness Campaign — Highlands Region",
    excerpt: "OWC conducted a series of awareness workshops across the Highlands provinces reaching over 3,000 workers.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
    author: "OWC Outreach Division",
    readTime: "4 min read",
    body: [
      {
        text: "The Office of Workers Compensation successfully completed a month-long awareness campaign across the Highlands region of Papua New Guinea in November 2025. The campaign visited Western Highlands, Southern Highlands, Enga, and Simbu provinces, reaching an estimated 3,200 workers across various industries.",
      },
      {
        heading: "Campaign Objectives",
        text: "The campaign aimed to inform workers about their rights under the Workers Compensation Act 1978, including the right to report workplace injuries, access medical treatment, and receive compensation for work-related injuries or occupational diseases. Many workers in regional areas were previously unaware of their entitlements.",
      },
      {
        heading: "Industries Reached",
        text: "The campaign targeted workers in agriculture, construction, mining, and hospitality — industries with higher rates of workplace injuries. Sessions were held at worksites, community halls, and local markets to maximise reach. Materials were provided in English and Tok Pisin.",
      },
      {
        heading: "Community Feedback",
        text: "Participant feedback was overwhelmingly positive, with many workers expressing that they had not known they could claim compensation for injuries sustained at work. Several workers with existing injuries were referred to the nearest OWC office to begin the claims process.",
      },
      {
        heading: "Next Steps",
        text: "Building on the success of the Highlands campaign, OWC will conduct similar awareness drives in Momase and New Guinea Islands regions in the first quarter of 2026. OWC also plans to produce radio and television content in Tok Pisin to extend the reach of workers rights messaging to remote communities.",
      },
      {
        text: "OWC thanks the provincial administrations, industry associations, and community leaders who supported the campaign by facilitating access to workplaces and communities across the Highlands.",
      },
    ],
  },
]
