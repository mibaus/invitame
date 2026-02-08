import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const ADMIN_EMAIL = "mi.baus.g@gmail.com" // Email de administradora

console.log("=== NEXTAUTH DEBUG START ===")
console.log("Environment check:", {
  hasClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  hasSecret: !!process.env.NEXTAUTH_SECRET,
  hasUrl: !!process.env.NEXTAUTH_URL,
  clientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
  clientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
  secretLength: process.env.NEXTAUTH_SECRET?.length || 0,
  urlValue: process.env.NEXTAUTH_URL,
  nodeEnv: process.env.NODE_ENV
})
console.log("=== NEXTAUTH DEBUG END ===")

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
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
      console.log("JWT callback:", { token, user })
      if (user) {
        token.email = user.email
      }
      return token
    },
    async session({ session, token }: any) {
      console.log("Session callback:", { session, token })
      if (token.email && session.user) {
        session.user.email = token.email
      }
      return session
    },
    async signIn({ user, account, profile }: any) {
      console.log("SignIn attempt:", { 
        email: user?.email, 
        isAdmin: user?.email === ADMIN_EMAIL,
        adminEmail: ADMIN_EMAIL,
        provider: account?.provider,
        hasProfile: !!profile
      })
      // Whitelist estricta: solo permitir el email de administradora
      const isAuthorized = user.email === ADMIN_EMAIL
      console.log("Authorization result:", { email: user.email, isAuthorized })
      return isAuthorized
    },
    async redirect({ url, baseUrl }: any) {
      console.log("Redirect callback:", { url, baseUrl })
      // Si viene de Google, redirigir a admin
      if (url.includes("google") || url.includes("callback")) {
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
  debug: true, // Activar debug en producción
})

export { handler as GET, handler as POST }

export const runtime = "nodejs"
