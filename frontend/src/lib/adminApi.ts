const BASE = "/api"

// Token stored in sessionStorage (cleared when tab closes) — more secure than localStorage.
// The backend also sets an httpOnly cookie for defence-in-depth.
const TOKEN_KEY = "owc_admin_token"
const SESSION_KEY = "owc_admin_session"

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function saveSession(token: string, username: string) {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(SESSION_KEY, username)
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

// Alias kept for compatibility with any older imports
export const clearToken = clearSession

export function isLoggedIn(): boolean {
  return !!sessionStorage.getItem(TOKEN_KEY)
}

async function authFetch(path: string, options: RequestInit = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (res.status === 401) {
    clearSession()
    window.location.href = "/admin/login"
  }
  return res
}

export const adminApi = {
  login: (username: string, password: string) =>
    fetch(`${BASE}/admin/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    fetch(`${BASE}/admin/logout`, {
      method: "POST",
      credentials: "include",
    }).finally(() => clearSession()),

  me: () => authFetch("/admin/me"),

  stats: () => authFetch("/admin/stats"),

  // News
  getNews: () => authFetch("/admin/news"),
  getArticle: (id: number) => authFetch(`/admin/news/${id}`),
  createArticle: (data: object) =>
    authFetch("/admin/news", { method: "POST", body: JSON.stringify(data) }),
  updateArticle: (id: number, data: object) =>
    authFetch(`/admin/news/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteArticle: (id: number) =>
    authFetch(`/admin/news/${id}`, { method: "DELETE" }),

  // Services
  getServices: () => authFetch("/admin/services"),
  createService: (data: object) =>
    authFetch("/admin/services", { method: "POST", body: JSON.stringify(data) }),
  updateService: (id: number, data: object) =>
    authFetch(`/admin/services/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteService: (id: number) =>
    authFetch(`/admin/services/${id}`, { method: "DELETE" }),
  reorderServices: (ids: number[]) =>
    authFetch("/admin/services/reorder", { method: "PUT", body: JSON.stringify({ ids }) }),

  // About
  getAbout: () => authFetch("/admin/about"),
  saveAbout: (data: object) =>
    authFetch("/admin/about", { method: "PUT", body: JSON.stringify(data) }),

  // Pages
  getPages: () => authFetch("/admin/pages"),
  updatePage: (slug: string, data: object) =>
    authFetch(`/admin/pages/${slug}`, { method: "PUT", body: JSON.stringify(data) }),

  // Menus
  getMenus: () => authFetch("/admin/menus"),
  saveMenus: (items: object[]) =>
    authFetch("/admin/menus", { method: "PUT", body: JSON.stringify({ items }) }),

  // Images
  getImages: () => authFetch("/admin/images"),
  uploadImage: (file: File) => {
    const form = new FormData()
    form.append("file", file)
    const token = getToken()
    return fetch(`/api/admin/upload/image`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
  },
  deleteImage: (filename: string) =>
    authFetch(`/admin/images/${filename}`, { method: "DELETE" }),

  // Documents
  getDocuments: () => authFetch("/admin/documents"),
  uploadDocument: (file: File, title: string, category: string) => {
    const form = new FormData()
    form.append("file", file)
    form.append("title", title)
    form.append("category", category)
    const token = getToken()
    return fetch(`/api/admin/upload/document`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    })
  },
  deleteDocument: (id: number) =>
    authFetch(`/admin/documents/${id}`, { method: "DELETE" }),

  // Settings
  getSettings: () => authFetch("/admin/settings"),
  saveSettings: (data: object) =>
    authFetch("/admin/settings", { method: "PUT", body: JSON.stringify(data) }),

  // Events
  getEvents: () => authFetch("/admin/events"),
  getEvent: (id: number) => authFetch(`/admin/events/${id}`),
  createEvent: (data: object) =>
    authFetch("/admin/events", { method: "POST", body: JSON.stringify(data) }),
  updateEvent: (id: number, data: object) =>
    authFetch(`/admin/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEvent: (id: number) =>
    authFetch(`/admin/events/${id}`, { method: "DELETE" }),

  // Offices
  getOffices: () => authFetch("/admin/offices"),
  createOffice: (data: object) =>
    authFetch("/admin/offices", { method: "POST", body: JSON.stringify(data) }),
  updateOffice: (id: number, data: object) =>
    authFetch(`/admin/offices/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteOffice: (id: number) =>
    authFetch(`/admin/offices/${id}`, { method: "DELETE" }),

  // Leadership
  getLeadership: () => authFetch("/admin/leadership"),
  createLeader: (data: object) =>
    authFetch("/admin/leadership", { method: "POST", body: JSON.stringify(data) }),
  updateLeader: (id: number, data: object) =>
    authFetch(`/admin/leadership/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteLeader: (id: number) =>
    authFetch(`/admin/leadership/${id}`, { method: "DELETE" }),
  reorderLeadership: (ids: number[]) =>
    authFetch("/admin/leadership/reorder", { method: "PUT", body: JSON.stringify({ ids }) }),

  // FAQs
  getFaqs: () => authFetch("/admin/faqs"),
  createFaq: (data: object) =>
    authFetch("/admin/faqs", { method: "POST", body: JSON.stringify(data) }),
  updateFaq: (id: number, data: object) =>
    authFetch(`/admin/faqs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteFaq: (id: number) =>
    authFetch(`/admin/faqs/${id}`, { method: "DELETE" }),
  reorderFaqs: (ids: number[]) =>
    authFetch("/admin/faqs/reorder", { method: "PUT", body: JSON.stringify({ ids }) }),

  // Hero Slides
  getHeroSlides: () => authFetch("/admin/hero-slides"),
  createHeroSlide: (data: object) =>
    authFetch("/admin/hero-slides", { method: "POST", body: JSON.stringify(data) }),
  updateHeroSlide: (id: number, data: object) =>
    authFetch(`/admin/hero-slides/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteHeroSlide: (id: number) =>
    authFetch(`/admin/hero-slides/${id}`, { method: "DELETE" }),
  reorderHeroSlides: (ids: number[]) =>
    authFetch("/admin/hero-slides/reorder", { method: "PUT", body: JSON.stringify({ ids }) }),

  // Audit Log
  getAuditLog: () => authFetch("/admin/audit-log"),

  // Password
  changePassword: (current: string, newPass: string) =>
    authFetch("/admin/change-password", {
      method: "PUT",
      body: JSON.stringify({ current, new: newPass }),
    }),
}
