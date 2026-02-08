import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const ADMIN_EMAIL = "mi.baus.g@gmail.com" // Email de administradora

const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    })
  ],
  pages: {
    signIn: '/login-admin',
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 60, // 30 minutos - token de corta duración
  },
  secret: process.env.NEXTAUTH_SECRET,
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
      // Whitelist estricta: solo permitir el email de administradora
      return user.email === ADMIN_EMAIL
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(config)
