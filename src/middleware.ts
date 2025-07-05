import { NextResponse } from 'next/server';

export function middleware() {
  // Only add security headers, no redirects to prevent loops
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg (favicon files)
     * - site.webmanifest (web app manifest)
     */
    '/((?!api|_next/static|_next/image|favicon|site.webmanifest).*)',
  ],
};
