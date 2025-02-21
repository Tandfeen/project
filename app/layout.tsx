"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { NetworkStatus } from "@/components/network-status";
import { MainNav } from "@/components/main-nav";
import { TestModeToggle } from "@/components/test-mode-toggle";
import { StateRecoveryDialog } from "@/components/state-recovery-dialog";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
        >
          <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
            <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between">
                <MainNav />
                <div className="flex items-center space-x-4">
                  <TestModeToggle />
                  <NetworkStatus />
                </div>
              </div>
            </header>
            <main className="container py-6">{children}</main>
          </div>
          <StateRecoveryDialog />
          <Toaster richColors closeButton position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}