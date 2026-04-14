"use client"
import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, AlertCircle, KeyRound } from "lucide-react"
import { adminApi, saveSession, isLoggedIn } from "@/lib/adminApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)

  useEffect(() => {
    if (isLoggedIn()) router.push("/admin")
  }, [router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await adminApi.login(username, password)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Login failed")
        return
      }
      saveSession(data.username ?? data.user?.username ?? "admin")
      router.push("/admin")
    } catch {
      setError("Could not connect to server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Card — contains everything */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Card header */}
          <div className="bg-[hsl(352,75%,23%)] px-8 pt-8 pb-6 text-center">
            <div className="flex items-center justify-center mx-auto mb-4 w-24 h-24">
              <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
                <img src="/png-coa.png" alt="NJSS Logo" className="w-16 h-16 object-contain drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-white">NJSS Admin</h1>
            <p className="text-red-200 text-sm mt-1">Sign in to the content management panel</p>
          </div>

          {/* Card body */}
          <div className="px-8 py-7">
            {error && (
              <div className="mb-5 flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {!showForgot ? (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                    <Input
                      required
                      autoFocus
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="admin"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <button
                        type="button"
                        onClick={() => { setShowForgot(true); setError("") }}
                        className="text-xs text-[hsl(352,83%,55%)] hover:text-[hsl(352,83%,48%)] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        required
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-1" disabled={loading}>
                    {loading ? "Signing in…" : "Sign In"}
                  </Button>
                </form>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <KeyRound className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <div className="text-sm text-red-900">
                    <p className="font-medium mb-1">Reset your password</p>
                    <p className="text-red-800 leading-relaxed">
                      Contact your system administrator to reset your password, or use the server environment variable <code className="bg-red-100 px-1 rounded text-xs">ADMIN_INITIAL_PASSWORD</code> to set a new default.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors text-center py-1"
                >
                  ← Back to sign in
                </button>
              </div>
            )}
          </div>

          {/* Card footer */}
          <div className="border-t border-gray-200 px-8 py-4 text-center">
            <a href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              ← Back to public site
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
