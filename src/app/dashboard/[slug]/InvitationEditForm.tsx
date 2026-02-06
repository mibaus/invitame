'use client';

import { useState } from 'react';
import { updateInvitation, UpdateInvitationData } from '@/app/actions/updateInvitation';
import { Pencil, X, Save, Loader2 } from 'lucide-react';

interface InvitationEditFormProps {
  slug: string;
  initialData: {
    headline: string;
    subtitle?: string;
    mainMessage: string;
    eventDate: string;
    eventTime: string;
    person1Name?: string;
    person2Name?: string;
    coupleHashtag?: string;
    ceremonyName?: string;
    ceremonyAddress?: string;
    ceremonyTime?: string;
    ceremonyMapsUrl?: string;
    receptionName?: string;
    receptionAddress?: string;
    receptionTime?: string;
    receptionMapsUrl?: string;
    dressCode?: string;
    dressCodeDescription?: string;
    quote?: string;
    quoteAuthor?: string;
    bankName?: string;
    bankAccountHolder?: string;
    bankAccountNumber?: string;
    giftRegistryMessage?: string;
    mercadoLibreUrl?: string;
    spotifyPlaylistUrl?: string;
    rsvpDeadline?: string;
    maxCompanions?: number;
    allowChildren?: boolean;
    rsvpConfirmationMessage?: string;
  };
  onUpdate?: () => void;
}

export function InvitationEditForm({ slug, initialData, onUpdate }: InvitationEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateInvitationData>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const result = await updateInvitation(slug, formData);
    
    setIsSaving(false);
    
    if (result.success) {
      setIsOpen(false);
      onUpdate?.();
    } else {
      alert('Error al guardar: ' + result.error);
    }
  };

  const updateField = (field: keyof UpdateInvitationData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
      >
        <Pencil className="w-4 h-4" />
        Editar Invitación
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Editar Invitación</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Información básica */}
          <section>
            <h3 className="text-lg font-medium mb-4">Información de la boda</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título principal</label>
                <input
                  type="text"
                  value={formData.headline || ''}
                  onChange={(e) => updateField('headline', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="María & Carlos"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="¡Nos casamos!"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje principal</label>
                <textarea
                  value={formData.mainMessage || ''}
                  onChange={(e) => updateField('mainMessage', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={formData.eventDate || ''}
                  onChange={(e) => updateField('eventDate', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora ceremonia</label>
                <input
                  type="time"
                  value={formData.eventTime || ''}
                  onChange={(e) => updateField('eventTime', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </section>

          {/* Pareja */}
          <section className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">La pareja</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre persona 1</label>
                <input
                  type="text"
                  value={formData.person1Name || ''}
                  onChange={(e) => updateField('person1Name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre persona 2</label>
                <input
                  type="text"
                  value={formData.person2Name || ''}
                  onChange={(e) => updateField('person2Name', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hashtag</label>
                <input
                  type="text"
                  value={formData.coupleHashtag || ''}
                  onChange={(e) => updateField('coupleHashtag', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="#MariaYCarlos2024"
                />
              </div>
            </div>
          </section>

          {/* Ceremonia */}
          <section className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Ceremonia</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del lugar</label>
                <input
                  type="text"
                  value={formData.ceremonyName || ''}
                  onChange={(e) => updateField('ceremonyName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={formData.ceremonyAddress || ''}
                  onChange={(e) => updateField('ceremonyAddress', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Maps</label>
                <input
                  type="url"
                  value={formData.ceremonyMapsUrl || ''}
                  onChange={(e) => updateField('ceremonyMapsUrl', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <input
                  type="time"
                  value={formData.ceremonyTime || ''}
                  onChange={(e) => updateField('ceremonyTime', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </section>

          {/* Recepción */}
          <section className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Recepción / Fiesta</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del lugar</label>
                <input
                  type="text"
                  value={formData.receptionName || ''}
                  onChange={(e) => updateField('receptionName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={formData.receptionAddress || ''}
                  onChange={(e) => updateField('receptionAddress', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Google Maps</label>
                <input
                  type="url"
                  value={formData.receptionMapsUrl || ''}
                  onChange={(e) => updateField('receptionMapsUrl', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                <input
                  type="time"
                  value={formData.receptionTime || ''}
                  onChange={(e) => updateField('receptionTime', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </section>

          {/* Dress Code */}
          <section className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Dress Code</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código de vestimenta</label>
                <select
                  value={formData.dressCode || ''}
                  onChange={(e) => updateField('dressCode', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Sin especificar</option>
                  <option value="formal">Formal</option>
                  <option value="semi-formal">Semi-formal</option>
                  <option value="casual">Casual</option>
                  <option value="themed">Temático</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.dressCodeDescription || ''}
                  onChange={(e) => updateField('dressCodeDescription', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Frase */}
          <section className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Frase especial</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frase</label>
                <textarea
                  value={formData.quote || ''}
                  onChange={(e) => updateField('quote', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                <input
                  type="text"
                  value={formData.quoteAuthor || ''}
                  onChange={(e) => updateField('quoteAuthor', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </section>

          {/* Regalos */}
          <section className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Mesa de regalos</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea
                  value={formData.giftRegistryMessage || ''}
                  onChange={(e) => updateField('giftRegistryMessage', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
                <input
                  type="text"
                  value={formData.bankName || ''}
                  onChange={(e) => updateField('bankName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titular</label>
                <input
                  type="text"
                  value={formData.bankAccountHolder || ''}
                  onChange={(e) => updateField('bankAccountHolder', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">CBU / Alias</label>
                <input
                  type="text"
                  value={formData.bankAccountNumber || ''}
                  onChange={(e) => updateField('bankAccountNumber', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Mercado Libre</label>
                <input
                  type="url"
                  value={formData.mercadoLibreUrl || ''}
                  onChange={(e) => updateField('mercadoLibreUrl', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </section>

          {/* Config RSVP */}
          <section className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Configuración RSVP</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
                <input
                  type="date"
                  value={formData.rsvpDeadline || ''}
                  onChange={(e) => updateField('rsvpDeadline', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Máx. acompañantes</label>
                <select
                  value={formData.maxCompanions || 2}
                  onChange={(e) => updateField('maxCompanions', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowChildren"
                  checked={formData.allowChildren || false}
                  onChange={(e) => updateField('allowChildren', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="allowChildren" className="text-sm text-gray-700">
                  Permitir confirmar niños
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de confirmación</label>
                <textarea
                  value={formData.rsvpConfirmationMessage || ''}
                  onChange={(e) => updateField('rsvpConfirmationMessage', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
            </div>
          </section>

          {/* Spotify */}
          <section className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Música</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Playlist Spotify</label>
              <input
                type="url"
                value={formData.spotifyPlaylistUrl || ''}
                onChange={(e) => updateField('spotifyPlaylistUrl', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="https://open.spotify.com/playlist/..."
              />
            </div>
          </section>

          {/* Actions */}
          <div className="sticky bottom-0 bg-white border-t pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
