import type { Metadata } from "next";
import { ResourcesPageClient } from "@/components/pages/resources-page-client";

export const metadata: Metadata = {
  title: "Resources",
};

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resources</h1>
        <p className="text-sm text-muted-foreground">
          Articles, guides, and care education
        </p>
      </div>

      <ResourcesPageClient />
    </div>
  );
}
