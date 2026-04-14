import { NextResponse } from 'next/server'

export const GET = () => {
  const res = NextResponse.redirect(new URL('/maintenance', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  res.cookies.set('maintenance_access', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}
