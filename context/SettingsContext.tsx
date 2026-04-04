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
  stat_benefits: string
  stat_processing: string
  stat_coverage: string
}

const DEFAULTS: SiteSettings = {
  theme: "navy",
  site_name: "National Judicial Staff Service",
  site_tagline: "Serving Justice for All People of Papua New Guinea",
  contact_phone: "+675 325 7902",
  contact_email: "info@judiciary.gov.pg",
  contact_address: "Waigani Court Complex\nWaigani Drive, Waigani\nNational Capital District, Papua New Guinea",
  contact_hours: "Mon–Fri, 8:00 AM – 4:00 PM",
  banner_enabled: "true",
  banner_text: "Court registry enquiries: +675 325 7902 | Email: info@judiciary.gov.pg | Waigani Court Complex, NCD",
  banner_link: "/contact",
  home_show_stats: "true",
  home_show_services: "true",
  home_show_process: "true",
  home_show_news: "true",
  home_show_events: "true",
  home_show_cta: "true",
  stat_benefits: "3,200+",
  stat_processing: "22",
  stat_coverage: "120+",
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
  }, [settings.theme])

  return <Ctx.Provider value={{ settings, reload: load }}>{children}</Ctx.Provider>
}

export function useSettings() {
  return useContext(Ctx).settings
}

export function useSettingsCtx() {
  return useContext(Ctx)
}
