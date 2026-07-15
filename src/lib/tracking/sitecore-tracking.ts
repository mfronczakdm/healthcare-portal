import {
  event,
  identity,
  pageView,
  type EventData,
  type IdentityData,
} from "@sitecore-cloudsdk/events/browser";
import {
  formatEventType,
  getPageSlug,
  type PortalEventType,
  trackingConfig,
} from "@/lib/config/tracking-config";
import { trackingEnv } from "@/lib/config/sitecore-env";
import { buildPersonaIdentityData } from "@/lib/tracking/persona-identity";
import { initCloudSdk, isCloudSdkConfigured } from "@/lib/tracking/cloud-sdk";
import type { Persona } from "@/types/portal";

/** Flat extension attributes accepted by Cloud SDK events. */
export type ExtensionData = Record<string, string | number | boolean>;
export type TrackingPayload = ExtensionData;

export interface IdentityContext {
  anonymousId?: string;
  memberId?: string;
  email?: string;
  personaId?: string;
}

export interface PageViewEvent {
  page: string;
  title?: string;
  referrer?: string;
}

export interface CustomEvent {
  name: string;
  payload?: TrackingPayload;
}

export interface CtaClickEvent {
  ctaId: string;
  label: string;
  href?: string;
  source?: "sitecore" | "mock" | "chrome";
}

export interface ContentImpressionEvent {
  contentId: string;
  title: string;
  source: "sitecore" | "mock";
  placement?: string;
}

let identityContext: IdentityContext = {};
let identityInitialized = false;
let currentPage = "home";

function canTrack() {
  return typeof window !== "undefined";
}

function ensureSdk() {
  if (!canTrack() || !trackingEnv.enabled) return false;
  initCloudSdk();
  return isCloudSdkConfigured();
}

function logDev(event: string, data: unknown) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug(`[tracking] ${event}`, data);
  }
}

function baseEventAttributes(page?: string): Pick<
  EventData,
  "language" | "page" | "channel" | "currency"
> {
  return {
    language: trackingConfig.language,
    page: page ?? currentPage,
    channel: trackingConfig.channel,
    currency: trackingConfig.currency,
  };
}

async function sendIdentity(data: IdentityData) {
  if (!ensureSdk()) {
    logDev("identity (dry-run)", data);
    return;
  }

  try {
    await identity(data);
    logDev("identity", data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[tracking] identity failed", error);
  }
}

async function sendPortalEvent(
  eventName: PortalEventType | string,
  extensionData?: ExtensionData,
  page?: string
) {
  const payload: EventData = {
    ...baseEventAttributes(page),
    type: formatEventType(eventName),
    extensionData,
  };

  if (!ensureSdk()) {
    logDev("event (dry-run)", payload);
    return;
  }

  try {
    await event(payload);
    logDev("event", payload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[tracking] event failed", { eventName, error });
  }
}

/** Initialize Cloud SDK identity from a demo persona (email provider). */
export function identifyPersona(persona: Persona, page?: string) {
  const slug = page ?? currentPage;
  const data = buildPersonaIdentityData(persona, slug);

  identityContext = {
    memberId: persona.profile.memberId,
    email: persona.profile.email,
    personaId: persona.id,
    anonymousId: `anon-${persona.id}`,
  };
  identityInitialized = true;

  void sendIdentity(data);
}

/** @deprecated Use identifyPersona — kept for compatibility with persona provider */
export function initIdentity(context: IdentityContext) {
  identityContext = { ...identityContext, ...context };
  identityInitialized = true;
}

export function getIdentity(): IdentityContext {
  return identityContext;
}

export function isTrackingInitialized() {
  return identityInitialized;
}

export function trackPageView(eventData: PageViewEvent) {
  if (!canTrack()) return;

  currentPage = getPageSlug(eventData.page);
  const payload = {
    ...baseEventAttributes(currentPage),
    referrer: eventData.referrer ?? document.referrer,
    extensionData: {
      title: eventData.title ?? document.title,
      path: eventData.page,
    },
  };

  logDev("pageView", payload);

  if (!ensureSdk()) return;

  void pageView(payload).catch((error) => {
    // eslint-disable-next-line no-console
    console.error("[tracking] pageView failed", error);
  });
}

/** Fire a namespaced portal event to the Unified Data Layer. */
export function trackPortalEvent(
  eventName: PortalEventType | string,
  extensionData?: ExtensionData,
  page?: string
) {
  void sendPortalEvent(eventName, extensionData, page);
}

export function trackCustomEvent(custom: CustomEvent) {
  trackPortalEvent(custom.name, custom.payload);
}

export function trackCtaClick(click: CtaClickEvent) {
  trackPortalEvent("CLICKED_CTA", {
    ctaId: click.ctaId,
    label: click.label,
    ...(click.href ? { href: click.href } : {}),
    source: click.source ?? "chrome",
  });
}

export function trackContentImpression(impression: ContentImpressionEvent) {
  trackPortalEvent("CONTENT_IMPRESSION", {
    contentId: impression.contentId,
    title: impression.title,
    source: impression.source,
    ...(impression.placement ? { placement: impression.placement } : {}),
  });
}

export function trackInteraction(name: string, payload?: ExtensionData) {
  trackPortalEvent(name, payload);
}

/** Reset local identity — useful when switching mock personas */
export function resetIdentity() {
  identityContext = {};
  identityInitialized = false;
}
