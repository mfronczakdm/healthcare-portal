"use client";

import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  MessageSquare,
} from "lucide-react";
import { usePersona } from "@/components/persona/persona-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cards = [
  {
    key: "appointments" as const,
    label: "Upcoming visits",
    href: "/appointments",
    icon: CalendarDays,
    valueKey: "upcomingAppointments" as const,
  },
  {
    key: "messages" as const,
    label: "Unread messages",
    href: "/messages",
    icon: MessageSquare,
    valueKey: "unreadMessages" as const,
  },
  {
    key: "tasks" as const,
    label: "Open tasks",
    href: "/profile",
    icon: ClipboardList,
    valueKey: "openTasks" as const,
  },
  {
    key: "results" as const,
    label: "Recent results",
    href: "/messages",
    icon: FileText,
    valueKey: "recentResults" as const,
  },
];

export function SummaryCards() {
  const { persona } = usePersona();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link key={card.key} href={card.href} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold tracking-tight">
                  {persona.summary[card.valueKey]}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
