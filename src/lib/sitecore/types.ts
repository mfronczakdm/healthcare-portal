/**
 * Shared types for the Sitecore GraphQL query library.
 * Connection settings live in lib/config/sitecore-env.ts (endpoint, API key, context).
 * Query documents and variables live here — edit per client/site in the query files.
 */

export interface SitecoreQueryDefinition {
  /** Stable id, e.g. "home.promo" — used in logs and registry */
  id: string;
  /** Human-readable note for SE teams */
  description?: string;
  /** GraphQL document string */
  document: string;
  /** Default variables — override at call time when needed */
  variables: Record<string, unknown>;
}

export interface ContentResult<T> {
  data: T;
  isLive: boolean;
  queryId: string;
  error?: string;
}

export interface SitecoreGraphQLField {
  value?: string;
  jsonValue?: unknown;
}
