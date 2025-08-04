"use client";

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {

  const pathName = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* Quick Create Button */}
        <SidebarMenu>
          {pathName.startsWith("/admin") && (<SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 min-w-8 duration-200 ease-linear gap-2"
              asChild
            >
              <Link href="/admin/courses/create">
                <IconCirclePlusFilled className="size-4" />
                <span>Quick Create</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>)}
        </SidebarMenu>

        {/* Dynamic Items */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={item.url} className={cn(pathName === item.url && "bg-sidebar-accent")}>
                  {item.icon && <item.icon className={cn(pathName === item.url && "text-primary")} />}
                  <span className="ml-2">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
