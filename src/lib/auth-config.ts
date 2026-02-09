import Google from "next-auth/providers/google"
import { NextAuthOptions } from "next-auth"

export const ADMIN_EMAIL = "mi.baus.g@gmail.com" // Email de administradora

export const authOptions: NextAuthOptions = {
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
        error: '/login-admin', // El error se pasa como query param
    },
    session: {
        strategy: "jwt",
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
}
