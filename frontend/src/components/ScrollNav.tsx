import { useEffect, useState } from "react"

interface Section {
  id: string
  label: string
}

interface ScrollNavProps {
  sections: Section[]
  faded?: boolean
}

export default function ScrollNav({ sections, faded = false }: ScrollNavProps) {
  const [active, setActive] = useState(sections[0]?.id ?? "")

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: "-35% 0px -55% 0px" }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [sections])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center">
      {sections.map((section, i) => (
        <div key={section.id} className="flex flex-col items-center">
          {/* Dot + tooltip */}
          <div className="group relative flex items-center">
            {/* Tooltip label */}
            <span className={`absolute right-6 text-xs px-2.5 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md ${
              faded
                ? "bg-white/90 text-gray-700 border border-gray-200"
                : "bg-[hsl(210,70%,18%)] text-white"
            }`}>
              {section.label}
            </span>
            {/* Dot button */}
            <button
              onClick={() => scrollTo(section.id)}
              aria-label={section.label}
              className={`rounded-full border-2 transition-all duration-200 ${
                faded
                  ? active === section.id
                    ? "w-2.5 h-2.5 bg-[hsl(210,70%,25%)]/60 border-[hsl(210,70%,25%)]/60 scale-125"
                    : "w-2 h-2 bg-transparent border-gray-300/60 hover:border-[hsl(210,70%,25%)]/50"
                  : active === section.id
                    ? "w-2.5 h-2.5 bg-[hsl(210,70%,25%)] border-[hsl(210,70%,25%)] scale-125"
                    : "w-2.5 h-2.5 bg-white border-gray-300 hover:border-[hsl(210,70%,25%)]"
              }`}
            />
          </div>
          {/* Connector line */}
          {i < sections.length - 1 && (
            <div className={`w-px h-6 ${faded ? "bg-gray-200/40" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  )
}
