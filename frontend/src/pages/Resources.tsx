import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Book, HelpCircle, ChevronDown, ChevronUp } from "lucide-react"
import PageHero from "@/components/PageHero"
import ScrollNav from "@/components/ScrollNav"

function FaqItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${open ? "border-[hsl(210,70%,25%)]/30 shadow-sm" : "border-gray-100"}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${open ? "bg-[hsl(210,70%,25%)]/5" : "bg-white hover:bg-gray-50"}`}
      >
        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${open ? "bg-[hsl(210,70%,25%)] text-white" : "bg-gray-100 text-gray-500"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={`flex-1 font-semibold text-sm leading-snug ${open ? "text-[hsl(210,70%,18%)]" : "text-gray-900"}`}>{faq.question}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-[hsl(210,70%,25%)] shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-3 text-sm text-gray-600 leading-relaxed border-t border-[hsl(210,70%,25%)]/10 bg-white ml-0">
          <div className="pl-11">{faq.answer}</div>
        </div>
      )}
    </div>
  )
}

interface FAQ { id: number; question: string; answer: string }
interface Doc { id: number; title: string; category: string; url: string; originalName: string; fileSize: number; uploadedAt: string }

const SECTIONS = [
  { id: "forms", label: "Downloadable Forms" },
  { id: "guides", label: "Guides & Publications" },
  { id: "faq", label: "FAQs" },
]

const FALLBACK_FAQS: FAQ[] = [
  { id: 1, question: "Is compensation mandatory for all employers?", answer: "Yes. All employers are required by law to insure their employees against work-related injury or death under the Workers' Compensation Act 1978." },
  { id: 2, question: "Can compensation be claimed for informal or casual workers?", answer: "Eligibility depends on the employment arrangement. OWC will assess each case individually — contact your nearest Provincial Labour Office or OWC HQ for guidance." },
  { id: 3, question: "How long does a claim take to be processed?", answer: "Most claims are resolved within 60–90 days, depending on the completeness of documentation and availability of medical reports." },
  { id: 4, question: "Who is eligible for workers compensation?", answer: "Any worker employed under a contract of service in PNG who suffers injury, disease, or death arising out of and in the course of employment is eligible." },
  { id: 5, question: "How long do I have to file a claim?", answer: "Claims must be lodged within 12 months of the injury date. Latent injury claims must be filed within 3 years of diagnosis." },
  { id: 6, question: "What if my employer refuses to report my injury?", answer: "You can report directly to OWC. We will investigate and assist you in pursuing your claim." },
  { id: 7, question: "Do I need a lawyer to file a claim?", answer: "No, you can file directly with OWC. However, for complex disputes you may choose to engage legal representation." },
  { id: 8, question: "How is compensation calculated?", answer: "Weekly benefits are based on your pre-injury earnings. Lump sum amounts depend on the degree of permanent disability as assessed by a certified medical board." },
]

function formatSize(bytes: number) {
  if (!bytes) return ""
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function Resources() {
  const [faqs, setFaqs] = useState<FAQ[]>(FALLBACK_FAQS)
  const [forms, setForms] = useState<Doc[]>([])
  const [guides, setGuides] = useState<Doc[]>([])

  useEffect(() => {
    fetch("/api/faqs")
      .then(r => r.json())
      .then((d: { faqs?: FAQ[] }) => { if (d.faqs?.length) setFaqs(d.faqs) })
      .catch(() => {})

    fetch("/api/documents")
      .then(r => r.json())
      .then((d: { documents?: Doc[] }) => {
        const docs = d.documents ?? []
        setForms(docs.filter(doc => doc.category === "Forms" || doc.category === "Form"))
        setGuides(docs.filter(doc => doc.category === "Guides" || doc.category === "Guide" || doc.category === "Publication"))
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      <PageHero
        badge="Downloads & Info"
        title="Resources & Forms"
        subtitle="Download forms, guides, and find answers to frequently asked questions about workers compensation in PNG."
        crumbs={[{ label: "Resources" }]}
        image="https://images.unsplash.com/photo-1568667256549-094345857637?w=1920&q=80"
      />

      <ScrollNav sections={SECTIONS} />

      {/* Forms */}
      <section id="forms" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <Download className="w-6 h-6 text-[hsl(210,70%,25%)]" />
            <h2 className="text-2xl font-bold text-gray-900">Downloadable Forms</h2>
          </div>
          {forms.length === 0 ? (
            <p className="text-gray-400 text-sm">No forms uploaded yet. Upload forms via the admin Documents section with category "Forms".</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((f) => (
                <Card key={f.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-300" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{f.title}</div>
                        <div className="text-xs text-gray-400">{f.originalName}</div>
                        {f.fileSize > 0 && <div className="text-xs text-gray-400 mt-0.5">{formatSize(f.fileSize)}</div>}
                      </div>
                    </div>
                    <a href={f.url} download target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="shrink-0">
                        <Download className="w-3 h-3" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Guides */}
      <section id="guides" className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Guides &amp; Publications</h2>
          {guides.length === 0 ? (
            <p className="text-gray-400 text-sm">No guides uploaded yet. Upload guides via the admin Documents section with category "Guides".</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {guides.map((g) => (
                <Card key={g.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <Book className="w-8 h-8 text-[hsl(210,70%,25%)] mb-2" />
                    <CardTitle className="text-sm">{g.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-500">{g.originalName}</p>
                    <a href={g.url} download target="_blank" rel="noopener noreferrer"
                      className="mt-2 text-xs font-medium text-[hsl(210,70%,25%)] hover:underline flex items-center gap-1">
                      <Download className="w-3 h-3" /> Download
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-5 h-5 text-[hsl(210,70%,25%)]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(210,70%,25%)]">FAQs</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-sm mt-1.5">Common questions about workers compensation in Papua New Guinea.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {faqs.map((f, i) => (
              <FaqItem key={f.id} faq={f} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
