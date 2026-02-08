import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  try {
    console.log("=== ADMIN PAGE START ===");
    console.log("Step 1: About to call auth()...");
    
    // Validar sesión en servidor
    const session = await auth();
    console.log("Step 2: auth() completed successfully");
    
    const ADMIN_EMAIL = "mi.baus.g@gmail.com";
    
    console.log("Session check:", { 
      hasSession: !!session, 
      hasUser: !!session?.user, 
      email: session?.user?.email,
      isAdmin: session?.user?.email === ADMIN_EMAIL 
    });
    
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      console.log("Step 3: Redirecting to login - not authorized");
      redirect('/login-admin');
    }

    console.log("Step 4: Admin authorized - showing simple page");

    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="mb-12">
          <Link href="/" className="font-serif text-4xl text-[#2C3333] tracking-tight">
            VOWS<span className="text-[#A27B5C]">.</span>
          </Link>
        </div>
        
        <div className="text-center">
          <h1 className="font-serif text-2xl text-[#2C3333] mb-4">
            Panel de Administración
          </h1>
          <p className="text-[#2C3333]/60 mb-8">
            Bienvenida, {session?.user?.name || 'Administradora'}!
          </p>
          
          <div className="p-6 bg-[#A27B5C]/10 rounded-2xl">
            <p className="text-sm text-[#2C3333]">
              {"✅ Login exitoso\n"}
              {"✅ Sesión válida\n"}
              {"✅ Email autorizado\n"}
              {"✅ Panel funcional"}
            </p>
          </div>
          
          <div className="mt-8">
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-[#2C3333] text-white text-sm uppercase tracking-widest font-bold rounded-xl hover:bg-[#A27B5C] transition-all duration-500"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("=== ADMIN PAGE ERROR ===");
    console.error("Error type:", typeof error);
    console.error("Error name:", error instanceof Error ? error.name : 'Unknown');
    console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack available');
    console.error("====================");
    
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <div className="mb-12">
          <Link href="/" className="font-serif text-4xl text-[#2C3333] tracking-tight">
            VOWS<span className="text-[#A27B5C]">.</span>
          </Link>
        </div>
        
        <div className="text-center">
          <h1 className="font-serif text-2xl text-red-600 mb-4">
            Error en el servidor
          </h1>
          <p className="text-[#2C3333]/60 mb-4">
            Ha ocurrido un error al cargar el panel de administración.
          </p>
          
          <div className="p-4 bg-red-50 rounded-lg mb-4">
            <p className="text-sm text-red-700 font-mono">
              {error instanceof Error ? error.message : 'Error desconocido'}
            </p>
          </div>
          
          <div className="mt-8">
            <Link 
              href="/login-admin"
              className="inline-block px-6 py-3 bg-red-600 text-white text-sm uppercase tracking-widest font-bold rounded-xl hover:bg-red-700 transition-all duration-500"
            >
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
