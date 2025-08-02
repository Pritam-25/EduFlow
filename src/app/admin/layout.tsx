"use server"
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SiteHeader } from "@/components/sidebar/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {

  const session = await auth.api.getSession({
    headers: await headers(),
  })


  if (!session?.user) {
    console.log("🔒 User not authenticated. Redirecting to /login");
    redirect("/login");
  }

  if (session.user.role !== "CREATOR") {
    console.log(`⛔ Access denied for user ${session.user.email} with role ${session.user.role}`);
    redirect("/unauthorized");
  }

  console.log("✅ Admin access granted:", session.user.email);



  return (
    <section>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  );
}
