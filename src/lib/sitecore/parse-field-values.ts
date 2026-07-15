/**
 * Parse Sitecore field markup returned by Edge GraphQL into plain UI values.
 */

/** Strip HTML / rich-text markup to readable plain text */
export function parseSitecoreRichText(raw?: string): string {
  if (!raw) return "";

  return raw
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract image src from Sitecore media markup, e.g. `<Image src="..." ... />` */
export function parseSitecoreImageSrc(raw?: string): string | undefined {
  if (!raw) return undefined;

  const srcMatch = raw.match(/\bsrc="([^"]+)"/i);
  return srcMatch?.[1]?.trim() || undefined;
}

export interface ParsedSitecoreLink {
  label?: string;
  href?: string;
  linkType?: string;
  itemId?: string;
}

/**
 * Parse Sitecore general link field markup.
 * Internal links often provide text + id without a resolved URL.
 */
export function parseSitecoreLink(raw?: string): ParsedSitecoreLink {
  if (!raw) return {};

  const attr = (name: string) => {
    const match = raw.match(new RegExp(`${name}="([^"]*)"`, "i"));
    return match?.[1]?.trim();
  };

  const linkType = attr("linktype");
  const label = attr("text") || attr("title");
  const url = attr("url") || attr("href");
  const anchor = attr("anchor");
  const querystring = attr("querystring");
  const itemId = attr("id");

  let href = url;

  if (!href && linkType === "external" && attr("target")) {
    href = url;
  }

  if (href && anchor) {
    href = `${href}#${anchor}`;
  }

  if (href && querystring) {
    const joiner = href.includes("?") ? "&" : "?";
    href = `${href}${joiner}${querystring.replace(/^\?/, "")}`;
  }

  return {
    label: label || undefined,
    href: href || undefined,
    linkType,
    itemId,
  };
}
