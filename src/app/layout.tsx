import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ['400', '600', '700', '800'],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "BakeTrack - Bakery Dashboard",
  description: "Claymorphism Dashboard for Bakery",
  applicationName: "BakeTrack",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "BakeTrack",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#db2777",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased bg-[#F5E6EE] min-h-screen`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
