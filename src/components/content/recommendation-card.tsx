"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getArticleLink, isExternalUrl } from "@/lib/config/resolve-external-link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trackContentImpression, trackCtaClick } from "@/lib/tracking";
import type { RecommendationItem } from "@/types/portal";

export function RecommendationCard({
  item,
  placement = "recommendations",
}: {
  item: RecommendationItem;
  placement?: string;
}) {
  const articleUrl = getArticleLink(item.id);
  const external = isExternalUrl(articleUrl);

  useEffect(() => {
    trackContentImpression({
      contentId: item.id,
      title: item.title,
      source: "mock",
      placement,
    });
  }, [item.id, item.title, placement]);

  const handleClick = () => {
    trackCtaClick({
      ctaId: item.id,
      label: item.title,
      href: articleUrl,
      source: "chrome",
    });
  };

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader className="space-y-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {item.category}
        </span>
        <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
        <CardDescription>{item.summary}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {item.readingTimeMinutes ? (
          <p className="text-xs text-muted-foreground">
            {item.readingTimeMinutes} min read
          </p>
        ) : null}
      </CardContent>
      <CardFooter>
        {external ? (
          <Button
            asChild
            variant="ghost"
            className="px-0 text-primary hover:bg-transparent hover:text-primary/80"
          >
            <a
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
            >
              Read article
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button
            asChild
            variant="ghost"
            className="px-0 text-primary hover:bg-transparent hover:text-primary/80"
          >
            <Link href={articleUrl} onClick={handleClick}>
              Read article
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
