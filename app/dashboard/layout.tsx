import type { Metadata, Viewport } from "next";
import DashboardClientLayout from "./DashboardClientLayout";

export const viewport: Viewport = {
  themeColor: "#F5F7FA",
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: "Dashboard | Krifth",
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
