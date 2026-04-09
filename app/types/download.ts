export interface Download {
  id: number
  document_url: string
  document_title: string
  customer_id: string
  customer_name: string
  downloaded_at: string
}

export interface TrackDownloadPayload {
  documentUrl: string
  documentTitle: string
  customerId: string
}

export interface PaginatedDownloads {
  data: Download[]
  total: number
  page: number
  totalPages: number
}
