'use client';

import React, { useState } from 'react';
import { Download, FileText, Table, X } from 'lucide-react';
import type { RSVPRecord, DietaryRestrictions } from '@/app/actions/dashboard';

interface CateringExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  rsvps: RSVPRecord[];
}

export function CateringExportModal({ isOpen, onClose, rsvps }: CateringExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');

  if (!isOpen) return null;

  // Filter confirmed guests only
  const confirmedGuests = rsvps.filter(r => r.attendance === true);

  // Process dietary restrictions for export
  const processGuestData = () => {
    return confirmedGuests.map(rsvp => {
      const restrictions = rsvp.dietary_restrictions;
      let restrictionText = '';
      
      if (!restrictions) {
        // No restrictions
        restrictionText = '';
      } else if (typeof restrictions === 'object') {
        // New checkbox format
        const selectedRestrictions = [];
        if (restrictions.celiac) selectedRestrictions.push('Celíaco');
        if (restrictions.vegan) selectedRestrictions.push('Vegano');
        if (restrictions.vegetarian) selectedRestrictions.push('Vegetariano');
        if (restrictions.allergic) {
          selectedRestrictions.push('Alérgico');
        }
        if (restrictions.other) {
          selectedRestrictions.push('Otros');
          if (restrictions.other_text) {
            selectedRestrictions.push(`(${restrictions.other_text})`);
          }
        }
        restrictionText = selectedRestrictions.join(', ');
      } else if (typeof restrictions === 'string') {
        // Legacy text format
        restrictionText = restrictions;
      }
      
      // Add menu notes if present
      if (rsvp.menu_notes) {
        restrictionText += restrictionText ? ` | ${rsvp.menu_notes}` : rsvp.menu_notes;
      }

      return {
        name: rsvp.name,
        guests: rsvp.guests_count,
        table: rsvp.custom_answers?.table_number as string || '',
        restrictions: restrictionText || 'Ninguna',
        hasAllergies: typeof restrictions === 'object' && restrictions !== null ? restrictions.allergic : 
                      (typeof restrictions === 'string' && restrictions.toLowerCase().includes('alérg')),
        notes: rsvp.message || ''
      };
    });
  };

  const generateCSV = () => {
    const guestData = processGuestData();
    
    const headers = [
      'Nombre Completo',
      'Cantidad de Invitados',
      'Mesa',
      'Restricciones Alimentarias',
      'Alergias (Sí/No)',
      'Notas Adicionales'
    ];
    
    const csvContent = [
      headers.join(','),
      ...guestData.map(guest => [
        `"${guest.name}"`,
        guest.guests,
        `"${guest.table}"`,
        `"${guest.restrictions}"`,
        guest.hasAllergies ? 'SÍ' : 'NO',
        `"${guest.notes}"`
      ].join(','))
    ].join('\n');
    
    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;
    
    return csvWithBOM;
  };

  const generateExcelData = () => {
    const guestData = processGuestData();
    
    // Create a more structured format for Excel
    const excelData = [
      ['REPORTE DE CATERING - VOWS.'],
      ['Evento:', 'Boda'],
      ['Fecha:', new Date().toLocaleDateString('es-AR')],
      ['Total Confirmados:', confirmedGuests.reduce((sum, g) => sum + g.guests_count, 0)],
      [],
      ['Nombre Completo', 'Invitados', 'Mesa', 'Restricciones', 'Alergias', 'Notas'],
      ...guestData.map(guest => [
        guest.name,
        guest.guests,
        guest.table,
        guest.restrictions,
        guest.hasAllergies ? 'SÍ' : 'NO',
        guest.notes
      ])
    ];
    
    return excelData;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (exportFormat === 'csv') {
        const csvContent = generateCSV();
        downloadFile(
          csvContent, 
          `catering-vows-${timestamp}.csv`, 
          'text/csv;charset=utf-8'
        );
      } else {
        // For Excel, we'll generate a CSV that Excel can open properly
        const excelData = generateExcelData();
        const csvContent = excelData.map(row => 
          row.map(cell => `"${cell}"`).join(',')
        ).join('\n');
        
        const BOM = '\uFEFF';
        const csvWithBOM = BOM + csvContent;
        
        downloadFile(
          csvWithBOM, 
          `catering-vows-${timestamp}.csv`, 
          'text/csv;charset=utf-8'
        );
      }
      
      // Close modal after successful export
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error('Export error:', error);
      alert('Error al exportar. Por favor, intenta nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const guestData = processGuestData();
  const totalGuests = confirmedGuests.reduce((sum, g) => sum + g.guests_count, 0);
  const guestsWithRestrictions = guestData.filter(g => g.restrictions !== 'Ninguna').length;
  const allergicGuests = guestData.filter(g => g.hasAllergies).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif text-stone-800">Exportar para Catering</h2>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Summary */}
          <div className="bg-stone-50 rounded-xl p-4 mb-6">
            <h3 className="text-sm font-medium text-stone-700 mb-3">Resumen de Datos</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-stone-500">Total confirmados:</span>
                <span className="ml-2 font-medium text-stone-800">{totalGuests}</span>
              </div>
              <div>
                <span className="text-stone-500">Con restricciones:</span>
                <span className="ml-2 font-medium text-amber-600">{guestsWithRestrictions}</span>
              </div>
              <div>
                <span className="text-stone-500">Alérgicos:</span>
                <span className="ml-2 font-medium text-red-600">{allergicGuests}</span>
              </div>
              <div>
                <span className="text-stone-500">Familias:</span>
                <span className="ml-2 font-medium text-stone-800">{confirmedGuests.length}</span>
              </div>
            </div>
          </div>
          
          {/* Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Formato de Exportación
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportFormat('csv')}
                className={`p-3 rounded-xl border transition-all ${
                  exportFormat === 'csv'
                    ? 'border-[#A27B5C] bg-[#F8F7F4] text-[#A27B5C]'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-medium">CSV</span>
                <span className="text-xs text-stone-400 block">Excel compatible</span>
              </button>
              
              <button
                onClick={() => setExportFormat('excel')}
                className={`p-3 rounded-xl border transition-all ${
                  exportFormat === 'excel'
                    ? 'border-[#A27B5C] bg-[#F8F7F4] text-[#A27B5C]'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <Table className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-medium">Excel</span>
                <span className="text-xs text-stone-400 block">Formato extendido</span>
              </button>
            </div>
          </div>
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting || confirmedGuests.length === 0}
            className="w-full bg-[#A27B5C] text-white px-6 py-3 rounded-xl font-medium tracking-premium text-sm hover:bg-[#8B6F47] transition-all duration-500 shadow-lg shadow-[#A27B5C]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exportar Reporte para Catering
              </>
            )}
          </button>
          
          {confirmedGuests.length === 0 && (
            <p className="text-xs text-stone-400 text-center mt-3">
              No hay invitados confirmados para exportar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
