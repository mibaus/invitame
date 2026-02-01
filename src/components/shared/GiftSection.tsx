'use client';

import type { ServiceTier, GiftRegistry } from '@/types';
import { useTierAccess } from './TierGate';
import { LuxuryButton } from './LuxuryButton';

interface GiftSectionProps {
  tier: ServiceTier;
  registry?: GiftRegistry;
  className?: string;
  styles?: {
    cardClassName?: string;
    buttonClassName?: string;
  };
}

/**
 * GiftSection - Componente inteligente para regalos
 * 
 * Essential: Solo texto con CBU/cuenta bancaria
 * Pro/Premium: Mesa de regalos completa con links a registries
 */
export function GiftSection({
  tier,
  registry,
  className = '',
  styles = {},
}: GiftSectionProps) {
  const { hasFeature } = useTierAccess(tier);
  const showFullRegistry = hasFeature('gift_registry_full');

  if (!registry?.enabled) {
    return null;
  }

  return (
    <div className={`gift-section ${className}`}>
      {/* Message */}
      {registry.message && (
        <p className="gift-message text-center mb-8 opacity-80">
          {registry.message}
        </p>
      )}

      {/* Bank Details (Essential y superiores) */}
      {registry.bank_details && (
        <BankDetails details={registry.bank_details} styles={styles} />
      )}

      {/* Gift Registries (Pro/Premium) */}
      {showFullRegistry && registry.registries && registry.registries.length > 0 && (
        <div className="gift-registries mt-8">
          <h4 className="text-sm uppercase tracking-widest opacity-60 mb-4 text-center">
            Mesa de Regalos
          </h4>
          <div className="flex flex-wrap justify-center gap-4">
            {registry.registries.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LuxuryButton
                  variant="outline"
                  className={styles.buttonClassName}
                >
                  {item.platform}
                </LuxuryButton>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface BankDetailsProps {
  details: NonNullable<GiftRegistry['bank_details']>;
  styles?: {
    cardClassName?: string;
  };
}

function BankDetails({ details, styles = {} }: BankDetailsProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`bank-details p-6 rounded-lg bg-white/5 border border-current/10 ${styles.cardClassName || ''}`}>
      <h4 className="text-sm uppercase tracking-widest opacity-60 mb-4">
        Datos Bancarios
      </h4>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="opacity-60">Banco:</span>
          <span>{details.bank_name}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="opacity-60">Titular:</span>
          <span>{details.account_holder}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="opacity-60">Cuenta:</span>
          <button
            onClick={() => copyToClipboard(details.account_number)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="Copiar número de cuenta"
          >
            <span className="font-mono">{details.account_number}</span>
            <CopyIcon className="w-4 h-4 opacity-60" />
          </button>
        </div>
        
        {details.routing_number && (
          <div className="flex justify-between items-center">
            <span className="opacity-60">CLABE:</span>
            <button
              onClick={() => copyToClipboard(details.routing_number!)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="Copiar CLABE"
            >
              <span className="font-mono">{details.routing_number}</span>
              <CopyIcon className="w-4 h-4 opacity-60" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}
