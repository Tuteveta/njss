"use client"
import { useEffect, useState } from "react"

interface Section { id: string; label: string }
interface ScrollNavProps { sections: Section[]; faded?: boolean }

export default function ScrollNav({ sections, faded = false }: ScrollNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? "")

  useEffect(() => {
    const getNavHeight = () =>
      (document.querySelector("header") as HTMLElement)?.offsetHeight ?? 80

    const update = () => {
      const offset = getNavHeight() + 32
      let closest = sections[0]?.id ?? ""
      let minDist = Infinity
      for (const { id } of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        const dist = Math.abs(el.getBoundingClientRect().top - offset)
        if (dist < minDist) {
          minDist = dist
          closest = id
        }
      }
      setActive(closest)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [sections])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const navHeight = (document.querySelector("header") as HTMLElement)?.offsetHeight ?? 80
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight
    window.scrollTo({ top, behavior: "smooth" })
  }

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center">
      {sections.map((section, i) => (
        <div key={section.id} className="flex flex-col items-center">
          <div className="group relative flex items-center">
            <span className={`absolute right-6 text-xs px-2.5 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${faded ? "bg-white/90 text-gray-700 border border-gray-200" : "bg-[hsl(352,83%,38%)] text-white"}`}>
              {section.label}
            </span>
            <button
              onClick={() => scrollTo(section.id)}
              aria-label={section.label}
              className={`rounded-full border-2 transition-all duration-200 ${faded
                ? active === section.id
                  ? "w-2.5 h-2.5 bg-[hsl(352,83%,48%)]/60 border-[hsl(352,83%,48%)]/60 scale-125"
                  : "w-2 h-2 bg-transparent border-gray-300/60 hover:border-[hsl(352,83%,48%)]/50"
                : active === section.id
                  ? "w-2.5 h-2.5 bg-[hsl(352,83%,48%)] border-[hsl(352,83%,48%)] scale-125"
                  : "w-2.5 h-2.5 bg-white border-gray-300 hover:border-[hsl(352,83%,48%)]"
              }`}
            />
          </div>
          {i < sections.length - 1 && (
            <div className={`w-px h-6 ${faded ? "bg-gray-200/40" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  )
}
