'use client';

import React from 'react';
import { StepProps, AgendaItem } from '../types';

export function Step5Config({ formData, updateFormData }: StepProps) {
  const updateAgendaItem = (id: string, updates: Partial<AgendaItem>) => {
    const newItems = formData.agendaItems?.map(item => item.id === id ? { ...item, ...updates } : item) || [];
    updateFormData({ agendaItems: newItems });
  };

  const addAgendaItem = () => {
    const newItem: AgendaItem = { id: Math.random().toString(36).substr(2, 9), time: '20:00', title: 'Nuevo Evento', icon: 'clock' };
    updateFormData({ agendaItems: [...(formData.agendaItems || []), newItem] });
  };

  // Funciones para preguntas personalizadas
  const addCustomQuestion = () => {
    const currentQuestions = formData.rsvpCustomQuestions || [];
    if (currentQuestions.length >= 3) return; // Máximo 3 preguntas
    
    const newQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      question: '',
      isActive: true
    };
    updateFormData({ rsvpCustomQuestions: [...currentQuestions, newQuestion] });
  };

  const updateCustomQuestion = (id: string, question: string) => {
    const updatedQuestions = formData.rsvpCustomQuestions?.map(q => 
      q.id === id ? { ...q, question } : q
    ) || [];
    updateFormData({ rsvpCustomQuestions: updatedQuestions });
  };

  const removeCustomQuestion = (id: string) => {
    const filteredQuestions = formData.rsvpCustomQuestions?.filter(q => q.id !== id) || [];
    updateFormData({ rsvpCustomQuestions: filteredQuestions });
  };

  const activeQuestionsCount = formData.rsvpCustomQuestions?.filter(q => q.isActive).length || 0;

  return (
    <div className="max-w-4xl mx-auto py-4 fade-in">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-[#2C3333] mb-3">Últimos Detalles <span className="text-gray-400 text-lg font-normal normal-case">(opcional)</span></h2>
        <p className="text-[#2C3333]/60 text-sm">Configurá los detalles finales. Recordá que tu invitación es un espacio vivo: podés ajustar horarios y gestionar invitados incluso después del pago.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {formData.showAgenda ? (
          <section className="fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#A27B5C]">Agenda del Evento</h3>
              <button onClick={addAgendaItem} className="text-[9px] font-bold text-[#2C3333] uppercase transition-colors hover:text-[#A27B5C]">+ Agregar</button>
            </div>
            <div className="space-y-3">
              {formData.agendaItems?.map((item) => (
                <div key={item.id} className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm">
                  <input type="time" value={item.time} onChange={(e) => updateAgendaItem(item.id, { time: e.target.value })} className="text-xs font-bold text-[#A27B5C] bg-transparent outline-none" />
                  <input type="text" value={item.title} onChange={(e) => updateAgendaItem(item.id, { title: e.target.value })} className="flex-grow text-sm outline-none font-medium" />
                  <button onClick={() => updateFormData({ agendaItems: formData.agendaItems?.filter(i => i.id !== item.id) })} className="text-gray-300 hover:text-red-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-3xl border border-gray-100 border-dashed">
             <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Agenda Desactivada</p>
          </div>
        )}

        <section className="p-6 bg-[#2C3333] text-white rounded-3xl shadow-xl shadow-black/10 fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#A27B5C]/20 flex items-center justify-center text-[#A27B5C]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">Gestión de Confirmación (RSVP)</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[9px] uppercase tracking-widest font-bold text-white/40 mb-2">Fecha Límite para Confirmar</label>
              <input 
                type="date" 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-[#A27B5C] outline-none" 
                value={formData.rsvpDeadline || ''} 
                onChange={(e) => updateFormData({ rsvpDeadline: e.target.value })} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] uppercase tracking-widest font-bold text-white/40 mb-2">Máx. Acompañantes</label>
                <select 
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-[#A27B5C] outline-none" 
                  value={formData.maxCompanions} 
                  onChange={(e) => updateFormData({ maxCompanions: parseInt(e.target.value) })}
                >
                  {[0,1,2,3,4,5,6].map(n => <option key={n} value={n} className="bg-[#2C3333]">{n}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input 
                  type="checkbox" 
                  id="child" 
                  className="w-4 h-4 rounded accent-[#A27B5C]"
                  checked={formData.allowChildren} 
                  onChange={(e) => updateFormData({ allowChildren: e.target.checked })} 
                />
                <label htmlFor="child" className="text-[10px] uppercase tracking-widest font-bold text-white/60">Permitir Niños</label>
              </div>
            </div>

            <div>
              <label className="block text-[9px] uppercase tracking-widest font-bold text-white/40 mb-2">Mensaje de Confirmación</label>
              <textarea 
                rows={2} 
                placeholder="¡Gracias por confirmar tu asistencia!" 
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm resize-none focus:border-[#A27B5C] outline-none" 
                value={formData.rsvpConfirmationMessage || ''} 
                onChange={(e) => updateFormData({ rsvpConfirmationMessage: e.target.value })} 
              />
            </div>
          </div>
        </section>

        {/* Preguntas Personalizadas */}
        <section className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#A27B5C]/10 flex items-center justify-center text-[#A27B5C]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2C3333]">Preguntas Personalizadas</h3>
                <p className="text-[9px] text-gray-400 mt-0.5">Máximo 3 preguntas para tus invitados</p>
              </div>
            </div>
            <button 
              onClick={addCustomQuestion} 
              disabled={activeQuestionsCount >= 3}
              className="text-[9px] font-bold text-[#A27B5C] uppercase transition-colors hover:text-[#2C3333] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Agregar
            </button>
          </div>

          <div className="space-y-3">
            {formData.rsvpCustomQuestions?.map((q, index) => (
              <div key={q.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#A27B5C] w-4">{index + 1}.</span>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateCustomQuestion(q.id, e.target.value)}
                  placeholder={`Escribe tu pregunta ${index + 1}...`}
                  className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#A27B5C] transition-colors"
                />
                <button 
                  onClick={() => removeCustomQuestion(q.id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Eliminar pregunta"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            
            {(!formData.rsvpCustomQuestions || formData.rsvpCustomQuestions.length === 0) && (
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-400">No hay preguntas personalizadas</p>
                <p className="text-[10px] text-gray-300 mt-1">Las respuestas aparecerán en el dashboard</p>
              </div>
            )}
          </div>

          {activeQuestionsCount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[9px] text-gray-400">
                {activeQuestionsCount} de 3 preguntas configuradas
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
