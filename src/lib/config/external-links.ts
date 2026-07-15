/**
 * External link targets for outbound UI (Sitecore marketing site, client demos, etc.)
 *
 * Sales engineers: update URLs here only — no component or mock-data edits needed.
 * Keys under `articles` and `resources` match item `id` values in mock personas
 * (e.g. r1, jr2, res1). Unlisted items use the matching `defaults` URL.
 */
export const externalLinksConfig = {
  /** Client / Sitecore marketing site */
  site: {
    home: "https://rocklandtrust-azure.vercel.app/",
  },

  /** Fallback when a specific article/resource id is not listed below */
  defaults: {
    article: "https://rocklandtrust-azure.vercel.app/",
    resource: "https://rocklandtrust-azure.vercel.app/",
  },

  /**
   * "Recommended for you" → Read article
   * Keys = recommendation id from mock personas (r1, jr1, sr1, …)
   */
  articles: {
    // Alex Rivera
    r1: "https://rocklandtrust-azure.vercel.app/",
    r2: "https://rocklandtrust-azure.vercel.app/",
    r3: "https://rocklandtrust-azure.vercel.app/",
    // Jordan Lee
    jr1: "https://rocklandtrust-azure.vercel.app/",
    jr2: "https://rocklandtrust-azure.vercel.app/",
    jr3: "https://rocklandtrust-azure.vercel.app/",
    // Sam Okafor
    sr1: "https://rocklandtrust-azure.vercel.app/",
    sr2: "https://rocklandtrust-azure.vercel.app/",
    sr3: "https://rocklandtrust-azure.vercel.app/",
  },

  /** Resources library cards (optional per-item overrides) */
  resources: {
    res1: "https://rocklandtrust-azure.vercel.app/",
    res2: "https://rocklandtrust-azure.vercel.app/",
    res3: "https://rocklandtrust-azure.vercel.app/",
    jres1: "https://rocklandtrust-azure.vercel.app/",
    jres2: "https://rocklandtrust-azure.vercel.app/",
    jres3: "https://rocklandtrust-azure.vercel.app/",
    sres1: "https://rocklandtrust-azure.vercel.app/",
    sres2: "https://rocklandtrust-azure.vercel.app/",
    sres3: "https://rocklandtrust-azure.vercel.app/",
  },
} as const;

export type ExternalLinksConfig = typeof externalLinksConfig;
