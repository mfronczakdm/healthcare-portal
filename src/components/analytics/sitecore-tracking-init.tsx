"use client";

import { useEffect } from "react";
import { initCloudSdk } from "@/lib/tracking/cloud-sdk";

/** Bootstraps Sitecore Cloud SDK once on the client. */
export function SitecoreTrackingInit() {
  useEffect(() => {
    initCloudSdk();
  }, []);

  return null;
}
