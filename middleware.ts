import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_EMAIL = "mi.baus.g@gmail.com" // Email de administradora

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Si intenta acceder a rutas de admin, redirigir a login
  if (pathname.startsWith('/admin')) {
    // Verificar si hay cookie de sesión
    const sessionToken = request.cookies.get('next-auth.session-token') || 
                       request.cookies.get('__Secure-next-auth.session-token')
    
    if (!sessionToken) {
      // No hay sesión, redirigir a login
      const url = new URL('/login-admin', request.url)
      return NextResponse.redirect(url)
    }
    
    // Si hay sesión pero no es admin, redirigir a home con error
    // La validación del email se hará en el servidor de la página admin
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
