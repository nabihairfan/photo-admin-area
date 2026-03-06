"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Captions() {
  const router = useRouter()
  const [captions, setCaptions] = useState<any[]>([])
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

    const { data } = await supabase
      .from("captions")
      .select(`
        id,
        content,
        like_count,
        is_featured,
        caption_requests (
          id,
          created_datetime_utc,
          image_id
        )
      `)
      .order("like_count", { ascending: false })

    setCaptions(data || [])
    setLoading(false)
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <Link href="/dashboard" className="text-blue-600 mb-4 inline-block">← Back</Link>
      <h1 className="text-3xl font-bold mb-6">💬 Captions</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Caption</th>
              <th className="p-4">Image ID</th>
              <th className="p-4">Likes</th>
              <th className="p-4">Featured?</th>
              <th className="p-4">Created At</th>
            </tr>
          </thead>
          <tbody>
            {captions.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{c.content}</td>
                <td className="p-4 text-sm text-gray-500">{c.caption_requests?.image_id}</td>
                <td className="p-4 font-bold text-purple-600">{c.like_count ?? 0}</td>
                <td className="p-4">{c.is_featured ? "⭐" : "—"}</td>
                <td className="p-4 text-sm text-gray-400">
                  {c.caption_requests?.created_datetime_utc
                    ? new Date(c.caption_requests.created_datetime_utc).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}