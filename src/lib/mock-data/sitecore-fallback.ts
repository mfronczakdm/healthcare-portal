import type {
  AlertItem,
  ContentBlock,
  CtaItem,
  RecommendationItem,
  ResourceItem,
  SitecorePortalContent,
} from "@/types/portal";

/**
 * Mock Sitecore-shaped content used when Edge delivery is unavailable.
 * Used by legacy portal content queries — promo uses mockPromoContent instead.
 */
export const mockSitecoreContent: SitecorePortalContent = {
  hero: {
    id: "sc-hero-fallback",
    source: "mock",
    heading: "Stay ahead of your care",
    body: "Personalized recommendations and care reminders curated for your plan and health goals.",
    ctaLabel: "Explore resources",
    ctaHref: "/resources",
  },
  alerts: [
    {
      id: "sc-alert-fallback-1",
      title: "Flu season guidance",
      body: "Review vaccination options and clinic hours for the upcoming season.",
      severity: "info",
      href: "/resources",
      ctaLabel: "View guidance",
    },
  ] satisfies AlertItem[],
  recommendations: [
    {
      id: "sc-rec-fallback-1",
      title: "Seasonal Wellness Checklist",
      summary: "Preventive tips aligned to your care pathway and local clinics.",
      category: "Wellness",
      readingTimeMinutes: 4,
      href: "/resources",
    },
    {
      id: "sc-rec-fallback-2",
      title: "Digital Visit Options",
      summary: "When a virtual visit is the fastest way to get answers.",
      category: "Care Delivery",
      readingTimeMinutes: 3,
      href: "/appointments",
    },
  ] satisfies RecommendationItem[],
  ctas: [
    {
      id: "sc-cta-fallback-1",
      source: "mock",
      title: "Need care today?",
      description: "Schedule a same-day virtual visit with an available clinician.",
      primaryLabel: "Schedule a visit",
      primaryHref: "/appointments",
      secondaryLabel: "Message care team",
      secondaryHref: "/messages",
    },
  ] satisfies CtaItem[],
  featuredResources: [
    {
      id: "sc-res-fallback-1",
      title: "Member Knowledge Center",
      summary: "Articles and short videos selected for your plan benefits.",
      category: "Education",
      tags: ["learning", "benefits"],
      featured: true,
      href: "/resources",
    },
  ] satisfies ResourceItem[],
};

export const mockPortalChromeBlocks: ContentBlock[] = [
  {
    id: "chrome-welcome",
    source: "mock",
    heading: "Your care snapshot",
    body: "Appointments, messages, and recommended reading appear here based on your profile.",
  },
];
