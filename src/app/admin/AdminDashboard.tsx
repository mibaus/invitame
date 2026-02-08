'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { activateInvitation, deactivateInvitation, deleteInvitation, type PendingInvitation } from '@/app/actions/admin';
import { Eye, PauseCircle, PlayCircle, Trash2, Users, CheckCircle, Clock, Calendar } from 'lucide-react';

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
      <div className="text-center py-16 bg-white rounded-3xl border border-black/5 shadow-sm">
        <div className="w-20 h-20 bg-[#E7D2CC]/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[#A27B5C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="font-serif text-xl text-[#2C3333] mb-2">No hay invitaciones</h3>
        <p className="text-[#2C3333]/50 text-sm mb-8 max-w-sm mx-auto">
          Las invitaciones creadas desde el onboarding aparecerán aquí
        </p>
        <Link
          href="/onboarding?tier=premium"
          className="inline-flex px-8 py-4 bg-[#2C3333] text-white text-[10px] uppercase tracking-widest font-bold rounded-xl hover:bg-[#A27B5C] transition-all duration-500 shadow-lg shadow-black/10"
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
        <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#2C3333]/5 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-[#2C3333]" />
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C3333]/40">Total</p>
          </div>
          <p className="font-serif text-3xl text-[#2C3333]">{invitations.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C3333]/40">Pendientes</p>
          </div>
          <p className="font-serif text-3xl text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#E7D2CC]/50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#A27B5C]" />
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C3333]/40">Activas</p>
          </div>
          <p className="font-serif text-3xl text-[#A27B5C]">{activeCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#2C3333]/5 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#2C3333]" />
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#2C3333]/40">Este mes</p>
          </div>
          <p className="font-serif text-3xl text-[#2C3333]">{invitations.length}</p>
        </div>
      </div>

      {/* Activation Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-[#2C3333]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 border border-black/5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#E7D2CC]/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayCircle className="w-8 h-8 text-[#A27B5C]" />
              </div>
              <h3 className="font-serif text-2xl text-[#2C3333] mb-2">Activar invitación</h3>
              <p className="text-sm text-[#2C3333]/60">
                Define una URL personalizada para que la invitación sea accesible
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-[#2C3333]/60 mb-3">
                URL personalizada (slug)
              </label>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-black/5 focus-within:border-[#A27B5C]/50 focus-within:ring-2 focus-within:ring-[#A27B5C]/20 transition-all">
                <span className="text-[#2C3333]/40 text-sm font-medium">vows.ar/</span>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1 bg-transparent text-[#2C3333] text-sm font-medium outline-none placeholder:text-[#2C3333]/30"
                  placeholder="maria-y-carlos"
                  autoFocus
                />
              </div>
              <p className="mt-2 text-xs text-[#2C3333]/40">
                Solo letras minúsculas, números y guiones
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setEditingId(null); setError(null); }}
                className="flex-1 px-6 py-3 border border-black/10 text-[#2C3333] rounded-xl text-[11px] uppercase tracking-widest font-bold hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmActivate}
                disabled={!newSlug || isPending}
                className="flex-1 px-6 py-3 bg-[#A27B5C] text-white rounded-xl text-[11px] uppercase tracking-widest font-bold hover:bg-[#2C3333] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#A27B5C]/20"
              >
                {isPending ? 'Activando...' : 'Activar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invitations Table */}
      <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-black/5">
              <tr>
                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[#2C3333]/40">
                  Cliente / Evento
                </th>
                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[#2C3333]/40">
                  Diseño
                </th>
                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[#2C3333]/40">
                  Estado
                </th>
                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[#2C3333]/40">
                  Fecha
                </th>
                <th className="text-right px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-[#2C3333]/40">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {invitations.map((invitation) => (
                <tr key={invitation.id} className="hover:bg-[#E7D2CC]/10 transition-colors">
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-medium text-[#2C3333]">
                        {invitation.client?.full_name || 'Sin nombre'}
                      </p>
                      <p className="text-sm text-[#2C3333]/50">
                        {invitation.client?.email || 'Sin email'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-[#2C3333]/70 font-medium">
                      {invitation.skin_id}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    {invitation.is_active ? (
                      <div>
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E7D2CC]/50 text-[#2C3333] text-[10px] uppercase tracking-wider font-bold rounded-full">
                          <span className="w-1.5 h-1.5 bg-[#A27B5C] rounded-full animate-pulse"></span>
                          Activa
                        </span>
                        <Link 
                          href={`/${invitation.slug}`}
                          target="_blank"
                          className="block text-xs text-[#A27B5C] hover:text-[#2C3333] hover:underline mt-1.5 font-medium transition-colors"
                        >
                          /{invitation.slug}
                        </Link>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 text-[10px] uppercase tracking-wider font-bold rounded-full">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-sm text-[#2C3333]/60">
                    {formatDate(invitation.created_at)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Preview */}
                      <Link
                        href={`/preview/${invitation.id}`}
                        target="_blank"
                        className="p-2.5 text-[#2C3333]/30 hover:text-[#A27B5C] hover:bg-[#A27B5C]/10 rounded-xl transition-all"
                        title="Ver preview con datos reales"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Activate/Deactivate */}
                      {invitation.is_active ? (
                        <button
                          onClick={() => handleDeactivate(invitation.id)}
                          disabled={isPending}
                          className="p-2.5 text-[#2C3333]/30 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                          title="Desactivar"
                        >
                          <PauseCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(invitation)}
                          disabled={isPending}
                          className="p-2.5 text-[#2C3333]/30 hover:text-[#A27B5C] hover:bg-[#A27B5C]/10 rounded-xl transition-all"
                          title="Activar"
                        >
                          <PlayCircle className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(invitation.id)}
                        disabled={isPending}
                        className="p-2.5 text-[#2C3333]/30 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
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
