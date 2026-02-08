import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
  // Solo redirigir si no hay cookie de sesión
  const { pathname } = request.nextUrl
  
  if (pathname.startsWith('/admin')) {
    const sessionToken = request.cookies.get('next-auth.session-token') || 
                       request.cookies.get('__Secure-next-auth.session-token')
    
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login-admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
