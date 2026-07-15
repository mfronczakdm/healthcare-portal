import type { Metadata } from "next";
import { MessagesPageClient } from "@/components/pages/messages-page-client";

export const metadata: Metadata = {
  title: "Messages",
};

export default function MessagesPage() {
  return <MessagesPageClient />;
}
