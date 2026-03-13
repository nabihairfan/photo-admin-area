"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminTable from "@/components/AdminTable"

export default function LLMModels() {
  const router = useRouter()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: "", provider_model_id: "", llm_provider_id: "", is_temperature_supported: "true" })

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
    const res = await fetch("/api/llm-models")
    setData(await res.json())
    setLoading(false)
  }

  async function handleSubmit() {
    const payload = { ...form, is_temperature_supported: form.is_temperature_supported === "true" }
    if (editing) {
      await fetch("/api/llm-models", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, id: editing.id }) })
    } else {
      await fetch("/api/llm-models", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    }
    setShowForm(false)
    setEditing(null)
    setForm({ name: "", provider_model_id: "", llm_provider_id: "", is_temperature_supported: "true" })
    fetchData()
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this model?")) return
    await fetch("/api/llm-models", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    fetchData()
  }

  function handleEdit(row: any) {
    setEditing(row)
    setForm({ name: row.name, provider_model_id: row.provider_model_id, llm_provider_id: row.llm_provider_id, is_temperature_supported: String(row.is_temperature_supported) })
    setShowForm(true)
  }

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-white animate-pulse">Loading...</p></div>

  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 mb-6 inline-block">← Back to Dashboard</Link>
      <h1 className="text-3xl font-black text-white mb-8">🤖 LLM Models</h1>

      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-bold text-lg mb-4">{editing ? "Edit Model" : "New Model"}</h2>
          <div className="grid grid-cols-2 gap-4">
            {["name", "provider_model_id", "llm_provider_id"].map((field) => (
              <div key={field}>
                <label className="text-gray-400 text-xs uppercase mb-1 block">{field}</label>
                <input className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  value={(form as any)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
              </div>
            ))}
            <div>
              <label className="text-gray-400 text-xs uppercase mb-1 block">Temperature Supported</label>
              <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                value={form.is_temperature_supported} onChange={(e) => setForm({ ...form, is_temperature_supported: e.target.value })}>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
            <button onClick={() => { setShowForm(false); setEditing(null) }} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <AdminTable title="LLM Models" emoji="🤖" data={data} columns={["id", "name", "provider_model_id", "llm_provider_id", "is_temperature_supported"]}
        onDelete={handleDelete} onEdit={handleEdit} onCreate={() => setShowForm(true)} createLabel="Add Model" />
    </main>
  )
}