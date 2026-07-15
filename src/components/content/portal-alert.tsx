"use client";

import Link from "next/link";
import { Info, AlertTriangle, CheckCircle2, Siren } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { trackCtaClick } from "@/lib/tracking";
import type { AlertItem } from "@/types/portal";

const icons = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  urgent: Siren,
} as const;

export function PortalAlert({ item }: { item: AlertItem }) {
  const Icon = icons[item.severity];

  return (
    <Alert variant={item.severity}>
      <Icon className="mt-0.5" />
      <div className="min-w-0 space-y-1">
        <AlertTitle>{item.title}</AlertTitle>
        <AlertDescription>
          {item.body}
          {item.ctaLabel && item.href ? (
            <Button
              asChild
              variant="link"
              className="mt-1 h-auto px-0"
              onClick={() =>
                trackCtaClick({
                  ctaId: item.id,
                  label: item.ctaLabel!,
                  href: item.href,
                  source: "chrome",
                })
              }
            >
              <Link href={item.href}>{item.ctaLabel}</Link>
            </Button>
          ) : null}
        </AlertDescription>
      </div>
    </Alert>
  );
}
