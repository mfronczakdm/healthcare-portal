"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getPageViewEventType } from "@/lib/config/tracking-config";
import { trackPageView, trackPortalEvent } from "@/lib/tracking";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView({ page: pathname });

    const pageEvent = getPageViewEventType(pathname);
    if (pageEvent) {
      trackPortalEvent(pageEvent, { path: pathname });
    }
  }, [pathname]);

  return null;
}
