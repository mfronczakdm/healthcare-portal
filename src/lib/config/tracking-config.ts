/**
 * Unified Data Layer defaults for CareConnect Portal.
 * Channel is fixed to PORTAL; event types are prefixed with the Sitecore site name.
 *
 * Tracking policy: IDENTITY on persona load/switch only.
 * Custom events fire on clicks only — never on page view / mount.
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

/** Sitecore custom event types (prefixed at runtime with site/). */
export const portalEventTypes = {
  viewMessage: "VIEW_MESSAGE",
  viewResults: "VIEW_RESULTS",
  viewAppointments: "VIEW_APPOINTMENTS",
  viewResources: "VIEW_RESOURCES",
  viewProfile: "VIEW_PROFILE",
  openMessage: "OPEN_MESSAGE",
  clickedCta: "CLICKED_CTA",
  clickedPromo: "CLICKED_PROMO",
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

export function getPageSlug(pathname: string): string {
  return pageSlugByPath[pathname] ?? (pathname.replace(/^\//, "") || "home");
}

/**
 * Custom event type for the Unified Data Layer.
 * Edge validates: ^[a-zA-Z0-9\-_./]{1,100}$ — colons are rejected.
 */
export function formatEventType(eventName: PortalEventType | string): string {
  const site = trackingConfig.siteName.replace(/[^a-zA-Z0-9\-_.]/g, "-");
  const name = String(eventName).replace(/[^a-zA-Z0-9\-_.]/g, "_");
  return `${site}/${name}`;
}
