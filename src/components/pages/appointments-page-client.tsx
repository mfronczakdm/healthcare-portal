"use client";

import { usePersona } from "@/components/persona/persona-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackCtaClick } from "@/lib/tracking";
import { formatDate, formatTime } from "@/lib/utils";

const statusVariant = {
  scheduled: "info",
  completed: "success",
  cancelled: "destructive",
  requested: "warning",
} as const;

export function AppointmentsPageClient() {
  const { persona } = usePersona();
  const upcoming = persona.appointments.filter(
    (a) => a.status === "scheduled" || a.status === "requested"
  );
  const past = persona.appointments.filter((a) => a.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            Upcoming visits, requests, and history
          </p>
        </div>
        <Button
          onClick={() =>
            trackCtaClick({
              ctaId: "request-appointment",
              label: "Request appointment",
              href: "/appointments",
              source: "chrome",
            })
          }
        >
          Request appointment
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Upcoming</h2>
        {upcoming.length === 0 ? (
          <EmptyState message="No upcoming appointments." />
        ) : (
          <div className="grid gap-4">
            {upcoming.map((appt) => (
              <Card key={appt.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{appt.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {appt.provider}
                    </p>
                  </div>
                  <Badge variant={statusVariant[appt.status]}>
                    {appt.status}
                  </Badge>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
                  <Detail label="When" value={`${formatDate(appt.startsAt)} · ${formatTime(appt.startsAt)}`} />
                  <Detail label="Type" value={appt.type} />
                  <Detail label="Location" value={appt.location} />
                  {appt.notes ? <Detail label="Notes" value={appt.notes} /> : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Past visits</h2>
        {past.length === 0 ? (
          <EmptyState message="No past visits on file." />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Visit</th>
                  <th className="px-4 py-3 font-medium">Provider</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {past.map((appt) => (
                  <tr key={appt.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">{appt.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {appt.provider}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(appt.startsAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[appt.status]}>
                        {appt.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}
