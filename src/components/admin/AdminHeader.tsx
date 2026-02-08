'use client'

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function AdminHeader() {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <button
      onClick={handleSignOut}
      className="p-2.5 text-[#2C3333]/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
      title="Cerrar sesión"
    >
      <LogOut className="w-4 h-4" />
    </button>
  )
}
