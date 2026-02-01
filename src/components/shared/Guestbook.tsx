'use client';

import { useState } from 'react';
import type { ServiceTier } from '@/types';
import { useTierAccess } from './TierGate';
import { LuxuryButton } from './LuxuryButton';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

interface GuestbookProps {
  tier: ServiceTier;
  invitationId: string;
  enabled?: boolean;
  className?: string;
  styles?: {
    formClassName?: string;
    entryClassName?: string;
    inputClassName?: string;
  };
}

/**
 * Guestbook - Libro de visitas interactivo
 * 
 * Essential/Pro: No disponible
 * Premium: Formulario + lista de mensajes
 */
export function Guestbook({
  tier,
  invitationId,
  enabled = false,
  className = '',
  styles = {},
}: GuestbookProps) {
  const { hasFeature } = useTierAccess(tier);
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [formState, setFormState] = useState({ name: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Solo Premium
  if (!hasFeature('guestbook') || !enabled) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.message.trim()) return;

    setIsSubmitting(true);
    try {
      // TODO: Implementar llamada a API/Supabase
      const newEntry: GuestbookEntry = {
        id: Date.now().toString(),
        name: formState.name,
        message: formState.message,
        createdAt: new Date().toISOString(),
      };
      
      setEntries([newEntry, ...entries]);
      setFormState({ name: '', message: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting guestbook entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = styles.inputClassName || 'w-full px-4 py-3 bg-white/10 border border-current/20 rounded-lg focus:outline-none focus:border-current/50 transition-colors';

  return (
    <div className={`guestbook ${className}`}>
      {/* Add Entry Button */}
      {!showForm && (
        <div className="text-center mb-8">
          <LuxuryButton onClick={() => setShowForm(true)}>
            ✍️ Dejar un mensaje
          </LuxuryButton>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className={`guestbook-form mb-8 p-6 rounded-lg bg-white/5 ${styles.formClassName || ''}`}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tu nombre</label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))}
                className={inputClass}
                placeholder="¿Cómo te llamas?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tu mensaje</label>
              <textarea
                required
                value={formState.message}
                onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
                className={`${inputClass} min-h-[100px] resize-none`}
                placeholder="Escribe tus buenos deseos..."
              />
            </div>
            <div className="flex gap-3">
              <LuxuryButton type="submit" loading={isSubmitting}>
                Enviar
              </LuxuryButton>
              <LuxuryButton 
                type="button" 
                variant="ghost" 
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </LuxuryButton>
            </div>
          </div>
        </form>
      )}

      {/* Entries */}
      {entries.length > 0 && (
        <div className="guestbook-entries space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`guestbook-entry p-4 rounded-lg bg-white/5 border border-current/10 ${styles.entryClassName || ''}`}
            >
              <p className="mb-2">{entry.message}</p>
              <p className="text-sm opacity-60">— {entry.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {entries.length === 0 && !showForm && (
        <p className="text-center opacity-60">
          Sé el primero en dejar un mensaje de buenos deseos 💌
        </p>
      )}
    </div>
  );
}
