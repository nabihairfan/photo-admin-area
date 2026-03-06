"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Images() {
  const router = useRouter()
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [editingId, setEditingId] = useState<any>(null)
  const [editUrl, setEditUrl] = useState("")
  const [editDescription, setEditDescription] = useState("")

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

    fetchImages()
  }

  async function fetchImages() {
    const { data } = await supabase
      .from("images")
      .select("id, url, image_description, is_public, is_common_use, created_datetime_utc")
      .order("created_datetime_utc", { ascending: false })
    setImages(data || [])
    setLoading(false)
  }

  async function createImage() {
    if (!newUrl) return
    await supabase.from("images").insert({ url: newUrl, image_description: newDescription })
    setNewUrl("")
    setNewDescription("")
    fetchImages()
  }

  async function updateImage(id: any) {
    await supabase.from("images").update({ url: editUrl, image_description: editDescription }).eq("id", id)
    setEditingId(null)
    fetchImages()
  }

  async function deleteImage(id: any) {
    if (!confirm("Delete this image?")) return
    await supabase.from("images").delete().eq("id", id)
    fetchImages()
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <Link href="/dashboard" className="text-blue-600 mb-4 inline-block">← Back</Link>
      <h1 className="text-3xl font-bold mb-6">🖼️ Images</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col gap-3">
        <h2 className="font-semibold text-lg">Add New Image</h2>
        <input
          className="border rounded px-3 py-2"
          placeholder="Image URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button onClick={createImage} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-fit">
          + Add Image
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
            <img src={img.url} alt="" className="w-16 h-16 object-cover rounded" onError={(e: any) => e.target.style.display='none'} />
            <div className="flex-1">
              {editingId === img.id ? (
                <div className="flex flex-col gap-2">
                  <input className="border rounded px-3 py-2" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} placeholder="URL" />
                  <input className="border rounded px-3 py-2" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Description" />
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 truncate">{img.url}</p>
                  <p className="text-xs text-gray-400">{img.image_description}</p>
                  <p className="text-xs text-gray-400">{img.is_public ? "🌍 Public" : "🔒 Private"}</p>
                </>
              )}
            </div>
            <div className="flex gap-2">
              {editingId === img.id ? (
                <button onClick={() => updateImage(img.id)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Save</button>
              ) : (
                <button onClick={() => { setEditingId(img.id); setEditUrl(img.url); setEditDescription(img.image_description || "") }} className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Edit</button>
              )}
              <button onClick={() => deleteImage(img.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}