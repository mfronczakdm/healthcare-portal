"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getDefaultPersonaProfileInput,
  personaToProfileInput,
} from "@/lib/mock-data";
import type { Persona, PersonaProfileInput } from "@/types/portal";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function PersonaFormDialog({
  open,
  onOpenChange,
  mode,
  persona,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  persona?: Persona;
  onSubmit: (input: PersonaProfileInput) => void;
}) {
  const [form, setForm] = useState<PersonaProfileInput>(
    getDefaultPersonaProfileInput
  );
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(
      mode === "edit" && persona
        ? personaToProfileInput(persona)
        : getDefaultPersonaProfileInput()
    );
    setShowDetails(mode === "edit");
    setError(null);
  }, [open, mode, persona]);

  const update = <K extends keyof PersonaProfileInput>(
    key: K,
    value: PersonaProfileInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.displayName.trim()) {
      setError("Name is required.");
      return;
    }
    if (!isValidEmail(form.email)) {
      setError("Enter a valid email address (used for Sitecore IDENTITY).");
      return;
    }
    setError(null);
    onSubmit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add demo user" : "Edit demo user"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Enter a name and email for the demo. Other profile fields are pre-filled and can be customized."
              : "Update any profile field for this custom demo user."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="displayName">
                Full name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="displayName"
                value={form.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                placeholder="Jane Doe"
                autoFocus
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="jane.doe@company.com"
                required
              />
              <p className="text-xs text-muted-foreground">
                Used as the Sitecore IDENTITY email identifier for this demo.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="px-0"
            onClick={() => setShowDetails((v) => !v)}
          >
            {showDetails ? "Hide additional fields" : "Edit additional fields"}
          </Button>

          {showDetails ? (
            <div className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="preferredName">Preferred name</Label>
                <Input
                  id="preferredName"
                  value={form.preferredName}
                  onChange={(e) => update("preferredName", e.target.value)}
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm"
                  value={form.role}
                  onChange={(e) =>
                    update(
                      "role",
                      e.target.value as PersonaProfileInput["role"]
                    )
                  }
                >
                  <option value="patient">Patient</option>
                  <option value="caregiver">Caregiver</option>
                  <option value="power-user">Power user</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memberId">Member ID</Label>
                <Input
                  id="memberId"
                  value={form.memberId}
                  onChange={(e) => update("memberId", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="planName">Plan</Label>
                <Input
                  id="planName"
                  value={form.planName}
                  onChange={(e) => update("planName", e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="primaryCareProvider">Primary care</Label>
                <Input
                  id="primaryCareProvider"
                  value={form.primaryCareProvider}
                  onChange={(e) =>
                    update("primaryCareProvider", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="pharmacy">Pharmacy</Label>
                <Input
                  id="pharmacy"
                  value={form.pharmacy}
                  onChange={(e) => update("pharmacy", e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="addressLine1">Address line 1</Label>
                <Input
                  id="addressLine1"
                  value={form.addressLine1}
                  onChange={(e) => update("addressLine1", e.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="addressLine2">Address line 2</Label>
                <Input
                  id="addressLine2"
                  value={form.addressLine2}
                  onChange={(e) => update("addressLine2", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input
                    id="zip"
                    value={form.zip}
                    onChange={(e) => update("zip", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Add user" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
