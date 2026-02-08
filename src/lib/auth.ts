import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

const ADMIN_EMAIL = "mi.baus.g@gmail.com" // Email de administradora

console.log("=== AUTH LIB LOADING ===");
console.log("Environment check in lib/auth:", {
  hasClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  hasSecret: !!process.env.NEXTAUTH_SECRET,
  hasUrl: !!process.env.NEXTAUTH_URL,
  nodeEnv: process.env.NODE_ENV
});

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
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  callbacks: {
    async jwt({ token, user }: any) {
      console.log("JWT callback:", { token, user });
      if (user) {
        token.email = user.email
      }
      return token
    },
    async session({ session, token }: any) {
      console.log("Session callback:", { session, token });
      if (token.email && session.user) {
        session.user.email = token.email
      }
      return session
    },
    async signIn({ user }: any) {
      console.log("SignIn callback:", { user, adminEmail: ADMIN_EMAIL });
      // Whitelist estricta: solo permitir el email de administradora
      return user.email === ADMIN_EMAIL
    }
  }
}

console.log("Creating NextAuth instance...");
export const { handlers, signIn, signOut, auth } = NextAuth(config)
console.log("NextAuth instance created successfully");
