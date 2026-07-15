"use client";

import { RecentActivity } from "@/components/dashboard/recent-activity";
import { usePersona } from "@/components/persona/persona-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnalyticsPageClient() {
  const { persona } = usePersona();

  const metrics = [
    { label: "Unread messages", value: persona.summary.unreadMessages },
    { label: "Open tasks", value: persona.summary.openTasks },
    { label: "Upcoming visits", value: persona.summary.upcomingAppointments },
    { label: "Recent results", value: persona.summary.recentResults },
    { label: "Saved resources", value: persona.resources.length },
    { label: "Activity events", value: persona.activity.length },
  ];

  const categoryCounts = persona.activity.reduce<Record<string, number>>(
    (acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="text-sm text-muted-foreground">
          Engagement snapshot for {persona.profile.preferredName ?? persona.label}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">
                {metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity by category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No category breakdown yet.
              </p>
            ) : (
              Object.entries(categoryCounts).map(([category, count]) => {
                const max = Math.max(...Object.values(categoryCounts));
                const width = Math.round((count / max) * 100);
                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span>{category}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <RecentActivity />
      </div>
    </div>
  );
}
