import Link from 'next/link';
import { LuxuryButton } from '@/components/shared';

export default function Home() {
  return (
    <div className="min-h-screen bg-charcoal-950 text-cream-100">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950 via-charcoal-900 to-charcoal-950" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-gold-500/10 rotate-45" />
        <div className="absolute bottom-20 right-10 w-24 h-24 border border-gold-500/10 rotate-12" />
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-gold-500/30 rounded-full" />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-gold-400/40 rounded-full" />

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="mb-8">
            <span className="text-gold-400 text-sm tracking-[0.5em] uppercase">Bienvenido a</span>
          </div>

          {/* Main Title */}
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-light mb-6 tracking-wide">
            <span className="text-gradient-gold">Invita</span>
            <span className="text-cream-100">.me</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-cream-300 font-light mb-4 tracking-wide">
            Invitaciones Digitales de Alta Gama
          </p>
          
          <p className="text-cream-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            Crea experiencias memorables para tus eventos más importantes. 
            Diseños exclusivos, elegancia atemporal y tecnología de vanguardia.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/demo">
              <LuxuryButton size="lg" className="min-w-[200px]">
                Ver Demo
              </LuxuryButton>
            </Link>
            <Link href="/admin">
              <LuxuryButton variant="outline" size="lg" className="min-w-[200px]">
                Crear Invitación
              </LuxuryButton>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-gold-500/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-charcoal-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-center text-gold-400 mb-16">
            Tres Niveles de Excelencia
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Essential */}
            <div className="p-8 bg-charcoal-950/50 rounded-2xl border border-gold-500/10 hover:border-gold-500/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-gold-400 text-xl">✦</span>
              </div>
              <h3 className="font-heading text-2xl text-cream-100 mb-3">Essential</h3>
              <p className="text-cream-400 text-sm mb-6">
                Elegancia accesible. Perfecto para quienes buscan sofisticación con simplicidad.
              </p>
              <ul className="space-y-2 text-sm text-cream-500">
                <li>• 3 diseños elegantes</li>
                <li>• Compartir por WhatsApp</li>
                <li>• Countdown animado</li>
                <li>• RSVP básico</li>
              </ul>
            </div>

            {/* Pro */}
            <div className="p-8 bg-charcoal-950/50 rounded-2xl border border-gold-500/30 hover:border-gold-500/50 transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-charcoal-950 text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
              <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-gold-400 text-xl">✦✦</span>
              </div>
              <h3 className="font-heading text-2xl text-cream-100 mb-3">Pro</h3>
              <p className="text-cream-400 text-sm mb-6">
                Control total. Dashboard completo y funcionalidades avanzadas.
              </p>
              <ul className="space-y-2 text-sm text-cream-500">
                <li>• 3 diseños premium</li>
                <li>• Dashboard de gestión</li>
                <li>• RSVP avanzado</li>
                <li>• Mesa de regalos</li>
                <li>• Múltiples ubicaciones</li>
              </ul>
            </div>

            {/* Premium */}
            <div className="p-8 bg-gradient-to-b from-charcoal-900 to-charcoal-950 rounded-2xl border border-gold-400/40 hover:border-gold-400/60 transition-all duration-300">
              <div className="w-12 h-12 bg-gold-400/20 rounded-full flex items-center justify-center mb-6">
                <span className="text-gold-300 text-xl">✦✦✦</span>
              </div>
              <h3 className="font-heading text-2xl text-cream-100 mb-3">Premium</h3>
              <p className="text-cream-400 text-sm mb-6">
                Lujo sin límites. Personalización total para momentos únicos.
              </p>
              <ul className="space-y-2 text-sm text-cream-500">
                <li>• 3 diseños de lujo</li>
                <li>• Dominio personalizado</li>
                <li>• Live streaming</li>
                <li>• Libro de firmas</li>
                <li>• CSS personalizado</li>
                <li>• Soporte prioritario</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-24 px-6 bg-charcoal-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl text-gold-400 mb-6">
            Prueba el Demo
          </h2>
          <p className="text-cream-400 mb-12 max-w-2xl mx-auto">
            Explora nuestra invitación de demostración para descubrir la calidad y 
            elegancia de nuestros diseños.
          </p>
          
          <Link href="/demo">
            <LuxuryButton size="lg">
              Ver Invitación Demo →
            </LuxuryButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black text-center border-t border-gold-500/10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-8 h-px bg-gold-500/30" />
          <span className="font-heading text-xl text-gold-400">Invita.me</span>
          <div className="w-8 h-px bg-gold-500/30" />
        </div>
        <p className="text-cream-600 text-sm">
          © 2024 Invita.me — Invitaciones Digitales de Alta Gama
        </p>
      </footer>
    </div>
  );
}
