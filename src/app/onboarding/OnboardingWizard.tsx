'use client';

import { useState, useTransition } from 'react';
import type { ServiceTier } from '@/types/database';
import { submitOnboarding, type OnboardingData } from '@/app/actions/onboarding';
import { SkinSelector } from './components/SkinSelector';
import { StepIndicator } from './components/StepIndicator';
import { ImageUploader, MultiImageUploader } from './components/ImageUploader';

interface OnboardingWizardProps {
  tier: ServiceTier;
}

const TIER_STYLES = {
  essential: {
    accent: 'bg-gray-600',
    accentText: 'text-gray-600',
    accentBorder: 'border-gray-600',
    badge: 'Essential',
    badgeBg: 'bg-gray-100 text-gray-700',
  },
  pro: {
    accent: 'bg-blue-600',
    accentText: 'text-blue-600',
    accentBorder: 'border-blue-600',
    badge: 'Pro',
    badgeBg: 'bg-blue-100 text-blue-700',
  },
  premium: {
    accent: 'bg-amber-500',
    accentText: 'text-amber-600',
    accentBorder: 'border-amber-500',
    badge: 'Premium',
    badgeBg: 'bg-amber-100 text-amber-700',
  },
};

const STEPS = [
  { id: 1, title: 'Datos Personales', description: 'Tu información de contacto' },
  { id: 2, title: 'Datos del Evento', description: 'Detalles de tu celebración' },
  { id: 3, title: 'Logística y Regalos', description: 'Ubicaciones y registro' },
  { id: 4, title: 'Multimedia', description: 'Fotos y música' },
];

export function OnboardingWizard({ tier }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<{ temporarySlug?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const styles = TIER_STYLES[tier];

  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    eventType: 'wedding',
    skinId: 'classic-elegance',
  });

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await submitOnboarding(tier, formData as OnboardingData);
      if (result.success) {
        setResult({ temporarySlug: result.temporarySlug });
        setIsComplete(true);
      } else {
        setError(result.error || 'Error al procesar tu solicitud.');
      }
    });
  };

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-full ${styles.accent} flex items-center justify-center`}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">¡Felicitaciones!</h1>
          <p className="text-gray-600">
            Tu invitación ha sido creada exitosamente. Nuestro equipo la revisará y te contactaremos
            pronto para asignar tu URL personalizada.
          </p>
          {result?.temporarySlug && (
            <p className="text-sm text-gray-500">
              Referencia: <code className="bg-gray-100 px-2 py-1 rounded">{result.temporarySlug}</code>
            </p>
          )}
          <a
            href="/"
            className={`inline-block px-6 py-3 rounded-lg text-white ${styles.accent} hover:opacity-90 transition-opacity`}
          >
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${styles.badgeBg} mb-4`}>
          Plan {styles.badge}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crea tu invitación</h1>
        <p className="text-gray-600">Completa los siguientes pasos para personalizar tu invitación digital</p>
      </div>

      {/* Step Indicator */}
      <StepIndicator steps={STEPS} currentStep={currentStep} tier={tier} />

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
        {/* Step 1: Datos Personales */}
        {currentStep === 1 && (
          <Step1PersonalData
            data={formData}
            onChange={updateFormData}
            tier={tier}
          />
        )}

        {/* Step 2: Datos del Evento */}
        {currentStep === 2 && (
          <Step2EventData
            data={formData}
            onChange={updateFormData}
            tier={tier}
          />
        )}

        {/* Step 3: Logística y Regalos */}
        {currentStep === 3 && (
          <Step3Logistics
            data={formData}
            onChange={updateFormData}
            tier={tier}
          />
        )}

        {/* Step 4: Multimedia */}
        {currentStep === 4 && (
          <Step4Multimedia
            data={formData}
            onChange={updateFormData}
            tier={tier}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className={`px-6 py-3 rounded-lg text-white ${styles.accent} hover:opacity-90 transition-opacity`}
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className={`px-8 py-3 rounded-lg text-white ${styles.accent} hover:opacity-90 transition-opacity disabled:opacity-50`}
            >
              {isPending ? 'Procesando...' : 'Finalizar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step Components
interface StepProps {
  data: Partial<OnboardingData>;
  onChange: (data: Partial<OnboardingData>) => void;
  tier: ServiceTier;
}

function Step1PersonalData({ data, onChange }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Datos Personales</h2>
      <p className="text-gray-600">Ingresa tu información de contacto para que podamos comunicarnos contigo.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo *</label>
          <input
            type="text"
            required
            value={data.clientName || ''}
            onChange={(e) => onChange({ clientName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            required
            value={data.clientEmail || ''}
            onChange={(e) => onChange({ clientEmail: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <input
            type="tel"
            value={data.clientPhone || ''}
            onChange={(e) => onChange({ clientPhone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+54 11 1234 5678"
          />
        </div>
      </div>
    </div>
  );
}

function Step2EventData({ data, onChange, tier }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Datos del Evento</h2>
      <p className="text-gray-600">Personaliza los detalles de tu celebración.</p>

      {/* Event Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de evento *</label>
        <select
          value={data.eventType || 'wedding'}
          onChange={(e) => onChange({ eventType: e.target.value as OnboardingData['eventType'] })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="wedding">Casamiento</option>
          <option value="quinceañera">Quinceañera</option>
          <option value="birthday">Cumpleaños</option>
          <option value="baby_shower">Baby Shower</option>
          <option value="corporate">Evento Corporativo</option>
          <option value="other">Otro</option>
        </select>
      </div>

      {/* Skin Selector */}
      <SkinSelector
        tier={tier}
        selectedSkin={data.skinId || 'classic-elegance'}
        onSelect={(skinId) => onChange({ skinId })}
      />

      {/* Headline & Subtitle */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Título principal *</label>
          <input
            type="text"
            required
            value={data.headline || ''}
            onChange={(e) => onChange({ headline: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: María & Carlos"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtítulo</label>
          <input
            type="text"
            value={data.subtitle || ''}
            onChange={(e) => onChange({ subtitle: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: ¡Nos casamos!"
          />
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha del evento *</label>
          <input
            type="date"
            required
            value={data.eventDate || ''}
            onChange={(e) => onChange({ eventDate: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hora del evento *</label>
          <input
            type="time"
            required
            value={data.eventTime || ''}
            onChange={(e) => onChange({ eventTime: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Wedding-specific fields */}
      {data.eventType === 'wedding' && (
        <div className="space-y-6 pt-4 border-t">
          <h3 className="font-medium text-gray-900">Información de la pareja</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre persona 1</label>
              <input
                type="text"
                value={data.person1Name || ''}
                onChange={(e) => onChange({ person1Name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="María"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre persona 2</label>
              <input
                type="text"
                value={data.person2Name || ''}
                onChange={(e) => onChange({ person2Name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Carlos"
              />
            </div>
          </div>
          {(tier === 'pro' || tier === 'premium') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hashtag de la boda</label>
              <input
                type="text"
                value={data.coupleHashtag || ''}
                onChange={(e) => onChange({ coupleHashtag: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="#MariaYCarlos2024"
              />
            </div>
          )}
        </div>
      )}

      {/* Main Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje principal *</label>
        <textarea
          required
          value={data.mainMessage || ''}
          onChange={(e) => onChange({ mainMessage: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Escribe el mensaje que verán tus invitados..."
        />
      </div>

      {/* Dress Code (Pro/Premium) */}
      {(tier === 'pro' || tier === 'premium') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Código de vestimenta</label>
          <select
            value={data.dressCode || ''}
            onChange={(e) => onChange({ dressCode: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sin especificar</option>
            <option value="formal">Formal</option>
            <option value="semi-formal">Semi-formal</option>
            <option value="casual">Casual</option>
            <option value="themed">Temático</option>
          </select>
        </div>
      )}

      {/* Quote (Premium) */}
      {tier === 'premium' && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium text-gray-900">Frase especial</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frase o cita</label>
            <textarea
              value={data.quote || ''}
              onChange={(e) => onChange({ quote: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Una frase que represente su amor..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Autor (opcional)</label>
            <input
              type="text"
              value={data.quoteAuthor || ''}
              onChange={(e) => onChange({ quoteAuthor: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Autor de la frase"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Step3Logistics({ data, onChange, tier }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Logística y Regalos</h2>
      <p className="text-gray-600">Indica las ubicaciones del evento y la información de regalos.</p>

      {/* Ceremony */}
      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Ceremonia</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del lugar</label>
            <input
              type="text"
              value={data.ceremonyName || ''}
              onChange={(e) => onChange({ ceremonyName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Iglesia San Francisco"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input
              type="text"
              value={data.ceremonyAddress || ''}
              onChange={(e) => onChange({ ceremonyAddress: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Av. Libertador 1234, Buenos Aires"
            />
          </div>
          {(tier === 'pro' || tier === 'premium') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Link de Google Maps</label>
              <input
                type="url"
                value={data.ceremonyMapsUrl || ''}
                onChange={(e) => onChange({ ceremonyMapsUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://maps.google.com/..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Reception */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium text-gray-900">Recepción / Fiesta</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del lugar</label>
            <input
              type="text"
              value={data.receptionName || ''}
              onChange={(e) => onChange({ receptionName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Estancia Los Álamos"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
            <input
              type="text"
              value={data.receptionAddress || ''}
              onChange={(e) => onChange({ receptionAddress: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ruta 8 Km 45, Pilar"
            />
          </div>
          {(tier === 'pro' || tier === 'premium') && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Link de Google Maps</label>
              <input
                type="url"
                value={data.receptionMapsUrl || ''}
                onChange={(e) => onChange({ receptionMapsUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://maps.google.com/..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Gift Registry */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium text-gray-900">Regalos</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Banco</label>
            <input
              type="text"
              value={data.bankName || ''}
              onChange={(e) => onChange({ bankName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Banco Galicia"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titular de la cuenta</label>
            <input
              type="text"
              value={data.bankAccountHolder || ''}
              onChange={(e) => onChange({ bankAccountHolder: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="María García"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CBU / Alias</label>
            <input
              type="text"
              value={data.bankAccountNumber || ''}
              onChange={(e) => onChange({ bankAccountNumber: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="maria.carlos.boda"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp for RSVP */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="font-medium text-gray-900">Confirmación de asistencia</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp para confirmaciones</label>
          <input
            type="tel"
            value={data.whatsappNumber || ''}
            onChange={(e) => onChange({ whatsappNumber: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+54 11 1234 5678"
          />
        </div>
      </div>
    </div>
  );
}

function Step4Multimedia({ data, onChange, tier }: StepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Multimedia</h2>
      <p className="text-gray-600">Agrega fotos y música para personalizar tu invitación.</p>

      {/* Cover Image */}
      <ImageUploader
        folder={`onboarding/${data.clientEmail || 'temp'}/cover`}
        onUpload={(url) => onChange({ coverImage: url })}
        currentImage={data.coverImage}
        label="Imagen de portada"
        hint="Esta imagen aparecerá como fondo principal de tu invitación"
      />

      {/* Gallery Images (Pro/Premium) */}
      {(tier === 'pro' || tier === 'premium') && (
        <MultiImageUploader
          folder={`onboarding/${data.clientEmail || 'temp'}/gallery`}
          onUpload={(urls) => onChange({ galleryImages: urls })}
          currentImages={data.galleryImages}
          maxImages={tier === 'pro' ? 10 : 15}
          label="Galería de fotos"
          hint={tier === 'pro' ? 'Máximo 10 fotos' : 'Máximo 15 fotos'}
        />
      )}

      {/* Music (Pro/Premium) */}
      {(tier === 'pro' || tier === 'premium') && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium text-gray-900">Música de fondo</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL de audio (MP3)</label>
            <input
              type="url"
              value={data.musicTrackUrl || ''}
              onChange={(e) => onChange({ musicTrackUrl: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://ejemplo.com/cancion.mp3"
            />
          </div>
        </div>
      )}

      {/* Spotify (Premium) */}
      {tier === 'premium' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Playlist de Spotify (URL)</label>
          <input
            type="url"
            value={data.spotifyPlaylistUrl || ''}
            onChange={(e) => onChange({ spotifyPlaylistUrl: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://open.spotify.com/playlist/..."
          />
        </div>
      )}

      {/* Summary */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-4">Resumen de tu invitación</h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Plan:</dt>
            <dd className="font-medium capitalize">{tier}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Diseño:</dt>
            <dd className="font-medium">{data.skinId}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Evento:</dt>
            <dd className="font-medium">{data.headline || '-'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Fecha:</dt>
            <dd className="font-medium">{data.eventDate || '-'}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
