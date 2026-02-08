import { NextResponse, NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

const ADMIN_EMAIL = "mi.baus.g@gmail.com" // Email de administradora

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Si intenta acceder a rutas de admin
  if (pathname.startsWith('/admin')) {
    const session = await auth()
    
    // Verificar si hay sesión y si el email está en la whitelist
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      // Redirigir a home con mensaje de error
      const url = new URL('/', request.url)
      url.searchParams.set('error', 'access_denied')
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
