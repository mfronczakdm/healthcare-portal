/**
 * Unified Data Layer defaults for CareConnect Portal.
 * Channel is fixed to PORTAL; event types are prefixed with the Sitecore site name.
 */
export const trackingConfig = {
  channel: "PORTAL" as const,
  language: "EN" as const,
  currency: "USD" as const,
  country: "US" as const,
  siteName:
    process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME ??
    process.env.NEXT_PUBLIC_SITECORE_SITE_NAME ??
    "careconnect",
} as const;

/** Sitecore custom event types (prefixed at runtime). */
export const portalEventTypes = {
  viewHome: "VIEW_HOME",
  viewMessage: "VIEW_MESSAGE",
  viewResults: "VIEW_RESULTS",
  viewAppointments: "VIEW_APPOINTMENTS",
  viewResources: "VIEW_RESOURCES",
  viewProfile: "VIEW_PROFILE",
  openMessage: "OPEN_MESSAGE",
  clickedCta: "CLICKED_CTA",
  clickedPromo: "CLICKED_PROMO",
  contentImpression: "CONTENT_IMPRESSION",
  personaSwitch: "PERSONA_SWITCH",
  preferenceUpdate: "PREFERENCE_UPDATE",
} as const;

export type PortalEventType =
  (typeof portalEventTypes)[keyof typeof portalEventTypes];

const pageSlugByPath: Record<string, string> = {
  "/": "home",
  "/messages": "messages",
  "/appointments": "appointments",
  "/resources": "resources",
  "/analytics": "results",
  "/profile": "profile",
};

const pageEventByPath: Partial<Record<string, PortalEventType>> = {
  "/": portalEventTypes.viewHome,
  "/messages": portalEventTypes.viewMessage,
  "/appointments": portalEventTypes.viewAppointments,
  "/resources": portalEventTypes.viewResources,
  "/analytics": portalEventTypes.viewResults,
  "/profile": portalEventTypes.viewProfile,
};

export function getPageSlug(pathname: string): string {
  return pageSlugByPath[pathname] ?? (pathname.replace(/^\//, "") || "home");
}

export function getPageViewEventType(
  pathname: string
): PortalEventType | undefined {
  return pageEventByPath[pathname];
}

export function formatEventType(eventName: PortalEventType | string): string {
  return `${trackingConfig.siteName}:${eventName}`;
}
