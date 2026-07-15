import {
  isSitecoreEdgeConfigured,
} from "@/lib/config/sitecore-env";
import { sitecoreGraphQL } from "@/lib/sitecore/client";
import type {
  ContentResult,
  SitecoreQueryDefinition,
} from "@/lib/sitecore/types";

export interface ExecuteSitecoreQueryOptions {
  /** Merge over definition.variables at runtime (e.g. preview language) */
  variables?: Record<string, unknown>;
}

export interface ExecuteSitecoreQueryResponse<TData> {
  data?: TData;
  errors?: { message: string; path?: string[] }[];
}

/**
 * Run any registered Sitecore query definition against Edge.
 * Returns raw GraphQL payload — loaders map to UI models.
 */
export async function executeSitecoreQuery<TData>(
  definition: SitecoreQueryDefinition,
  options?: ExecuteSitecoreQueryOptions
): Promise<ExecuteSitecoreQueryResponse<TData>> {
  if (!isSitecoreEdgeConfigured()) {
    return {
      errors: [{ message: "Sitecore Edge is not configured (missing context or API key)" }],
    };
  }

  return sitecoreGraphQL<TData>({
    query: definition.document,
    variables: {
      ...definition.variables,
      ...options?.variables,
    },
  });
}

export interface LoadSitecoreSlotOptions<TData, TModel> {
  definition: SitecoreQueryDefinition;
  map: (data: TData | undefined) => TModel | null;
  fallback: TModel;
  variables?: Record<string, unknown>;
}

/**
 * Execute a query, map to a UI model, and fall back when Edge is unavailable.
 * Use one call per page partial (promo, hero, featured list, etc.).
 */
export async function loadSitecoreSlot<TData, TModel>(
  options: LoadSitecoreSlotOptions<TData, TModel>
): Promise<ContentResult<TModel>> {
  const { definition, map, fallback, variables } = options;

  if (!isSitecoreEdgeConfigured()) {
    const message =
      "Sitecore Edge is not configured — set SITECORE_API_KEY in .env.local";
    if (process.env.NODE_ENV === "development") {
      console.warn(`[sitecore:${definition.id}] ${message}`);
    }
    return {
      data: fallback,
      isLive: false,
      queryId: definition.id,
      error: message,
    };
  }

  if (
    process.env.NODE_ENV === "development" &&
    !process.env.SITECORE_API_KEY
  ) {
    console.warn(
      `[sitecore:${definition.id}] SITECORE_API_KEY is missing. Server-side Edge requests need the Delivery API token from SitecoreAI Deploy (Context ID alone often returns 401).`
    );
  }

  try {
    const response = await executeSitecoreQuery<TData>(definition, { variables });

    if (response.errors?.length) {
      const error = response.errors[0]?.message ?? "GraphQL error";
      if (process.env.NODE_ENV === "development") {
        console.error(`[sitecore:${definition.id}] ${error}`);
      }
      return {
        data: fallback,
        isLive: false,
        queryId: definition.id,
        error,
      };
    }

    const mapped = map(response.data);
    if (!mapped) {
      const error = "No content returned from Sitecore Edge";
      if (process.env.NODE_ENV === "development") {
        console.error(`[sitecore:${definition.id}] ${error}`, response.data);
      }
      return {
        data: fallback,
        isLive: false,
        queryId: definition.id,
        error,
      };
    }

    return {
      data: mapped,
      isLive: true,
      queryId: definition.id,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Sitecore query failed";
    if (process.env.NODE_ENV === "development") {
      console.error(`[sitecore:${definition.id}] ${message}`);
    }
    return {
      data: fallback,
      isLive: false,
      queryId: definition.id,
      error: message,
    };
  }
}
