"use client";

import Link from "next/link";
import {
  Activity,
  Bell,
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  Menu,
  User,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PersonaSwitcher } from "@/components/persona/persona-switcher";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePersona } from "@/components/persona/persona-provider";
import { brandConfig } from "@/lib/config/brand";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  Bell,
  CalendarDays,
  BookOpen,
  Activity,
  User,
} as const;

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { persona } = usePersona();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = brandConfig.navigation.filter((item) => {
    if (item.href === "/analytics") return brandConfig.features.showAnalytics;
    if (item.href === "/resources") return brandConfig.features.showResources;
    if (item.href === "/appointments")
      return brandConfig.features.showAppointments;
    if (item.href === "/messages") return brandConfig.features.showMessages;
    return true;
  });

  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>

          <BrandLogo />

          <div className="ml-auto flex items-center gap-2">
            <PersonaSwitcher />
            <ThemeToggle />
            <Button asChild variant="ghost" size="icon" aria-label="Messages">
              <Link href="/messages" className="relative">
                <Bell className="h-4 w-4" />
                {persona.summary.unreadMessages > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                    {persona.summary.unreadMessages}
                  </span>
                ) : null}
              </Link>
            </Button>
            <Link href="/profile" className="hidden sm:block">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{persona.avatarInitials}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-0 lg:gap-6 lg:px-6 lg:py-6">
        <aside
          className={cn(
            "fixed inset-y-16 left-0 z-30 w-72 border-r border-sidebar-border bg-sidebar p-4 transition-transform lg:static lg:inset-auto lg:z-auto lg:translate-x-0 lg:rounded-xl lg:border lg:self-start",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <nav aria-label="Primary" className="space-y-1">
            {nav.map((item) => {
              const Icon = iconMap[item.icon];
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Separator className="my-4" />

          <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Need help?</p>
            <p className="mt-1">{brandConfig.supportPhone}</p>
            <p>{brandConfig.supportEmail}</p>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <main
          id="main-content"
          className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-0 lg:py-0"
        >
          {children}
          <footer className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
            <p>{brandConfig.footerLegal}</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
