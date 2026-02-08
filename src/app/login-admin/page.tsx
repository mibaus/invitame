'use client'

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Logo VOWS */}
      <div className="mb-12">
        <Link href="/" className="font-serif text-4xl text-[#2C3333] tracking-tight">
          VOWS<span className="text-[#A27B5C]">.</span>
        </Link>
      </div>

      {/* Mensaje de error si existe */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center max-w-sm">
          <p className="text-red-700 text-sm">
            {(error === 'access_denied' || error === 'AccessDenied')
              ? 'Acceso denegado. Solo el administrador autorizado puede acceder a esta sección.'
              : `Error en la autenticación (${error}). Por favor, intenta nuevamente.`
            }
          </p>
        </div>
      )}

      {/* Botón de login */}
      <button
        onClick={() => signIn('google', { callbackUrl: '/admin' })}
        className="px-8 py-4 bg-[#2C3333] text-white text-sm uppercase tracking-widest font-bold rounded-xl hover:bg-[#A27B5C] transition-all duration-500 shadow-lg shadow-black/10 flex items-center gap-3"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Acceder como Administradora
      </button>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-[10px] uppercase tracking-widest text-[#2C3333]/30">
          Panel de Administración VOWS.
        </p>
      </div>
    </div>
  )
}

export default function LoginAdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="mb-12">
          <Link href="/" className="font-serif text-4xl text-[#2C3333] tracking-tight">
            VOWS<span className="text-[#A27B5C]">.</span>
          </Link>
        </div>
        <div className="w-10 h-10 border-2 border-[#A27B5C]/30 border-t-[#A27B5C] rounded-full animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
