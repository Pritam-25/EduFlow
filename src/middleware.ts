import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // adjust this path if needed

console.log("✅ Admin middleware loaded!");

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only protect /admin routes
  if (pathname.startsWith("/admin")) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.log("🔒 User not authenticated. Redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (session.user.role !== "ADMIN") {
      console.log(`⛔ Access denied for user ${session.user.email} with role ${session.user.role}`);
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    console.log(`✅ Admin access granted: ${session.user.email}`);
  }

  return NextResponse.next();
}

// Enable Node.js middleware runtime
export const config = {
  runtime: "nodejs",
  matcher: ["/admin/:path*"], // Only applies to admin routes
};
