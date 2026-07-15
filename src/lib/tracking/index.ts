export {
  identifyPersona,
  initIdentity,
  getIdentity,
  isTrackingInitialized,
  trackPageView,
  trackPortalEvent,
  trackCustomEvent,
  trackCtaClick,
  trackContentImpression,
  trackInteraction,
  resetIdentity,
} from "./sitecore-tracking";

export { initCloudSdk, isCloudSdkConfigured, isCloudSdkInitialized } from "./cloud-sdk";
export { buildPersonaIdentityData } from "./persona-identity";

export type {
  TrackingPayload,
  IdentityContext,
  PageViewEvent,
  CustomEvent,
  CtaClickEvent,
  ContentImpressionEvent,
} from "./sitecore-tracking";

export {
  portalEventTypes,
  trackingConfig,
  formatEventType,
  getPageSlug,
} from "@/lib/config/tracking-config";

export type { PortalEventType } from "@/lib/config/tracking-config";
