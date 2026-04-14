import { NextResponse } from 'next/server'

export const GET = (request) => {
  const res = NextResponse.redirect(new URL('/maintenance', request.url))
  res.cookies.set('maintenance_access', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return res
}
