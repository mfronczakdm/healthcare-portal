import { mockPromoContent } from "@/lib/mock-data/promo-fallback";
import { loadSitecoreSlot } from "@/lib/sitecore/execute-query";
import {
  parseSitecoreImageSrc,
  parseSitecoreLink,
  parseSitecoreRichText,
} from "@/lib/sitecore/parse-field-values";
import { homePromoQuery } from "@/lib/sitecore/queries/home/promo.query";
import type { SitecoreGraphQLField } from "@/lib/sitecore/types";
import type { ContentResult } from "@/lib/sitecore/types";
import type { PromoContent } from "@/types/portal";

interface HomePromoQueryItem {
  id?: string;
  name?: string;
  PromoText?: SitecoreGraphQLField;
  PromoText2?: SitecoreGraphQLField;
  PromoLink?: SitecoreGraphQLField;
  PromoImage?: SitecoreGraphQLField;
}

interface HomePromoQueryData {
  item?: HomePromoQueryItem | null;
}

function fieldValue(field?: SitecoreGraphQLField): string {
  return field?.value?.trim() ?? "";
}

function mapHomePromoResponse(
  data: HomePromoQueryData | undefined
): PromoContent | null {
  const item = data?.item;
  if (!item) return null;

  const promoText = parseSitecoreRichText(fieldValue(item.PromoText));
  if (!promoText) return null;

  const promoText2 = parseSitecoreRichText(fieldValue(item.PromoText2)) || undefined;
  const link = parseSitecoreLink(fieldValue(item.PromoLink));
  const promoImageUrl = parseSitecoreImageSrc(fieldValue(item.PromoImage));

  return {
    id: item.id ?? "sitecore-promo",
    source: "sitecore",
    sitecoreId: item.id,
    name: item.name,
    promoText,
    promoText2,
    promoLinkLabel: link.label,
    promoLinkHref: link.href,
    promoImageUrl,
  };
}

/** Home page — promotion banner partial (uses GQL_HOME_PROMO_QUERY) */
export async function loadHomePromo(
  variables?: Record<string, unknown>
): Promise<ContentResult<PromoContent>> {
  return loadSitecoreSlot<HomePromoQueryData, PromoContent>({
    definition: homePromoQuery,
    map: mapHomePromoResponse,
    fallback: mockPromoContent,
    variables,
  });
}
