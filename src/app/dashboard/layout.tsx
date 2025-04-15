"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/navbar/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <SidebarProvider>
          <div className="flex flex-row min-h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-x-hidden">
              <div className="flex items-center space-x-1">
                <SidebarTrigger />
                <Navbar name="Henok" />
              </div>
              <main className="flex-1">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
