import Link from 'next/link';
import { LuxuryButton } from '@/components/shared';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-charcoal-950 text-cream-100 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <span className="font-heading text-8xl text-gold-500/20">404</span>
        </div>
        
        <h1 className="font-heading text-3xl text-gold-400 mb-4">
          Invitación no encontrada
        </h1>
        
        <p className="text-cream-400 mb-8">
          Lo sentimos, la invitación que buscas no existe o ha expirado.
        </p>

        <Link href="/">
          <LuxuryButton>
            Volver al Inicio
          </LuxuryButton>
        </Link>
      </div>
    </div>
  );
}
