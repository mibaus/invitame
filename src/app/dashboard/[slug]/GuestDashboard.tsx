'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Users, Download, ExternalLink, RefreshCw } from 'lucide-react';
import type { DashboardData, RSVPRecord } from '@/app/actions/dashboard';
import { getRSVPs } from '@/app/actions/dashboard';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { InvitationEditForm } from './InvitationEditForm';
import { ExportModal } from '@/components/dashboard/ExportModal';
import { CateringSummaryWidget } from '@/components/dashboard/CateringSummaryWidget';
import { CateringExportModal } from '@/components/dashboard/CateringExportModal';
import { WhatsAppShare } from '@/components/dashboard/WhatsAppShare';

interface GuestDashboardProps {
  data: DashboardData;
}

export function GuestDashboard({ data }: GuestDashboardProps) {
  const { invitation } = data;
  const [rsvps, setRsvps] = useState(data.rsvps);
  const [stats, setStats] = useState(data.stats);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCateringModalOpen, setIsCateringModalOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');

  // Función para actualizar stats basado en RSVPs
  const updateStats = useCallback((rsvpList: RSVPRecord[]) => {
    const confirmedRsvps = rsvpList.filter(r => r.attendance === true);
    const declinedRsvps = rsvpList.filter(r => r.attendance === false);
    const specialMenus = rsvpList.filter(r => r.dietary_restrictions || r.menu_notes).length;
    const musicSuggestions = rsvpList.filter(r => r.music_suggestion).length;

    return {
      totalGuests: confirmedRsvps.reduce((sum, r) => sum + r.guests_count, 0),
      totalFamilies: rsvpList.length,
      confirmed: confirmedRsvps.reduce((sum, r) => sum + r.guests_count, 0),
      declined: declinedRsvps.length,
      specialMenus,
      musicSuggestions,
    };
  }, []);

  // Carga inicial y fallback para modo dev
  const refreshRSVPs = useCallback(async () => {
    setIsRefreshing(true);
    
    try {
      const result = await getRSVPs(invitation.id);
      if (result.success && result.rsvps) {
        setRsvps(result.rsvps);
        if (result.stats) setStats(result.stats);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error refreshing RSVPs:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [invitation.id]);

  // Supabase Realtime subscription
  useEffect(() => {
    // Si Supabase no está configurado (modo dev), solo hacemos carga inicial
    if (!isSupabaseConfigured()) {
      refreshRSVPs();
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      refreshRSVPs();
      return;
    }

    // Carga inicial
    refreshRSVPs();

    // Suscribirse a cambios en la tabla rsvps para esta invitación
    const channel = supabase
      .channel(`rsvps-${invitation.id}`)
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'rsvps',
          filter: `invitation_id=eq.${invitation.id}`,
        },
        (payload) => {
          console.log('Realtime RSVP update:', payload);
          console.log('Event type:', payload.eventType);
          console.log('New data:', payload.new);
          console.log('Old data:', payload.old);
          
          // Helper para mapear datos crudos a RSVPRecord
          const mapToRSVPRecord = (data: any): RSVPRecord => ({
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            status: data.status === 'pending' ? 'confirmed' : data.status,
            attendance: data.attendance === null ? true : data.attendance,
            guests_count: data.guests_count || 1,
            children_count: data.children_count || 0,
            dietary_restrictions: data.dietary_restrictions,
            menu_notes: data.menu_notes,
            music_suggestion: data.music_suggestion,
            custom_answers: data.custom_answers,
            message: data.message,
            created_at: data.created_at,
          });
          
          // Manejar diferentes tipos de eventos
          if (payload.eventType === 'INSERT') {
            const newRsvp = mapToRSVPRecord(payload.new);
            console.log('Mapped new RSVP:', newRsvp);
            setRsvps(prev => {
              // Evitar duplicados
              if (prev.some(r => r.id === newRsvp.id)) {
                console.log('Duplicate RSVP, skipping');
                return prev;
              }
              const updated = [newRsvp, ...prev];
              console.log('Updated RSVP list:', updated);
              setStats(updateStats(updated));
              return updated;
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedRsvp = mapToRSVPRecord(payload.new);
            console.log('Mapped updated RSVP:', updatedRsvp);
            setRsvps(prev => {
              const updated = prev.map(r => 
                r.id === updatedRsvp.id ? updatedRsvp : r
              );
              setStats(updateStats(updated));
              return updated;
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedRsvp = payload.old as RSVPRecord;
            console.log('Deleted RSVP:', deletedRsvp);
            setRsvps(prev => {
              const updated = prev.filter(r => r.id !== deletedRsvp.id);
              setStats(updateStats(updated));
              return updated;
            });
          }
          setLastUpdated(new Date());
        }
      )
      .subscribe((status, err) => {
        console.log('Realtime subscription status:', status);
        if (err) {
          console.error('Realtime subscription error:', err);
        }
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to realtime updates');
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('disconnected');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invitation.id, refreshRSVPs, updateStats]);

  const content = invitation.content || {};
  
  console.log('DEBUG - invitation:', invitation);
  console.log('DEBUG - content:', content);
  
  const couple = content.couple || {};
  const person1 = couple.person1 || {};
  const person2 = couple.person2 || {};

  const coupleNames = person1.name && person2.name 
    ? `${person1.name} & ${person2.name}` 
    : person1.name || person2.name || 'Los novios';

  const editData = {
    // Basic
    headline: content.headline || '',
    subtitle: content.subtitle || '',
    mainMessage: content.main_message || '',
    
    // Couple
    person1Name: person1.name || '',
    person1FullName: person1.full_name || '',
    person1PhotoUrl: person1.photo_url || '',
    person2Name: person2.name || '',
    person2FullName: person2.full_name || '',
    person2PhotoUrl: person2.photo_url || '',
    coupleHashtag: couple.hashtag || '',
    loveStory: couple.love_story || '',
    
    // Multimedia
    coverImage: content.cover_image || '',
    galleryImages: content.gallery_images || [],
    
    // Event
    eventDate: (content.logistics?.event_date || '').split('T')[0],
    eventTime: (content.logistics?.event_date || '').split('T')[1]?.slice(0, 5) || '',
    
    // Venues
    ceremonyName: content.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.name || '',
    ceremonyAddress: content.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.address || '',
    ceremonyCity: content.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.city || '',
    ceremonyTime: content.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.time || '',
    ceremonyMapsUrl: content.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.google_maps_url || '',
    ceremonyWazeUrl: content.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.waze_url || '',
    ceremonyInstructions: content.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.instructions || '',
    ceremonyImageUrl: content.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.image_url || '',
    receptionName: content.logistics?.venues?.find((v: any) => v.type === 'reception')?.name || '',
    receptionAddress: content.logistics?.venues?.find((v: any) => v.type === 'reception')?.address || '',
    receptionCity: content.logistics?.venues?.find((v: any) => v.type === 'reception')?.city || '',
    receptionTime: content.logistics?.venues?.find((v: any) => v.type === 'reception')?.time || '',
    receptionMapsUrl: content.logistics?.venues?.find((v: any) => v.type === 'reception')?.google_maps_url || '',
    receptionWazeUrl: content.logistics?.venues?.find((v: any) => v.type === 'reception')?.waze_url || '',
    receptionInstructions: content.logistics?.venues?.find((v: any) => v.type === 'reception')?.instructions || '',
    receptionImageUrl: content.logistics?.venues?.find((v: any) => v.type === 'reception')?.image_url || '',
    hasCeremony: !!content.logistics?.venues?.find((v: any) => v.type === 'ceremony')?.name,
    hasReception: !!content.logistics?.venues?.find((v: any) => v.type === 'reception')?.name,
    parkingInfo: content.logistics?.parking_info || '',
    
    // Dress Code
    dressCode: content.logistics?.dress_code?.code || '',
    dressCodeDescription: content.logistics?.dress_code?.description || '',
    
    // Quote
    quote: content.quote?.text || '',
    quoteAuthor: content.quote?.author || '',
    
    // Gift
    giftRegistryMessage: content.features?.gift_registry?.message || '',
    bankName: content.features?.gift_registry?.bank_details?.bank_name || '',
    bankAccountHolder: content.features?.gift_registry?.bank_details?.account_holder || '',
    bankAccountNumber: content.features?.gift_registry?.bank_details?.account_number || '',
    
    // Music
    spotifyPlaylistUrl: content.features?.music?.spotify_playlist_url || '',
    musicTrackUrl: content.features?.music?.track_url || '',
    musicTrackName: content.features?.music?.track_name || '',
    musicArtist: content.features?.music?.artist || '',
    musicAutoplay: content.features?.music?.autoplay || false,
    
    // RSVP
    rsvpDeadline: content.features?.rsvp?.deadline || '',
    maxCompanions: content.features?.rsvp?.max_companions || 2,
    allowChildren: content.features?.rsvp?.allow_children || false,
    rsvpConfirmationMessage: content.features?.rsvp?.confirmation_message || '',
    customQuestions: content.features?.rsvp?.custom_questions || [],
  };
  
  console.log('DEBUG - editData:', editData);

  const confirmed = rsvps.filter(r => r.attendance === true).length;
  const declined = rsvps.filter(r => r.attendance === false).length;
  const totalGuests = rsvps.reduce((sum, r) => sum + (r.guests_count || 1), 0);

  const handleOpenCateringExport = () => {
    if (rsvps.length === 0) {
      alert('No hay invitados para exportar');
      return;
    }
    setIsCateringModalOpen(true);
  };

  const handleOpenExport = () => {
    if (rsvps.length === 0) {
      alert('No hay invitados para exportar');
      return;
    }
    setIsExportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Mobile Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-light tracking-wide text-stone-800">
                VOWS <span style={{ color: '#a27b5c' }}>.</span>
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                {person1.name || person2.name 
                  ? `${person1.name || ''} & ${person2.name || ''}` 
                  : 'Tu Boda'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 text-[10px] text-stone-400">
                <span>{rsvps.length} respuestas · {totalGuests} invitados</span>
                {connectionStatus === 'connected' && (
                  <span className="flex items-center gap-1 text-emerald-500" title="Conectado en tiempo real">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    En vivo
                  </span>
                )}
                <button
                  onClick={refreshRSVPs}
                  disabled={isRefreshing}
                  className="p-1 hover:bg-stone-100 rounded transition-colors disabled:opacity-50"
                  title="Actualizar ahora"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <InvitationEditForm 
                slug={invitation.slug} 
                initialData={editData}
                onUpdate={() => window.location.reload()}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Confirmados</p>
            <p className="text-2xl font-serif text-stone-800 mt-1">{confirmed}</p>
            <div className="mt-2 h-1 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${rsvps.length ? (confirmed / rsvps.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">No asisten</p>
            <p className="text-2xl font-serif text-stone-800 mt-1">{declined}</p>
            <div className="mt-2 h-1 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-400 rounded-full"
                style={{ width: `${rsvps.length ? (declined / rsvps.length) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">Total</p>
            <p className="text-2xl font-serif text-stone-800 mt-1">{rsvps.length}</p>
            <p className="text-xs text-stone-400 mt-2">personas</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={handleOpenExport}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-stone-200 text-stone-600 rounded-xl text-[11px] font-medium hover:bg-stone-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>
          
          <button
            onClick={handleOpenCateringExport}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-transparent border border-[#A27B5C] text-[#A27B5C] rounded-xl text-[11px] font-medium hover:bg-[#A27B5C] hover:text-white transition-all duration-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Catering</span>
          </button>
          
          {invitation.is_active && (
            <Link
              href={`/${invitation.slug}`}
              target="_blank"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-stone-800 text-white rounded-xl text-[11px] font-medium hover:bg-stone-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver</span>
            </Link>
          )}
          
          <WhatsAppShare
            invitationSlug={invitation.slug}
            coupleNames={coupleNames}
            eventDate={content.logistics?.event_date}
          />
        </div>

        {/* Catering Summary Widget */}
        <CateringSummaryWidget rsvps={rsvps} />

        {/* Guests List */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="px-4 py-4 border-b border-stone-100">
            <p className="text-xs font-medium text-stone-500">
              {rsvps.length === 0 ? 'Sin invitados aún' : `${rsvps.length} invitados`}
            </p>
          </div>

          {rsvps.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-stone-300" />
              </div>
              <p className="text-stone-600 font-medium">Aún no hay respuestas</p>
              <p className="text-xs text-stone-400 mt-1">
                Los invitados aparecerán aquí cuando confirmen
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {rsvps.map((rsvp) => (
                <div key={rsvp.id} className="px-4 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
                        <span className="font-serif text-sm text-stone-600">
                          {rsvp.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-stone-800 text-sm">{rsvp.name}</p>
                        {/* Critical Allergy Dot */}
                        {(() => {
                          const restrictions = rsvp.dietary_restrictions;
                          let isAllergic = false;
                          
                          if (typeof restrictions === 'object' && restrictions !== null) {
                            isAllergic = restrictions.allergic;
                          } else if (typeof restrictions === 'string' && restrictions) {
                            isAllergic = restrictions.toLowerCase().includes('alérg');
                          }
                          
                          return isAllergic ? (
                            <div className="w-1 h-1 rounded-full bg-[#A27B5C]"></div>
                          ) : null;
                        })()}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${
                      rsvp.attendance === true 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-rose-50 text-rose-500'
                    }`}>
                      {rsvp.attendance === true ? 'Asiste' : 'No asiste'}
                    </span>
                  </div>
                  
                  {/* Additional details */}
                  {(rsvp.music_suggestion || rsvp.message || (rsvp.custom_answers && Object.keys(rsvp.custom_answers).length > 0)) && (
                    <div className="mt-3 space-y-2 pl-13 ml-13">
                      {rsvp.music_suggestion && (
                        <p className="text-xs text-stone-600 flex items-center gap-1.5">
                          <span className="text-amber-500">♪</span>
                          <span className="font-medium">Música:</span> {rsvp.music_suggestion}
                        </p>
                      )}
                  {/* Guest Info */}
                  <p className="text-xs text-stone-400 mb-3">
                    {rsvp.guests_count > 1 ? `${rsvp.guests_count} personas` : '1 persona'}
                    {rsvp.children_count ? ` · ${rsvp.children_count} niños` : ''}
                  </p>
                  
                  {/* Dietary Restriction Tags */}
                  {(() => {
                    const restrictions = rsvp.dietary_restrictions;
                    let restrictionTags = [];
                    let isAllergic = false;
                    
                    if (typeof restrictions === 'object' && restrictions !== null) {
                      // New checkbox format
                      if (restrictions.celiac) restrictionTags.push('Celíaco');
                      if (restrictions.vegan) restrictionTags.push('Vegano');
                      if (restrictions.vegetarian) restrictionTags.push('Vegetariano');
                      if (restrictions.allergic) {
                        restrictionTags.push('Alérgico');
                        isAllergic = true;
                      }
                      if (restrictions.other) {
                        restrictionTags.push('Otros');
                        if (restrictions.other_text) {
                          restrictionTags.push(restrictions.other_text);
                        }
                      }
                    } else if (typeof restrictions === 'string' && restrictions) {
                      // Legacy text format
                      restrictionTags.push(restrictions);
                      isAllergic = restrictions.toLowerCase().includes('alérg');
                    }
                    
                    // Add menu notes as tag
                    if (rsvp.menu_notes) {
                      restrictionTags.push(rsvp.menu_notes);
                    }
                    
                    return restrictionTags.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {restrictionTags.map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-block px-2 py-1 bg-[#F9F9F9] border border-stone-200 rounded text-xs text-stone-600 font-light"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null;
                  })()}
                      
                      {/* Custom Answers - Displayed aesthetically */}
                      {rsvp.custom_answers && Object.keys(rsvp.custom_answers).length > 0 && (
                        <div className="mt-3 pt-2 border-t border-stone-100">
                          <p className="text-[10px] uppercase tracking-wider text-stone-400 font-medium mb-2">
                            Respuestas personalizadas
                          </p>
                          <div className="space-y-1.5">
                            {Object.entries(rsvp.custom_answers).map(([key, value]) => {
                              // Find the corresponding question from customQuestions
                              const questionDef = editData.customQuestions?.find((q: any) => q.id === key);
                              const questionText = questionDef?.question || key.replace(/_/g, ' ').replace(/-/g, ' ');
                              
                              return (
                                <div key={key} className="flex items-start gap-2 text-xs">
                                  <span className="text-stone-400">•</span>
                                  <span className="text-stone-500 font-medium">
                                    {questionText}:
                                  </span>
                                  <span className="text-stone-700">
                                    {typeof value === 'string' ? value : JSON.stringify(value)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {rsvp.message && (
                        <p className="text-xs text-stone-500 italic mt-2 border-l-2 border-stone-200 pl-2">
                          "{rsvp.message}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-stone-400 py-4">
          Panel privado · No compartir este enlace
        </p>
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={{ ...data, rsvps, stats }}
      />
      
      {/* Catering Export Modal */}
      <CateringExportModal
        isOpen={isCateringModalOpen}
        onClose={() => setIsCateringModalOpen(false)}
        rsvps={rsvps}
      />
    </div>
  );
}
