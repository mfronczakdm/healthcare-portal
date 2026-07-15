import { sitecoreEnv } from "@/lib/config/sitecore-env";

export interface GraphQLRequestOptions {
  query: string;
  variables?: Record<string, unknown>;
  endpoint?: string;
  headers?: Record<string, string>;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string; path?: string[] }[];
}

/**
 * Minimal GraphQL helper for Sitecore Edge delivery.
 * Server-side requests should use SITECORE_API_KEY (Delivery token from Deploy).
 * @see https://doc.sitecore.com/sai/en/developers/sitecoreai/experience-edge/experience-edge-apis/authorization-and-api-access/index.html
 */
export async function sitecoreGraphQL<T>(
  options: GraphQLRequestOptions
): Promise<GraphQLResponse<T>> {
  const endpoint = options.endpoint ?? sitecoreEnv.endpoint;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...sitecoreEnv.deliveryHeaders,
    ...options.headers,
  };

  if (sitecoreEnv.apiKey) {
    headers.sc_apikey = sitecoreEnv.apiKey;
  }
  if (sitecoreEnv.edgeContextId) {
    headers["X-EXPERIENCE-EDGE-CONTEXT"] = sitecoreEnv.edgeContextId;
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: options.query,
      variables: options.variables ?? {},
    }),
    cache: "no-store",
  });

  const bodyText = await response.text();

  if (!response.ok) {
    throw new Error(
      `Sitecore GraphQL ${response.status} ${response.statusText}: ${bodyText.slice(0, 240)}`
    );
  }

  try {
    return JSON.parse(bodyText) as GraphQLResponse<T>;
  } catch {
    throw new Error(
      `Sitecore GraphQL returned non-JSON: ${bodyText.slice(0, 240)}`
    );
  }
}
