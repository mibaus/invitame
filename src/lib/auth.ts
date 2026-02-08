import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const ADMIN_EMAIL = "mi.baus.g@gmail.com" // Email de administradora

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  pages: {
    signIn: '/login-admin',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutos - token de corta duración
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token.email && session.user) {
        session.user.email = token.email
      }
      return session
    },
    async signIn({ user }) {
      // Whitelist estricta: solo permitir el email de administradora
      return user.email === ADMIN_EMAIL
    }
  }
})
