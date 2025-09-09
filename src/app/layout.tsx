import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "../styles/globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { Suspense } from "react";
import { MainLayout } from "@/shared/layouts/main/MainLayout";
import { ClientProvider } from "@/providers/ClientProvider";
import { ServerProvider } from "@/providers/ServerProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TestTeleApp",
  description: "Telestore example application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <ClientProvider>
              <ServerProvider>
                <MainLayout>
                  {children}
                </MainLayout>
              </ServerProvider>
            </ClientProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
