"use client";

import { NotificationsPanel } from "@/components/notifications/notifications-panel";
import { usePersona } from "@/components/persona/persona-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { portalEventTypes, trackPortalEvent } from "@/lib/tracking";
import { formatDate, formatTime } from "@/lib/utils";

export function MessagesPageClient() {
  const { persona } = usePersona();
  const unread = persona.notifications.filter((n) => !n.read);
  const read = persona.notifications.filter((n) => n.read);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Secure messages, results, and care reminders
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inbox</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="unread">
                <TabsList>
                  <TabsTrigger value="unread">
                    Unread ({unread.length})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    All ({persona.notifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="archive">
                    Read ({read.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="unread" className="space-y-3 pt-4">
                  <MessageList items={unread} empty="No unread messages." />
                </TabsContent>
                <TabsContent value="all" className="space-y-3 pt-4">
                  <MessageList
                    items={persona.notifications}
                    empty="No messages yet."
                  />
                </TabsContent>
                <TabsContent value="archive" className="space-y-3 pt-4">
                  <MessageList items={read} empty="No read messages." />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <NotificationsPanel showViewAll={false} />
        </div>
      </div>
    </div>
  );
}

function MessageList({
  items,
  empty,
}: {
  items: {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    read: boolean;
    category: string;
  }[];
  empty: string;
}) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        {empty}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          role="button"
          tabIndex={0}
          className="cursor-pointer rounded-lg border border-border p-4 transition-colors hover:bg-muted/40"
          onClick={() =>
            trackPortalEvent(portalEventTypes.openMessage, {
              messageId: item.id,
              category: item.category,
              title: item.title,
              read: item.read,
            })
          }
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              trackPortalEvent(portalEventTypes.openMessage, {
                messageId: item.id,
                category: item.category,
                title: item.title,
                read: item.read,
              });
            }
          }}
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{item.category}</Badge>
            {!item.read ? <Badge variant="info">New</Badge> : null}
          </div>
          <p className="font-medium">{item.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatDate(item.createdAt)} · {formatTime(item.createdAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}
