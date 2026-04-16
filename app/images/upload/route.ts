import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: Request) {
  const { imageUrl, description } = await request.json()
  
  const { data, error } = await supabaseAdmin
    .from("images")
    .insert({
      url: imageUrl,
      image_description: description,
      is_public: true,
      is_common_use: false,
      created_by_user_id: (await supabaseAdmin.auth.getUser()).data.user?.id,
      modified_by_user_id: (await supabaseAdmin.auth.getUser()).data.user?.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}