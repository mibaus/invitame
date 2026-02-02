'use client';

import { useState, useTransition } from 'react';
import type { ServiceTier, RSVPConfig, InvitationMetadata } from '@/types';
import { useTierAccess } from './TierGate';
import { LuxuryButton } from './LuxuryButton';
import { getWhatsAppShareUrl } from '@/lib/utils';
import { submitRSVP } from '@/app/actions/rsvp';

interface RSVPManagerProps {
  tier: ServiceTier;
  config: RSVPConfig;
  metadata: InvitationMetadata;
  whatsappMessage?: string;
  phoneNumber?: string;
  className?: string;
  /** Estilos personalizados por skin */
  styles?: {
    buttonClassName?: string;
    formClassName?: string;
    inputClassName?: string;
  };
}

/**
 * RSVPManager - Componente Factory para RSVP
 * 
 * Essential: Botón de WhatsApp
 * Pro/Premium: Formulario completo con base de datos
 */
export function RSVPManager({
  tier,
  config,
  metadata,
  whatsappMessage = '¡Hola! Confirmo mi asistencia al evento.',
  phoneNumber,
  className = '',
  styles = {},
}: RSVPManagerProps) {
  const { hasFeature } = useTierAccess(tier);

  if (!config.enabled) {
    return null;
  }

  // Essential: Solo WhatsApp
  if (!hasFeature('rsvp_form')) {
    return (
      <RSVPWhatsApp
        message={whatsappMessage}
        phoneNumber={phoneNumber}
        className={className}
        buttonClassName={styles.buttonClassName}
      />
    );
  }

  // Pro/Premium: Formulario completo
  return (
    <RSVPForm
      config={config}
      invitationId={metadata.id}
      className={className}
      styles={styles}
    />
  );
}

// ----- Componente WhatsApp (Essential) -----

interface RSVPWhatsAppProps {
  message: string;
  phoneNumber?: string;
  className?: string;
  buttonClassName?: string;
}

function RSVPWhatsApp({ message, phoneNumber, className, buttonClassName }: RSVPWhatsAppProps) {
  const handleClick = () => {
    const url = getWhatsAppShareUrl(message);
    window.open(url, '_blank');
  };

  return (
    <div className={`rsvp-whatsapp text-center ${className}`}>
      <LuxuryButton
        onClick={handleClick}
        size="lg"
        className={buttonClassName}
      >
        <span className="flex items-center gap-2">
          <WhatsAppIcon />
          Confirmar por WhatsApp
        </span>
      </LuxuryButton>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// ----- Componente Formulario (Pro/Premium) -----

interface RSVPFormProps {
  config: RSVPConfig;
  invitationId: string;
  className?: string;
  styles?: {
    formClassName?: string;
    inputClassName?: string;
    buttonClassName?: string;
  };
}

function RSVPForm({ config, invitationId, className, styles = {} }: RSVPFormProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    attending: 'yes' as 'yes' | 'no' | 'maybe',
    companions: 0,
    companionNames: [''],
    dietary: '',
    message: '',
    musicSuggestion: '',
  });
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await submitRSVP({
        invitationId,
        name: formState.name,
        email: formState.email || undefined,
        phone: formState.phone || undefined,
        attendance: formState.attending === 'yes',
        guestsCount: 1 + formState.companions,
        dietaryRestrictions: formState.dietary || undefined,
        musicSuggestion: formState.musicSuggestion || undefined,
        message: formState.message || undefined,
      });

      if (result.success) {
        setSubmittedName(result.data?.name || formState.name);
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Hubo un error al enviar tu confirmación.');
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className={`rsvp-success text-center p-8 ${className}`}>
        <div className="text-4xl mb-4">✓</div>
        <h3 className="text-2xl font-heading mb-2">¡Gracias por confirmar!</h3>
        <p className="opacity-70">
          {config.confirmation_message || 'Hemos recibido tu confirmación. ¡Nos vemos pronto!'}
        </p>
      </div>
    );
  }

  const inputClass = styles.inputClassName || 'w-full px-4 py-3 bg-white/10 border border-current/20 rounded-lg focus:outline-none focus:border-current/50 transition-colors';

  return (
    <form onSubmit={handleSubmit} className={`rsvp-form space-y-6 ${styles.formClassName || ''} ${className}`}>
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium mb-2">Nombre completo *</label>
        <input
          type="text"
          required
          value={formState.name}
          onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))}
          className={inputClass}
          placeholder="Tu nombre"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          value={formState.email}
          onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))}
          className={inputClass}
          placeholder="tu@email.com"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium mb-2">Teléfono</label>
        <input
          type="tel"
          value={formState.phone}
          onChange={(e) => setFormState(s => ({ ...s, phone: e.target.value }))}
          className={inputClass}
          placeholder="+52 123 456 7890"
        />
      </div>

      {/* Asistencia */}
      <div>
        <label className="block text-sm font-medium mb-2">¿Asistirás? *</label>
        <select
          required
          value={formState.attending}
          onChange={(e) => setFormState(s => ({ ...s, attending: e.target.value as 'yes' | 'no' | 'maybe' }))}
          className={inputClass}
        >
          <option value="yes">Sí, confirmo mi asistencia</option>
          <option value="no">No podré asistir</option>
          <option value="maybe">Aún no estoy seguro</option>
        </select>
      </div>

      {/* Acompañantes */}
      {formState.attending === 'yes' && config.max_companions > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Número de acompañantes (máx. {config.max_companions})
          </label>
          <input
            type="number"
            min="0"
            max={config.max_companions}
            value={formState.companions}
            onChange={(e) => setFormState(s => ({ ...s, companions: parseInt(e.target.value) || 0 }))}
            className={inputClass}
          />
        </div>
      )}

      {/* Restricciones alimentarias */}
      {config.dietary_options && config.dietary_options.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Restricciones alimentarias</label>
          <select
            value={formState.dietary}
            onChange={(e) => setFormState(s => ({ ...s, dietary: e.target.value }))}
            className={inputClass}
          >
            <option value="">Ninguna</option>
            {config.dietary_options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}

      {/* Mensaje */}
      <div>
        <label className="block text-sm font-medium mb-2">Mensaje para los anfitriones</label>
        <textarea
          value={formState.message}
          onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
          className={`${inputClass} min-h-[100px] resize-none`}
          placeholder="Escribe un mensaje especial..."
        />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Submit */}
      <LuxuryButton
        type="submit"
        size="lg"
        loading={isPending}
        className={`w-full ${styles.buttonClassName || ''}`}
      >
        {isPending ? 'Enviando...' : 'Confirmar Asistencia'}
      </LuxuryButton>
    </form>
  );
}
