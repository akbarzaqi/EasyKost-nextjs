import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/users/dashboard') ||
    pathname.startsWith('/admin/dashboard')
  )
}

function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/login') || pathname.startsWith('/register')
}

export function proxy(request: NextRequest) {
  const session = request.cookies.get('session')
  const { pathname } = request.nextUrl

  if (isProtectedRoute(pathname) && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute(pathname) && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|hunian).*)',
  ],
}
