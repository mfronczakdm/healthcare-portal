import { personas } from "@/lib/mock-data/personas";
import type { Persona, PersonaProfileInput, ProfileDetails } from "@/types/portal";

const TEMPLATE_ID = "alex-rivera";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "CC";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

function preferredFromDisplayName(displayName: string): string {
  return displayName.trim().split(/\s+/)[0] ?? displayName;
}

function randomMemberId(): string {
  const n = Math.floor(1000000 + Math.random() * 9000000);
  return `CC-${n}`;
}

function getTemplate(): Persona {
  const template = personas.find((p) => p.id === TEMPLATE_ID) ?? personas[0];
  if (!template) {
    throw new Error("No persona template available");
  }
  return structuredClone(template);
}

/** Default values for the Add User form (SE only needs name + email). */
export function getDefaultPersonaProfileInput(): PersonaProfileInput {
  const template = getTemplate();
  const { profile } = template;

  return {
    displayName: "",
    preferredName: "",
    email: "",
    phone: profile.phone,
    dateOfBirth: profile.dateOfBirth,
    memberId: randomMemberId(),
    planName: profile.planName,
    primaryCareProvider: profile.primaryCareProvider,
    pharmacy: profile.pharmacy,
    addressLine1: profile.address.line1,
    addressLine2: profile.address.line2 ?? "",
    city: profile.address.city,
    state: profile.address.state,
    zip: profile.address.zip,
    role: "patient",
    description: "Custom demo profile for sales engineer presentations",
  };
}

export function personaToProfileInput(persona: Persona): PersonaProfileInput {
  const { profile } = persona;
  return {
    displayName: profile.displayName,
    preferredName: profile.preferredName ?? "",
    email: profile.email,
    phone: profile.phone,
    dateOfBirth: profile.dateOfBirth,
    memberId: profile.memberId,
    planName: profile.planName,
    primaryCareProvider: profile.primaryCareProvider,
    pharmacy: profile.pharmacy,
    addressLine1: profile.address.line1,
    addressLine2: profile.address.line2 ?? "",
    city: profile.address.city,
    state: profile.address.state,
    zip: profile.address.zip,
    role: persona.role,
    description: persona.description,
  };
}

function buildProfileDetails(
  input: PersonaProfileInput,
  preferences: ProfileDetails["preferences"]
): ProfileDetails {
  const preferred =
    input.preferredName?.trim() || preferredFromDisplayName(input.displayName);

  return {
    displayName: input.displayName.trim(),
    preferredName: preferred,
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    dateOfBirth: input.dateOfBirth,
    memberId: input.memberId.trim() || randomMemberId(),
    planName: input.planName.trim(),
    primaryCareProvider: input.primaryCareProvider.trim(),
    pharmacy: input.pharmacy.trim(),
    address: {
      line1: input.addressLine1.trim(),
      line2: input.addressLine2?.trim() || undefined,
      city: input.city.trim(),
      state: input.state.trim().toUpperCase(),
      zip: input.zip.trim(),
    },
    preferences,
  };
}

/**
 * Clone the patient template portal content and stamp SE name/email
 * (and optional profile overrides) onto a custom persona.
 */
export function createCustomPersona(
  input: PersonaProfileInput,
  options?: { id?: string; existing?: Persona }
): Persona {
  const base = options?.existing
    ? structuredClone(options.existing)
    : getTemplate();

  const displayName = input.displayName.trim();
  const preferred =
    input.preferredName?.trim() || preferredFromDisplayName(displayName);
  const id =
    options?.id ??
    `custom-${slugify(displayName) || "user"}-${Date.now().toString(36)}`;

  const profile = buildProfileDetails(
    input,
    base.profile.preferences ?? {
      emailNotifications: true,
      smsReminders: true,
      marketingOptIn: false,
    }
  );

  return {
    ...base,
    id,
    isCustom: true,
    role: input.role,
    label: displayName,
    description:
      input.description?.trim() ||
      `Custom demo profile for ${displayName}`,
    avatarInitials: initialsFromName(displayName),
    heroGreeting: `Good afternoon, ${preferred}`,
    heroSubtext:
      base.heroSubtext ||
      "You have items waiting for your attention in the portal.",
    profile,
  };
}

export function updateCustomPersona(
  existing: Persona,
  input: PersonaProfileInput
): Persona {
  return createCustomPersona(input, {
    id: existing.id,
    existing,
  });
}
