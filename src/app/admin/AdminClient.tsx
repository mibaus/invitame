'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { PendingInvitation } from '@/app/actions/admin';
import { getDashboardData, DashboardData } from '@/app/actions/dashboard';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminClientProps {
  invitations: PendingInvitation[];
}

export default function AdminClient({ invitations }: AdminClientProps) {
  const { data: session, status } = useSession();
  const [selectedInvitation, setSelectedInvitation] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  // Auth check happens in server component, but keep client fail-safe
  if (status === 'unauthenticated') {
    redirect('/login-admin');
    return null;
  }

  const handleViewDetails = async (slug: string) => {
    if (loadingSlug) return; // Prevent multiple concurrent requests

    setLoadingSlug(slug);
    try {
      console.log('Fetching details for:', slug);
      const res = await getDashboardData(slug);
      console.log('Dashboard response:', res);

      if (res.success && res.data) {
        setDashboardData(res.data);
        setSelectedInvitation(slug);
      } else {
        console.error('Error in response:', res.error);
        alert('Error al cargar detalles: ' + (res.error || 'Desconocido'));
      }
    } catch (error) {
      console.error('Catch error:', error);
      alert('Error inesperado al cargar detalles');
    } finally {
      setLoadingSlug(null);
    }
  };

  const handleBackToList = () => {
    setSelectedInvitation(null);
    setDashboardData(null);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#A27B5C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-[#2C3333]">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-serif text-2xl tracking-tight">
            VOWS<span className="text-[#A27B5C]">.</span>
          </Link>
          <span className="text-sm bg-[#2C3333] text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden sm:inline-block">
            {session?.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/login-admin' })}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Salir
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {selectedInvitation && dashboardData ? (
            <InvitationDetailView
              key="detail"
              data={dashboardData}
              onBack={handleBackToList}
            />
          ) : (
            <InvitationListView
              key="list"
              invitations={invitations}
              onSelect={handleViewDetails}
              loadingSlug={loadingSlug}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Sub-components ---

function InvitationListView({
  invitations,
  onSelect,
  loadingSlug
}: {
  invitations: PendingInvitation[];
  onSelect: (slug: string) => void;
  loadingSlug: string | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif mb-1">Invitaciones</h1>
          <p className="text-sm text-gray-500">
            {invitations.length} invitaciones encontradas
          </p>
        </div>

        {/* Actions like "Create New" could go here */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invitations.map((inv) => (
          <div
            key={inv.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold ${inv.is_active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
                }`}>
                {inv.is_active ? 'Activa' : 'Inactiva'}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(inv.created_at).toLocaleDateString()}
              </span>
            </div>

            <h3 className="font-serif text-xl mb-1">
              {inv.content?.headline || 'Sin título'}
            </h3>
            <p className="text-xs text-gray-500 font-mono mb-4 truncate">
              /{inv.slug}
            </p>

            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-2 h-2 rounded-full bg-[#A27B5C]"></span>
                {inv.client?.full_name || 'Cliente desconocido'}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-50">
                <Link
                  href={`/preview/${inv.skin_id}?slug=${inv.slug}`}
                  target="_blank"
                  className="px-4 py-2 rounded-lg border border-gray-200 text-center text-sm hover:bg-gray-50 transition-colors"
                >
                  Ver
                </Link>
                <button
                  onClick={() => onSelect(inv.slug)}
                  disabled={loadingSlug === inv.slug}
                  className={`px-4 py-2 rounded-lg text-white text-center text-sm transition-colors disabled:opacity-50 ${loadingSlug === inv.slug
                      ? 'bg-[#A27B5C] opacity-75 cursor-not-allowed'
                      : 'bg-[#2C3333] hover:bg-[#A27B5C]'
                    }`}
                >
                  {loadingSlug === inv.slug ? 'Cargando...' : 'Gestionar'}
                </button>
              </div>
            </div>
          </div>
        ))}

        {invitations.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
            No hay invitaciones creadas aún.
          </div>
        )}
      </div>
    </motion.div>
  );
}

function InvitationDetailView({
  data,
  onBack
}: {
  data: DashboardData;
  onBack: () => void;
}) {
  const { invitation, rsvps, stats } = data;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-serif">
            {invitation.headline}
          </h1>
          <p className="text-sm text-gray-500 font-mono">
            /{invitation.slug}
          </p>
        </div>
        <div className="ml-auto">
          <Link
            href={`/dashboard/${invitation.slug}`}
            target="_blank"
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Ver Dashboard Cliente ↗
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Invitados" value={stats.totalGuests} />
        <StatCard label="Confirmados" value={stats.confirmed} color="bg-green-50 text-green-700" />
        <StatCard label="Rechazados" value={stats.declined} color="bg-red-50 text-red-700" />
        <StatCard label="Dietas Especiales" value={stats.specialMenus} color="bg-orange-50 text-orange-700" />
      </div>

      {/* RSVP Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="font-bold text-gray-700">Lista de Invitados</h2>
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            {rsvps.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-center">Invitados</th>
                <th className="px-6 py-3">Detalles</th>
                <th className="px-6 py-3 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rsvps.map((rsvp) => (
                <tr key={rsvp.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {rsvp.name}
                    {rsvp.email && (
                      <div className="text-xs text-gray-400 font-normal">{rsvp.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={rsvp.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    {rsvp.attendance ? rsvp.guests_count : '-'}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-gray-500">
                    {rsvp.dietary_restrictions && (
                      <span className="mr-2 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                        Dieta
                      </span>
                    )}
                    {rsvp.message && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                        Mensaje
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400 text-xs">
                    {new Date(rsvp.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {rsvps.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    Aún no hay confirmaciones para este evento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, color = "bg-white" }: { label: string; value: number; color?: string }) {
  return (
    <div className={`p-4 rounded-xl border border-gray-100 shadow-sm ${color}`}>
      <p className="text-xs opacity-70 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-serif">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    confirmed: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    maybe: 'bg-blue-100 text-blue-700',
  }[status] || 'bg-gray-100 text-gray-700';

  const labels = {
    confirmed: 'Confirmado',
    declined: 'Rechazado',
    pending: 'Pendiente',
    maybe: 'Quizás',
  }[status] || status;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {labels}
    </span>
  );
}
