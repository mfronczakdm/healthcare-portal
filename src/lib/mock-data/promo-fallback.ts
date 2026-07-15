import type { PromoContent } from "@/types/portal";

/**
 * Fallback promo shown when Sitecore Edge delivery is unavailable.
 * Only this slot displays the MOCK DATA badge — not account/persona UI.
 */
export const mockPromoContent: PromoContent = {
  id: "promo-fallback",
  source: "mock",
  name: "Wellness Promotion",
  promoText: "Save on preventive screenings this season",
  promoText2:
    "Schedule your annual wellness visit and access member-only education resources.",
  promoLinkLabel: "Learn more",
  promoLinkHref: "/resources",
};
