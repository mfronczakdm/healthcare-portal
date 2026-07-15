import { externalLinksConfig } from "@/lib/config/external-links";

export function isExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

/** Marketing / Sitecore site homepage */
export function getSiteHomeUrl() {
  return externalLinksConfig.site.home;
}

/** Resolve "Read article" URL for a recommendation card */
export function getArticleLink(recommendationId: string) {
  const articles = externalLinksConfig.articles as Record<string, string>;
  return (
    articles[recommendationId] ??
    externalLinksConfig.defaults.article ??
    externalLinksConfig.site.home
  );
}

/** Resolve resource library card URL */
export function getResourceLink(resourceId: string) {
  const resources = externalLinksConfig.resources as Record<string, string>;
  return (
    resources[resourceId] ??
    externalLinksConfig.defaults.resource ??
    externalLinksConfig.site.home
  );
}

/**
 * Resolve any UI link: external config wins, then explicit href, then portal route.
 */
export function resolveOutboundLink(options: {
  configKey?: string;
  type: "article" | "resource";
  href?: string;
  fallback?: string;
}) {
  if (options.configKey) {
    return options.type === "article"
      ? getArticleLink(options.configKey)
      : getResourceLink(options.configKey);
  }
  if (options.href && isExternalUrl(options.href)) {
    return options.href;
  }
  if (options.type === "article") {
    return getArticleLink(options.configKey ?? "");
  }
  return options.href ?? options.fallback ?? getSiteHomeUrl();
}
