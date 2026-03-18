"use client"
import { createContext, useContext, useEffect, useState } from "react"

export interface SiteSettings {
  theme: string
  site_name: string
  site_tagline: string
  contact_phone: string
  contact_email: string
  contact_address: string
  contact_hours: string
  banner_enabled: string
  banner_text: string
  banner_link: string
  home_show_stats: string
  home_show_services: string
  home_show_process: string
  home_show_news: string
  home_show_events: string
  home_show_cta: string
  stat_claims: string
  stat_benefits: string
  stat_processing: string
  stat_coverage: string
  custom_css: string
}

const DEFAULTS: SiteSettings = {
  theme: "navy",
  site_name: "Office of Workers Compensation",
  site_tagline: "Protecting Papua New Guinea's Workforce",
  contact_phone: "(+675) 313 5000 / Toll-Free: 180 1100",
  contact_email: "workerscomp@owc.gov.pg",
  contact_address: "Gaukara Rumana, Wards Rd\nPort Moresby, NCD\nPapua New Guinea",
  contact_hours: "Mon–Fri, 8:00 AM – 4:00 PM",
  banner_enabled: "true",
  banner_text: "For claims assistance call (+675) 313 5000 or Toll-Free 180 1100. Email: workerscomp@owc.gov.pg",
  banner_link: "/claims",
  home_show_stats: "true",
  home_show_services: "true",
  home_show_process: "true",
  home_show_news: "true",
  home_show_events: "true",
  home_show_cta: "true",
  stat_claims: "1,732",
  stat_benefits: "K3.2M+",
  stat_processing: "60–90",
  stat_coverage: "All PLOs",
  custom_css: "",
}

interface SettingsCtx {
  settings: SiteSettings
  reload: () => void
}

const Ctx = createContext<SettingsCtx>({ settings: DEFAULTS, reload: () => {} })

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS)

  const load = () => {
    fetch("/api/settings")
      .then(r => r.json())
      .then((data: Partial<SiteSettings>) => setSettings({ ...DEFAULTS, ...data }))
      .catch(() => {})
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme || "navy")
    let styleEl = document.getElementById("owc-custom-css") as HTMLStyleElement | null
    if (settings.custom_css) {
      if (!styleEl) {
        styleEl = document.createElement("style")
        styleEl.id = "owc-custom-css"
        document.head.appendChild(styleEl)
      }
      styleEl.textContent = settings.custom_css
    } else if (styleEl) {
      styleEl.textContent = ""
    }
  }, [settings.theme, settings.custom_css])

  return <Ctx.Provider value={{ settings, reload: load }}>{children}</Ctx.Provider>
}

export function useSettings() {
  return useContext(Ctx).settings
}

export function useSettingsCtx() {
  return useContext(Ctx)
}
