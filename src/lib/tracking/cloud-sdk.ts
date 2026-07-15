import { CloudSDK } from "@sitecore-cloudsdk/core/browser";
import "@sitecore-cloudsdk/events/browser";
import { trackingEnv } from "@/lib/config/sitecore-env";
import { trackingConfig } from "@/lib/config/tracking-config";

let initialized = false;

export function isCloudSdkConfigured(): boolean {
  return Boolean(trackingEnv.edgeContextId);
}

export function isCloudSdkInitialized(): boolean {
  return initialized;
}

function expireCookie(name: string, domain?: string) {
  const domainPart = domain ? ` Domain=${domain};` : "";
  // Match attributes used by Cloud SDK (Secure + SameSite=None) and plain fallbacks
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=None; Secure;${domainPart}`;
  document.cookie = `${name}=; Path=/; Max-Age=0;${domainPart}`;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;${domainPart}`;
}

/**
 * Delete Sitecore Cloud SDK browser/guest cookies so the next init
 * creates a new browser_id (clientId) — equivalent to logging out.
 */
export function clearSitecoreTrackingCookies(): void {
  if (typeof document === "undefined") return;

  const contextId = trackingEnv.edgeContextId;
  const domain = trackingEnv.cookieDomain || undefined;
  const known = new Set<string>([
    "sc_cid",
    "sc_cid_personalize",
  ]);

  if (contextId) {
    known.add(`sc_${contextId}`);
    known.add(`sc_${contextId}_personalize`);
  }

  for (const part of document.cookie.split(";")) {
    const name = part.trim().split("=")[0];
    if (name?.startsWith("sc_")) known.add(name);
  }

  for (const name of known) {
    expireCookie(name);
    if (domain) expireCookie(name, domain);
  }
}

async function waitForBrowserIdCookie(timeoutMs = 5000): Promise<boolean> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const hasId = document.cookie
      .split(";")
      .some((part) => part.trim().startsWith("sc_cid=") && part.includes("="));
    if (hasId) {
      const value = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sc_cid="))
        ?.split("=")[1];
      if (value) return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  return false;
}

/** Initialize Sitecore Cloud SDK (browser) once per guest session. */
export function initCloudSdk(): void {
  if (typeof window === "undefined" || initialized || !trackingEnv.enabled) {
    return;
  }

  if (!trackingEnv.edgeContextId) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[tracking] Cloud SDK not initialized — NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID is missing."
      );
    }
    return;
  }

  try {
    CloudSDK({
      sitecoreEdgeContextId: trackingEnv.edgeContextId,
      siteName: trackingConfig.siteName,
      cookieDomain: trackingEnv.cookieDomain || undefined,
      enableBrowserCookie: true,
    })
      .addEvents()
      .initialize();

    initialized = true;

    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("[tracking] Sitecore Cloud SDK initialized", {
        siteName: trackingConfig.siteName,
        channel: trackingConfig.channel,
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[tracking] Cloud SDK initialization failed", error);
  }
}

/**
 * Close the current Sitecore guest session (clear queue + browser cookies)
 * and start a fresh anonymous guest — use when switching demo personas.
 */
export async function resetCloudSdkGuest(): Promise<void> {
  if (typeof window === "undefined" || !trackingEnv.enabled) return;

  try {
    const { clearEventQueue } = await import("@sitecore-cloudsdk/events/browser");
    await clearEventQueue();
  } catch {
    // SDK may not be initialized yet — still clear cookies below
  }

  clearSitecoreTrackingCookies();
  initialized = false;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[tracking] Sitecore guest reset — clearing browser_id for new persona");
  }

  initCloudSdk();
  await waitForBrowserIdCookie();
}
