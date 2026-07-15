"use client";

import { PortalAlert } from "@/components/content/portal-alert";
import { usePersona } from "@/components/persona/persona-provider";

export function PersonaAlerts() {
  const { persona } = usePersona();

  if (persona.alerts.length === 0) return null;

  return (
    <>
      {persona.alerts.map((item) => (
        <PortalAlert key={item.id} item={item} />
      ))}
    </>
  );
}
