import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware";

// Middleware function
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If the user is authenticated and tries to visit /sign-in, /sign-up, or /verify
  if (token && (
    url.pathname.startsWith("/sign-in") || 
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify")
  )) {
    // Redirect authenticated users to /dashboard if they try to visit sign-in, sign-up, or verify
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is not authenticated and tries to access /dashboard, redirect to /sign-in
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If the user is not authenticated, ensure they're sent to /sign-in if they're visiting other restricted pages


  // If the user is not authenticated and tries to visit the home page, they can proceed (or you can redirect them if desired)
  if (!token && url.pathname === "/") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configuration for matching the paths
export const config = {
  matcher: [
    "/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"
  ],
};
  