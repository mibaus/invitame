import Link from 'next/link';
import { LuxuryButton } from '@/components/shared';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-charcoal-950 text-cream-100 flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-gold-400 text-3xl">🔧</span>
        </div>
        
        <h1 className="font-heading text-4xl text-gold-400 mb-4">
          Panel de Administración
        </h1>
        
        <p className="text-cream-400 mb-8">
          El dashboard de administración está en desarrollo. 
          Próximamente podrás crear y gestionar tus invitaciones aquí.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-charcoal-900/50 rounded-lg border border-gold-500/10">
            <h3 className="text-cream-200 font-medium mb-2">Próximas funcionalidades:</h3>
            <ul className="text-sm text-cream-500 space-y-1 text-left">
              <li>• Crear nueva invitación</li>
              <li>• Editor visual de contenido</li>
              <li>• Selector de skins/temas</li>
              <li>• Gestión de RSVPs</li>
              <li>• Analíticas de visitas</li>
            </ul>
          </div>

          <Link href="/">
            <LuxuryButton variant="outline" className="w-full">
              ← Volver al Inicio
            </LuxuryButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
