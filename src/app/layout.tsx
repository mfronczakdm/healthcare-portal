import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { SitecoreTrackingInit } from "@/components/analytics/sitecore-tracking-init";
import { PortalShell } from "@/components/layout/portal-shell";
import { PersonaProvider } from "@/components/persona/persona-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { brandConfig } from "@/lib/config/brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: brandConfig.appName,
    template: `%s · ${brandConfig.appName}`,
  },
  description: brandConfig.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PersonaProvider>
            <SitecoreTrackingInit />
            <PageViewTracker />
            <PortalShell>{children}</PortalShell>
          </PersonaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
