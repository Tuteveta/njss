"use client"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  value: string
  options: string[]
  onChange: (v: string) => void
  /** If provided, shown when value is empty and the empty option is hidden from the list */
  placeholder?: string
  /** "inline" (default) — bare trigger for use inside a styled wrapper div
   *  "field" — full bordered input-style field with its own border/background */
  variant?: "inline" | "field"
  className?: string
}

export default function CustomSelect({
  value,
  options,
  onChange,
  placeholder,
  variant = "inline",
  className,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Visible options — skip the empty placeholder string
  const visibleOptions = placeholder ? options.filter(o => o !== "") : options

  const displayValue = value || placeholder || ""
  const isPlaceholder = !value && !!placeholder

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const triggerClass =
    variant === "field"
      ? cn(
          "w-full flex items-center justify-between gap-2 h-10 px-3 rounded-xl border text-sm outline-none transition-colors",
          open ? "border-[hsl(352,83%,44%)] bg-white" : "border-gray-200 bg-gray-50",
          isPlaceholder ? "text-gray-400" : "text-gray-700"
        )
      : cn(
          "flex items-center gap-1.5 text-sm bg-transparent outline-none whitespace-nowrap",
          isPlaceholder ? "text-gray-400" : "text-gray-700"
        )

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button type="button" onClick={() => setOpen(o => !o)} className={triggerClass}>
        <span>{displayValue}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-150", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 min-w-[160px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
          {visibleOptions.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm transition-colors",
                opt === value
                  ? "text-[hsl(352,83%,44%)] bg-[hsl(352,83%,44%)]/5 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
