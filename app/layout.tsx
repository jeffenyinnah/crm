import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Sidebar from "@/components/shared/Sidebar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aplo - CRM",
  description: "Simple CRM for SMBs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-50`}>
          <div className="flex">
            <Sidebar />
            <main className="flex-1 md:ml-64">
              <Toaster />
              {children}
            </main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
