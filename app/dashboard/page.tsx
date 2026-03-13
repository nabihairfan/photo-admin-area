"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { checkUserAndFetchStats() }, [])

  async function checkUserAndFetchStats() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/"); return }

    const { data: profile } = await supabase.from("profiles").select("is_superadmin").eq("email", user.email).single()
    const allowedEmails = ["inabiha820@gmail.com"]
    if (!profile?.is_superadmin && !allowedEmails.includes(user.email!)) { router.push("/"); return }

    const response = await fetch("/api/stats")
    const data = await response.json()
    setStats(data)
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">⚡</div>
        <p className="text-white text-xl font-semibold animate-pulse">Loading Admin Dashboard...</p>
      </div>
    </div>
  )

  const pieData = [
    { name: "Users", value: stats?.users },
    { name: "Images", value: stats?.images },
    { name: "Captions", value: stats?.captions },
  ]

  const COLORS = ["#6366f1", "#22d3ee", "#f59e0b"]

  const barData = [
    { name: "Users", count: stats?.users, fill: "#6366f1" },
    { name: "Images", count: stats?.images, fill: "#22d3ee" },
    { name: "Captions", count: stats?.captions, fill: "#f59e0b" },
  ]

  const captionsPerImage = stats?.images ? (stats?.captions / stats?.images).toFixed(1) : 0
  const captionsPerUser = stats?.users ? (stats?.captions / stats?.users).toFixed(1) : 0
  const imagesPerUser = stats?.users ? (stats?.images / stats?.users).toFixed(1) : 0

  const navItems = [
    { href: "/users", label: "Users", emoji: "👤", color: "bg-indigo-600 hover:bg-indigo-700" },
    { href: "/images", label: "Images", emoji: "🖼️", color: "bg-cyan-600 hover:bg-cyan-700" },
    { href: "/captions", label: "Captions", emoji: "💬", color: "bg-amber-600 hover:bg-amber-700" },
    { href: "/caption-requests", label: "Caption Requests", emoji: "📝", color: "bg-pink-600 hover:bg-pink-700" },
    { href: "/caption-examples", label: "Caption Examples", emoji: "✍️", color: "bg-purple-600 hover:bg-purple-700" },
    { href: "/humor-flavors", label: "Humor Flavors", emoji: "😂", color: "bg-green-600 hover:bg-green-700" },
    { href: "/humor-flavor-steps", label: "Humor Flavor Steps", emoji: "🪜", color: "bg-teal-600 hover:bg-teal-700" },
    { href: "/terms", label: "Terms", emoji: "📖", color: "bg-orange-600 hover:bg-orange-700" },
    { href: "/llm-models", label: "LLM Models", emoji: "🤖", color: "bg-blue-600 hover:bg-blue-700" },
    { href: "/llm-providers", label: "LLM Providers", emoji: "🏢", color: "bg-violet-600 hover:bg-violet-700" },
    { href: "/llm-prompt-chains", label: "Prompt Chains", emoji: "⛓️", color: "bg-red-600 hover:bg-red-700" },
    { href: "/llm-responses", label: "LLM Responses", emoji: "💭", color: "bg-yellow-600 hover:bg-yellow-700" },
    { href: "/allowed-domains", label: "Allowed Domains", emoji: "🌐", color: "bg-lime-600 hover:bg-lime-700" },
    { href: "/whitelist-emails", label: "Whitelist Emails", emoji: "📧", color: "bg-sky-600 hover:bg-sky-700" },
  ]

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent">
            ⚡ Crackd Admin
          </h1>
          <p className="text-gray-400 mt-1">Real-time database overview</p>
        </div>
        <button onClick={signOut} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition">
          Sign Out
        </button>
      </div>

      {/* Nav Grid */}
      <div className="grid grid-cols-4 gap-3 mb-10">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`${item.color} text-white px-4 py-3 rounded-lg text-sm font-semibold transition text-center`}>
            {item.emoji} {item.label}
          </Link>
        ))}
      </div>

      {/* Big stat cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: "Total Users", value: stats?.users?.toLocaleString(), icon: "👤", color: "from-indigo-600 to-indigo-900", border: "border-indigo-500" },
          { label: "Total Images", value: stats?.images?.toLocaleString(), icon: "🖼️", color: "from-cyan-600 to-cyan-900", border: "border-cyan-500" },
          { label: "Total Captions", value: stats?.captions?.toLocaleString(), icon: "💬", color: "from-amber-600 to-amber-900", border: "border-amber-500" },
        ].map((s) => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} border ${s.border} rounded-2xl p-6 shadow-xl`}>
            <div className="text-4xl mb-3">{s.icon}</div>
            <p className="text-gray-300 text-sm uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-5xl font-black">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Ratio cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: "Captions per Image", value: captionsPerImage, icon: "📸", desc: "avg captions generated per image" },
          { label: "Captions per User", value: captionsPerUser, icon: "✍️", desc: "avg captions per user" },
          { label: "Images per User", value: imagesPerUser, icon: "🗂️", desc: "avg images per user" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
            <div className="text-3xl mb-2">{s.icon}</div>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-4xl font-black text-white">{s.value}</p>
            <p className="text-gray-500 text-xs mt-2">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold mb-6 text-gray-200">📊 Database Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} labelStyle={{ color: "#f9fafb" }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold mb-6 text-gray-200">🥧 Data Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fun facts */}
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold mb-4 text-gray-200">🤯 Fun Facts</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { fact: `Each image gets an average of ${captionsPerImage} captions generated`, emoji: "⚖️" },
            { fact: `${stats?.images?.toLocaleString()} images have been uploaded to Crackd`, emoji: "🚀" },
            { fact: `Over ${stats?.captions?.toLocaleString()} captions generated — that's a lot of humor!`, emoji: "😂" },
            { fact: `${stats?.users?.toLocaleString()} users have joined the Crackd community`, emoji: "🌍" },
          ].map((f, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-4">
              <div className="text-3xl mb-2">{f.emoji}</div>
              <p className="text-gray-300 text-sm">{f.fact}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-gray-600 text-xs mt-8">Crackd Admin Area • Superadmins only 🔒</p>
    </main>
  )
}