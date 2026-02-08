'use client';

import React, { useState } from 'react';
import { Download, FileText, Table, X, FileImage } from 'lucide-react';
import type { RSVPRecord, DietaryRestrictions } from '@/app/actions/dashboard';

interface DynamicExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredRsvps: RSVPRecord[];
  totalCount: number;
}

export function DynamicExportModal({ isOpen, onClose, filteredRsvps, totalCount }: DynamicExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');

  if (!isOpen) return null;

  // Process dietary restrictions for export
  const processGuestData = () => {
    return filteredRsvps.map(rsvp => {
      const restrictions = rsvp.dietary_restrictions;
      let restrictionText = '';
      
      if (!restrictions) {
        restrictionText = '';
      } else if (typeof restrictions === 'object') {
        // New checkbox format
        const selectedRestrictions = [];
        if (restrictions.celiac) selectedRestrictions.push('Celíaco');
        if (restrictions.vegan) selectedRestrictions.push('Vegano');
        if (restrictions.vegetarian) selectedRestrictions.push('Vegetariano');
        if (restrictions.allergic) selectedRestrictions.push('Alérgico');
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
        children: rsvp.children_count || 0,
        table: rsvp.custom_answers?.table_number as string || '',
        restrictions: restrictionText || 'Ninguna',
        hasAllergies: typeof restrictions === 'object' && restrictions !== null ? restrictions.allergic : 
                      (typeof restrictions === 'string' && restrictions.toLowerCase().includes('alérg')),
        music: rsvp.music_suggestion || '',
        notes: rsvp.message || '',
        status: rsvp.attendance === true ? 'Confirmado' : 'No asiste'
      };
    });
  };

  const generateCSV = () => {
    const guestData = processGuestData();
    
    const headers = [
      'Nombre Completo',
      'Invitados',
      'Niños',
      'Mesa',
      'Restricciones Alimentarias',
      'Alergias (Sí/No)',
      'Sugerencia Musical',
      'Notas',
      'Estado'
    ];
    
    const csvContent = [
      headers.join(','),
      ...guestData.map(guest => [
        `"${guest.name}"`,
        guest.guests,
        guest.children,
        `"${guest.table}"`,
        `"${guest.restrictions}"`,
        guest.hasAllergies ? 'SÍ' : 'NO',
        `"${guest.music}"`,
        `"${guest.notes}"`,
        `"${guest.status}"`
      ].join(','))
    ].join('\n');
    
    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;
    
    return csvWithBOM;
  };

  const generatePDFContent = () => {
    const guestData = processGuestData();
    const timestamp = new Date().toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Count restrictions
    const restrictionCounts = {
      celiac: 0,
      vegan: 0,
      vegetarian: 0,
      allergic: 0,
      other: 0
    };

    guestData.forEach(guest => {
      const restrictions = guest.restrictions.toLowerCase();
      if (restrictions.includes('celíaco')) restrictionCounts.celiac += guest.guests;
      if (restrictions.includes('vegano')) restrictionCounts.vegan += guest.guests;
      if (restrictions.includes('vegetariano')) restrictionCounts.vegetarian += guest.guests;
      if (restrictions.includes('alérgico')) restrictionCounts.allergic += guest.guests;
      if (restrictions.includes('otros') || (restrictions !== 'ninguna' && !restrictionCounts.celiac && !restrictionCounts.vegan && !restrictionCounts.vegetarian && !restrictionCounts.allergic)) {
        restrictionCounts.other += guest.guests;
      }
    });

    // Generate HTML for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            color: #2C3333;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            background: #ffffff;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #A27B5C;
            padding-bottom: 20px;
        }
        
        .logo {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            color: #2C3333;
            margin-bottom: 8px;
        }
        
        .logo span {
            color: #A27B5C;
        }
        
        .subtitle {
            font-size: 14px;
            color: #666;
            font-weight: 300;
            margin: 0;
        }
        
        .summary {
            background: #F9F9F9;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .summary h2 {
            font-family: 'Playfair Display', serif;
            font-size: 18px;
            margin: 0 0 15px 0;
            color: #2C3333;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
        }
        
        .summary-item {
            text-align: center;
        }
        
        .summary-number {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 700;
            color: #A27B5C;
        }
        
        .summary-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #666;
        }
        
        .guests-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 30px;
        }
        
        .guests-table th {
            background: #A27B5C;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .guests-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #E5E5E5;
            font-size: 12px;
        }
        
        .guests-table tr:nth-child(even) {
            background: #FAFAFA;
        }
        
        .allergy-warning {
            background: #FFF3F3;
            border: 1px solid #FFB3B3;
            padding: 8px;
            border-radius: 4px;
            font-size: 11px;
            color: #D32F2F;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E5E5;
            text-align: center;
            font-size: 10px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">VOWS<span>.</span></div>
        <p class="subtitle">Reporte de Catering para Evento</p>
        <p class="subtitle">Fecha: ${timestamp}</p>
    </div>
    
    <div class="summary">
        <h2>Resumen de Restricciones Alimentarias</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-number">${guestData.reduce((sum, g) => sum + g.guests, 0)}</div>
                <div class="summary-label">Total Invitados</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">${restrictionCounts.celiac}</div>
                <div class="summary-label">Celíacos</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">${restrictionCounts.vegan}</div>
                <div class="summary-label">Veganos</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">${restrictionCounts.vegetarian}</div>
                <div class="summary-label">Vegetarianos</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">${restrictionCounts.allergic}</div>
                <div class="summary-label">Alérgicos</div>
            </div>
            <div class="summary-item">
                <div class="summary-number">${restrictionCounts.other}</div>
                <div class="summary-label">Otras</div>
            </div>
        </div>
    </div>
    
    <table class="guests-table">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Invitados</th>
                <th>Niños</th>
                <th>Mesa</th>
                <th>Restricciones</th>
                <th>Notas</th>
            </tr>
        </thead>
        <tbody>
            ${guestData.map(guest => `
                <tr>
                    <td>${guest.name}</td>
                    <td>${guest.guests}</td>
                    <td>${guest.children}</td>
                    <td>${guest.table || '-'}</td>
                    <td>
                        ${guest.hasAllergies ? `<div class="allergy-warning">⚠ ${guest.restrictions}</div>` : guest.restrictions}
                    </td>
                    <td>${guest.notes || '-'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    
    <div class="footer">
        <p>Generado por VOWS. • Sistema de Gestión de Eventos Premium</p>
        <p>Este documento es confidencial y para uso exclusivo del catering contratado.</p>
    </div>
</body>
</html>`;

    return htmlContent;
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
          `vows-seleccion-${timestamp}.csv`, 
          'text/csv;charset=utf-8'
        );
      } else {
        // For PDF, generate HTML and let user print/save as PDF
        const pdfContent = generatePDFContent();
        const blob = new Blob([pdfContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Open in new window for printing
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
            }, 500);
          };
        }
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
  const totalGuests = guestData.reduce((sum, g) => sum + g.guests, 0);
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
            <h2 className="text-lg font-serif text-stone-800">Exportar Selección Filtrada</h2>
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
            <h3 className="text-sm font-medium text-stone-700 mb-3">Datos a Exportar</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-stone-500">Invitados seleccionados:</span>
                <span className="ml-2 font-medium text-stone-800">{totalCount}</span>
              </div>
              <div>
                <span className="text-stone-500">Total personas:</span>
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
            </div>
          </div>
          
          {/* Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-700 mb-3">
              Formato de Exportación
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportFormat('pdf')}
                className={`p-3 rounded-xl border transition-all ${
                  exportFormat === 'pdf'
                    ? 'border-[#A27B5C] bg-[#F8F7F4] text-[#A27B5C]'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <FileImage className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-medium">PDF Editorial</span>
                <span className="text-xs text-stone-400 block">Para el salón</span>
              </button>
              
              <button
                onClick={() => setExportFormat('csv')}
                className={`p-3 rounded-xl border transition-all ${
                  exportFormat === 'csv'
                    ? 'border-[#A27B5C] bg-[#F8F7F4] text-[#A27B5C]'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-medium">CSV de Datos</span>
                <span className="text-xs text-stone-400 block">Para Excel</span>
              </button>
            </div>
          </div>
          
          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting || filteredRsvps.length === 0}
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
                Exportar Selección
              </>
            )}
          </button>
          
          {filteredRsvps.length === 0 && (
            <p className="text-xs text-stone-400 text-center mt-3">
              No hay invitados seleccionados para exportar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
