import type { Metadata } from "next";
import { AppointmentsPageClient } from "@/components/pages/appointments-page-client";

export const metadata: Metadata = {
  title: "Appointments",
};

export default function AppointmentsPage() {
  return <AppointmentsPageClient />;
}
