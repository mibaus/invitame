'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateInvitation, UpdateInvitationData } from '@/app/actions/updateInvitation';
import { 
  Pencil, X, Save, Loader2, Calendar, MapPin, Gift, Music, User, Users, 
  Quote, UtensilsCrossed, Camera, Sparkles, ChevronRight, Layout, Heart,
  Image as ImageIcon, Type, Clock, Banknote, MessageCircle, Eye, ChevronLeft
} from 'lucide-react';
import { ImageUploader, MultiImageUploader } from '@/app/onboarding/components/ImageUploader';

interface InvitationEditFormProps {
  slug: string;
  initialData: {
    // Basic
    headline: string;
    subtitle?: string;
    mainMessage: string;
    
    // Couple
    person1Name?: string;
    person1FullName?: string;
    person1PhotoUrl?: string;
    person2Name?: string;
    person2FullName?: string;
    person2PhotoUrl?: string;
    coupleHashtag?: string;
    loveStory?: string;
    
    // Multimedia
    coverImage?: string;
    galleryImages?: string[];
    
    // Event
    eventDate: string;
    eventTime: string;
    
    // Venues
    ceremonyName?: string;
    ceremonyAddress?: string;
    ceremonyCity?: string;
    ceremonyTime?: string;
    ceremonyMapsUrl?: string;
    ceremonyWazeUrl?: string;
    ceremonyInstructions?: string;
    ceremonyImageUrl?: string;
    receptionName?: string;
    receptionAddress?: string;
    receptionCity?: string;
    receptionTime?: string;
    receptionMapsUrl?: string;
    receptionWazeUrl?: string;
    receptionInstructions?: string;
    receptionImageUrl?: string;
    hasCeremony?: boolean;
    hasReception?: boolean;
    parkingInfo?: string;
    
    // Dress Code
    dressCode?: string;
    dressCodeDescription?: string;
    
    // Quote
    quote?: string;
    quoteAuthor?: string;
    
    // Gift
    giftRegistryMessage?: string;
    bankName?: string;
    bankAccountHolder?: string;
    bankAccountNumber?: string;
    
    // Music
    spotifyPlaylistUrl?: string;
    musicTrackUrl?: string;
    musicTrackName?: string;
    musicArtist?: string;
    musicAutoplay?: boolean;
    
    // RSVP
    rsvpDeadline?: string;
    maxCompanions?: number;
    allowChildren?: boolean;
    rsvpConfirmationMessage?: string;
    customQuestions?: Array<{ id: string; question: string; type: 'text' | 'boolean' | 'select'; options?: string[]; required?: boolean }>;
    
    // Section Visibility
    showHero?: boolean;
    showCountdown?: boolean;
    showAgenda?: boolean;
    showDressCode?: boolean;
    showGiftRegistry?: boolean;
    showRSVP?: boolean;
    showGallery?: boolean;
    showGuestMessages?: boolean;
    showMusic?: boolean;
  };
  onUpdate?: () => void;
}

type FormSection = 'couple' | 'multimedia' | 'event' | 'venues' | 'details' | 'gift' | 'rsvp' | 'sections';

interface NavItem {
  id: FormSection;
  label: string;
  description: string;
  icon: React.ReactNode;
}

export function InvitationEditForm({ slug, initialData, onUpdate }: InvitationEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<FormSection>('couple');
  const [formData, setFormData] = useState<UpdateInvitationData>(initialData);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sincronizar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialData]);

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

  // Funciones para preguntas personalizadas
  const addCustomQuestion = () => {
    const currentQuestions = formData.customQuestions || [];
    if (currentQuestions.length >= 3) return;
    
    const newQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      question: '',
      type: 'text' as const,
    };
    
    setFormData(prev => ({
      ...prev,
      customQuestions: [...currentQuestions, newQuestion]
    }));
  };

  const updateCustomQuestion = (id: string, question: string) => {
    const updatedQuestions = formData.customQuestions?.map(q => 
      q.id === id ? { ...q, question } : q
    ) || [];
    
    setFormData(prev => ({ ...prev, customQuestions: updatedQuestions }));
  };

  const removeCustomQuestion = (id: string) => {
    const filteredQuestions = formData.customQuestions?.filter(q => q.id !== id) || [];
    setFormData(prev => ({ ...prev, customQuestions: filteredQuestions }));
  };

  const navigationItems: NavItem[] = [
    { id: 'couple', label: 'La Pareja', description: 'Nombres y fotos', icon: <Heart className="w-5 h-5" /> },
    { id: 'multimedia', label: 'Galería', description: 'Fotos y portada', icon: <Camera className="w-5 h-5" /> },
    { id: 'event', label: 'El Evento', description: 'Fecha y detalles', icon: <Calendar className="w-5 h-5" /> },
    { id: 'venues', label: 'Ubicaciones', description: 'Ceremonia y fiesta', icon: <MapPin className="w-5 h-5" /> },
    { id: 'details', label: 'Detalles', description: 'Frases especiales', icon: <Quote className="w-5 h-5" /> },
    { id: 'gift', label: 'Regalos', description: 'Mesa de regalos', icon: <Gift className="w-5 h-5" /> },
    { id: 'rsvp', label: 'RSVP', description: 'Confirmaciones', icon: <Users className="w-5 h-5" /> },
    { id: 'sections', label: 'Visibilidad', description: 'Mostrar/ocultar', icon: <Layout className="w-5 h-5" /> },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center gap-2 px-4 py-2.5 bg-stone-800 text-white text-sm font-medium rounded-xl hover:bg-stone-700 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
      >
        <Pencil className="w-4 h-4 transition-transform group-hover:rotate-12" />
        <span>Personalizar</span>
      </button>
    );
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
          onClick={() => !isSaving && setIsOpen(false)}
        />
        
        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full h-full md:h-[90vh] md:max-w-6xl bg-[#FAFAF8] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Mobile Header - Premium with Bottom Sheet Trigger */}
          <div className="md:hidden flex flex-col bg-white border-b border-stone-100">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
                className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Volver</span>
              </button>
              
              {/* Section Selector Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200 hover:bg-stone-100 transition-colors"
              >
                <span className="text-sm font-medium text-stone-800">
                  {navigationItems.find(item => item.id === activeSection)?.label}
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400 rotate-90" />
              </button>

              <div className="w-16" /> {/* Spacer for alignment */}
            </div>
          </div>

          {/* Mobile Bottom Sheet Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="md:hidden fixed inset-0 bg-stone-900/50 z-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                
                {/* Sheet */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] flex flex-col"
                >
                  {/* Handle */}
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 bg-stone-300 rounded-full" />
                  </div>
                  
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                    <h3 className="font-serif text-lg text-stone-800">Secciones</h3>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Navigation Items */}
                  <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {navigationItems.map((item, index) => (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => {
                          setActiveSection(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-left transition-all ${
                          activeSection === item.id
                            ? 'bg-stone-800 text-white'
                            : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activeSection === item.id ? 'bg-white/20' : 'bg-white'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.label}</p>
                          <p className={`text-xs mt-0.5 ${
                            activeSection === item.id ? 'text-stone-300' : 'text-stone-400'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                        {activeSection === item.id && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </motion.button>
                    ))}
                  </nav>
                  
                  {/* Safe Area Spacer */}
                  <div className="h-safe-bottom" />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Sidebar Navigation - Desktop */}
          <div className="hidden md:flex w-72 bg-white border-r border-stone-100 flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-stone-800 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-serif text-lg text-stone-800 leading-tight">Editor</h2>
                  <p className="text-xs text-stone-400">Personaliza tu invitación</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {navigationItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 group ${
                    activeSection === item.id
                      ? 'bg-stone-800 text-white shadow-lg shadow-stone-800/20'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className={`mt-0.5 transition-colors ${
                    activeSection === item.id ? 'text-white' : 'text-stone-400 group-hover:text-stone-600'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${activeSection === item.id ? 'text-white' : 'text-stone-800'}`}>
                      {item.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${activeSection === item.id ? 'text-stone-300' : 'text-stone-400'}`}>
                      {item.description}
                    </p>
                  </div>
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-1.5 h-1.5 rounded-full bg-white mt-2"
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-stone-100">
              <button
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-50 rounded-xl transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center justify-between px-8 py-5 bg-white/50 backdrop-blur-sm border-b border-stone-100">
              <div>
                <h1 className="font-serif text-xl text-stone-800">
                  {navigationItems.find(item => item.id === activeSection)?.label}
                </h1>
                <p className="text-sm text-stone-400 mt-0.5">
                  {navigationItems.find(item => item.id === activeSection)?.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="group flex items-center gap-2 px-6 py-2.5 bg-stone-800 text-white text-sm font-medium rounded-xl hover:bg-stone-700 transition-all shadow-lg shadow-stone-800/20 hover:shadow-xl hover:shadow-stone-800/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span>Guardar cambios</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-3 md:p-8 pb-24 md:pb-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-3xl mx-auto space-y-4 md:space-y-6">
            
            {/* Couple Section */}
            {activeSection === 'couple' && (
              <div className="space-y-8">
                {/* Main Title */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <Type className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Título Principal</label>
                      <p className="text-xs text-stone-400">El nombre que aparecerá en la portada</p>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={formData.headline || ''}
                    onChange={(e) => updateField('headline', e.target.value)}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all text-lg font-serif"
                    placeholder="María & Carlos"
                  />
                </div>

                {/* Couple Names */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Los Novios</label>
                      <p className="text-xs text-stone-400">Nombres de la pareja</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Nombre 1</label>
                      <input
                        type="text"
                        value={formData.person1Name || ''}
                        onChange={(e) => updateField('person1Name', e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                        placeholder="María"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Nombre 2</label>
                      <input
                        type="text"
                        value={formData.person2Name || ''}
                        onChange={(e) => updateField('person2Name', e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                        placeholder="Carlos"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Multimedia Section */}
            {activeSection === 'multimedia' && (
              <div className="space-y-6">
                {/* Cover Image */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Foto de Portada</label>
                      <p className="text-xs text-stone-400">La imagen principal de tu invitación</p>
                    </div>
                  </div>
                  <ImageUploader 
                    value={formData.coverImage} 
                    onChange={(url) => updateField('coverImage', url)}
                    hint="Esta foto aparecerá en la portada de tu invitación"
                  />
                </div>

                {/* Couple Photos */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Fotos de la Pareja</label>
                      <p className="text-xs text-stone-400">Imágenes para la sección de presentación</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ImageUploader 
                      label={formData.person1Name || 'Persona 1'}
                      value={formData.person1PhotoUrl} 
                      onChange={(url) => updateField('person1PhotoUrl', url)}
                    />
                    <ImageUploader 
                      label={formData.person2Name || 'Persona 2'}
                      value={formData.person2PhotoUrl} 
                      onChange={(url) => updateField('person2PhotoUrl', url)}
                    />
                  </div>
                </div>

                {/* Gallery */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <Layout className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Galería de Fotos</label>
                      <p className="text-xs text-stone-400">Hasta 15 fotos de tu historia juntos</p>
                    </div>
                  </div>
                  <MultiImageUploader
                    folder="invitations"
                    currentImages={formData.galleryImages || []}
                    onUpload={(urls) => setFormData(prev => ({ ...prev, galleryImages: urls }))}
                    maxImages={15}
                    label="Galería"
                    hint="Estas fotos aparecerán en la sección de galería"
                  />
                </div>
              </div>
            )}

            {/* Event Section */}
            {activeSection === 'event' && (
              <div className="space-y-6">
                {/* Main Message */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Mensaje Principal</label>
                      <p className="text-xs text-stone-400">El texto de bienvenida de tu invitación</p>
                    </div>
                  </div>
                  <textarea
                    value={formData.mainMessage || ''}
                    onChange={(e) => updateField('mainMessage', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all resize-none"
                    placeholder="Con mucha alegría queremos invitarlos a celebrar con nosotros..."
                  />
                </div>

                {/* Date and Time */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Fecha y Hora</label>
                      <p className="text-xs text-stone-400">Cuándo será el evento</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Fecha</label>
                      <input
                        type="date"
                        value={formData.eventDate || ''}
                        onChange={(e) => updateField('eventDate', e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Hora</label>
                      <input
                        type="time"
                        value={formData.eventTime || ''}
                        onChange={(e) => updateField('eventTime', e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Dress Code */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Código de Vestimenta</label>
                      <p className="text-xs text-stone-400">Qué deben usar los invitados</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <select
                      value={formData.dressCode || ''}
                      onChange={(e) => updateField('dressCode', e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                    >
                      <option value="">Seleccionar estilo...</option>
                      <option value="formal">Formal</option>
                      <option value="semi-formal">Semi-formal</option>
                      <option value="casual-elegante">Casual Elegante</option>
                      <option value="casual">Casual</option>
                      <option value="themed">Temática Especial</option>
                    </select>
                    <textarea
                      value={formData.dressCodeDescription || ''}
                      onChange={(e) => updateField('dressCodeDescription', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all resize-none"
                      placeholder="Descripción adicional (opcional)..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Venues Section */}
            {activeSection === 'venues' && (
              <div className="space-y-6">
                {/* Ceremony Toggle */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <div className="relative flex items-center mt-1">
                      <input
                        type="checkbox"
                        checked={formData.hasCeremony || false}
                        onChange={(e) => updateField('hasCeremony', e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-11 h-6 bg-stone-200 rounded-full peer-checked:bg-stone-800 transition-colors" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-sm font-medium text-stone-800">Ceremonia</span>
                      <p className="text-xs text-stone-400 mt-0.5">¿Tendrán ceremonia religiosa o civil?</p>
                    </div>
                  </label>

                  {formData.hasCeremony && (
                    <div className="mt-6 pt-6 border-t border-stone-100 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Nombre del lugar</label>
                          <input
                            type="text"
                            value={formData.ceremonyName || ''}
                            onChange={(e) => updateField('ceremonyName', e.target.value)}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                            placeholder="Iglesia San..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Horario</label>
                          <input
                            type="time"
                            value={formData.ceremonyTime || ''}
                            onChange={(e) => updateField('ceremonyTime', e.target.value)}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Dirección</label>
                        <input
                          type="text"
                          value={formData.ceremonyAddress || ''}
                          onChange={(e) => updateField('ceremonyAddress', e.target.value)}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                          placeholder="Calle 123, Ciudad"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Link Google Maps</label>
                        <input
                          type="url"
                          value={formData.ceremonyMapsUrl || ''}
                          onChange={(e) => updateField('ceremonyMapsUrl', e.target.value)}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                          placeholder="https://maps.google.com/..."
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Reception Toggle */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <div className="relative flex items-center mt-1">
                      <input
                        type="checkbox"
                        checked={formData.hasReception || false}
                        onChange={(e) => updateField('hasReception', e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-11 h-6 bg-stone-200 rounded-full peer-checked:bg-stone-800 transition-colors" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-sm font-medium text-stone-800">Recepción / Fiesta</span>
                      <p className="text-xs text-stone-400 mt-0.5">¿Tendrán celebración después?</p>
                    </div>
                  </label>

                  {formData.hasReception && (
                    <div className="mt-6 pt-6 border-t border-stone-100 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Nombre del lugar</label>
                          <input
                            type="text"
                            value={formData.receptionName || ''}
                            onChange={(e) => updateField('receptionName', e.target.value)}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                            placeholder="Salón..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Horario</label>
                          <input
                            type="time"
                            value={formData.receptionTime || ''}
                            onChange={(e) => updateField('receptionTime', e.target.value)}
                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Dirección</label>
                        <input
                          type="text"
                          value={formData.receptionAddress || ''}
                          onChange={(e) => updateField('receptionAddress', e.target.value)}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                          placeholder="Calle 456, Ciudad"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Link Google Maps</label>
                        <input
                          type="url"
                          value={formData.receptionMapsUrl || ''}
                          onChange={(e) => updateField('receptionMapsUrl', e.target.value)}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                          placeholder="https://maps.google.com/..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Details Section */}
            {activeSection === 'details' && (
              <div className="space-y-6">
                {/* Quote */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <Quote className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Frase Especial</label>
                      <p className="text-xs text-stone-400">Una cita o mensaje significativo</p>
                    </div>
                  </div>
                  <textarea
                    value={formData.quote || ''}
                    onChange={(e) => updateField('quote', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all resize-none italic font-serif"
                    placeholder="El amor es paciente, es bondadoso..."
                  />
                  <div className="mt-4 space-y-2">
                    <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Autor o referencia</label>
                    <input
                      type="text"
                      value={formData.quoteAuthor || ''}
                      onChange={(e) => updateField('quoteAuthor', e.target.value)}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                      placeholder="1 Corintios 13:4-8"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Gift Section */}
            {activeSection === 'gift' && (
              <div className="space-y-6">
                {/* Gift Message */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <Gift className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Mensaje de Regalos</label>
                      <p className="text-xs text-stone-400">Cómo prefieren recibir los regalos</p>
                    </div>
                  </div>
                  <textarea
                    value={formData.giftRegistryMessage || ''}
                    onChange={(e) => updateField('giftRegistryMessage', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all resize-none"
                    placeholder="Su presencia es nuestro mejor regalo..."
                  />
                </div>

                {/* Bank Details */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <Banknote className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Datos Bancarios</label>
                      <p className="text-xs text-stone-400">Para transferencias (opcional)</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Banco</label>
                        <input
                          type="text"
                          value={formData.bankName || ''}
                          onChange={(e) => updateField('bankName', e.target.value)}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                          placeholder="Banco Nación"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Titular</label>
                        <input
                          type="text"
                          value={formData.bankAccountHolder || ''}
                          onChange={(e) => updateField('bankAccountHolder', e.target.value)}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                          placeholder="Nombre completo"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">CBU / Alias</label>
                      <input
                        type="text"
                        value={formData.bankAccountNumber || ''}
                        onChange={(e) => updateField('bankAccountNumber', e.target.value)}
                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all font-mono text-sm"
                        placeholder="0000000000000000000000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RSVP Section */}
            {activeSection === 'rsvp' && (
              <div className="space-y-6">
                {/* RSVP Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Configuración RSVP</label>
                      <p className="text-xs text-stone-400">Opciones de confirmación</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Fecha límite</label>
                        <input
                          type="date"
                          value={formData.rsvpDeadline || ''}
                          onChange={(e) => updateField('rsvpDeadline', e.target.value)}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-500 uppercase tracking-wider">Máx. acompañantes</label>
                        <select
                          value={formData.maxCompanions || 2}
                          onChange={(e) => updateField('maxCompanions', parseInt(e.target.value))}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                        >
                          {[0, 1, 2, 3, 4, 5, 6].map(n => (
                            <option key={n} value={n}>{n}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.allowChildren || false}
                          onChange={(e) => updateField('allowChildren', e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-11 h-6 bg-stone-200 rounded-full peer-checked:bg-stone-800 transition-colors" />
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                      </div>
                      <span className="text-sm text-stone-700">Permitir confirmar niños</span>
                    </label>
                  </div>
                </div>

                {/* Confirmation Message */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-stone-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-800">Mensaje de Confirmación</label>
                      <p className="text-xs text-stone-400">Lo que verán tras confirmar</p>
                    </div>
                  </div>
                  <textarea
                    value={formData.rsvpConfirmationMessage || ''}
                    onChange={(e) => updateField('rsvpConfirmationMessage', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all resize-none"
                    placeholder="¡Gracias por confirmar! Nos vemos pronto..."
                  />
                </div>

                {/* Custom Questions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-stone-600" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-stone-800">Preguntas Personalizadas</label>
                        <p className="text-xs text-stone-400">Hasta 3 preguntas para invitados</p>
                      </div>
                    </div>
                    <button
                      onClick={addCustomQuestion}
                      disabled={(formData.customQuestions?.length || 0) >= 3}
                      className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      + Agregar
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.customQuestions?.map((q, index) => (
                      <div key={q.id} className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center text-xs font-medium text-stone-600">{index + 1}</span>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => updateCustomQuestion(q.id, e.target.value)}
                          placeholder={`Escribe tu pregunta ${index + 1}...`}
                          className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-800 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:bg-white transition-all"
                        />
                        <button
                          onClick={() => removeCustomQuestion(q.id)}
                          className="p-2 text-stone-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar pregunta"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {(!formData.customQuestions || formData.customQuestions.length === 0) && (
                      <div className="text-center py-8 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                        <p className="text-sm text-stone-400">No hay preguntas personalizadas</p>
                        <p className="text-xs text-stone-300 mt-1">Agrega preguntas para conocer más de tus invitados</p>
                      </div>
                    )}
                  </div>

                  {(formData.customQuestions?.length || 0) > 0 && (
                    <div className="mt-4 pt-4 border-t border-stone-100">
                      <p className="text-xs text-stone-400">
                        {formData.customQuestions?.length} de 3 preguntas configuradas
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sections Visibility Section */}
            {activeSection === 'sections' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 mb-4">
                  <h3 className="text-sm font-medium text-stone-800 mb-1">Visibilidad de Secciones</h3>
                  <p className="text-xs text-stone-500">Activa o desactiva las secciones que se mostrarán en tu invitación</p>
                </div>

                {/* Hero / Portada */}
                <label className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 flex items-center gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showHero !== false}
                      onChange={(e) => updateField('showHero', e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-stone-300 rounded bg-white peer-checked:bg-stone-800 peer-checked:border-stone-800 transition-all flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-stone-700">Portada con foto principal</span>
                    <p className="text-xs text-stone-500">Muestra la imagen de portada con los nombres</p>
                  </div>
                </label>

                {/* Cuenta Regresiva */}
                <label className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 flex items-center gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showCountdown !== false}
                      onChange={(e) => updateField('showCountdown', e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-stone-300 rounded bg-white peer-checked:bg-stone-800 peer-checked:border-stone-800 transition-all flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-stone-700">Cuenta regresiva</span>
                    <p className="text-xs text-stone-500">Muestra los días restantes hasta el evento</p>
                  </div>
                </label>

                {/* Galería */}
                <label className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 flex items-center gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showGallery !== false}
                      onChange={(e) => updateField('showGallery', e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-stone-300 rounded bg-white peer-checked:bg-stone-800 peer-checked:border-stone-800 transition-all flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-stone-700">Galería de fotos</span>
                    <p className="text-xs text-stone-500">Muestra la galería de fotos del evento</p>
                  </div>
                </label>

                {/* Dress Code */}
                <label className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 flex items-center gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showDressCode !== false}
                      onChange={(e) => updateField('showDressCode', e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-stone-300 rounded bg-white peer-checked:bg-stone-800 peer-checked:border-stone-800 transition-all flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-stone-700">Código de vestimenta</span>
                    <p className="text-xs text-stone-500">Muestra la sección de dress code</p>
                  </div>
                </label>

                {/* Mesa de Regalos */}
                <label className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 flex items-center gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showGiftRegistry !== false}
                      onChange={(e) => updateField('showGiftRegistry', e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-stone-300 rounded bg-white peer-checked:bg-stone-800 peer-checked:border-stone-800 transition-all flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-stone-700">Mesa de regalos</span>
                    <p className="text-xs text-stone-500">Muestra la sección de regalos y datos bancarios</p>
                  </div>
                </label>

                {/* RSVP */}
                <label className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 flex items-center gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showRSVP !== false}
                      onChange={(e) => updateField('showRSVP', e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-stone-300 rounded bg-white peer-checked:bg-stone-800 peer-checked:border-stone-800 transition-all flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-stone-700">Confirmación de asistencia</span>
                    <p className="text-xs text-stone-500">Permite a los invitados confirmar asistencia</p>
                  </div>
                </label>

                {/* Libro de Visitas */}
                <label className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 flex items-center gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showGuestMessages || false}
                      onChange={(e) => updateField('showGuestMessages', e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-stone-300 rounded bg-white peer-checked:bg-stone-800 peer-checked:border-stone-800 transition-all flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-stone-700">Libro de visitas</span>
                    <p className="text-xs text-stone-500">Permite a los invitados dejar mensajes</p>
                  </div>
                </label>

                {/* Música */}
                <label className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 flex items-center gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showMusic !== false}
                      onChange={(e) => updateField('showMusic', e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-stone-300 rounded bg-white peer-checked:bg-stone-800 peer-checked:border-stone-800 transition-all flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-stone-700">Música</span>
                    <p className="text-xs text-stone-500">Muestra el reproductor de música</p>
                  </div>
                </label>

                {/* Agenda */}
                <label className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 flex items-center gap-3 cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showAgenda !== false}
                      onChange={(e) => updateField('showAgenda', e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 border-2 border-stone-300 rounded bg-white peer-checked:bg-stone-800 peer-checked:border-stone-800 transition-all flex items-center justify-center">
                      <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-stone-700">Agenda del día</span>
                    <p className="text-xs text-stone-500">Muestra la línea de tiempo con los eventos</p>
                  </div>
                </label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
            </div>

            {/* Mobile Floating Save Button */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-stone-100/80 to-transparent pointer-events-none">
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-stone-800 text-white text-sm font-medium rounded-2xl shadow-xl shadow-stone-800/30 hover:bg-stone-700 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 pointer-events-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar cambios</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile bottom safe area spacer */}
            <div className="md:hidden h-20" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
