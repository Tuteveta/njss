// Lightweight input sanitiser — strips HTML tags and trims whitespace
// Used at API boundaries to prevent stored XSS

export function sanitiseString(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return ""
  return value
    .trim()
    .replace(/<[^>]*>/g, "")          // strip HTML tags
    .replace(/[<>'"]/g, (c) => ({     // encode remaining special chars
      "<": "&lt;", ">": "&gt;",
      "'": "&#39;", '"': "&quot;",
    }[c] ?? c))
    .slice(0, maxLength)
}

export function sanitiseEmail(value: unknown): string {
  const s = sanitiseString(value, 200)
  // Basic RFC-compliant email pattern check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : ""
}
