import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // adjust this path if needed
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { Role } from "./generated/prisma";


const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  rules: [
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR", // Uptime monitoring services
        "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
  ],
});


async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    

    if (!session) {
      if (process.env.NODE_ENV !== "production") {
        console.log("🔒 User not authenticated. Redirecting to /login");
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session.user.role !== Role.CREATOR) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`⛔ Access denied for user ${session.user.email} with role ${session.user.role}`);
      }
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("✅ Admin access granted:", session.user.email);
    }
  }

  return NextResponse.next();
}


export const config = {
  runtime: 'nodejs',
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

// Pass any existing middleware with the optional existingMiddleware prop
export default createMiddleware(aj, async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return middleware(request);
  }

  return NextResponse.next();
});