"use client";

import Link from "next/link";
import { usePersona } from "@/components/persona/persona-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate, formatTime, cn } from "@/lib/utils";

const categoryVariant = {
  message: "info",
  appointment: "default",
  result: "success",
  reminder: "warning",
  system: "secondary",
} as const;

export function NotificationsPanel({
  limit,
  showViewAll = true,
}: {
  limit?: number;
  showViewAll?: boolean;
}) {
  const { persona } = usePersona();
  const items = limit
    ? persona.notifications.slice(0, limit)
    : persona.notifications;

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">Notifications</CardTitle>
        <p className="text-sm text-muted-foreground">
          {persona.summary.unreadMessages} unread
        </p>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            You&apos;re all caught up. New notifications will appear here.
          </p>
        ) : (
          <ScrollArea className={limit ? "h-[320px] pr-3" : "h-auto"}>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href ?? "/messages"}
                    className={cn(
                      "block rounded-lg border border-border p-3 transition-colors hover:bg-muted/50",
                      !item.read && "border-primary/25 bg-primary/5"
                    )}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant={categoryVariant[item.category]}>
                        {item.category}
                      </Badge>
                      {!item.read ? (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                          New
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.body}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(item.createdAt)} · {formatTime(item.createdAt)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
        {showViewAll ? (
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link href="/messages">View all messages</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
