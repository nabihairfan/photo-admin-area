"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminTable from "@/components/AdminTable"

export default function AllowedDomains() {
  const router = useRouter()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ apex_domain: "" })

  useEffect(() => { checkAndFetch() }, [])

  async function checkAndFetch() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/"); return }
    const allowedEmails = ["inabiha820@gmail.com"]
    const { data: profile } = await supabase.from("profiles").select("is_superadmin").eq("email", user.email).single()
    if (!profile?.is_superadmin && !allowedEmails.includes(user.email!)) { router.push("/"); return }
    fetchData()
  }

  async function fetchData() {
    const res = await fetch("/api/allowed-domains")
    setData(await res.json())
    setLoading(false)
  }

  async function handleSubmit() {
    if (editing) {
      await fetch("/api/allowed-domains", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: editing.id }) })
    } else {
      await fetch("/api/allowed-domains", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    }
    setShowForm(false)
    setEditing(null)
    setForm({ apex_domain: "" })
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this domain?")) return
    await fetch("/api/allowed-domains", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    fetchData()
  }

  function handleEdit(row: any) {
    setEditing(row)
    setForm({ apex_domain: row.apex_domain })
    setShowForm(true)
  }

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-white animate-pulse">Loading...</p></div>

  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 mb-6 inline-block">← Back to Dashboard</Link>
      <h1 className="text-3xl font-black text-white mb-8">🌐 Allowed Signup Domains</h1>

      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-bold text-lg mb-4">{editing ? "Edit Domain" : "New Domain"}</h2>
          <div>
            <label className="text-gray-400 text-xs uppercase mb-1 block">Apex Domain</label>
            <input className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. columbia.edu" value={form.apex_domain} onChange={(e) => setForm({ apex_domain: e.target.value })} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <AdminTable title="Allowed Signup Domains" emoji="🌐" data={data} columns={["id", "apex_domain", "created_datetime_utc"]}
        onDelete={handleDelete} onEdit={handleEdit} onCreate={() => setShowForm(true)} createLabel="Add Domain" />
    </main>
  )
}