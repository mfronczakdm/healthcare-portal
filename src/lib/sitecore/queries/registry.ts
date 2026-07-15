import { homePromoQuery } from "./home/promo.query";
import type { SitecoreQueryDefinition } from "@/lib/sitecore/types";

export const sitecoreQueryRegistry = {
  [homePromoQuery.id]: homePromoQuery,
} as const satisfies Record<string, SitecoreQueryDefinition>;

export type SitecoreQueryId = keyof typeof sitecoreQueryRegistry;

export function getSitecoreQuery(id: SitecoreQueryId): SitecoreQueryDefinition {
  return sitecoreQueryRegistry[id];
}
