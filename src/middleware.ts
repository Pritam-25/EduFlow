import { NextRequest, NextResponse } from "next/server";
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { env } from "./env";
import { getSessionCookie } from "better-auth/cookies"

const aj = arcjet({
  key: env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
        "STRIPE_WEBHOOK"
      ],
    }),
  ],
});

export async function middleware(request: NextRequest) {
  // Skip session check for webhook routes
  if (request.nextUrl.pathname.startsWith("/api/webhook")) {
    console.log("🔄 Skipping auth middleware for webhook:", request.nextUrl.pathname);
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/api/webhook/:path*", // Add webhook routes to matcher
  ],
};

export default createMiddleware(aj, async (request: NextRequest) => {
  // Handle webhook routes without auth
  if (request.nextUrl.pathname.startsWith("/api/webhook")) {
    console.log("🎯 Webhook route detected, bypassing auth");
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    return middleware(request);
  }

  return NextResponse.next();
});