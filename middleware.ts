import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

console.log("✅ Middleware file is loaded!");

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 💡 Only apply logic for admin routes
  if (pathname.startsWith("/admin")) {
    
    console.log(`🔒 Admin route accessed: ${pathname}`);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // ❌ Not logged in
    if (!session) {
      console.log("🚫 No session found. Redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // ❌ Logged in but not an admin
    if (session.user.role !== "ADMIN") {
      console.log(`🚫 Unauthorized access by: ${session.user.email} (role: ${session.user.role})`);
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // ✅ Admin access granted
    console.log(`✅ Admin access granted: ${session.user.email}`);
  }

  return NextResponse.next();
}

export const config = {
  runtime: "nodejs", // 👈 Ensure nodejs runtime to use auth.api + Prisma
  matcher: ["/admin/:path*"], // 👈 Only triggers for /admin and sub-routes
};
