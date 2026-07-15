import type { Persona } from "@/types/portal";

const STORAGE_KEY = "cc_custom_personas";

export function loadCustomPersonas(): Persona[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Persona[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p) => p && typeof p.id === "string" && p.profile?.email)
      .map((p) => ({ ...p, isCustom: true }));
  } catch {
    return [];
  }
}

export function saveCustomPersonas(personas: Persona[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(personas.map((p) => ({ ...p, isCustom: true })))
  );
}
