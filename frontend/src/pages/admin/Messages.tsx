import { useEffect, useState } from "react"
import { Mail, Trash2, ChevronDown, ChevronUp, MessageSquare } from "lucide-react"
import { adminApi } from "@/lib/adminApi"
import AdminLayout from "@/components/admin/AdminLayout"

interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  receivedAt: string
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString("en-PG", { month: "short", day: "numeric", year: "numeric" })
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")

  const load = () => {
    adminApi.getMessages()
      .then(r => r.json())
      .then(d => setMessages(d.messages || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleExpand = (msg: Message) => {
    if (expanded === msg.id) { setExpanded(null); return }
    setExpanded(msg.id)
    if (!msg.read) {
      adminApi.markRead(msg.id)
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return
    await adminApi.deleteMessage(id)
    setMessages(prev => prev.filter(m => m.id !== id))
    if (expanded === id) setExpanded(null)
  }

  const unread = messages.filter(m => !m.read).length
  const filtered = messages.filter(m =>
    filter === "all" ? true : filter === "unread" ? !m.read : m.read
  )

  return (
    <AdminLayout>
      <div className="w-full space-y-6 pb-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-400 text-sm mt-1.5">
              {messages.length} total{unread > 0 ? ` · ${unread} unread` : " · all read"}
            </p>
          </div>
          {unread > 0 && (
            <span className="flex items-center gap-2 bg-[hsl(210,70%,93%)] text-[hsl(210,70%,30%)] text-sm font-semibold px-4 py-2.5 rounded-xl">
              <Mail className="w-4 h-4" /> {unread} unread
            </span>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden w-fit">
          {(["all", "unread", "read"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors ${
                filter === f ? "bg-[hsl(210,70%,25%)] text-white" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {f === "all" ? `All (${messages.length})` : f === "unread" ? `Unread (${unread})` : `Read (${messages.length - unread})`}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[hsl(210,70%,25%)] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading messages…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No messages here</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {filtered.map(msg => (
              <div key={msg.id} className={`transition-colors ${!msg.read ? "bg-[hsl(210,70%,99%)]" : ""}`}>
                <button
                  onClick={() => handleExpand(msg)}
                  className="w-full flex items-start gap-5 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm ${
                    msg.read ? "bg-gray-100 text-gray-500" : "bg-[hsl(210,70%,93%)] text-[hsl(210,70%,30%)]"
                  }`}>
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`text-sm font-bold truncate ${msg.read ? "text-gray-700" : "text-gray-900"}`}>
                          {msg.name}
                        </span>
                        {!msg.read && <span className="w-2 h-2 rounded-full bg-[hsl(210,70%,40%)] shrink-0" />}
                        <span className="text-xs text-gray-400 hidden sm:block truncate">{msg.email}</span>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">{timeAgo(msg.receivedAt)}</span>
                    </div>
                    <div className={`text-sm ${msg.read ? "text-gray-500" : "text-gray-800 font-semibold"}`}>
                      {msg.subject}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 line-clamp-1 leading-relaxed">
                      {msg.message}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 mt-1">
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(msg.id) }}
                      className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expanded === msg.id
                      ? <ChevronUp className="w-4 h-4 text-gray-400" />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />
                    }
                  </div>
                </button>

                {expanded === msg.id && (
                  <div className="px-6 pb-6 pl-[84px]">
                    <div className="bg-gray-50 rounded-xl p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100 mb-4">
                      {msg.message}
                    </div>
                    <div className="flex items-center gap-4">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[hsl(210,70%,25%)] bg-[hsl(210,70%,93%)] hover:bg-[hsl(210,70%,88%)] px-4 py-2 rounded-lg transition-colors"
                      >
                        <Mail className="w-4 h-4" /> Reply via email
                      </a>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.receivedAt).toLocaleDateString("en-PG", {
                          weekday: "long", year: "numeric", month: "long",
                          day: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
