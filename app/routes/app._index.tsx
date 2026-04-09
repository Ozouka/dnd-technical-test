/* eslint-disable react/no-unescaped-entities */
import type { LoaderFunctionArgs } from "react-router"
import { useLoaderData, useSearchParams } from "react-router"
import { authenticate } from "../shopify.server"
import { getDownloads } from "../lib/supabase.server"
import {
  Page,
  Card,
  DataTable,
  Pagination,
  Text,
  Link,
  EmptyState,
} from "@shopify/polaris"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request)

  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"))

  const result = await getDownloads(page)
  return result
}

export default function Index() {
  const { data: downloads, page, totalPages, total } = useLoaderData<typeof loader>()
  const [, setSearchParams] = useSearchParams()

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCustomerAdminUrl = (gid: string): string => {
    const numericId = gid.split("/").pop()
    return `shopify:admin/customers/${numericId}`
  }

  const rows = downloads.map((dl) => [
    <Link url={dl.document_url} external key={`doc-${dl.id}`}>
      {dl.document_title}
    </Link>,
    <Link url={getCustomerAdminUrl(dl.customer_id)} key={`client-${dl.id}`}>
      {dl.customer_name}
    </Link>,
    formatDate(dl.downloaded_at),
  ])

  return (
    <Page
      title="Téléchargements"
      subtitle={`${total} téléchargement${total > 1 ? "s" : ""} au total`}
    >
      <Card>
        {downloads.length === 0 ? (
          <EmptyState heading="Aucun téléchargement pour l'instant" image="">
            <Text as="p" variant="bodyMd">
              Les téléchargements apparaîtront ici dès qu'un client cliquera sur "Télécharger".
            </Text>
          </EmptyState>
        ) : (
          <>
            <DataTable
              columnContentTypes={["text", "text", "text"]}
              headings={["Document", "Client", "Date"]}
              rows={rows}
            />
            {totalPages > 1 && (
              <div style={{ padding: "16px", display: "flex", justifyContent: "center" }}>
                <Pagination
                  hasPrevious={page > 1}
                  onPrevious={() => setSearchParams({ page: String(page - 1) })}
                  hasNext={page < totalPages}
                  onNext={() => setSearchParams({ page: String(page + 1) })}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </Page>
  )
}
