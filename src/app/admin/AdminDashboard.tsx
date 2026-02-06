'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { activateInvitation, deactivateInvitation, deleteInvitation, type PendingInvitation } from '@/app/actions/admin';

interface AdminDashboardProps {
  invitations: PendingInvitation[];
}

export function AdminDashboard({ invitations: initialInvitations }: AdminDashboardProps) {
  const [invitations, setInvitations] = useState(initialInvitations);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSlug, setNewSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pendingCount = invitations.filter(i => !i.is_active).length;
  const activeCount = invitations.filter(i => i.is_active).length;

  const handleActivate = (invitation: PendingInvitation) => {
    setEditingId(invitation.id);
    // Generate suggested slug from headline or couple names
    const suggested = generateSlug(invitation);
    setNewSlug(suggested);
    setError(null);
  };

  const handleConfirmActivate = () => {
    if (!editingId || !newSlug) return;

    startTransition(async () => {
      const result = await activateInvitation(editingId, newSlug);
      if (result.success) {
        setInvitations(prev => prev.map(inv => 
          inv.id === editingId ? { ...inv, slug: newSlug, is_active: true } : inv
        ));
        setEditingId(null);
        setNewSlug('');
      } else {
        setError(result.error || 'Error al activar');
      }
    });
  };

  const handleDeactivate = (id: string) => {
    startTransition(async () => {
      const result = await deactivateInvitation(id);
      if (result.success) {
        setInvitations(prev => prev.map(inv => 
          inv.id === id ? { ...inv, is_active: false } : inv
        ));
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta invitación?')) return;

    startTransition(async () => {
      const result = await deleteInvitation(id);
      if (result.success) {
        setInvitations(prev => prev.filter(inv => inv.id !== id));
      }
    });
  };

  if (invitations.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay invitaciones</h3>
        <p className="text-gray-500 mb-6">Las invitaciones creadas desde el onboarding aparecerán aquí</p>
        <Link
          href="/onboarding?tier=premium"
          className="inline-flex px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
        >
          Crear primera invitación
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{invitations.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Activas</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Este mes</p>
          <p className="text-2xl font-bold text-gray-900">{invitations.length}</p>
        </div>
      </div>

      {/* Activation Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activar invitación</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL personalizada (slug)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">invita.me/</span>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="maria-y-carlos"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Solo letras minúsculas, números y guiones
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setEditingId(null); setError(null); }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmActivate}
                disabled={!newSlug || isPending}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isPending ? 'Activando...' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invitations Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente / Evento
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan / Diseño
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {invitation.content?.headline || invitation.client?.full_name || 'Sin título'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {invitation.client?.email || 'Sin email'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      invitation.tier === 'premium' 
                        ? 'bg-amber-100 text-amber-700'
                        : invitation.tier === 'pro'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {invitation.tier}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {invitation.skin_id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {invitation.is_active ? (
                      <div>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Activa
                        </span>
                        <Link 
                          href={`/${invitation.slug}`}
                          target="_blank"
                          className="block text-xs text-blue-600 hover:underline mt-1"
                        >
                          /{invitation.slug}
                        </Link>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(invitation.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Preview - muestra la invitación real con datos del cliente */}
                      <Link
                        href={`/preview/${invitation.id}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Ver preview con datos reales"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>

                      {/* Activate/Deactivate */}
                      {invitation.is_active ? (
                        <button
                          onClick={() => handleDeactivate(invitation.id)}
                          disabled={isPending}
                          className="p-2 text-amber-500 hover:text-amber-700"
                          title="Desactivar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(invitation)}
                          disabled={isPending}
                          className="p-2 text-green-500 hover:text-green-700"
                          title="Activar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(invitation.id)}
                        disabled={isPending}
                        className="p-2 text-red-400 hover:text-red-600"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function generateSlug(invitation: PendingInvitation): string {
  // Try to generate from couple names or headline
  const headline = invitation.content?.headline || '';
  const person1 = invitation.content?.couple?.person1?.name || '';
  const person2 = invitation.content?.couple?.person2?.name || '';

  let base = '';
  if (person1 && person2) {
    base = `${person1}-y-${person2}`;
  } else if (headline) {
    base = headline;
  } else {
    base = 'mi-invitacion';
  }

  // Normalize: lowercase, replace spaces and special chars with hyphens
  return base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
