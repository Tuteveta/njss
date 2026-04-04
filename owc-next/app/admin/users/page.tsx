"use client"
import { useEffect, useState } from "react"
import { adminApi } from "@/lib/adminApi"
import AdminLayout from "@/components/admin/AdminLayout"
import { ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_COLORS, ROLES, type Role } from "@/lib/roles"
import { Plus, Pencil, Trash2, X, ShieldCheck, AlertCircle, Eye, EyeOff } from "lucide-react"

interface User { id: number; username: string; role: string; created_at: string }

function RoleBadge({ role }: { role: string }) {
  const color = ROLE_COLORS[role as Role] ?? "bg-gray-100 text-gray-600"
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${color}`}>
      {ROLE_LABELS[role as Role] ?? role}
    </span>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentRole, setCurrentRole] = useState("")
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)

  // Form state
  const [fUsername, setFUsername] = useState("")
  const [fPassword, setFPassword] = useState("")
  const [fRole, setFRole] = useState<Role>("editor")
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    adminApi.me().then(r => r.json()).then(d => setCurrentRole(d.role))
    load()
  }, [])

  function load() {
    setLoading(true)
    adminApi.getUsers()
      .then(r => r.json())
      .then(d => setUsers(d.users ?? []))
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false))
  }

  function openCreate() {
    setEditUser(null)
    setFUsername(""); setFPassword(""); setFRole("editor")
    setFormError(""); setShowForm(true)
  }

  function openEdit(u: User) {
    setEditUser(u)
    setFUsername(u.username); setFPassword(""); setFRole(u.role as Role)
    setFormError(""); setShowForm(true)
  }

  async function handleSave() {
    setFormError("")
    if (!editUser && (!fUsername.trim() || !fPassword)) {
      setFormError("Username and password are required"); return
    }
    if (!editUser && fPassword.length < 8) {
      setFormError("Password must be at least 8 characters"); return
    }
    setSaving(true)
    try {
      let res
      if (editUser) {
        const body: { role?: string; password?: string } = { role: fRole }
        if (fPassword) body.password = fPassword
        res = await adminApi.updateUser(editUser.id, body)
      } else {
        res = await adminApi.createUser({ username: fUsername.trim(), password: fPassword, role: fRole })
      }
      if (!res.ok) {
        const d = await res.json()
        setFormError(d.error || "Save failed"); return
      }
      setShowForm(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(u: User) {
    if (!confirm(`Delete user "${u.username}"? This cannot be undone.`)) return
    await adminApi.deleteUser(u.id)
    load()
  }

  if (currentRole && currentRole !== "superadmin") {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShieldCheck className="w-12 h-12 text-gray-200 mb-4" />
          <p className="font-semibold text-gray-500">Access Denied</p>
          <p className="text-sm text-gray-400 mt-1">User management is restricted to Super Admins.</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-base font-bold text-gray-900">User Management</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Manage admin accounts and their access roles</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 bg-[hsl(352,83%,48%)] hover:bg-[hsl(352,75%,23%)] text-white text-xs font-semibold px-3 py-2 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add User
          </button>
        </div>

        {/* Roles reference */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ROLES.map(r => (
            <div key={r} className="gf-panel p-4">
              <div className="flex items-center gap-2 mb-1">
                <RoleBadge role={r} />
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">{ROLE_DESCRIPTIONS[r]}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}

        {/* Users table */}
        <div className="gf-panel overflow-hidden">
          <div className="gf-panel-header">
            <span className="gf-panel-title">All Users</span>
            <span className="text-[11px] text-gray-400">{users.length} account{users.length !== 1 ? "s" : ""}</span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-gray-400">Loading…</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Created</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{u.username}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell">
                      {new Date(u.created_at).toLocaleDateString("en-PG", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-sm">{editUser ? `Edit "${editUser.username}"` : "Add New User"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2.5 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />{formError}
              </div>
            )}

            {!editUser && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Username</label>
                <input
                  value={fUsername}
                  onChange={e => setFUsername(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none"
                  placeholder="e.g. jdoe"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                {editUser ? "New Password (leave blank to keep)" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={fPassword}
                  onChange={e => setFPassword(e.target.value)}
                  className="w-full h-9 px-3 pr-9 rounded-lg border border-gray-200 text-sm bg-gray-50 focus:bg-white focus:border-[hsl(352,83%,44%)] focus:outline-none"
                  placeholder={editUser ? "Leave blank to keep current" : "Min 8 characters"}
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Role</label>
              <div className="space-y-2">
                {ROLES.map(r => (
                  <label key={r} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${fRole === r ? "border-[hsl(352,83%,44%)] bg-red-50/40" : "border-gray-200 hover:border-gray-300"}`}>
                    <input
                      type="radio"
                      name="role"
                      value={r}
                      checked={fRole === r}
                      onChange={() => setFRole(r)}
                      className="mt-0.5 accent-[hsl(352,83%,44%)]"
                    />
                    <div>
                      <div className="text-xs font-bold text-gray-800">{ROLE_LABELS[r]}</div>
                      <div className="text-[11px] text-gray-400 leading-tight">{ROLE_DESCRIPTIONS[r]}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 h-9 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-9 rounded-lg bg-[hsl(352,83%,48%)] hover:bg-[hsl(352,75%,23%)] text-white text-sm font-semibold transition-colors disabled:opacity-60"
              >
                {saving ? "Saving…" : editUser ? "Save Changes" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
