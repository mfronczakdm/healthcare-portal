/**
 * Home page — promotion banner (GetMobileCollege)
 *
 * Edit the GraphQL document OR default variables below for your Sitecore environment.
 */
import type { SitecoreQueryDefinition } from "@/lib/sitecore/types";
import { sitecoreQueryDefaults } from "@/lib/sitecore/queries/_defaults";

export const GQL_HOME_PROMO_QUERY = /* GraphQL */ `
  query GetMobileCollege($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      id
      name
      PromoText: field(name: "PromoText") {
        value
      }
      PromoText2: field(name: "PromoText2") {
        value
      }
      PromoLink: field(name: "PromoLink") {
        value
      }
      PromoImage: field(name: "PromoIcon") {
        value
      }
    }
  }
`;

export const homePromoQueryVariables = {
  path: "/sitecore/content/rockland/rockland/Data/Promos/Monitor accounts on the go",
  language: sitecoreQueryDefaults.language,
} as const;

export const homePromoQuery = {
  id: "home.promo",
  description: "Welcome page promotion banner",
  document: GQL_HOME_PROMO_QUERY,
  variables: { ...homePromoQueryVariables },
} satisfies SitecoreQueryDefinition;
