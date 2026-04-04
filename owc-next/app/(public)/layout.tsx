import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import BackToTop from "@/components/BackToTop"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* WCAG 2.1 — Skip navigation link (visible on focus) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-999 focus:px-4 focus:py-2 focus:bg-[hsl(352,83%,44%)] focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Navbar />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
      <BackToTop />
    </>
  )
}
