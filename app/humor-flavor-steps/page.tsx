"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AdminTable from "@/components/AdminTable"

export default function HumorFlavorSteps() {
  const router = useRouter()
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { checkAndFetch() }, [])

  async function checkAndFetch() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/"); return }
    const allowedEmails = ["inabiha820@gmail.com"]
    const { data: profile } = await supabase.from("profiles").select("is_superadmin").eq("email", user.email).single()
    if (!profile?.is_superadmin && !allowedEmails.includes(user.email!)) { router.push("/"); return }
    const res = await fetch("/api/humor-flavor-steps")
    setData(await res.json())
    setLoading(false)
  }

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-white animate-pulse">Loading...</p></div>

  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 mb-6 inline-block">← Back to Dashboard</Link>
      <h1 className="text-3xl font-black text-white mb-8">🪜 Humor Flavor Steps</h1>
      <AdminTable title="Humor Flavor Steps" emoji="🪜" data={data} columns={["id", "humor_flavor_id", "description", "order_by", "llm_temperature", "created_datetime_utc"]} />
    </main>
  )
}