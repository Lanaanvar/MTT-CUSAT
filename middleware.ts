import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check for protected routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup'
  
  // Get the session cookie
  const session = request.cookies.get('session')
  
  // Redirect to login if trying to access admin routes without a session
  if (isAdminRoute && !session) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
  
  // If user is already logged in and tries to access login/signup pages,
  // redirect them to home page
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
    '/signup',
  ],
} 