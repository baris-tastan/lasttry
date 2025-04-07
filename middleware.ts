import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/signIn', req.url))
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)|/profile/:path*',
  ],
}