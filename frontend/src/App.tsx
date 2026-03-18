import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Home from "@/pages/Home"
import About from "@/pages/About"
import Services from "@/pages/Services"
import News from "@/pages/News"
import Resources from "@/pages/Resources"
import Contact from "@/pages/Contact"
import PrivacyPolicy from "@/pages/PrivacyPolicy"
import TermsOfUse from "@/pages/TermsOfUse"
import NewsArticle from "@/pages/NewsArticle"
import AdminLogin from "@/pages/admin/Login"
import Dashboard from "@/pages/admin/Dashboard"
import NewsManager from "@/pages/admin/NewsManager"
import NewsEditor from "@/pages/admin/NewsEditor"
import PagesManager from "@/pages/admin/PagesManager"
import ServicesManager from "@/pages/admin/ServicesManager"
import AboutManager from "@/pages/admin/AboutManager"
import MediaLibrary from "@/pages/admin/MediaLibrary"
import PDFManager from "@/pages/admin/PDFManager"
import MenuManager from "@/pages/admin/MenuManager"
import SiteSettings from "@/pages/admin/SiteSettings"
import Events from "@/pages/Events"
import EventsManager from "@/pages/admin/EventsManager"
import OfficesManager from "@/pages/admin/OfficesManager"
import LeadershipManager from "@/pages/admin/LeadershipManager"
import FAQManager from "@/pages/admin/FAQManager"
import HeroSlidesManager from "@/pages/admin/HeroSlidesManager"
import AuditLog from "@/pages/admin/AuditLog"
import { SettingsProvider } from "@/context/SettingsContext"
import { isLoggedIn } from "@/lib/adminApi"

function RequireAuth({ children }: { children: React.ReactNode }) {
  return isLoggedIn() ? <>{children}</> : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <SettingsProvider>
    <BrowserRouter>
      <Routes>
        {/* ── Admin routes (no Navbar/Footer) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/admin/news" element={<RequireAuth><NewsManager /></RequireAuth>} />
        <Route path="/admin/news/new" element={<RequireAuth><NewsEditor /></RequireAuth>} />
        <Route path="/admin/news/:id/edit" element={<RequireAuth><NewsEditor /></RequireAuth>} />
        <Route path="/admin/services" element={<RequireAuth><ServicesManager /></RequireAuth>} />
        <Route path="/admin/about" element={<RequireAuth><AboutManager /></RequireAuth>} />
        <Route path="/admin/pages" element={<RequireAuth><PagesManager /></RequireAuth>} />
        <Route path="/admin/media" element={<RequireAuth><MediaLibrary /></RequireAuth>} />
        <Route path="/admin/documents" element={<RequireAuth><PDFManager /></RequireAuth>} />
        <Route path="/admin/menus" element={<RequireAuth><MenuManager /></RequireAuth>} />
        <Route path="/admin/settings" element={<RequireAuth><SiteSettings /></RequireAuth>} />
        <Route path="/admin/events" element={<RequireAuth><EventsManager /></RequireAuth>} />
        <Route path="/admin/offices" element={<RequireAuth><OfficesManager /></RequireAuth>} />
        <Route path="/admin/leadership" element={<RequireAuth><LeadershipManager /></RequireAuth>} />
        <Route path="/admin/faqs" element={<RequireAuth><FAQManager /></RequireAuth>} />
        <Route path="/admin/hero-slides" element={<RequireAuth><HeroSlidesManager /></RequireAuth>} />
        <Route path="/admin/audit-log" element={<RequireAuth><AuditLog /></RequireAuth>} />

        {/* ── Public routes (with Navbar/Footer) ── */}
        <Route path="/*" element={
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:slug" element={<NewsArticle />} />
                <Route path="/events" element={<Events />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfUse />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
    </SettingsProvider>
  )
}
