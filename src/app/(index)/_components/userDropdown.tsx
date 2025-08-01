import {
  BookOpenIcon,
  ChevronDownIcon,
  Home,
  LayoutDashboardIcon,
  LogOutIcon,
  UserPenIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSignOut } from "@/hooks/use-signOut";
import { Role } from "@/generated/prisma/client";

interface iAppProps {
  email: string;
  image: string;
  name: string;
  role: Role;
}

// ✅ Define navigation config type that only includes roles we handle
type NavigationConfig = {
  [Role.USER]: {
    courses: { url: string; label: string };
    dashboard: { url: string; label: string };
  };
  [Role.CREATOR]: {
    courses: { url: string; label: string };
    dashboard: { url: string; label: string };
  };
};

export default function UserDropdown({ email, image, name, role }: iAppProps) {
  const handleSignOut = useSignOut();

  // ✅ Add fallback for invalid role
  const safeRole = role || Role.USER;

  // ✅ Role-based navigation configuration (removed ADMIN)
  const navigationConfig: NavigationConfig = {
    [Role.USER]: {
      courses: { url: "/courses", label: "Courses" },
      dashboard: { url: "/dashboard", label: "Dashboard" },
    },
    [Role.CREATOR]: {
      courses: { url: "/admin/courses", label: "My Courses" }, // ✅ Using admin URLs for creators
      dashboard: { url: "/admin/dashboard", label: "Creator Dashboard" },
    },
  };

  const nav = navigationConfig[safeRole as keyof NavigationConfig];

  // ✅ Beautiful role badge function (removed ADMIN handling)
  const getRoleBadge = () => {
    if (safeRole === Role.CREATOR) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">
          Teacher
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
          Student
        </Badge>
      );
    }
  };

  // ✅ Add error handling
  if (!nav) {
    console.error("Invalid role:", role);
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image} alt="Profile image" />
            <AvatarFallback>
              {
                name
                  .split(" ") // split by space
                  .map((n) => n[0]?.toUpperCase()) // take first letter and capitalize
                  .join("") // join letters to form initials
              }
            </AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-70"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-48" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
          {/* ✅ Beautiful role badge */}
          <div className="mt-2">
            {getRoleBadge()}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/">
              <Home size={16} className="opacity-70" aria-hidden="true" />
              <span>Home</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={nav.courses.url}>
              <BookOpenIcon
                size={16}
                className="opacity-70"
                aria-hidden="true"
              />
              <span>{nav.courses.label}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={nav.dashboard.url}>
              <LayoutDashboardIcon
                size={16}
                className="opacity-70"
                aria-hidden="true"
              />
              <span>{nav.dashboard.label}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/edit-profile">
              <UserPenIcon
                size={16}
                className="opacity-70"
                aria-hidden="true"
              />
              <span>Edit Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOutIcon size={16} className="opacity-100" aria-hidden="true" />
          <span className="opacity-100">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
