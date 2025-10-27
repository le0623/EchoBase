import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const hostname = req.headers.get('host') || '';
    
    // Handle tenant subdomain routing
    if (hostname.includes('.localhost:3000') || hostname.includes('.localhost')) {
      const subdomain = hostname.split('.')[0];
      
      // If accessing tenant subdomain root, redirect to subdomain page
      if (pathname === '/') {
        return NextResponse.redirect(new URL(`http://${hostname}/s/${subdomain}`, req.url));
      }
      
      // If accessing signin on tenant subdomain, ensure it goes to tenant-specific signin
      if (pathname === '/signin' && subdomain) {
        return NextResponse.redirect(new URL(`http://${hostname}/s/${subdomain}/signin`, req.url));
      }
      
      // Allow tenant-specific signin and subdomain pages
      if (pathname.startsWith('/signin') || pathname.startsWith('/s/')) {
        return NextResponse.next();
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const hostname = req.headers.get('host') || '';
        
        // Allow access to signin page without authentication
        if (pathname.startsWith('/signin')) {
          return true;
        }
        
        // Handle tenant subdomain signin
        if (hostname.includes('.localhost:3000') || hostname.includes('.localhost')) {
          if (pathname.startsWith('/signin') || pathname.startsWith('/dashboard')) {
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
        // Allow access to subdomain pages (they handle their own auth)
        if (pathname.startsWith('/s/')) {
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
