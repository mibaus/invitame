import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const ADMIN_EMAIL = "mi.baus.g@gmail.com" // Email de administradora

console.log("NextAuth env check:", {
  clientId: process.env.GOOGLE_CLIENT_ID ? "exists" : "missing",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "exists" : "missing",
  secret: process.env.NEXTAUTH_SECRET ? "exists" : "missing",
  url: process.env.NEXTAUTH_URL || "missing"
})

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    })
  ],
  pages: {
    signIn: '/login-admin',
    error: '/login-admin?error=true',
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 60, // 30 minutos - token de corta duración
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.email = user.email
      }
      return token
    },
    async session({ session, token }: any) {
      if (token.email && session.user) {
        session.user.email = token.email
      }
      return session
    },
    async signIn({ user }: any) {
      console.log("SignIn callback:", { email: user?.email, adminEmail: ADMIN_EMAIL })
      // Whitelist estricta: solo permitir el email de administradora
      return user.email === ADMIN_EMAIL
    },
    async redirect({ url, baseUrl }: any) {
      console.log("Redirect callback:", { url, baseUrl })
      // Si viene de Google, redirigir a admin
      if (url.includes("google")) {
        return `${baseUrl}/admin`
      }
      // Si es una URL relativa, permitir
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      // Por defecto, ir a admin
      return `${baseUrl}/admin`
    }
  },
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }

export const runtime = "nodejs"
