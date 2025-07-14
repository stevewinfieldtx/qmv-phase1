import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { method, nextUrl } = request;
  console.log(`[${new Date().toISOString()}] ${method} ${nextUrl.pathname}`);
  const response = NextResponse.next();
  // example additional security header
  response.headers.set('X-Powered-By', 'none');
  return response;
}

export const config = {
  matcher: '/:path*',
};