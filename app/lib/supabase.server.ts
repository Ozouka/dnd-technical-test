import { createClient } from "@supabase/supabase-js"
import type { Download, TrackDownloadPayload } from "../types/download"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// I put 15 here for the screen size to be able to see everything without scrolling but you can change here with 20 for example
const PER_PAGE = 15

export async function createDownload(payload: TrackDownloadPayload & { customerName: string }) {
  const { data, error } = await supabase
    .from("downloads")
    .insert({
      document_url: payload.documentUrl,
      document_title: payload.documentTitle,
      customer_id: payload.customerId,
      customer_name: payload.customerName,
    })
    .select()
    .single()

  if (error) throw new Error(`Supabase insert error: ${error.message}`)
  return data as Download
}

export async function getDownloads(page: number = 1) {
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const { data, error, count } = await supabase
    .from("downloads")
    .select("*", { count: "exact" })
    .order("downloaded_at", { ascending: false })
    .range(from, to)

  if (error) throw new Error(`Supabase select error: ${error.message}`)

  const total = count ?? 0
  const totalPages = Math.ceil(total / PER_PAGE)

  return {
    data: data as Download[],
    total,
    page,
    totalPages,
  }
}
