"use client"
import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[hsl(352,83%,44%)] hover:bg-[hsl(352,83%,38%)] text-white flex items-center justify-center border border-[hsl(352,83%,38%)] transition-all duration-200 hover:-translate-y-0.5"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  )
}
