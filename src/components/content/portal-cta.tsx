"use client";

import Link from "next/link";
import { SitecoreSourceBadge } from "@/components/content/source-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackCtaClick } from "@/lib/tracking";
import { cn } from "@/lib/utils";
import type { CtaItem } from "@/types/portal";

export function PortalCta({
  item,
  className,
}: {
  item: CtaItem;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-2">
          <CardTitle className="text-xl">{item.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
        <SitecoreSourceBadge source={item.source} />
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button asChild>
          <Link
            href={item.primaryHref}
            onClick={() =>
              trackCtaClick({
                ctaId: item.id,
                label: item.primaryLabel,
                href: item.primaryHref,
                source: item.source,
              })
            }
          >
            {item.primaryLabel}
          </Link>
        </Button>
        {item.secondaryLabel && item.secondaryHref ? (
          <Button asChild variant="outline">
            <Link
              href={item.secondaryHref}
              onClick={() =>
                trackCtaClick({
                  ctaId: `${item.id}-secondary`,
                  label: item.secondaryLabel!,
                  href: item.secondaryHref,
                  source: item.source,
                })
              }
            >
              {item.secondaryLabel}
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
