import { Suspense } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getPendingInvitations } from '@/app/actions/admin';
import { AdminDashboard } from './AdminDashboard';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// Componente para manejar errores
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="mb-12">
        <Link href="/" className="font-serif text-4xl text-[#2C3333] tracking-tight">
          VOWS<span className="text-[#A27B5C]">.</span>
        </Link>
      </div>
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center max-w-sm">
        <p className="text-red-700 text-sm">
          Error al cargar el panel de administración. Por favor, intenta nuevamente.
        </p>
      </div>
      <Link 
        href="/login-admin"
        className="px-6 py-3 bg-[#2C3333] text-white text-sm uppercase tracking-widest font-bold rounded-xl hover:bg-[#A27B5C] transition-all duration-500"
      >
        Volver al login
      </Link>
    </div>
  );
}

async function InvitationsList() {
  try {
    const result = await getPendingInvitations();
    
    if (!result.success) {
      throw new Error(result.error);
    }

    return <AdminDashboard invitations={result.data || []} />;
  } catch (error) {
    console.error("Invitations list error:", error);
    return (
      <div className="p-8 bg-[#E7D2CC]/30 border border-[#A27B5C]/20 rounded-2xl text-[#2C3333] text-center">
        <p className="font-serif text-lg mb-2">Ha ocurrido un error</p>
        <p className="text-sm text-[#2C3333]/60">{error instanceof Error ? error.message : 'Error desconocido'}</p>
      </div>
    );
  }
}

async function AdminContent() {
  try {
    console.log("=== ADMIN PAGE LOADING ===");
    
    // Validar sesión en servidor
    const session = await auth();
    const ADMIN_EMAIL = "mi.baus.g@gmail.com";
    
    console.log("Session check:", { 
      hasSession: !!session, 
      hasUser: !!session?.user, 
      email: session?.user?.email,
      isAdmin: session?.user?.email === ADMIN_EMAIL 
    });
    
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      console.log("Redirecting to login - not authorized");
      redirect('/login-admin');
    }

    console.log("Admin authorized, loading dashboard...");

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-black/5 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href="/" className="font-serif text-2xl text-[#2C3333] tracking-tight">
                  VOWS<span className="text-[#A27B5C]">.</span>
                </Link>
                <span className="px-3 py-1 bg-[#2C3333] text-white text-[9px] uppercase tracking-widest font-bold rounded-full">
                  Admin
                </span>
              </div>
              <div className="flex items-center gap-3">
                <AdminHeader />
                <Link 
                  href="/onboarding?tier=premium"
                  className="px-6 py-3 bg-[#2C3333] text-white text-[10px] uppercase tracking-widest font-bold rounded-xl hover:bg-[#A27B5C] transition-all duration-500 shadow-lg shadow-black/10 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nueva invitación
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#A27B5C] mb-2">
              Panel de Control
            </p>
            <h1 className="font-serif text-4xl text-[#2C3333] mb-3">Invitaciones</h1>
            <p className="text-[#2C3333]/60 text-sm">
              Gestiona las invitaciones creadas desde el formulario de onboarding
            </p>
          </div>

          <Suspense fallback={
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-2 border-[#A27B5C]/30 border-t-[#A27B5C] rounded-full animate-spin"></div>
            </div>
          }>
            <InvitationsList />
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8 border-t border-black/5">
          <p className="text-center text-[10px] uppercase tracking-widest text-[#2C3333]/40">
            {new Date().getFullYear()} VOWS. Panel de Administración
          </p>
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Admin page error:", error);
    return (
      <ErrorBoundary>
        <div />
      </ErrorBoundary>
    );
  }
}

export default async function AdminPage() {
  return (
    <ErrorBoundary>
      <AdminContent />
    </ErrorBoundary>
  );
}
