"use client";

import * as React from "react";
import {
  defaultPersonaId,
  getAllPersonas,
  getPersonaById,
} from "@/lib/mock-data";
import {
  identifyPersona,
  resetIdentity,
  trackPortalEvent,
} from "@/lib/tracking";
import { portalEventTypes } from "@/lib/config/tracking-config";
import type { Persona } from "@/types/portal";

const PERSONA_COOKIE = "cc_persona_id";

interface PersonaContextValue {
  persona: Persona;
  personas: Persona[];
  setPersonaId: (id: string) => void;
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
  const personas = React.useMemo(() => getAllPersonas(), []);
  const [personaId, setPersonaIdState] = React.useState(
    initialPersonaId ?? defaultPersonaId
  );

  React.useEffect(() => {
    const fromCookie = readCookie(PERSONA_COOKIE);
    if (fromCookie && getPersonaById(fromCookie)) {
      setPersonaIdState(fromCookie);
    }
  }, []);

  const persona = React.useMemo(
    () => getPersonaById(personaId) ?? personas[0],
    [personaId, personas]
  );

  React.useEffect(() => {
    if (!persona) return;
    resetIdentity();
    identifyPersona(persona);
  }, [persona]);

  const setPersonaId = React.useCallback((id: string) => {
    if (!getPersonaById(id)) return;
    setPersonaIdState(id);
    writeCookie(PERSONA_COOKIE, id);
    trackPortalEvent(portalEventTypes.personaSwitch, { personaId: id });
  }, []);

  if (!persona) {
    return null;
  }

  return (
    <PersonaContext.Provider value={{ persona, personas, setPersonaId }}>
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
