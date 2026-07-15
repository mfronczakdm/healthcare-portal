"use client";

import * as React from "react";
import {
  createCustomPersona,
  defaultPersonaId,
  getAllPersonas,
  getPersonaById,
  loadCustomPersonas,
  saveCustomPersonas,
  updateCustomPersona,
} from "@/lib/mock-data";
import {
  identifyPersona,
  resetIdentity,
  trackPortalEvent,
} from "@/lib/tracking";
import { portalEventTypes } from "@/lib/config/tracking-config";
import type { Persona, PersonaProfileInput } from "@/types/portal";

const PERSONA_COOKIE = "cc_persona_id";

interface PersonaContextValue {
  persona: Persona;
  personas: Persona[];
  setPersonaId: (id: string) => void;
  addCustomPersona: (input: PersonaProfileInput) => Persona;
  updateCurrentPersona: (input: PersonaProfileInput) => Persona | null;
  deleteCustomPersona: (id: string) => void;
}

const PersonaContext = React.createContext<PersonaContextValue | null>(null);

function readCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1] ?? "") : null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; SameSite=Lax`;
}

export function PersonaProvider({
  children,
  initialPersonaId,
}: {
  children: React.ReactNode;
  initialPersonaId?: string;
}) {
  const builtInPersonas = React.useMemo(() => getAllPersonas(), []);
  const [customPersonas, setCustomPersonas] = React.useState<Persona[]>([]);
  const [hydrated, setHydrated] = React.useState(false);
  const [personaId, setPersonaIdState] = React.useState(
    initialPersonaId ?? defaultPersonaId
  );

  React.useEffect(() => {
    const stored = loadCustomPersonas();
    setCustomPersonas(stored);
    const fromCookie = readCookie(PERSONA_COOKIE);
    if (fromCookie) {
      const exists =
        getPersonaById(fromCookie) ||
        stored.some((p) => p.id === fromCookie);
      if (exists) setPersonaIdState(fromCookie);
    }
    setHydrated(true);
  }, []);

  const personas = React.useMemo(
    () => [...builtInPersonas, ...customPersonas],
    [builtInPersonas, customPersonas]
  );

  const findPersona = React.useCallback(
    (id: string) =>
      personas.find((p) => p.id === id) ??
      getPersonaById(id) ??
      customPersonas.find((p) => p.id === id),
    [personas, customPersonas]
  );

  const persona = React.useMemo(
    () => findPersona(personaId) ?? personas[0] ?? builtInPersonas[0],
    [findPersona, personaId, personas, builtInPersonas]
  );

  React.useEffect(() => {
    if (!hydrated || !persona) return;
    resetIdentity();
    identifyPersona(persona);
  }, [persona, hydrated]);

  const persistCustom = React.useCallback((next: Persona[]) => {
    setCustomPersonas(next);
    saveCustomPersonas(next);
  }, []);

  const setPersonaId = React.useCallback(
    (id: string) => {
      if (!findPersona(id)) return;
      setPersonaIdState(id);
      writeCookie(PERSONA_COOKIE, id);
      trackPortalEvent(portalEventTypes.personaSwitch, { personaId: id });
    },
    [findPersona]
  );

  const addCustomPersona = React.useCallback(
    (input: PersonaProfileInput) => {
      const created = createCustomPersona(input);
      const next = [...customPersonas, created];
      persistCustom(next);
      setPersonaIdState(created.id);
      writeCookie(PERSONA_COOKIE, created.id);
      trackPortalEvent(portalEventTypes.personaSwitch, {
        personaId: created.id,
        action: "create",
      });
      return created;
    },
    [customPersonas, persistCustom]
  );

  const updateCurrentPersona = React.useCallback(
    (input: PersonaProfileInput) => {
      if (!persona?.isCustom) return null;
      const updated = updateCustomPersona(persona, input);
      const next = customPersonas.map((p) =>
        p.id === updated.id ? updated : p
      );
      persistCustom(next);
      return updated;
    },
    [persona, customPersonas, persistCustom]
  );

  const deleteCustomPersona = React.useCallback(
    (id: string) => {
      const next = customPersonas.filter((p) => p.id !== id);
      persistCustom(next);
      if (personaId === id) {
        const fallback = builtInPersonas[0]?.id ?? defaultPersonaId;
        setPersonaIdState(fallback);
        writeCookie(PERSONA_COOKIE, fallback);
      }
    },
    [customPersonas, persistCustom, personaId, builtInPersonas]
  );

  if (!persona) {
    return null;
  }

  return (
    <PersonaContext.Provider
      value={{
        persona,
        personas,
        setPersonaId,
        addCustomPersona,
        updateCurrentPersona,
        deleteCustomPersona,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = React.useContext(PersonaContext);
  if (!ctx) {
    throw new Error("usePersona must be used within PersonaProvider");
  }
  return ctx;
}
