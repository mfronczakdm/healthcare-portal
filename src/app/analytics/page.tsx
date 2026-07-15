import type { Metadata } from "next";
import { AnalyticsPageClient } from "@/components/pages/analytics-page-client";

export const metadata: Metadata = {
  title: "Activity",
};

export default function AnalyticsPage() {
  return <AnalyticsPageClient />;
}
