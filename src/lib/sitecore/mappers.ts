import type {
  AlertItem,
  ContentBlock,
  ContentMeta,
  CtaItem,
  RecommendationItem,
  ResourceItem,
  SitecorePortalContent,
} from "@/types/portal";

/** Loose shapes matching typical Experience Edge field payloads */
interface EdgeField {
  value?: string;
  jsonValue?: unknown;
}

interface EdgeItem {
  id?: string;
  name?: string;
  title?: EdgeField;
  summary?: EdgeField;
  body?: EdgeField;
  category?: EdgeField;
  severity?: EdgeField;
  ctaLabel?: EdgeField;
  ctaLink?: EdgeField;
  readingTime?: EdgeField;
  fields?: { name: string; jsonValue?: unknown; value?: string }[];
}

function fieldValue(item: EdgeItem, name: string): string {
  const direct = (item as Record<string, EdgeField | undefined>)[name];
  if (direct?.value) return String(direct.value);
  const fromFields = item.fields?.find((f) => f.name === name);
  if (fromFields?.value) return String(fromFields.value);
  if (typeof fromFields?.jsonValue === "string") return fromFields.jsonValue;
  return "";
}

function linkHref(item: EdgeItem, name = "ctaLink"): string | undefined {
  const raw =
    (item as Record<string, EdgeField | undefined>)[name]?.jsonValue ??
    item.fields?.find((f) => f.name === name)?.jsonValue;
  if (!raw || typeof raw !== "object") return undefined;
  const link = raw as { url?: string; href?: string; value?: { href?: string } };
  return link.url ?? link.href ?? link.value?.href;
}

export function mapRecommendation(item: EdgeItem): RecommendationItem {
  return {
    id: item.id ?? item.name ?? cryptoRandomId(),
    title: fieldValue(item, "title") || item.name || "Untitled",
    summary: fieldValue(item, "summary"),
    category: fieldValue(item, "category") || "General",
    href: linkHref(item) ?? "/resources",
    readingTimeMinutes: Number(fieldValue(item, "readingTime") || 0) || undefined,
  };
}

export function mapAlert(item: EdgeItem): AlertItem & ContentMeta {
  const severityRaw = fieldValue(item, "severity").toLowerCase();
  const severity =
    severityRaw === "warning" ||
    severityRaw === "success" ||
    severityRaw === "urgent"
      ? severityRaw
      : "info";

  return {
    id: item.id ?? item.name ?? cryptoRandomId(),
    source: "sitecore",
    sitecoreId: item.id,
    title: fieldValue(item, "title") || item.name || "Alert",
    body: fieldValue(item, "body"),
    severity,
    href: linkHref(item),
    ctaLabel: fieldValue(item, "ctaLabel") || undefined,
  };
}

export function mapCta(item: EdgeItem): CtaItem {
  return {
    id: item.id ?? item.name ?? cryptoRandomId(),
    source: "sitecore",
    sitecoreId: item.id,
    title: fieldValue(item, "title") || item.name || "Learn more",
    description: fieldValue(item, "summary") || fieldValue(item, "body"),
    primaryLabel: fieldValue(item, "ctaLabel") || "Continue",
    primaryHref: linkHref(item) ?? "/",
  };
}

export function mapResource(item: EdgeItem): ResourceItem {
  return {
    id: item.id ?? item.name ?? cryptoRandomId(),
    title: fieldValue(item, "title") || item.name || "Resource",
    summary: fieldValue(item, "summary"),
    category: fieldValue(item, "category") || "General",
    tags: fieldValue(item, "tags")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    href: linkHref(item) ?? "/resources",
    featured: fieldValue(item, "featured").toLowerCase() === "true",
  };
}

export function mapHero(data: {
  id?: string;
  heroHeading?: EdgeField;
  heroBody?: EdgeField;
  heroCtaLabel?: EdgeField;
  heroCtaLink?: EdgeField;
}): ContentBlock {
  return {
    id: data.id ?? "sitecore-hero",
    source: "sitecore",
    sitecoreId: data.id,
    heading: data.heroHeading?.value ?? "",
    body: data.heroBody?.value ?? "",
    ctaLabel: data.heroCtaLabel?.value,
    ctaHref:
      linkHref({ ctaLink: data.heroCtaLink } as EdgeItem, "ctaLink") ??
      "/resources",
  };
}

export function mapPortalContent(raw: {
  hero?: ContentBlock;
  alerts?: AlertItem[];
  recommendations?: RecommendationItem[];
  ctas?: CtaItem[];
  featuredResources?: ResourceItem[];
}): SitecorePortalContent {
  return {
    hero: raw.hero,
    alerts: raw.alerts ?? [],
    recommendations: raw.recommendations ?? [],
    ctas: raw.ctas ?? [],
    featuredResources: raw.featuredResources ?? [],
  };
}

function cryptoRandomId() {
  return `sc-${Math.random().toString(36).slice(2, 10)}`;
}
