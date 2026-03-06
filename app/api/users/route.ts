import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, first_name, last_name, email, is_superadmin, is_in_study, created_datetime_utc")
    .order("created_datetime_utc", { ascending: false })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}