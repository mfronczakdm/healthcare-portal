"use client";

import { Check, Users } from "lucide-react";
import { usePersona } from "@/components/persona/persona-provider";
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
        <DropdownMenuLabel>Member profiles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {personas.map((p) => (
          <DropdownMenuItem
            key={p.id}
            onClick={() => setPersonaId(p.id)}
            className="flex flex-col items-start gap-1 py-2"
          >
            <div className="flex w-full items-center justify-between gap-2">
              <span className="font-medium">{p.label}</span>
              {p.id === persona.id ? (
                <Check className="h-4 w-4 text-primary" />
              ) : null}
            </div>
            <span className="text-xs text-muted-foreground">{p.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
