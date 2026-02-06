'use client';

import { FeaturesSelector } from './FeaturesSelector';
import { AgendaEditor } from './AgendaEditor';
import type { OnboardingData } from '@/app/actions/onboarding';

interface StepProps {
  data: Partial<OnboardingData>;
  onChange: (data: Partial<OnboardingData>) => void;
}

export function Step5FeaturesConfig({ data, onChange }: StepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Secciones de la invitación</h2>
        <p className="text-gray-600 mb-4">Selecciona qué secciones quieres mostrar en tu invitación.</p>
        <FeaturesSelector
          features={{
            showHero: data.showHero,
            showCountdown: data.showCountdown,
            showAgenda: data.showAgenda,
            showVenueMap: data.showVenueMap,
            showDressCode: data.showDressCode,
            showGiftRegistry: data.showGiftRegistry,
            showRSVP: data.showRSVP,
            showGallery: data.showGallery,
            showMusic: data.showMusic,
            showGuestMessages: data.showGuestMessages,
          }}
          onChange={(features) => onChange(features)}
        />
      </div>

      {/* Agenda Editor */}
      {data.showAgenda !== false && (
        <div className="pt-6 border-t">
          <h3 className="font-medium text-gray-900 mb-4">Agenda del día</h3>
          <p className="text-sm text-gray-600 mb-4">Personaliza los momentos de tu evento.</p>
          <AgendaEditor
            items={data.agendaItems || []}
            onChange={(items) => onChange({ agendaItems: items })}
          />
        </div>
      )}

      {/* RSVP Config */}
      {data.showRSVP !== false && (
        <div className="pt-6 border-t">
          <h3 className="font-medium text-gray-900 mb-4">Configuración de confirmaciones (RSVP)</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha límite para confirmar</label>
              <input
                type="date"
                value={data.rsvpDeadline || ''}
                onChange={(e) => onChange({ rsvpDeadline: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Máximo de acompañantes</label>
              <select
                value={data.maxCompanions || 2}
                onChange={(e) => onChange({ maxCompanions: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'acompañante' : 'acompañantes'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.allowChildren || false}
                onChange={(e) => onChange({ allowChildren: e.target.checked })}
                className="w-5 h-5 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700">Permitir confirmar asistencia de niños</span>
            </label>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje de confirmación</label>
            <textarea
              value={data.rsvpConfirmationMessage || ''}
              onChange={(e) => onChange({ rsvpConfirmationMessage: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="¡Gracias por confirmar! Te esperamos..."
            />
          </div>
        </div>
      )}
    </div>
  );
}
