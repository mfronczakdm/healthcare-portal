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

/** Initialize Sitecore Cloud SDK (browser) once per session. */
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
