"use client";

import Link from "next/link";
import { usePersona } from "@/components/persona/persona-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

const priorityVariant = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
} as const;

export function OpenTasks() {
  const { persona } = usePersona();
  const tasks = persona.tasks.filter((t) => !t.completed).slice(0, 4);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No open tasks.</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-border p-3"
            >
              <div className="mb-1 flex items-center gap-2">
                <Badge variant={priorityVariant[task.priority]}>
                  {task.priority}
                </Badge>
                {task.dueDate ? (
                  <span className="text-xs text-muted-foreground">
                    Due {formatDate(task.dueDate)}
                  </span>
                ) : null}
              </div>
              <p className="text-sm font-medium">{task.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {task.description}
              </p>
              {task.href ? (
                <Button asChild variant="link" className="mt-1 h-auto px-0">
                  <Link href={task.href}>Open</Link>
                </Button>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
