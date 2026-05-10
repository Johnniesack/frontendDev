import type { Metadata, Viewport } from "next";

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
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.classList.add('dashboard-active');`
        }}
      />
      {children}
    </>
  );
}
