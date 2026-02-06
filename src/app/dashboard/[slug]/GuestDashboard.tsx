'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserCheck, 
  UserX, 
  UtensilsCrossed, 
  Music, 
  Download, 
  ExternalLink,
  AlertTriangle,
  Filter,
  Pencil
} from 'lucide-react';
import type { DashboardData, RSVPRecord } from '@/app/actions/dashboard';
import { InvitationEditForm } from './InvitationEditForm';

interface GuestDashboardProps {
  data: DashboardData;
}

type FilterType = 'all' | 'confirmed' | 'declined' | 'dietary';

const TIER_STYLES = {
  essential: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Essential' },
  pro: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Pro' },
  premium: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Premium' },
};

export function GuestDashboard({ data }: GuestDashboardProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const { invitation, rsvps, stats } = data;
  const tierStyle = TIER_STYLES[invitation.tier as keyof typeof TIER_STYLES] || TIER_STYLES.essential;

  // Extract invitation content for editing
  const content = (invitation as any).content || {};
  const logistics = content.logistics || {};
  const venues = logistics.venues || [];
  const ceremony = venues.find((v: any) => v.type === 'ceremony') || {};
  const reception = venues.find((v: any) => v.type === 'reception') || {};
  const features = content.features || {};
  const rsvp = features.rsvp || {};
  const giftRegistry = features.gift_registry || {};
  const bankDetails = giftRegistry.bank_details || {};
  const registries = giftRegistry.registries || [];
  const mercadoLibre = registries.find((r: any) => r.id === 'mercadolibre') || {};
  const music = features.music || {};
  const couple = content.couple || {};
  const person1 = couple.person1 || {};
  const person2 = couple.person2 || {};
  const quote = content.quote || {};
  const dressCode = logistics.dress_code || {};
  
  const eventDate = logistics.event_date ? logistics.event_date.split('T')[0] : '';
  const eventTime = logistics.event_date ? logistics.event_date.split('T')[1]?.slice(0, 5) : '';

  const editData = {
    headline: content.headline || '',
    subtitle: content.subtitle || '',
    mainMessage: content.main_message || '',
    eventDate,
    eventTime,
    person1Name: person1.name || '',
    person2Name: person2.name || '',
    coupleHashtag: couple.hashtag || '',
    ceremonyName: ceremony.name || '',
    ceremonyAddress: ceremony.address || '',
    ceremonyTime: ceremony.time || '',
    ceremonyMapsUrl: ceremony.google_maps_url || '',
    receptionName: reception.name || '',
    receptionAddress: reception.address || '',
    receptionTime: reception.time || '',
    receptionMapsUrl: reception.google_maps_url || '',
    dressCode: dressCode.code || '',
    dressCodeDescription: dressCode.description || '',
    quote: quote.text || '',
    quoteAuthor: quote.author || '',
    bankName: bankDetails.bank_name || '',
    bankAccountHolder: bankDetails.account_holder || '',
    bankAccountNumber: bankDetails.account_number || '',
    giftRegistryMessage: giftRegistry.message || '',
    mercadoLibreUrl: mercadoLibre.url || '',
    spotifyPlaylistUrl: music.spotify_playlist_url || '',
    rsvpDeadline: rsvp.deadline || '',
    maxCompanions: rsvp.max_companions || 2,
    allowChildren: rsvp.allow_children || false,
    rsvpConfirmationMessage: rsvp.confirmation_message || '',
  };

  const filteredRsvps = rsvps.filter((rsvp) => {
    switch (filter) {
      case 'confirmed':
        return rsvp.attendance === true;
      case 'declined':
        return rsvp.attendance === false;
      case 'dietary':
        return rsvp.dietary_restrictions || rsvp.menu_notes;
      default:
        return true;
    }
  });

  const handleExport = () => {
    // TODO: Implementar descarga real de archivo Excel/CSV
    const csvData = rsvps.map(r => ({
      Nombre: r.name,
      Email: r.email || '',
      Teléfono: r.phone || '',
      Asistencia: r.attendance === true ? 'Sí' : 'No',
      Acompañantes: r.guests_count,
      'Restricciones Alimentarias': r.dietary_restrictions || '',
      'Notas de Menú': r.menu_notes || '',
      'Sugerencia Musical': r.music_suggestion || '',
      Mensaje: r.message || '',
    }));
    
    console.log('=== EXPORTACIÓN CSV ===');
    console.log('Headers:', Object.keys(csvData[0] || {}).join(','));
    csvData.forEach(row => {
      console.log(Object.values(row).join(','));
    });
    console.log('=== FIN EXPORTACIÓN ===');
    
    alert('Datos exportados a la consola. Revisa las herramientas de desarrollo (F12).');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{invitation.headline}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${tierStyle.bg} ${tierStyle.text}`}>
                  {tierStyle.label}
                </span>
              </div>
              <p className="text-gray-500 text-sm">
                Panel de gestión de invitados
                {invitation.event_date && (
                  <span className="ml-2">
                    • {new Date(invitation.event_date).toLocaleDateString('es-AR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <InvitationEditForm 
                slug={invitation.slug} 
                initialData={editData}
                onUpdate={() => window.location.reload()}
              />
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Exportar Lista
              </button>
              {invitation.is_active && (
                <Link
                  href={`/${invitation.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver Invitación
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KPICard
            icon={<Users className="w-5 h-5" />}
            label="Total Personas"
            value={stats.totalGuests}
            color="blue"
          />
          <KPICard
            icon={<UserCheck className="w-5 h-5" />}
            label="Familias/Grupos"
            value={stats.totalFamilies}
            color="green"
          />
          <KPICard
            icon={<UtensilsCrossed className="w-5 h-5" />}
            label="Menús Especiales"
            value={stats.specialMenus}
            color="amber"
            alert={stats.specialMenus > 0}
          />
          <KPICard
            icon={<Music className="w-5 h-5" />}
            label="Canciones Sugeridas"
            value={stats.musicSuggestions}
            color="purple"
          />
        </div>

        {/* Stats Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-gray-600">Confirmados:</span>
              <span className="font-semibold text-gray-900">{stats.confirmed} personas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-gray-600">No asisten:</span>
              <span className="font-semibold text-gray-900">{stats.declined}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            Todos ({rsvps.length})
          </FilterButton>
          <FilterButton active={filter === 'confirmed'} onClick={() => setFilter('confirmed')}>
            Asisten ({rsvps.filter(r => r.attendance === true).length})
          </FilterButton>
          <FilterButton active={filter === 'declined'} onClick={() => setFilter('declined')}>
            No Asisten ({rsvps.filter(r => r.attendance === false).length})
          </FilterButton>
          <FilterButton active={filter === 'dietary'} onClick={() => setFilter('dietary')}>
            Con Alergias ({rsvps.filter(r => r.dietary_restrictions || r.menu_notes).length})
          </FilterButton>
        </div>

        {/* Guests Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filteredRsvps.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay invitados en esta categoría</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asistencia
                    </th>
                    <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acompañantes
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Menú / Observaciones
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Música
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRsvps.map((rsvp) => (
                    <GuestRow key={rsvp.id} rsvp={rsvp} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Privacy Warning */}
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-800 font-medium">Este panel es privado</p>
            <p className="text-amber-700 text-sm">
              No compartas esta URL con tus invitados. Ellos deben usar el link público de la invitación.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function KPICard({ 
  icon, 
  label, 
  value, 
  color,
  alert = false 
}: { 
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'blue' | 'green' | 'amber' | 'purple';
  alert?: boolean;
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 relative">
      {alert && value > 0 && (
        <span className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
      )}
      <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function FilterButton({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
        active
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}

function GuestRow({ rsvp }: { rsvp: RSVPRecord }) {
  const getStatusBadge = () => {
    if (rsvp.attendance === true) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          Asiste
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        No Asiste
      </span>
    );
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-gray-900">{rsvp.name}</p>
          {rsvp.email && (
            <p className="text-sm text-gray-500">{rsvp.email}</p>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        {getStatusBadge()}
      </td>
      <td className="px-6 py-4 text-center">
        <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 font-medium rounded-full">
          {rsvp.guests_count}
        </span>
      </td>
      <td className="px-6 py-4">
        {(rsvp.dietary_restrictions || rsvp.menu_notes) ? (
          <div className="space-y-1">
            {rsvp.dietary_restrictions && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                <AlertTriangle className="w-3 h-3" />
                {rsvp.dietary_restrictions}
              </span>
            )}
            {rsvp.menu_notes && (
              <p className="text-sm text-gray-600">{rsvp.menu_notes}</p>
            )}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        )}
      </td>
      <td className="px-6 py-4">
        {rsvp.music_suggestion ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
            <Music className="w-3.5 h-3.5 text-purple-500" />
            {rsvp.music_suggestion}
          </span>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        )}
      </td>
    </tr>
  );
}
