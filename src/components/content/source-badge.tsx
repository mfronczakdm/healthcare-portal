import { brandConfig } from "@/lib/config/brand";
import { Badge } from "@/components/ui/badge";
import type { ContentSource } from "@/types/portal";

/**
 * Source label for Sitecore Edge slots only (promos, ads, CMS modules).
 * Do not use on persona/account UI — those are native portal data.
 */
export function SitecoreSourceBadge({ source }: { source: ContentSource }) {
  if (source === "sitecore") {
    if (!brandConfig.features.showSitecoreLiveBadges) return null;
    return <Badge variant="live">{brandConfig.sitecore.liveLabel}</Badge>;
  }

  if (!brandConfig.features.showMockDataLabels) return null;
  return <Badge variant="mock">{brandConfig.sitecore.mockLabel}</Badge>;
}
