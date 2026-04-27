"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/lib/ThemeContext"

export default function Captions() {
  const router = useRouter()
  const [captions, setCaptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { bg, card, text, subtext, border, tableHead, tableRow, isDark } = useTheme()

  useEffect(() => { checkAndFetch() }, [])

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
      .select(`id, content, like_count, is_featured, caption_requests(id, created_datetime_utc, image_id)`)
      .order("like_count", { ascending: false })
    setCaptions(data || [])
    setLoading(false)
  }

  if (loading) return (
    <div className={`min-h-screen ${bg} flex items-center justify-center`}>
      <p className="text-white animate-pulse">Loading...</p>
    </div>
  )

  return (
    <main className={`min-h-screen ${bg} ${text} p-8`}>
      <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 mb-6 inline-block">← Back to Dashboard</Link>
      <h1 className={`text-3xl font-black mb-6 ${text}`}>💬 Captions</h1>
      <div className={`border rounded-2xl overflow-hidden shadow-xl ${card}`}>
        <table className="w-full text-left">
          <thead className={`border-b ${tableHead}`}>
            <tr>
              <th className={`p-4 text-sm font-semibold ${subtext}`}>Caption</th>
              <th className={`p-4 text-sm font-semibold ${subtext}`}>Image ID</th>
              <th className={`p-4 text-sm font-semibold ${subtext}`}>Likes</th>
              <th className={`p-4 text-sm font-semibold ${subtext}`}>Featured?</th>
              <th className={`p-4 text-sm font-semibold ${subtext}`}>Created At</th>
            </tr>
          </thead>
          <tbody>
            {captions.map((c) => (
              <tr key={c.id} className={`border-b transition ${tableRow}`}>
                <td className={`p-4 max-w-md ${text}`}>{c.content}</td>
                <td className={`p-4 text-sm font-mono ${subtext}`}>{c.caption_requests?.image_id}</td>
                <td className="p-4 font-bold text-purple-400">{c.like_count ?? 0}</td>
                <td className="p-4">{c.is_featured ? "⭐" : <span className={subtext}>—</span>}</td>
                <td className={`p-4 text-sm ${subtext}`}>
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