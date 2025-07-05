// src/app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Middleware function with typed request parameter
export function middleware(request: NextRequest) {
  // Allow requests to sitemap.xml, robots.txt, and verification file
  const pathname = request.nextUrl.pathname;
  if (
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/google309dfde5f79964cc.html'
  ) {
    return NextResponse.next();
  }
  return NextResponse.next();
}

// Configuration to specify which paths the middleware applies to
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)', // Apply to all paths except static assets
  ],
};