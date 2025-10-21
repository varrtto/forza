import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {

    const { pathname } = req.nextUrl;

    if (
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/static/") ||
      pathname.startsWith("/favicon.ico") ||
      pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)
    ) {
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect routes that require authentication
        const { pathname } = req.nextUrl;

        // Allow access to auth pages
        if (pathname.startsWith("/auth/")) {
          return true;
        }

        // Allow access to public pages
        if (pathname === "/") {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .webp files (image files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.webp$|.*\\.png$).*)",
  ],
};
