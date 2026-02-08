'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Copy, Check, X, Sparkles, RotateCcw } from 'lucide-react';

interface WhatsAppShareProps {
  invitationSlug: string;
  coupleNames: string;
  eventDate?: string;
}

export function WhatsAppShare({ invitationSlug, coupleNames, eventDate }: WhatsAppShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const storageKey = `whatsapp-message-${invitationSlug}`;

  const invitationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${invitationSlug}` 
    : `/${invitationSlug}`;

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `${numbers.slice(0, 2)} ${numbers.slice(2, 6)} ${numbers.slice(6)}`;
    return `${numbers.slice(0, 2)} ${numbers.slice(2, 6)} ${numbers.slice(6, 10)}`;
  };

  const getRawPhoneNumber = (formatted: string) => {
    return formatted.replace(/\D/g, '');
  };

  const getDefaultMessage = () => {
    const dateStr = eventDate 
      ? new Date(eventDate).toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })
      : '';
    
    let message = `¡Hola{{NOMBRE}}! 🎉\n\n`;
    message += `${coupleNames} te invitan a celebrar su boda`;
    if (dateStr) message += ` el ${dateStr}`;
    message += `.\n\n`;
    message += `Aquí está tu invitación personalizada:\n${invitationUrl}\n\n`;
    message += `Por favor, confirma tu asistencia respondiendo en el enlace. ¡Te esperamos! 💕`;
    
    return message;
  };

  const [customMessage, setCustomMessage] = useState(getDefaultMessage());

  // Load saved message from localStorage when modal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCustomMessage(saved);
      } else {
        setCustomMessage(getDefaultMessage());
      }
    }
  }, [isOpen, invitationSlug, coupleNames, eventDate]);

  // Save message to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && customMessage) {
      localStorage.setItem(storageKey, customMessage);
      setIsSaved(true);
      const timer = setTimeout(() => setIsSaved(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [customMessage, storageKey]);

  // Update message when guest name changes (replace {{NOMBRE}} placeholder)
  useEffect(() => {
    const placeholder = '{{NOMBRE}}';
    const replacement = guestName ? ` ${guestName}` : '';
    
    setCustomMessage(prev => {
      if (prev.includes(placeholder)) {
        return prev.replace(placeholder, replacement);
      }
      // If the message was already edited, don't auto-replace
      return prev;
    });
  }, [guestName]);

  const handleResetMessage = () => {
    setCustomMessage(getDefaultMessage());
  };

  const getWhatsAppUrl = () => {
    const rawPhone = getRawPhoneNumber(phoneNumber);
    if (!rawPhone) return '';
    
    const message = encodeURIComponent(customMessage);
    return `https://wa.me/${rawPhone}?text=${message}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (getRawPhoneNumber(formatted).length <= 10) {
      setPhoneNumber(formatted);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Silently fail
    }
  };

  const handleSend = () => {
    const rawPhone = getRawPhoneNumber(phoneNumber);
    if (rawPhone.length >= 10) {
      setIsSending(true);
      setTimeout(() => {
        window.open(getWhatsAppUrl(), '_blank');
        setIsSending(false);
        setPhoneNumber('');
        setGuestName('');
      }, 400);
    }
  };

  const rawPhone = getRawPhoneNumber(phoneNumber);
  const isValidPhone = rawPhone.length >= 10;

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-[11px] font-medium hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.1 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div 
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-stone-900/20 overflow-hidden pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 p-6">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-white">
                        Compartir invitación
                      </h3>
                      <p className="text-xs text-emerald-100">
                        Envía por WhatsApp a tus invitados
                      </p>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                  {/* Guest Name Input */}
                  <div>
                    <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
                      Nombre del invitado
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Ej: María"
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                    <p className="text-[10px] text-stone-400 mt-1.5">
                      Se personalizará el mensaje con este nombre
                    </p>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
                      Número de teléfono
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 text-sm font-medium">
                        +54
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        placeholder="11 1234 5678"
                        className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1.5">
                      Ingresá el número sin el 0 delante (ej: 11 para Buenos Aires)
                    </p>
                  </div>

                  {/* Editable Message Preview */}
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">
                          Mensaje (editable)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {isSaved && (
                          <motion.span
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-[10px] text-emerald-600 font-medium"
                          >
                            Guardado ✓
                          </motion.span>
                        )}
                        <button
                          onClick={handleResetMessage}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-200 transition-colors"
                          title="Restaurar mensaje por defecto"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-600 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                      placeholder="Escribe tu mensaje personalizado..."
                    />
                    <p className="text-[10px] text-stone-400 mt-2">
                      Este mensaje se guarda automáticamente para futuros envíos
                    </p>
                  </div>

                  {/* Copy Link Option */}
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-xs text-stone-500 hover:text-stone-700 transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600">Link copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar solo el link de la invitación
                      </>
                    )}
                  </button>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0">
                  <motion.button
                    onClick={handleSend}
                    disabled={!isValidPhone}
                    whileHover={isValidPhone ? { scale: 1.02 } : {}}
                    whileTap={isValidPhone ? { scale: 0.98 } : {}}
                    className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-medium transition-all ${
                      isValidPhone
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {isSending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Abrir WhatsApp
                      </>
                    )}
                  </motion.button>

                  {!isValidPhone && phoneNumber && (
                    <p className="text-center text-[10px] text-rose-500 mt-2">
                      El número debe tener al menos 10 dígitos
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
