"use client";

import { RecommendationCard } from "@/components/content/recommendation-card";
import { usePersona } from "@/components/persona/persona-provider";

export function RecommendationsSection() {
  const { persona } = usePersona();
  const items = persona.recommendations;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Recommended for you</h2>
      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Recommendations will appear here as we learn more about your care goals.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              placement="home-recommendations"
            />
          ))}
        </div>
      )}
    </section>
  );
}
