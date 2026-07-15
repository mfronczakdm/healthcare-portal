/**
 * Central brand & feature configuration.
 * Rename the portal, swap logos/colors, and toggle sections here.
 * Theme color tokens live in globals.css — keep hex values in sync
 * with the CSS variables below when rebranding.
 */
export const brandConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "CareConnect Portal",
  shortName: "CareConnect",
  tagline: "Your health, organized in one place",
  logoText: "CareConnect",
  logoImagePath: "/brand/careconnect-health-logo.png",
  faviconPath: "/favicon.ico",
  supportEmail: "support@careconnect.health",
  supportPhone: "1-800-555-0147",
  footerLegal:
    "© CareConnect Health. Confidential patient information. Unauthorized use is prohibited.",
  organizationName: "CareConnect Health",

  /** CareConnect Health logo palette — mirrored in globals.css */
  colors: {
    blue: "#0072BC",
    green: "#7DC242",
    primary: "#0072BC",
    primaryForeground: "#FFFFFF",
    accent: "#7DC242",
    accentForeground: "#FFFFFF",
    muted: "#F4F6F8",
    ring: "#0072BC",
  },

  features: {
    showAnalytics: true,
    showResources: true,
    showAppointments: true,
    showMessages: true,
    showPersonaSwitcher: true,
    showSitecoreLiveBadges: true,
    showMockDataLabels: true,
  },

  sitecore: {
    liveLabel: "SITECORE(LIVE)",
    mockLabel: "MOCK DATA",
  },

  navigation: [
    { href: "/", label: "Home", icon: "LayoutDashboard" },
    { href: "/messages", label: "Messages", icon: "Bell" },
    { href: "/appointments", label: "Appointments", icon: "CalendarDays" },
    { href: "/resources", label: "Resources", icon: "BookOpen" },
    { href: "/analytics", label: "Activity", icon: "Activity" },
    { href: "/profile", label: "Profile", icon: "User" },
  ] as const,
} as const;

export type BrandConfig = typeof brandConfig;
export type NavItem = (typeof brandConfig.navigation)[number];
