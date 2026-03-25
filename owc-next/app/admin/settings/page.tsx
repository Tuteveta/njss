"use client"
import { useEffect, useState } from "react"
import {
  Palette, Phone, Layout, Code, Save, CheckCircle, RefreshCw,
  Building2, BarChart3,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { adminApi } from "@/lib/adminApi"
import { useSettingsCtx } from "@/context/SettingsContext"
import AdminLayout from "@/components/admin/AdminLayout"
import { cn } from "@/lib/utils"

type Tab = "appearance" | "organisation" | "contact" | "sections" | "statistics" | "code"

const THEMES = [
  { id: "navy",    label: "Navy Blue",    bg: "hsl(210 70% 25%)", dark: "hsl(210 70% 15%)" },
  { id: "teal",    label: "Teal",         bg: "hsl(179 60% 22%)", dark: "hsl(179 60% 13%)" },
  { id: "forest",  label: "Forest Green", bg: "hsl(148 55% 22%)", dark: "hsl(148 55% 13%)" },
  { id: "crimson", label: "Crimson",      bg: "hsl(355 58% 26%)", dark: "hsl(355 58% 16%)" },
  { id: "purple",  label: "Purple",       bg: "hsl(263 52% 30%)", dark: "hsl(263 52% 18%)" },
]

function Toggle({ on, onToggle, label, desc }: { on: boolean; onToggle: () => void; label: string; desc?: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-gray-50">
      <div>
        <div className="text-sm font-medium text-gray-800">{label}</div>
        {desc && <div className="text-xs text-gray-500 mt-0.5">{desc}</div>}
      </div>
      <button
        onClick={onToggle}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          on ? "bg-emerald-500" : "bg-gray-200"
        )}
      >
        <span className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          on ? "translate-x-5" : "translate-x-0"
        )} />
      </button>
    </div>
  )
}

export default function SiteSettings() {
  const { settings, reload } = useSettingsCtx()
  const [form, setForm] = useState({ ...settings })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<Tab>("appearance")

  useEffect(() => { setForm({ ...settings }) }, [settings])

  const set = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const toggle = (key: string) =>
    set(key, form[key as keyof typeof form] === "true" ? "false" : "true")

  const isOn = (key: string) => form[key as keyof typeof form] === "true"

  const save = async () => {
    setSaving(true)
    try {
      const res = await adminApi.saveSettings(form)
      if (res.ok) {
        setSaved(true)
        reload()
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "appearance",   label: "Appearance",   icon: Palette },
    { id: "organisation", label: "Organisation",  icon: Building2 },
    { id: "contact",      label: "Contact Info",  icon: Phone },
    { id: "sections",     label: "Home Sections", icon: Layout },
    { id: "statistics",   label: "Statistics",    icon: BarChart3 },
    { id: "code",         label: "Custom CSS",    icon: Code },
  ]

  const SaveBtn = () => (
    <Button onClick={save} disabled={saving} className="gap-2">
      {saved
        ? <><CheckCircle className="w-4 h-4" /> Saved</>
        : saving
          ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</>
          : <><Save className="w-4 h-4" /> Save Changes</>}
    </Button>
  )

  return (
    <AdminLayout>
      <div className="w-full space-y-6 pb-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
            <p className="text-sm text-gray-400 mt-1.5">Control the appearance and content of the public website</p>
          </div>
          <SaveBtn />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                tab === t.id
                  ? "border-[hsl(var(--owc-p))] text-[hsl(var(--owc-p))]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Appearance ── */}
        {tab === "appearance" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Colour Theme</CardTitle>
              <p className="text-sm text-gray-500">Sets the primary colour for the navigation, footer, and hero sections.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => set("theme", t.id)}
                    className={cn(
                      "rounded-xl border p-3 text-left transition-all",
                      form.theme === t.id ? "border-[hsl(210,70%,25%)] bg-[hsl(210,70%,25%)]/5" : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex gap-1.5 mb-2">
                      <div className="w-6 h-6 rounded-full" style={{ background: t.bg }} />
                      <div className="w-6 h-6 rounded-full" style={{ background: t.dark }} />
                    </div>
                    <div className="text-xs font-medium text-gray-700">{t.label}</div>
                    {form.theme === t.id && <div className="text-[10px] text-[hsl(210,70%,25%)] font-semibold mt-0.5">Active</div>}
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t">
                <p className="text-sm font-medium text-gray-700 mb-1">Live preview</p>
                <div className="rounded-lg overflow-hidden border border-gray-200 text-white text-sm">
                  <div className="px-4 py-3 flex items-center gap-3 font-semibold"
                    style={{ background: THEMES.find(t => t.id === form.theme)?.bg }}>
                    <div className="w-5 h-5 rounded bg-white/20" />
                    {form.site_name || "Office of Workers Compensation"}
                  </div>
                  <div className="px-4 py-3 text-xs"
                    style={{ background: THEMES.find(t => t.id === form.theme)?.dark }}>
                    Footer · {form.contact_email || "workerscomp@owc.gov.pg"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Organisation ── */}
        {tab === "organisation" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organisation Identity</CardTitle>
              <p className="text-sm text-gray-500">Site name and tagline used in the navigation bar, browser tab, and footer.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                <Input
                  value={form.site_name}
                  onChange={e => set("site_name", e.target.value)}
                  placeholder="Office of Workers Compensation"
                />
                <p className="text-xs text-gray-400 mt-1">Displayed in the navbar logo and browser tab title.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline / Sub-name</label>
                <Input
                  value={form.site_tagline}
                  onChange={e => set("site_tagline", e.target.value)}
                  placeholder="Protecting Papua New Guinea's Workforce"
                />
                <p className="text-xs text-gray-400 mt-1">Short tagline shown below the site name in the hero section.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Contact Info ── */}
        {tab === "contact" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
              <p className="text-sm text-gray-500">Displayed in the footer, Contact page, and homepage CTA block.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input value={form.contact_phone} onChange={e => set("contact_phone", e.target.value)} placeholder="(+675) 313 5000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input value={form.contact_email} onChange={e => set("contact_email", e.target.value)} placeholder="workerscomp@owc.gov.pg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HQ Address</label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(210,70%,25%)]"
                  value={form.contact_address}
                  onChange={e => set("contact_address", e.target.value)}
                  placeholder="Gaukara Rumana, Wards Rd..."
                />
                <p className="text-xs text-gray-400 mt-1">Use a new line for each address line.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label>
                <Input value={form.contact_hours} onChange={e => set("contact_hours", e.target.value)} placeholder="Mon–Fri, 8:00 AM – 4:00 PM" />
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-3">Alert Banner</p>
                <Toggle
                  on={isOn("banner_enabled")}
                  onToggle={() => toggle("banner_enabled")}
                  label="Show alert banner on homepage"
                />
                {isOn("banner_enabled") && (
                  <div className="space-y-2 mt-3">
                    <Input
                      value={form.banner_text}
                      onChange={e => set("banner_text", e.target.value)}
                      placeholder="Banner message…"
                    />
                    <Input
                      value={form.banner_link}
                      onChange={e => set("banner_link", e.target.value)}
                      placeholder="/claims"
                    />
                    <p className="text-xs text-gray-400">Leave link empty to show text only.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Home Sections ── */}
        {tab === "sections" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Homepage Section Visibility</CardTitle>
                <p className="text-sm text-gray-500">Toggle which sections are shown on the public homepage.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: "home_show_stats",    label: "Statistics Bar",       desc: "Live stats: claims lodged, benefits paid, processing time, coverage" },
                  { key: "home_show_services", label: "Our Services",         desc: "Workers Compensation, Rehabilitation, Employer Registration, Claim Filing" },
                  { key: "home_show_process",  label: "Claims Process Steps", desc: "5-step visual guide to filing a claim" },
                  { key: "home_show_news",     label: "Latest News",          desc: "3 most recent published news article cards" },
                  { key: "home_show_events",   label: "Upcoming Events",      desc: "Next 3 upcoming events from the Events calendar" },
                  { key: "home_show_cta",      label: "Contact / CTA",        desc: "Case officer, Head Office, Lae Regional contact cards" },
                ].map(s => (
                  <Toggle
                    key={s.key}
                    on={isOn(s.key)}
                    onToggle={() => toggle(s.key)}
                    label={s.label}
                    desc={s.desc}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Statistics ── */}
        {tab === "statistics" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Homepage Statistics</CardTitle>
              <p className="text-sm text-gray-500">The four statistics displayed in the stats bar on the homepage. Update these annually or as data changes.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "stat_claims",     label: "Stat 1 — Value",    placeholder: "1,732",    hint: 'e.g. "1,732" — Claims Lodged' },
                { key: "stat_benefits",   label: "Stat 2 — Value",    placeholder: "K3.2M+",   hint: 'e.g. "K3.2M+" — Benefits Paid' },
                { key: "stat_processing", label: "Stat 3 — Value",    placeholder: "60–90",    hint: 'e.g. "60–90" — Avg. Processing Days' },
                { key: "stat_coverage",   label: "Stat 4 — Value",    placeholder: "All PLOs", hint: 'e.g. "All PLOs" — Nationwide Coverage' },
              ].map(s => (
                <div key={s.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{s.label}</label>
                  <Input
                    value={form[s.key as keyof typeof form]}
                    onChange={e => set(s.key, e.target.value)}
                    placeholder={s.placeholder}
                  />
                  <p className="text-xs text-gray-400 mt-1">{s.hint}</p>
                </div>
              ))}
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  These values display on the homepage stats bar. The labels (Claims Lodged, Benefits Paid, etc.) are fixed. Only the values are configurable here.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Custom CSS ── */}
        {tab === "code" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Custom CSS</CardTitle>
              <p className="text-sm text-gray-500">Injected into the public site's <code>&lt;head&gt;</code>. Use to fine-tune colours, spacing, or branding without a code deployment.</p>
            </CardHeader>
            <CardContent>
              <textarea
                rows={16}
                spellCheck={false}
                className="w-full rounded-md border border-gray-200 bg-gray-50 text-gray-800 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(210,70%,25%)] resize-y"
                value={form.custom_css}
                onChange={e => set("custom_css", e.target.value)}
                placeholder={`/* Example: change accent colour */\n.btn-primary { background: #0d7a4e !important; }\n\n/* Hide a specific section */\n#stats { display: none; }`}
              />
              <p className="text-xs text-gray-400 mt-2">Changes take effect immediately on the public site after saving.</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <SaveBtn />
        </div>
      </div>
    </AdminLayout>
  )
}
