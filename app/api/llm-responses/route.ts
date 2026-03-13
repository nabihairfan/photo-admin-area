import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET() {
  const { data, error } = await supabaseAdmin.from("llm_model_responses").select("*").order("created_datetime_utc", { ascending: false }).limit(100)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}