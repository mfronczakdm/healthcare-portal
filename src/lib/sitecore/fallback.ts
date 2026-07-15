/**
 * Shared helpers for content source labeling.
 * MOCK DATA badges appear only on fallback regions; SITECORE(LIVE) on Edge content.
 */
export function isMockSource(source: "sitecore" | "mock") {
  return source === "mock";
}

export function isLiveSource(source: "sitecore" | "mock") {
  return source === "sitecore";
}
