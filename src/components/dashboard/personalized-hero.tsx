"use client";

import { usePersona } from "@/components/persona/persona-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portalEventTypes, trackPortalEvent } from "@/lib/tracking";
import Link from "next/link";

export function PersonalizedHero() {
  const { persona } = usePersona();

  return (
    <Card className="relative overflow-hidden border-primary/15 bg-gradient-to-br from-primary/12 via-card to-accent/8">
      <CardHeader className="space-y-2">
        <p className="text-sm font-medium text-primary">
          {persona.role === "caregiver"
            ? "Caregiver portal"
            : persona.role === "power-user"
              ? "Wellness portal"
              : "Member portal"}
        </p>
        <CardTitle className="text-2xl tracking-tight sm:text-3xl">
          {persona.heroGreeting}
        </CardTitle>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {persona.heroSubtext}
        </p>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Button asChild>
          <Link
            href="/appointments"
            onClick={() =>
              trackPortalEvent(portalEventTypes.viewAppointments, {
                ctaId: "hero-schedule",
                label: "View appointments",
                href: "/appointments",
              })
            }
          >
            View appointments
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link
            href="/messages"
            onClick={() =>
              trackPortalEvent(portalEventTypes.viewMessage, {
                ctaId: "hero-messages",
                label: "Open messages",
                href: "/messages",
              })
            }
          >
            Open messages
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
