"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminTable from "@/components/AdminTable"

export default function Terms() {
  const router = useRouter()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ term: "", definition: "", example: "", priority: "" })

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
    const res = await fetch("/api/terms")
    setData(await res.json())
    setLoading(false)
  }

  async function handleSubmit() {
    if (editing) {
      await fetch("/api/terms", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: editing.id }) })
    } else {
      await fetch("/api/terms", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
    }
    setShowForm(false)
    setEditing(null)
    setForm({ term: "", definition: "", example: "", priority: "" })
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this term?")) return
    await fetch("/api/terms", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    fetchData()
  }

  function handleEdit(row: any) {
    setEditing(row)
    setForm({ term: row.term, definition: row.definition, example: row.example, priority: row.priority })
    setShowForm(true)
  }

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-white animate-pulse">Loading...</p></div>

  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 mb-6 inline-block">← Back to Dashboard</Link>
      <h1 className="text-3xl font-black text-white mb-8">📖 Terms</h1>

      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-bold text-lg mb-4">{editing ? "Edit Term" : "New Term"}</h2>
          <div className="grid grid-cols-2 gap-4">
            {["term", "definition", "example", "priority"].map((field) => (
              <div key={field}>
                <label className="text-gray-400 text-xs uppercase mb-1 block">{field}</label>
                <input className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  value={(form as any)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <AdminTable title="Terms" emoji="📖" data={data} columns={["id", "term", "definition", "example", "priority"]}
        onDelete={handleDelete} onEdit={handleEdit} onCreate={() => setShowForm(true)} createLabel="Add Term" />
    </main>
  )
}