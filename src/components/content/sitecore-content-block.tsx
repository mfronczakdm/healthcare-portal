"use client";

import Link from "next/link";
import { SitecoreSourceBadge } from "@/components/content/source-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackCtaClick } from "@/lib/tracking";
import type { ContentBlock } from "@/types/portal";

export function SitecoreContentBlock({
  block,
}: {
  block: ContentBlock;
  placement?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <CardTitle className="text-lg">{block.heading}</CardTitle>
        <SitecoreSourceBadge source={block.source} />
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {block.body}
        </p>
        {block.ctaLabel && block.ctaHref ? (
          <Button asChild variant="outline" size="sm">
            <Link
              href={block.ctaHref}
              onClick={() =>
                trackCtaClick({
                  ctaId: block.id,
                  label: block.ctaLabel!,
                  href: block.ctaHref,
                  source: block.source,
                })
              }
            >
              {block.ctaLabel}
            </Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
