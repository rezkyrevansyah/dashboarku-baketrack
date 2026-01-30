import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardProvider } from "@/context/DashboardContext";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ['400', '600', '700', '800'],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "BakeTrack - Bakery Dashboard",
  description: "Claymorphism Dashboard for Bakery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased flex bg-[#F5E6EE] min-h-screen`}>
        <DashboardProvider>
          {/* Sidebar Holder - Since sidebar is Fixed, we need this to push content */}
          <div className="hidden md:block h-screen">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 p-8 h-screen overflow-y-auto w-full relative">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </DashboardProvider>
      </body>
    </html>
  );
}
