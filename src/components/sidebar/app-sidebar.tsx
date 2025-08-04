"use client";

import * as React from "react";
import {
  IconDashboard,
  IconHelp,
  IconListDetails,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Codesandbox } from "lucide-react";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const data = {
    // Dynamic navigation based on pathname
    navMain: [
      {
        title: "Dashboard",
        url: isAdmin ? "/admin/dashboard" : "/dashboard",
        icon: IconDashboard,
      },
      {
        title: isAdmin ? "My Courses" : "Enrolled Courses",
        url: isAdmin ? "/admin/courses" : "/dashboard/enrolled-courses",
        icon: IconListDetails,
      },
    ],

    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: IconSettings,
      },
      {
        title: "Get Help",
        url: "#",
        icon: IconHelp,
      },
      {
        title: "Search",
        url: "#",
        icon: IconSearch,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Codesandbox className="!size-5" />
                <span className="text-lg font-semibold">
                  Edu<span className="text-primary">Flow</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
