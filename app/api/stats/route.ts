import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET() {
  const [users, images, captions] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("images").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("captions").select("*", { count: "exact", head: true }),
  ])

  return NextResponse.json({
    users: users.count,
    images: images.count,
    captions: captions.count,
  })
}