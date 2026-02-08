'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RSVPConfig, InvitationMetadata } from '@/types';
import { LuxuryButton } from './LuxuryButton';
import { cn } from '@/lib/utils';
import { submitRSVP } from '@/app/actions/rsvp';
import { DietaryRestrictionsDropdown } from './DietaryRestrictionsDropdown';

interface RSVPManagerProps {
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
    labelClassName?: string;
  };
}

/**
 * RSVPManager - Componente de RSVP
 * En modelo Single Price, siempre usamos el formulario completo (robusto).
 */
export function RSVPManager({
  config,
  metadata,
  whatsappMessage = '¡Hola! Confirmo mi asistencia al evento.',
  phoneNumber,
  className = '',
  styles = {},
}: RSVPManagerProps) {

  if (!config.enabled) {
    return null;
  }

  // Always render the full form
  return (
    <RSVPForm
      config={config}
      invitationId={metadata.id}
      className={className}
      styles={styles}
    />
  );
}

// ----- Componente Formulario (Robust) -----

interface RSVPFormProps {
  config: RSVPConfig;
  invitationId: string;
  className?: string;
  styles?: {
    formClassName?: string;
    inputClassName?: string;
    buttonClassName?: string;
    labelClassName?: string;
  };
}

/**
 * FormField - Campo de formulario con UX mejorado
 */
function FormField({
  label,
  required,
  error,
  children,
  labelClassName,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  labelClassName?: string;
}) {
  return (
    <div className="space-y-2">
      <label className={cn(
        "block text-sm font-medium tracking-wide",
        labelClassName
      )}>
        {label}
        {required && <span className="text-antique-gold ml-1">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-sm text-rose-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * AttendanceSelector - Selección visual de asistencia
 */
function AttendanceSelector({
  value,
  onChange,
  inputClassName,
}: {
  value: 'yes' | 'no' | 'maybe';
  onChange: (value: 'yes' | 'no' | 'maybe') => void;
  inputClassName?: string;
}) {
  const options = [
    { value: 'yes' as const, label: 'Sí, asistiré', icon: '🎉' },
    { value: 'no' as const, label: 'No podré', icon: '😢' },
    { value: 'maybe' as const, label: 'No estoy seguro', icon: '🤔' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((opt) => (
        <motion.button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
            "min-h-[80px] text-center",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2",
            value === opt.value
              ? "border-current bg-current/10 font-bold"
              : "border-current/30 hover:border-current/50 opacity-70"
          )}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl mb-1">{opt.icon}</span>
          <span className="text-sm">{opt.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

/**
 * GuestCounter - Stepper para número de invitados
 */
function GuestCounter({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (value: number) => void;
  max: number;
}) {
  return (
    <div className="flex items-center justify-center gap-4">
      <motion.button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value <= 0}
        className={cn(
          "w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-bold",
          "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold",
          value <= 0
            ? "border-current/20 opacity-40 cursor-not-allowed"
            : "border-current text-current hover:bg-current/10"
        )}
        whileTap={value > 0 ? { scale: 0.95 } : {}}
      >
        −
      </motion.button>

      <div className="w-16 text-center">
        <span className="text-3xl font-display-editorial">{value}</span>
        <p className="text-xs opacity-50 mt-1">invitados</p>
      </div>

      <motion.button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          "w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-bold",
          "transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold",
          value >= max
            ? "border-current/20 opacity-40 cursor-not-allowed"
            : "border-current text-current hover:bg-current/10"
        )}
        whileTap={value < max ? { scale: 0.95 } : {}}
      >
        +
      </motion.button>
    </div>
  );
}

/**
 * SuccessState - Estado de éxito con animación
 */
function SuccessState({ name, message }: { name: string; message?: string }) {
  return (
    <motion.div
      className="text-center py-12 px-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <motion.div
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
      >
        <motion.svg
          className="w-10 h-10 text-green-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.path
            d="M5 13l4 4L19 7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>

      <motion.h3
        className="text-2xl font-bold mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        ¡Gracias, {name}!
      </motion.h3>

      <motion.p
        className="text-base opacity-70 max-w-sm mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {message || 'Hemos recibido tu confirmación. ¡Nos vemos pronto!'}
      </motion.p>
    </motion.div>
  );
}

function RSVPForm({ config, invitationId, className, styles = {} }: RSVPFormProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    attending: 'yes' as 'yes' | 'no' | 'maybe',
    companions: 0,
    companionNames: [''],
    dietary: [] as string[],
    message: '',
    musicSuggestion: '',
  });
  const [isPending, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = { ...fieldErrors };

    if (name === 'name' && value.length > 0 && value.length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.email = 'Email no válido';
    } else {
      delete errors[name];
    }

    setFieldErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formState.name.length < 2) {
      setFieldErrors({ name: 'Por favor ingresa tu nombre completo' });
      return;
    }

    startTransition(async () => {
      const result = await submitRSVP({
        invitationId,
        name: formState.name,
        email: formState.email || undefined,
        phone: formState.phone || undefined,
        attendance: formState.attending === 'yes',
        guestsCount: 1 + formState.companions,
        dietaryRestrictions: formState.dietary.join(', ') || undefined,
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
      <SuccessState
        name={submittedName.split(' ')[0]}
        message={config.confirmation_message}
      />
    );
  }

  const inputClass = cn(
    "w-full px-4 py-4 min-h-[56px]",
    "bg-white/50 border-2 border-current/20 rounded-xl",
    "placeholder:opacity-40",
    "transition-all duration-200",
    "focus:outline-none focus:border-current focus:ring-4 focus:ring-current/10",
    "hover:border-current/40",
    styles.inputClassName
  );

  const selectClass = cn(
    inputClass,
    "appearance-none bg-no-repeat bg-right pr-10",
    "cursor-pointer"
  );

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn("space-y-8", styles.formClassName, className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Nombre */}
      <FormField
        label="Nombre completo"
        required
        error={fieldErrors.name}
        labelClassName={styles.labelClassName}
      >
        <input
          type="text"
          required
          value={formState.name}
          onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))}
          onBlur={(e) => validateField('name', e.target.value)}
          className={cn(inputClass, fieldErrors.name && "border-rose-400 focus:border-rose-500")}
          placeholder="Tu nombre completo"
        />
      </FormField>

      {/* Email */}
      <FormField
        label="Email"
        error={fieldErrors.email}
        labelClassName={styles.labelClassName}
      >
        <input
          type="email"
          value={formState.email}
          onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))}
          onBlur={(e) => validateField('email', e.target.value)}
          className={cn(inputClass, fieldErrors.email && "border-rose-400 focus:border-rose-500")}
          placeholder="tu@email.com"
        />
      </FormField>

      {/* Teléfono */}
      <FormField label="Teléfono" labelClassName={styles.labelClassName}>
        <input
          type="tel"
          value={formState.phone}
          onChange={(e) => setFormState(s => ({ ...s, phone: e.target.value }))}
          className={inputClass}
          placeholder="+54 11 1234 5678"
        />
      </FormField>

      {/* Asistencia - Visual Selector */}
      <FormField label="¿Asistirás?" required labelClassName={styles.labelClassName}>
        <AttendanceSelector
          value={formState.attending}
          onChange={(value) => setFormState(s => ({ ...s, attending: value }))}
          inputClassName={styles.inputClassName}
        />
      </FormField>

      {/* Acompañantes - Stepper */}
      <AnimatePresence>
        {formState.attending === 'yes' && config.max_companions > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormField
              label={`Acompañantes (máximo ${config.max_companions})`}
              labelClassName={styles.labelClassName}
            >
              <GuestCounter
                value={formState.companions}
                onChange={(value) => setFormState(s => ({ ...s, companions: value }))}
                max={config.max_companions}
              />
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Restricciones alimentarias */}
      {config.dietary_options && config.dietary_options.length > 0 && (
        <FormField label="Restricciones alimentarias" labelClassName={styles.labelClassName}>
          <DietaryRestrictionsDropdown
            value={formState.dietary}
            onChange={(value) => setFormState(s => ({ ...s, dietary: value }))}
            options={config.dietary_options}
            placeholder="Selecciona restricciones alimentarias..."
            styles={{
              triggerClassName: inputClass,
              dropdownClassName: "border-2 rounded-xl shadow-lg",
              optionClassName: "px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm",
              tagClassName: "px-2 py-1 rounded-md text-xs font-medium",
              inputClassName: "px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
            }}
          />
        </FormField>
      )}

      {/* Mensaje */}
      <FormField label="Mensaje para los anfitriones (opcional)" labelClassName={styles.labelClassName}>
        <textarea
          value={formState.message}
          onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
          className={cn(inputClass, "min-h-[120px] resize-none py-4")}
          placeholder="Escribe un mensaje especial..."
        />
      </FormField>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="p-4 bg-rose-50 border-2 border-rose-200 rounded-xl text-rose-700 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit o WhatsApp */}
      <div className="space-y-4">
        <motion.div whileTap={{ scale: 0.99 }}>
          <LuxuryButton
            type="submit"
            size="lg"
            loading={isPending}
            className={cn("w-full min-h-[56px] text-lg", styles.buttonClassName)}
          >
            {isPending ? 'Enviando...' : 'Confirmar Asistencia'}
          </LuxuryButton>
        </motion.div>
        
        {/* WhatsApp Option */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-current/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white/50 opacity-60">o</span>
          </div>
        </div>
        
        <a 
          href={`https://wa.me/?text=${encodeURIComponent(
            `¡Hola! Confirmo mi asistencia al evento.\n\nNombre: ${formState.name || '[Tu nombre]'}\nAsistencia: ${formState.attending === 'yes' ? 'Sí asistiré' : formState.attending === 'no' ? 'No podré ir' : 'Tal vez'}\n${formState.companions > 0 ? `Acompañantes: ${formState.companions}` : ''}\n${formState.dietary ? `Restricciones: ${formState.dietary}` : ''}\n${formState.message ? `Mensaje: ${formState.message}` : ''}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-green-500/30 text-green-600 hover:bg-green-500/10 transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5" />
          <span>Confirmar por WhatsApp</span>
        </a>
      </div>
    </motion.form>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
