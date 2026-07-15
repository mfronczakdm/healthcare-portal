import { OpenTasks } from "@/components/dashboard/open-tasks";
import { PersonalizedHero } from "@/components/dashboard/personalized-hero";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { RecommendationsSection } from "@/components/dashboard/recommendations-section";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { NotificationsPanel } from "@/components/notifications/notifications-panel";
import { PromoBanner } from "@/components/content/promo-banner";
import { PersonaAlerts } from "@/components/dashboard/persona-alerts";
import { loadHomePromo } from "@/lib/sitecore/loaders/home/promo";

export default async function HomePage() {
  const promo = await loadHomePromo();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
        <p className="text-sm text-muted-foreground">
          Care summary, recommendations, and next steps
        </p>
      </div>

      <PersonalizedHero />

      <PromoBanner promo={promo.data} edgeError={promo.error} />

      <PersonaAlerts />

      <SummaryCards />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <RecommendationsSection />

          <OpenTasks />
        </div>

        <div className="space-y-6">
          <NotificationsPanel limit={4} />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
