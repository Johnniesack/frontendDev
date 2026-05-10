import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Krifth | Your hustle, automated.",
  description: "Set up your storefront and leverage AI-driven streetwear management.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-body bg-paper text-ink selection:bg-brand/20 selection:text-brand relative">
        {/* Stable Fixed Background */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[#0A0A0B]" />
          <div 
            className="absolute inset-0 opacity-40"
            style={{ 
              backgroundImage: `
                radial-gradient(circle at 0% 0%, var(--color-paper-deep) 0%, transparent 50%),
                radial-gradient(circle at 100% 100%, var(--color-purple-haze) 0%, transparent 50%)
              ` 
            }} 
          />
          <div className="absolute inset-0 auth-grain opacity-[0.15]" />
        </div>
        {children}
      </body>
    </html>
  );
}