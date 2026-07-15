export { sitecoreGraphQL } from "./client";
export type { GraphQLRequestOptions, GraphQLResponse } from "./client";

export {
  executeSitecoreQuery,
  loadSitecoreSlot,
} from "./execute-query";
export type {
  ExecuteSitecoreQueryOptions,
  ExecuteSitecoreQueryResponse,
  LoadSitecoreSlotOptions,
} from "./execute-query";

export {
  sitecoreQueryDefaults,
  GQL_HOME_PROMO_QUERY,
  homePromoQuery,
  homePromoQueryVariables,
  sitecoreQueryRegistry,
  getSitecoreQuery,
} from "./queries";
export type { SitecoreQueryId } from "./queries";

export {
  parseSitecoreRichText,
  parseSitecoreImageSrc,
  parseSitecoreLink,
} from "./parse-field-values";
export type { ParsedSitecoreLink } from "./parse-field-values";

export { loadHomePromo } from "./loaders";
export { loadHomePromo as getPromoContent } from "./loaders";

export {
  mapAlert,
  mapRecommendation,
  mapCta,
  mapResource,
  mapHero,
  mapPortalContent,
} from "./mappers";
export { preferLiveOrMock } from "./content";
export { isMockSource, isLiveSource } from "./fallback";

export type {
  SitecoreQueryDefinition,
  ContentResult,
  SitecoreGraphQLField,
} from "./types";
