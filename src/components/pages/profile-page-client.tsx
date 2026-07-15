"use client";

import { useState } from "react";
import { OpenTasks } from "@/components/dashboard/open-tasks";
import { usePersona } from "@/components/persona/persona-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { portalEventTypes, trackPortalEvent } from "@/lib/tracking";
import { formatDate } from "@/lib/utils";

export function ProfilePageClient() {
  const { persona } = usePersona();
  const { profile } = persona;
  const [emailNotifications, setEmailNotifications] = useState(
    profile.preferences.emailNotifications
  );
  const [smsReminders, setSmsReminders] = useState(
    profile.preferences.smsReminders
  );
  const [marketingOptIn, setMarketingOptIn] = useState(
    profile.preferences.marketingOptIn
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Account details, preferences, and care info
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {persona.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-semibold">{profile.displayName}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">Member ID {profile.memberId}</Badge>
              <Badge variant="outline">{profile.planName}</Badge>
              <Badge>{persona.role}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact & coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Preferred name" value={profile.preferredName ?? profile.displayName} />
            <Field label="Phone" value={profile.phone} />
            <Field label="Date of birth" value={formatDate(profile.dateOfBirth)} />
            <Field label="Primary care" value={profile.primaryCareProvider} />
            <Field label="Pharmacy" value={profile.pharmacy} />
            <Field
              label="Address"
              value={`${profile.address.line1}${profile.address.line2 ? `, ${profile.address.line2}` : ""}, ${profile.address.city}, ${profile.address.state} ${profile.address.zip}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <PreferenceRow
              id="email"
              label="Email notifications"
              description="Visit reminders and secure message alerts"
              checked={emailNotifications}
              onCheckedChange={(checked) => {
                setEmailNotifications(checked);
                trackPortalEvent(portalEventTypes.preferenceUpdate, {
                  key: "emailNotifications",
                  value: checked,
                });
              }}
            />
            <Separator />
            <PreferenceRow
              id="sms"
              label="SMS reminders"
              description="Text reminders for upcoming appointments"
              checked={smsReminders}
              onCheckedChange={(checked) => {
                setSmsReminders(checked);
                trackPortalEvent(portalEventTypes.preferenceUpdate, {
                  key: "smsReminders",
                  value: checked,
                });
              }}
            />
            <Separator />
            <PreferenceRow
              id="marketing"
              label="Wellness updates"
              description="Seasonal programs and educational content"
              checked={marketingOptIn}
              onCheckedChange={(checked) => {
                setMarketingOptIn(checked);
                trackPortalEvent(portalEventTypes.preferenceUpdate, {
                  key: "marketingOptIn",
                  value: checked,
                });
              }}
            />
          </CardContent>
        </Card>
      </div>

      {persona.careRecipients && persona.careRecipients.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Care recipients</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {persona.careRecipients.map((recipient) => (
              <div
                key={recipient.memberId}
                className="rounded-lg border border-border p-4"
              >
                <p className="font-medium">{recipient.name}</p>
                <p className="text-sm text-muted-foreground">
                  {recipient.relationship}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Member ID {recipient.memberId}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <OpenTasks />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email-display">Sign-in email</Label>
            <Input id="email-display" value={profile.email} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-display">Member ID</Label>
            <Input id="member-display" value={profile.memberId} readOnly />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}

function PreferenceRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
      />
    </div>
  );
}
