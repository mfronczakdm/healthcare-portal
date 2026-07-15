"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Megaphone } from "lucide-react";
import { SitecoreSourceBadge } from "@/components/content/source-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  portalEventTypes,
  trackContentImpression,
  trackPortalEvent,
} from "@/lib/tracking";
import { cn } from "@/lib/utils";
import type { PromoContent } from "@/types/portal";

function isExternalUrl(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function PromoBanner({
  promo,
  className,
  edgeError,
}: {
  promo: PromoContent;
  className?: string;
  /** Dev-only: why Edge fallback was used */
  edgeError?: string;
}) {
  useEffect(() => {
    trackContentImpression({
      contentId: promo.id,
      title: promo.promoText,
      source: promo.source,
      placement: "home-promo",
    });
  }, [promo.id, promo.promoText, promo.source]);

  const ctaLabel = promo.promoLinkLabel ?? "Learn more";
  const ctaHref = promo.promoLinkHref;

  const handleCtaClick = () => {
    trackPortalEvent(portalEventTypes.clickedPromo, {
      contentId: promo.id,
      label: ctaLabel,
      href: ctaHref,
      source: promo.source,
    });
  };

  const ctaButton = ctaHref ? (
    isExternalUrl(ctaHref) ? (
      <Button asChild variant="accent" className="shrink-0">
        <a
          href={ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCtaClick}
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </a>
      </Button>
    ) : (
      <Button asChild variant="accent" className="shrink-0">
        <Link href={ctaHref} onClick={handleCtaClick}>
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    )
  ) : (
    <Button variant="accent" className="shrink-0" onClick={handleCtaClick}>
      {ctaLabel}
      <ArrowRight className="h-4 w-4" />
    </Button>
  );

  return (
    <Card
      className={cn(
        "overflow-hidden border-accent/25 bg-gradient-to-r from-accent/10 via-card to-primary/10",
        className
      )}
      aria-label="Promotion"
    >
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-start">
          {promo.promoImageUrl ? (
            <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-40">
              <Image
                src={promo.promoImageUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 160px"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent sm:w-40">
              <Megaphone className="h-8 w-8" aria-hidden />
            </div>
          )}

          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                Promotion
              </p>
              <SitecoreSourceBadge source={promo.source} />
            </div>
            <p className="text-lg font-semibold leading-snug">{promo.promoText}</p>
            {promo.promoText2 ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {promo.promoText2}
              </p>
            ) : null}
            {process.env.NODE_ENV === "development" &&
            promo.source === "mock" &&
            edgeError ? (
              <p className="text-xs text-destructive/80">{edgeError}</p>
            ) : null}
          </div>
        </div>

        {ctaButton}
      </CardContent>
    </Card>
  );
}
