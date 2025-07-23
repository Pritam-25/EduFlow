"use client";
import Link from "next/link";
import { GalleryVerticalEnd} from "lucide-react";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import UserDropdown from "./userDropdown";

const navigationItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Courses",
    href: "/courses",
  },
  {
    name: "Contact Us",
    href: "/contact",
  },
];

export default function Navbar() {
  //* fetch user session
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="px-4 md:px-6 lg:px-8 min-h-16 container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 mr-4 space-x-2">
          <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6 p-1" />
          </div>
          <span className="font-bold">EduFlow</span>
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <div>
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium  hover:font-bold hover:text-primary px-3 py-2 rounded-md"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Navigation (theme toggle and account section) */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {isPending ? null : session ? (
            <>
              <UserDropdown
                email={session.user.email}
                image={
                  session.user.image ??
                  `https://avatar.vercel.sh/${session.user.email}`
                }
                name={session.user.name}
              />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "default" })}
              >
                Login
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ variant: "secondary" })}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
