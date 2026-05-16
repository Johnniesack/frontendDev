"use client";

import { useEffect } from "react";

export default function DashboardClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.classList.add("dashboard-active");
    return () => {
      document.documentElement.classList.remove("dashboard-active");
    };
  }, []);

  return <>{children}</>;
}
