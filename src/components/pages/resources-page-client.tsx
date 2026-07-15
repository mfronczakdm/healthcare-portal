"use client";

import { usePersona } from "@/components/persona/persona-provider";
import { getResourceLink, isExternalUrl } from "@/lib/config/resolve-external-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export function ResourcesPageClient() {
  const { persona } = usePersona();

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Your library</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {persona.resources.map((resource) => {
          const resourceUrl = getResourceLink(resource.id);
          const external = isExternalUrl(resourceUrl);

          return (
            <Card key={resource.id} className="flex flex-col transition-shadow hover:shadow-md">
              <CardHeader className="space-y-3">
                <Badge variant="secondary">{resource.category}</Badge>
                <CardTitle className="text-base">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <p className="text-sm text-muted-foreground">{resource.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                {external ? (
                  <Button asChild variant="link" className="h-auto px-0">
                    <a
                      href={resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View resource
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button asChild variant="link" className="h-auto px-0">
                    <Link href={resourceUrl}>View resource</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
