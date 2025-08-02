// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { headers } from "next/headers";


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


export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user) {
        console.log("🔒 User not authenticated. Redirecting to /login");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (session.user.role !== "CREATOR") {
        console.log(`⛔ Access denied for user ${session.user.email} with role ${session.user.role}`);
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }

      console.log("✅ Admin access granted:", session.user.email);
    } catch (error) {
      console.error("Auth error in middleware:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", // Only protect admin routes
  ],
};

// Pass any existing middleware with the optional existingMiddleware prop
export default createMiddleware(aj, async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return middleware(request);
  }

  return NextResponse.next();
});