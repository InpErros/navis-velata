import { NextResponse } from 'next/server'

const MAINTENANCE_MODE = false // Set to true to lock the site

export function middleware(request) {
  if (!MAINTENANCE_MODE) return NextResponse.next()
  const { pathname } = request.nextUrl

  // Allow staff with the access cookie through
  if (request.cookies.get('maintenance_access')?.value === 'unlocked') {
    return NextResponse.next()
  }

  // Allow the maintenance page, auth API, and static assets through
  if (
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/api/maintenance-auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logo')
  ) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/maintenance', request.url))
}

export const config = {
  matcher: ['/((?!api/_next/static|_next/image|.*\\.(?:ico|png|jpg|jpeg|svg|avif|webp)).*)'],
}
