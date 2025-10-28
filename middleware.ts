import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { rootDomain } from '@/lib/utils';

function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Local development environment
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }

    return null;
  }

  // Production environment - Handle Vercel domains
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Handle Vercel preview deployments (tenant---branch-name.vercel.app)
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  // Handle Vercel production domain (echobase.vercel.app)
  if (hostname === rootDomain) {
    return null; // This is the main domain
  }

  // Handle Vercel subdomains ([subdomain].echobase.vercel.app)
  if (hostname.endsWith(`.${rootDomain}`)) {
    const subdomain = hostname.replace(`.${rootDomain}`, '');
    // Ensure it's not www or other reserved subdomains
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      return subdomain;
    }
  }

  // Handle custom domain subdomains
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}

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
