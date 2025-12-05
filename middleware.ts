import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { extractSubdomain } from '@/lib/subdomain';

export default withAuth(
  function middleware(req) {

    const { pathname } = req.nextUrl;
    const subdomain = extractSubdomain(req);

    // Handle tenant subdomain routing
    if (subdomain) {
      // Block access to admin page from subdomains
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      if (pathname.startsWith('/api')) {
        return NextResponse.next();
      }

      // For the root path on a subdomain, rewrite to the subdomain page
      return NextResponse.rewrite(new URL(`/s/${subdomain}${pathname}`, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const subdomain = extractSubdomain(req);

        // Allow access to signin page without authentication
        if (pathname.startsWith('/signin')) {
          return true;
        }

        // Handle tenant subdomain signin
        if (subdomain) {
          if (pathname.startsWith('/signin') || pathname.startsWith('/s/')) {
            // Check if user is authenticated
            return !!token;
          }
        }
        // Allow access to select-tenant page (user must be authenticated)
        if (pathname.startsWith('/select-tenant')) {
          return !!token;
        }
        // Allow access to setup-tenant page (user must be authenticated)
        if (pathname.startsWith('/setup-tenant')) {
          return !!token;
        }
        // Allow access to API routes
        if (pathname.startsWith('/api/')) {
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
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
