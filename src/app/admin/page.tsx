import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  try {
    const session = await auth();
    const ADMIN_EMAIL = "mi.baus.g@gmail.com";
    
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      redirect('/login-admin');
    }

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'white' }}>
        <div style={{ marginBottom: '48px' }}>
          <Link href="/" style={{ fontFamily: 'serif', fontSize: '36px', color: '#2C3333', textDecoration: 'none' }}>
            VOWS<span style={{ color: '#A27B5C' }}>.</span>
          </Link>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '24px', color: '#2C3333', marginBottom: '16px' }}>
            Panel de Administracion
          </h1>
          <p style={{ color: 'rgba(44,51,51,0.6)', marginBottom: '32px' }}>
            Bienvenida, {session?.user?.name || 'Administradora'}!
          </p>
          
          <div style={{ padding: '24px', backgroundColor: 'rgba(162,123,92,0.1)', borderRadius: '16px', marginBottom: '32px' }}>
            <p style={{ fontSize: '14px', color: '#2C3333', whiteSpace: 'pre-line' }}>
              {`✅ Login exitoso
✅ Sesion valida
✅ Email autorizado
✅ Panel funcional`}
            </p>
          </div>
          
          <Link 
            href="/"
            style={{ 
              display: 'inline-block', 
              padding: '12px 24px', 
              backgroundColor: '#2C3333', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 'bold'
            }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Admin page error:", error);
    
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'white' }}>
        <div style={{ marginBottom: '48px' }}>
          <Link href="/" style={{ fontFamily: 'serif', fontSize: '36px', color: '#2C3333', textDecoration: 'none' }}>
            VOWS<span style={{ color: '#A27B5C' }}>.</span>
          </Link>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '24px', color: '#dc2626', marginBottom: '16px' }}>
            Error en el servidor
          </h1>
          <p style={{ color: 'rgba(44,51,51,0.6)', marginBottom: '16px' }}>
            Ha ocurrido un error al cargar el panel de administracion.
          </p>
          
          <div style={{ padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: '#dc2626', fontFamily: 'monospace' }}>
              {error instanceof Error ? error.message : 'Error desconocido'}
            </p>
          </div>
          
          <Link 
            href="/login-admin"
            style={{ 
              display: 'inline-block', 
              padding: '12px 24px', 
              backgroundColor: '#dc2626', 
              color: 'white', 
              textDecoration: 'none',
              borderRadius: '12px',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 'bold'
            }}
          >
            Volver al login
          </Link>
        </div>
      </div>
    );
  }
}
