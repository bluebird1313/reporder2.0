import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Check if accessing a dashboard route
  const isDashboardRoute = pathname.startsWith('/dashboard')

  // For now, just check if we have any auth-related cookies
  // This is a basic check - the real auth validation happens in the AuthProvider
  const hasAuthCookie = req.cookies.has('sb-access-token') || 
                       req.cookies.has('supabase-auth-token') ||
                       req.cookies.has('sb-refresh-token')

  // If not authenticated and trying to access protected route
  if (!hasAuthCookie && isDashboardRoute) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing login and potentially authenticated, let the login page handle it
  // The login page will redirect based on user role

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 