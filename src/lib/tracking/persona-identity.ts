import type { IdentityData } from "@sitecore-cloudsdk/events/browser";
import { trackingConfig } from "@/lib/config/tracking-config";
import type { Persona } from "@/types/portal";

function splitName(displayName: string): { firstName: string; lastName: string } {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }
  return {
    firstName: parts[0] ?? displayName,
    lastName: parts.slice(1).join(" "),
  };
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }
  return phone;
}

/**
 * Build a Sitecore IDENTITY payload from a demo persona (email provider).
 *
 * Note: Edge Events currently expects address `street` as a string internally.
 * Sending string[] (SDK/docs shape) causes:
 *   ArrayList cannot be cast to String
 * So street lines go in extensionData instead.
 */
export function buildPersonaIdentityData(
  persona: Persona,
  page = "home"
): IdentityData {
  const { profile } = persona;
  const { firstName, lastName } = splitName(profile.displayName);

  return {
    language: trackingConfig.language,
    page,
    channel: trackingConfig.channel,
    currency: trackingConfig.currency,
    email: profile.email,
    firstName,
    lastName,
    phone: normalizePhone(profile.phone),
    mobile: normalizePhone(profile.phone),
    city: profile.address.city,
    state: profile.address.state,
    postalCode: profile.address.zip,
    country: trackingConfig.country,
    identifiers: [
      {
        id: profile.email,
        provider: "email",
      },
    ],
    extensionData: {
      personaId: persona.id,
      memberId: profile.memberId,
      role: persona.role,
      planName: profile.planName,
      street: profile.address.line1,
    },
  };
}
