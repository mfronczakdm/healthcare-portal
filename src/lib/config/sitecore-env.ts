/**
 * Sitecore environment values — edit .env / .env.local to point at
 * another SitecoreAI Edge delivery environment.
 *
 * Query documents and variables live in lib/sitecore/queries/ — not here.
 *
 * Server-side GraphQL (Next.js server components) requires SITECORE_API_KEY —
 * the Delivery API token from SitecoreAI Deploy → your environment → Details.
 * Context ID alone returns 401 from Edge when used without a token on the server.
 */
export const sitecoreEnv = {
  endpoint:
    process.env.SITECORE_EDGE_ENDPOINT ??
    "https://edge.sitecorecloud.io/api/graphql/v1",
  environmentId: process.env.SITECORE_ENVIRONMENT_ID ?? "",
  apiKey: process.env.SITECORE_API_KEY ?? "",
  edgeContextId:
    process.env.SITECORE_EDGE_CONTEXT_ID ??
    process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID ??
    "",
  liveEnabled: process.env.NEXT_PUBLIC_SITECORE_LIVE_ENABLED === "true",
  deliveryHeaders: parseHeaders(process.env.SITECORE_DELIVERY_HEADERS),
} as const;

export function isSitecoreEdgeConfigured() {
  return Boolean(sitecoreEnv.apiKey || sitecoreEnv.edgeContextId);
}

export function prefersDeliveryApiKey() {
  return Boolean(sitecoreEnv.apiKey);
}

function parseHeaders(raw?: string): Record<string, string> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

export const trackingEnv = {
  /** Set to "false" to disable Unified Data Layer calls (dev console logging still runs). */
  enabled: process.env.NEXT_PUBLIC_SITECORE_TRACKING_ENABLED !== "false",
  edgeContextId:
    process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID ??
    process.env.SITECORE_EDGE_CONTEXT_ID ??
    "",
  cookieDomain: process.env.NEXT_PUBLIC_SITECORE_COOKIE_DOMAIN ?? "",
} as const;
