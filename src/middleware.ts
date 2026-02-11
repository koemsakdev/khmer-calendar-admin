import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;

  // Dashboard pages that need auth
  const protectedPaths = [
    "/holidays",
    "/holiday-dates",
    "/holiday-types",
    "/special-events",
  ];
  const isOnDashboard =
    req.nextUrl.pathname === "/" ||
    protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  // Non-GET API calls need auth (POST, PUT, DELETE)
  const isApiWrite =
    req.nextUrl.pathname.startsWith("/api/v1/") && req.method !== "GET";

  // Protect dashboard pages → redirect to login
  if (isOnDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Protect write API routes → return 401
  if (isApiWrite && !isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};