"use client"
import { useEffect, useState } from "react"
import { RefreshCw, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminLayout from "@/components/admin/AdminLayout"
import { adminApi } from "@/lib/adminApi"

interface LogEntry {
  id: number
  username: string
  action: string
  detail: string
  ip: string
  createdAt: string
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const ACTION_COLORS: Record<string, string> = {
  login:  "bg-emerald-50 text-emerald-700",
  logout: "bg-gray-100 text-gray-600",
  create: "bg-blue-50 text-blue-700",
  update: "bg-amber-50 text-amber-700",
  delete: "bg-red-50 text-red-700",
}

export default function AuditLog() {
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminApi.getAuditLog()
      .then(r => r.json())
      .then(d => setEntries(d.entries ?? []))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const actionColor = (action: string) => {
    const key = Object.keys(ACTION_COLORS).find(k => action.toLowerCase().startsWith(k))
    return key ? ACTION_COLORS[key] : "bg-gray-100 text-gray-600"
  }

  return (
    <AdminLayout>
      <div className="w-full space-y-6 pb-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
            <p className="text-gray-400 text-sm mt-1.5">{entries.length} recorded action{entries.length !== 1 ? "s" : ""}</p>
          </div>
          <Button variant="outline" onClick={load} className="flex items-center gap-2 h-10">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-16 text-center">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(210,70%,25%)] rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading log…</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-16 text-center">
              <ShieldAlert className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No audit log entries yet</p>
              <p className="text-gray-400 text-sm mt-1">Actions will appear here after admin activity</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[auto_1fr_auto] border-b border-gray-100 bg-gray-50/60 px-6">
                <div className="py-3.5 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">User &amp; Detail</div>
                <div className="py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">When</div>
              </div>
              <div className="divide-y divide-gray-50">
                {entries.map(e => (
                  <div key={e.id} className="grid grid-cols-[auto_1fr_auto] items-center px-6 py-4 hover:bg-gray-50/60 transition-colors">
                    <div className="pr-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${actionColor(e.action)}`}>
                        {e.action}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-gray-900 text-sm">{e.username}</span>
                      {e.detail && <span className="text-sm text-gray-500"> — {e.detail}</span>}
                      {e.ip && <div className="text-xs text-gray-300 mt-0.5">{e.ip}</div>}
                    </div>
                    <div className="text-right text-sm text-gray-400 whitespace-nowrap pl-6">{timeAgo(e.createdAt)}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
