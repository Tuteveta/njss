"use client"
import Link from "next/link"
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react"
import { useSettings } from "@/context/SettingsContext"

const quickLinks = [
  { label: "About OWC", href: "/about" },
  { label: "Our Services", href: "/services" },
  { label: "News & Updates", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Resources & Forms", href: "/resources" },
  { label: "Contact Us", href: "/contact" },
]

const services = [
  "Workers Compensation",
  "Injury Rehabilitation",
  "Employer Registration",
  "Medical Assessments",
  "Dispute Resolution",
  "Legal Assistance",
]

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
]

const socials = [
  { label: "Facebook", href: "#", svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /> },
  { label: "Twitter / X", href: "#", svg: <><path d="M4 4l16 16M4 20 20 4" /></> },
  { label: "LinkedIn", href: "#", svg: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></> },
  { label: "YouTube", href: "#", svg: <><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></> },
]

export default function Footer() {
  const s = useSettings()
  const addressLines = (s.contact_address || "").split("\n").filter(Boolean)

  return (
    <footer className="bg-[hsl(210,70%,12%)] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <img src="/png-coa.png" alt="PNG Coat of Arms" className="h-14 w-auto" />
              <div>
                <div className="text-white font-bold text-sm leading-tight">OWC</div>
                <div className="text-blue-400 text-[10px] tracking-widest uppercase mt-0.5">Papua New Guinea</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">
              Protecting the rights and welfare of workers in Papua New Guinea through fair compensation, quality rehabilitation, and legal support services.
            </p>
            <div className="text-xs text-gray-500 mb-4">Established under the Workers Compensation Act 1978</div>
            <div className="flex items-center gap-2">
              {socials.map(({ svg, label, href }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center transition-colors group">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors">{svg}</svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-400 transition-all duration-200 rounded" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://portal.owc.gov.pg" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                  File a Claim <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Our Services</h3>
            <ul className="space-y-2.5 text-sm">
              {services.map((svc) => (
                <li key={svc} className="flex items-center gap-2 text-gray-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full shrink-0" />
                  {svc}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3.5 text-sm">
              {addressLines.length > 0 && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" />
                  <span className="text-gray-400 leading-relaxed">
                    {addressLines.map((line, i) => (
                      <span key={i}>{line}{i < addressLines.length - 1 && <br />}</span>
                    ))}
                  </span>
                </li>
              )}
              <li>
                <a href={`tel:${s.contact_phone}`} className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  {s.contact_phone || "+675 321 6000"}
                </a>
              </li>
              <li>
                <a href={`mailto:${s.contact_email}`} className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  {s.contact_email || "info@owc.gov.pg"}
                </a>
              </li>
            </ul>
            <div className="mt-5 bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-xs font-semibold text-white mb-1">Office Hours</div>
              <div className="text-xs text-gray-400">{s.contact_hours || "Monday – Friday"}</div>
              <div className="text-xs text-gray-400">8:00 AM – 4:00 PM</div>
              <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Now Open
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5" />
      <div className="max-w-7xl mx-auto px-4 lg:px-10 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} Office of Workers Compensation, Papua New Guinea.</span>
            <span className="hidden sm:inline text-gray-600">·</span>
            <span>All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-gray-300 transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
