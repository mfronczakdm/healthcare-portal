/** Shared domain types for portal UI, mock data, and Sitecore mapping */

export type ContentSource = "sitecore" | "mock";

export interface ContentMeta {
  source: ContentSource;
  sitecoreId?: string;
  lastModified?: string;
}

/** Sitecore Edge promo / advertisement slot (GetMobileCollege query) */
export interface PromoContent extends ContentMeta {
  id: string;
  name?: string;
  promoText: string;
  promoText2?: string;
  /** CTA label parsed from PromoLink field */
  promoLinkLabel?: string;
  /** Resolved href when Sitecore provides a URL */
  promoLinkHref?: string;
  promoImageUrl?: string;
}

export interface AlertItem {
  id: string;
  title: string;
  body: string;
  severity: "info" | "warning" | "success" | "urgent";
  href?: string;
  ctaLabel?: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl?: string;
  /** Outbound URLs are managed in lib/config/external-links.ts (by id) */
  href?: string;
  readingTimeMinutes?: number;
}

export interface ContentBlock extends ContentMeta {
  id: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
}

export interface CtaItem extends ContentMeta {
  id: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  category: "message" | "appointment" | "result" | "reminder" | "system";
  href?: string;
}

export interface AppointmentItem {
  id: string;
  title: string;
  provider: string;
  location: string;
  startsAt: string;
  endsAt: string;
  status: "scheduled" | "completed" | "cancelled" | "requested";
  type: string;
  notes?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  href?: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  detail: string;
  occurredAt: string;
  category: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  href?: string;
  featured?: boolean;
}

export interface ProfileDetails {
  displayName: string;
  preferredName?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  memberId: string;
  planName: string;
  primaryCareProvider: string;
  pharmacy: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  preferences: {
    emailNotifications: boolean;
    smsReminders: boolean;
    marketingOptIn: boolean;
  };
}

export interface DashboardSummary {
  upcomingAppointments: number;
  unreadMessages: number;
  openTasks: number;
  recentResults: number;
}

export interface Persona {
  id: string;
  role: "patient" | "caregiver" | "power-user";
  label: string;
  description: string;
  avatarInitials: string;
  /** SE-created demo profile stored in the browser */
  isCustom?: boolean;
  profile: ProfileDetails;
  summary: DashboardSummary;
  heroGreeting: string;
  heroSubtext: string;
  notifications: NotificationItem[];
  appointments: AppointmentItem[];
  tasks: TaskItem[];
  activity: ActivityItem[];
  recommendations: RecommendationItem[];
  alerts: AlertItem[];
  resources: ResourceItem[];
  careRecipients?: { name: string; relationship: string; memberId: string }[];
}

/** Editable profile fields for create/edit demo users */
export interface PersonaProfileInput {
  displayName: string;
  preferredName?: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  memberId: string;
  planName: string;
  primaryCareProvider: string;
  pharmacy: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zip: string;
  role: Persona["role"];
  description?: string;
}

export interface SitecorePortalContent {
  hero?: ContentBlock;
  alerts: AlertItem[];
  recommendations: RecommendationItem[];
  ctas: CtaItem[];
  featuredResources: ResourceItem[];
}
