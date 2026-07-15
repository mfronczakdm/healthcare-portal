"use client";

import { Check, Users } from "lucide-react";
import { usePersona } from "@/components/persona/persona-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { brandConfig } from "@/lib/config/brand";
import { cn } from "@/lib/utils";

export function PersonaSwitcher({ className }: { className?: string }) {
  const { persona, personas, setPersonaId } = usePersona();

  if (!brandConfig.features.showPersonaSwitcher) {
    return null;
  }

  const builtIn = personas.filter((p) => !p.isCustom);
  const custom = personas.filter((p) => p.isCustom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", className)}
          aria-label="Switch member profile"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">{persona.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Built-in profiles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {builtIn.map((p) => (
          <PersonaMenuItem
            key={p.id}
            label={p.label}
            description={p.description}
            selected={p.id === persona.id}
            onSelect={() => setPersonaId(p.id)}
          />
        ))}
        {custom.length > 0 ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Custom demo users</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {custom.map((p) => (
              <PersonaMenuItem
                key={p.id}
                label={p.label}
                description={p.profile.email}
                selected={p.id === persona.id}
                custom
                onSelect={() => setPersonaId(p.id)}
              />
            ))}
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PersonaMenuItem({
  label,
  description,
  selected,
  custom,
  onSelect,
}: {
  label: string;
  description: string;
  selected: boolean;
  custom?: boolean;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem
      onClick={onSelect}
      className="flex flex-col items-start gap-1 py-2"
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-medium">
          {label}
          {custom ? (
            <Badge variant="secondary" className="text-[10px]">
              Custom
            </Badge>
          ) : null}
        </span>
        {selected ? <Check className="h-4 w-4 text-primary" /> : null}
      </div>
      <span className="text-xs text-muted-foreground">{description}</span>
    </DropdownMenuItem>
  );
}
