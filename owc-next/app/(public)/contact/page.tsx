"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import PageHero from "@/components/PageHero"
import ScrollNav from "@/components/ScrollNav"

const SECTIONS = [
  { id: "contact-form", label: "Send a Message" },
  { id: "offices", label: "Our Offices" },
]
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react"

interface Office { id: number; name: string; address: string; phone: string; email: string; hours: string }

const FALLBACK_OFFICES: Office[] = [
  { id: 1, name: "Head Office — Port Moresby (OWC / DLIR HQ)", address: "Gaukara Rumana, Wards Rd, Port Moresby, NCD", phone: "(+675) 313 5000 / Toll-Free: 180 1100", email: "workerscomp@owc.gov.pg", hours: "Mon–Fri: 8:00 AM – 4:00 PM" },
  { id: 2, name: "Lae Regional Office", address: "Lae City Centre, Morobe Province", phone: "+675 472 0000", email: "lae@owc.gov.pg", hours: "Mon–Fri: 8:00 AM – 4:00 PM" },
  { id: 3, name: "Mt Hagen Office", address: "Highlands Highway, Western Highlands", phone: "+675 542 0000", email: "mthagen@owc.gov.pg", hours: "Mon–Fri: 8:00 AM – 4:00 PM" },
]

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [sent, setSent] = useState(false)
  const [offices, setOffices] = useState<Office[]>(FALLBACK_OFFICES)
  useEffect(() => {
    fetch("/api/offices")
      .then(r => r.json())
      .then((d: { offices?: Office[] }) => { if (d.offices?.length) setOffices(d.offices) })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    } catch {
      // demo fallback
    }
    setSent(true)
  }

  return (
    <div>
      <PageHero
        badge="Get in Touch"
        title="Contact Us"
        subtitle="Our team is ready to assist you. Reach out to your nearest OWC office or send us a message online."
        crumbs={[{ label: "Contact" }]}
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
      />

      <ScrollNav sections={SECTIONS} />

      <section id="contact-form" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact form */}
            <div className="lg:col-span-2">
              {sent ? (
                <Card>
                  <CardContent className="pt-10 pb-10 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent</h2>
                    <p className="text-gray-500">Thank you for contacting us. We will respond within 2 business days.</p>
                    <Button className="mt-6" onClick={() => setSent(false)}>Send Another Message</Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Send Us a Message</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                          <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                          <Input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                        <Input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                        <Textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                      </div>
                      <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Offices */}
            <div id="offices" className="space-y-4">
              {offices.map((o) => (
                <Card key={o.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{o.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[hsl(210,70%,25%)] mt-0.5 shrink-0" />{o.address}</div>
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-[hsl(210,70%,25%)] shrink-0" />{o.phone}</div>
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[hsl(210,70%,25%)] shrink-0" />{o.email}</div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[hsl(210,70%,25%)] shrink-0" />{o.hours}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
