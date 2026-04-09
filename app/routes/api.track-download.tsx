import type { ActionFunctionArgs } from "react-router"
import { authenticate } from "../shopify.server"
import { createDownload } from "../lib/supabase.server"

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticate.public.appProxy(request);

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const { documentUrl, documentTitle, customerId, customerName } = body;

  if (!documentUrl || !documentTitle) {
    return new Response(JSON.stringify({ error: "Paramètres manquants" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    await createDownload({
      documentUrl,
      documentTitle,
      customerId: customerId || "unknown",
      customerName: customerName || "Client inconnu",
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Erreur tracking globale:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
