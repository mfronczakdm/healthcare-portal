/** Merge helpers for Sitecore vs mock content lists */
export function preferLiveOrMock<T extends { source?: string }>(
  liveItems: T[] | undefined,
  mockItems: T[]
): { items: T[]; usedMock: boolean } {
  if (liveItems && liveItems.length > 0 && liveItems.every((i) => i.source === "sitecore")) {
    return { items: liveItems, usedMock: false };
  }
  if (liveItems && liveItems.some((i) => i.source === "sitecore")) {
    const live = liveItems.filter((i) => i.source === "sitecore");
    return { items: live, usedMock: false };
  }
  return { items: mockItems, usedMock: true };
}
