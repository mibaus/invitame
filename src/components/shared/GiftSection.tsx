'use client';

import { useState } from 'react';
import type { GiftRegistry } from '@/types';
import { LuxuryButton } from './LuxuryButton';

interface GiftSectionProps {
  registry?: GiftRegistry;
  className?: string;
  styles?: {
    cardClassName?: string;
    buttonClassName?: string;
  };
}

export function GiftSection({
  registry,
  className = '',
  styles = {},
}: GiftSectionProps) {
  if (!registry?.enabled) {
    return null;
  }

  const showFullRegistry = registry.registries && registry.registries.length > 0;
  const mercadoLibreItem = registry.registries?.find(r => 
    r.platform.toLowerCase().includes('mercado libre') || 
    r.platform.toLowerCase().includes('mercadolibre')
  );
  const otherRegistries = registry.registries?.filter(r => r.id !== mercadoLibreItem?.id);

  return (
    <div className={`gift-section ${className}`}>
      {/* Message */}
      {registry.message && (
        <p className="gift-message text-center mb-8 opacity-80 text-lg leading-relaxed">
          {registry.message}
        </p>
      )}

      {/* Bank Details */}
      {registry.bank_details && (
        <BankDetails details={registry.bank_details} styles={styles} />
      )}

      {/* Mercado Libre - Destacado */}
      {mercadoLibreItem && (
        <div className="mt-8 text-center">
          <a
            href={mercadoLibreItem.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LuxuryButton
              variant="primary"
              size="lg"
              className={`${styles.buttonClassName} w-full sm:w-auto`}
            >
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Ver Lista de Regalos en Mercado Libre
            </LuxuryButton>
          </a>
        </div>
      )}

      {/* Other Gift Registries */}
      {otherRegistries && otherRegistries.length > 0 && (
        <div className="gift-registries mt-8">
          <h4 className="text-sm uppercase tracking-widest opacity-60 mb-4 text-center">
            Otras Mesas de Regalos
          </h4>
          <div className="flex flex-wrap justify-center gap-4">
            {otherRegistries.map((item) => (
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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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
          <span className="opacity-60">CBU/Alias:</span>
          <button
            onClick={() => copyToClipboard(details.account_number, 'cbu')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title="Copiar CBU"
          >
            <span className="font-mono">{details.account_number}</span>
            {copiedField === 'cbu' ? (
              <span className="text-xs text-green-500">¡Copiado!</span>
            ) : (
              <CopyIcon className="w-4 h-4 opacity-60" />
            )}
          </button>
        </div>

        {details.routing_number && (
          <div className="flex justify-between items-center">
            <span className="opacity-60">CUIT:</span>
            <button
              onClick={() => copyToClipboard(details.routing_number!, 'cuit')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="Copiar CUIT"
            >
              <span className="font-mono">{details.routing_number}</span>
              {copiedField === 'cuit' ? (
                <span className="text-xs text-green-500">¡Copiado!</span>
              ) : (
                <CopyIcon className="w-4 h-4 opacity-60" />
              )}
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

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}
