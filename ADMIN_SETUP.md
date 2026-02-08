# Configuración de Login Administrador VOWS

## Pasos para configurar el acceso de administradora:

### 1. Configurar Google OAuth
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ 
4. Crea credenciales de OAuth 2.0:
   - Tipo de aplicación: "Aplicación web"
   - URIs de redirección autorizadas: `http://localhost:3000/api/auth/callback/google`
5. Copia el Client ID y Client Secret

### 2. Configurar variables de entorno
Crea un archivo `.env.local` basado en `.env.example`:

```bash
# NextAuth.js - Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id-real
GOOGLE_CLIENT_SECRET=tu-google-client-secret-real
NEXTAUTH_SECRET=genera-un-segredo-aleatorio-de-32-caracteres
NEXTAUTH_URL=http://localhost:3000
```

### 3. Actualizar email de administradora
Edita el archivo `src/lib/auth.ts` y `src/middleware.ts`:
Reemplaza `"ariel.baus@gmail.com"` con tu email real de administradora.

### 4. Generar NEXTAUTH_SECRET
Ejecuta este comando en tu terminal:
```bash
openssl rand -base64 32
```

## Flujo de acceso:
1. Visita `/admin` → redirige a `/login-admin`
2. Click en "Acceder como Administradora" → login con Google
3. Si el email coincide con la whitelist → acceso a `/admin`
4. Si el email no coincide → redirección a home con error

## Características de seguridad:
- ✅ Whitelist estricta de email
- ✅ Token de sesión de 30 minutos
- ✅ Middleware de protección de rutas
- ✅ Logout automático al cerrar sesión
- ✅ Redirección con mensaje de error

## Estética implementada:
- ✅ Diseño minimalista blanco
- ✅ Logo VOWS. con punto bronce
- ✅ Botón elegante único
- ✅ Mensajes de error discretos
