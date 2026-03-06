"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"


export default function Users() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAndFetch()
  }, [])

  async function checkAndFetch() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/"); return }

    const allowedEmails = ["inabiha820@gmail.com"]
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_superadmin")
      .eq("email", user.email)
      .single()

    if (!profile?.is_superadmin && !allowedEmails.includes(user.email!)) {
      router.push("/"); return
    }

    const response = await fetch("/api/users")
    const data = await response.json()
    console.log("profiles data:", data?.length)
    setUsers(data || [])
    setLoading(false)
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <Link href="/dashboard" className="text-blue-600 mb-4 inline-block">← Back</Link>
      <h1 className="text-3xl font-bold mb-6">👤 Users / Profiles</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Superadmin?</th>
              <th className="p-4">In Study?</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{u.first_name} {u.last_name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.is_superadmin ? "✅" : "—"}</td>
                <td className="p-4">{u.is_in_study ? "✅" : "—"}</td>
                <td className="p-4 text-sm text-gray-400">{new Date(u.created_datetime_utc).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}