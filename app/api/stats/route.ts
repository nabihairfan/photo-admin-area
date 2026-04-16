import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET() {
  const [users, images, captions, votes, upvotes, downvotes, topCaptions] = await Promise.all([
    supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("images").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("captions").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("caption_votes").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("caption_votes").select("*", { count: "exact", head: true }).eq("vote_value", 1),
    supabaseAdmin.from("caption_votes").select("*", { count: "exact", head: true }).eq("vote_value", -1),
    supabaseAdmin.from("captions").select("id, content, like_count").order("like_count", { ascending: false }).limit(5),
  ])

  return NextResponse.json({
    users: users.count,
    images: images.count,
    captions: captions.count,
    votes: votes.count,
    upvotes: upvotes.count,
    downvotes: downvotes.count,
    topCaptions: topCaptions.data,
  })
}