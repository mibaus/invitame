'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  X, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Check,
  Users,
  Calendar,
  Music,
  UtensilsCrossed,
  MessageSquare
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { DashboardData } from '@/app/actions/dashboard';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DashboardData;
}

interface ExportOption {
  id: 'excel' | 'pdf';
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const exportOptions: ExportOption[] = [
  {
    id: 'excel',
    label: 'Excel',
    description: 'Datos editables para planificación',
    icon: FileSpreadsheet,
    color: 'text-[#7A8B7A]',
    bgColor: 'bg-[#F0F2EF]',
    borderColor: 'border-[#D4DCD4]',
  },
  {
    id: 'pdf',
    label: 'PDF',
    description: 'Documento elegante para compartir',
    icon: FileText,
    color: 'text-[#B8956A]',
    bgColor: 'bg-[#FAF6F1]',
    borderColor: 'border-[#EBE4D9]',
  },
];

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    filter: 'blur(4px)',
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    filter: 'blur(4px)',
    transition: {
      duration: 0.2,
    },
  },
};

const optionVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 20,
    },
  },
  tap: {
    scale: 0.98,
  },
};

// Paper noise SVG background
const paperNoiseSvg = `url("data:image/svg+xml,${encodeURIComponent(`<svg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23noise)' opacity='0.03'/></svg>`)}")`;

export function ExportModal({ isOpen, onClose, data }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'pdf' | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const { invitation, rsvps } = data;
  const content = invitation.content || {};
  const couple = content.couple || {};
  
  // Get custom questions from invitation config
  const customQuestions = content.features?.rsvp?.custom_questions || [];
  
  const confirmed = rsvps.filter(r => r.attendance === true).length;
  const declined = rsvps.filter(r => r.attendance === false).length;
  const totalGuests = rsvps.reduce((sum, r) => sum + (r.guests_count || 1), 0);

  const handleExport = async () => {
    if (!selectedFormat) return;
    
    setIsExporting(true);
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (selectedFormat === 'excel') {
      exportToExcel();
    } else {
      await exportToPDF();
    }
    
    setIsExporting(false);
    setExportComplete(true);
    
    // Reset and close after showing success
    setTimeout(() => {
      setExportComplete(false);
      setSelectedFormat(null);
      onClose();
    }, 1500);
  };

  const exportToExcel = () => {
    if (rsvps.length === 0) return;

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Create summary sheet data
    const summaryRows = [
      ['Resumen de Invitados'],
      [],
      ['Pareja', `${couple.person1?.name || ''} & ${couple.person2?.name || ''}`],
      ['Fecha del Evento', content.logistics?.event_date ? new Date(content.logistics.event_date).toLocaleDateString('es-AR') : '-'],
      [],
      ['Estadísticas', ''],
      ['Total Respuestas', rsvps.length],
      ['Confirmados', confirmed],
      ['No Asisten', declined],
      ['Total Invitados', totalGuests],
      ['Tasa de Confirmacion', `${rsvps.length ? Math.round((confirmed / rsvps.length) * 100) : 0}%`],
    ];
    
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    
    // Set column widths for summary sheet
    wsSummary['!cols'] = [
      { wch: 25 }, // Columna A - etiquetas
      { wch: 40 }, // Columna B - valores
    ];
    
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen');
    
    // Prepare guests data - include custom questions as columns
    const customQuestionIds = customQuestions.map((q: any) => q.id);
    const customQuestionLabels = customQuestions.map((q: any) => q.question);
    
    const guestsHeaders = [
      'N',
      'Nombre',
      'Email',
      'Telefono',
      'Asistencia',
      'Acompanantes',
      'Ninos',
      'Restricciones Alimentarias',
      'Notas de Menu',
      'Sugerencia Musical',
      'Mensaje',
      ...customQuestionLabels,
      'Fecha de Respuesta'
    ];
    
    const guestsRows = rsvps
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
      .map((r, index) => {
        // Build custom answers row
        const customAnswersRow = customQuestionIds.map((qid: string) => {
          const answer = r.custom_answers?.[qid];
          if (typeof answer === 'string') return answer;
          if (answer === null || answer === undefined) return '';
          return JSON.stringify(answer);
        });
        
        return [
          index + 1,
          r.name || '',
          r.email || '',
          r.phone || '',
          r.attendance === true ? 'SI' : 'NO',
          r.guests_count || 0,
          r.children_count || 0,
          r.dietary_restrictions || '',
          r.menu_notes || '',
          r.music_suggestion || '',
          r.message || '',
          ...customAnswersRow,
          new Date(r.created_at).toLocaleDateString('es-AR'),
        ];
      });
    
    const guestsData = [guestsHeaders, ...guestsRows];
    const wsGuests = XLSX.utils.aoa_to_sheet(guestsData);
    
    // Set column widths for guests sheet - columnas más anchas para mejor legibilidad
    const baseCols = [
      { wch: 5 },   // N
      { wch: 30 },  // Nombre
      { wch: 35 },  // Email
      { wch: 18 },  // Telefono
      { wch: 12 },  // Asistencia
      { wch: 14 },  // Acompanantes
      { wch: 8 },   // Ninos
      { wch: 35 },  // Restricciones Alimentarias
      { wch: 35 },  // Notas de Menu
      { wch: 35 },  // Sugerencia Musical
      { wch: 50 },  // Mensaje
    ];
    const customQuestionCols = customQuestionLabels.map(() => ({ wch: 40 }));
    const finalCols = [
      ...baseCols,
      ...customQuestionCols,
      { wch: 18 },  // Fecha de Respuesta
    ];
    wsGuests['!cols'] = finalCols;
    
    XLSX.utils.book_append_sheet(wb, wsGuests, 'Invitados');

    // Generate filename with couple names
    const brideName = (couple.person1?.name || '').toLowerCase().replace(/\s+/g, '-');
    const groomName = (couple.person2?.name || '').toLowerCase().replace(/\s+/g, '-');
    const fileName = `vows-${brideName}-${groomName}.xlsx`;
    
    try {
      // Use the synchronous writeFile which creates a download
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error('Error exporting Excel:', err);
      // Fallback: manual blob creation
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const exportToPDF = async () => {
    if (!pdfRef.current || rsvps.length === 0) return;

    // First, we need to measure each guest card's height
    // We'll render all cards in a hidden container and measure them
    const measureContainer = document.createElement('div');
    measureContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 210mm;
      padding: 20mm;
      background: #FDFCFB;
      font-family: 'Cormorant Garamond', Georgia, serif;
    `;
    document.body.appendChild(measureContainer);

    // Clone the header content
    const headerHtml = `
      <div style="text-align: center; margin-bottom: 32px;">
        <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.3em; color: #A8A29E; margin-bottom: 8px;">vows</p>
        <h1 style="font-size: 30px; font-family: 'Cormorant Garamond', Georgia, serif; color: #292524; margin-bottom: 8px;">${couple.person1?.name || ''} & ${couple.person2?.name || ''}</h1>
        <p style="font-size: 14px; color: #78716C;">${content.logistics?.event_date ? new Date(content.logistics.event_date).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
      </div>
      <div style="display: flex; justify-content: center; gap: 32px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #E7E5E4;">
        <div style="text-align: center;"><p style="font-size: 24px; font-family: 'Cormorant Garamond', Georgia, serif; color: #7A8B7A;">${confirmed}</p><p style="font-size: 12px; color: #78716C; text-transform: uppercase; letter-spacing: 0.05em;">Confirman</p></div>
        <div style="text-align: center;"><p style="font-size: 24px; font-family: 'Cormorant Garamond', Georgia, serif; color: #B8956A;">${declined}</p><p style="font-size: 12px; color: #78716C; text-transform: uppercase; letter-spacing: 0.05em;">No asisten</p></div>
        <div style="text-align: center;"><p style="font-size: 24px; font-family: 'Cormorant Garamond', Georgia, serif; color: #57534E;">${rsvps.length}</p><p style="font-size: 12px; color: #78716C; text-transform: uppercase; letter-spacing: 0.05em;">Respuestas</p></div>
        <div style="text-align: center;"><p style="font-size: 24px; font-family: 'Cormorant Garamond', Georgia, serif; color: #57534E;">${totalGuests}</p><p style="font-size: 12px; color: #78716C; text-transform: uppercase; letter-spacing: 0.05em;">Total Invitados</p></div>
      </div>
    `;

    // Create individual cards and measure their heights
    const sortedRsvps = rsvps.slice().sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
    const pageHeightPx = 297 * 3.779527559; // A4 height in pixels (1mm ≈ 3.78px at 96 DPI, scale 1)
    const contentHeightPx = pageHeightPx - (40 * 3.779527559); // Subtract padding
    const headerHeightPx = 140; // Approximate header height
    const availableHeightPx = contentHeightPx - headerHeightPx - 60; // 60px for footer

    // Generate PDF pages
    const pdf = new jsPDF('p', 'mm', 'a4');
    let isFirstPage = true;
    let currentPageGuests: typeof sortedRsvps = [];
    let currentPageHeight = headerHeightPx + 40; // Header + title

    for (let i = 0; i < sortedRsvps.length; i++) {
      const rsvp = sortedRsvps[i];
      
      // Estimate card height based on content (rough approximation)
      let estimatedCardHeight = 60; // Base height
      if (rsvp.email || rsvp.phone) estimatedCardHeight += 20;
      if (rsvp.dietary_restrictions) estimatedCardHeight += 16;
      if (rsvp.menu_notes) estimatedCardHeight += 16;
      if (rsvp.music_suggestion) estimatedCardHeight += 16;
      if (rsvp.custom_answers && Object.keys(rsvp.custom_answers).length > 0) {
        estimatedCardHeight += 12 + (Object.keys(rsvp.custom_answers).length * 14);
      }
      if (rsvp.message) estimatedCardHeight += 20;
      estimatedCardHeight += 16; // Bottom spacing

      // Check if adding this card would exceed page height
      if (currentPageHeight + estimatedCardHeight > availableHeightPx && currentPageGuests.length > 0) {
        // Render current page and start new one
        await renderPDFPage(pdf, headerHtml, currentPageGuests, isFirstPage, customQuestions);
        isFirstPage = false;
        currentPageGuests = [rsvp];
        currentPageHeight = headerHeightPx + 40 + estimatedCardHeight;
      } else {
        currentPageGuests.push(rsvp);
        currentPageHeight += estimatedCardHeight;
      }
    }

    // Render last page
    if (currentPageGuests.length > 0) {
      await renderPDFPage(pdf, headerHtml, currentPageGuests, isFirstPage, customQuestions);
    }

    // Cleanup
    document.body.removeChild(measureContainer);

    // Generate filename
    const brideName = (couple.person1?.name || '').toLowerCase().replace(/\s+/g, '-');
    const groomName = (couple.person2?.name || '').toLowerCase().replace(/\s+/g, '-');
    const fileName = `vows-${brideName}-${groomName}.pdf`;
    pdf.save(fileName);
  };

  const renderPDFPage = async (
    pdf: jsPDF, 
    headerHtml: string, 
    guests: typeof rsvps, 
    isFirstPage: boolean,
    customQuestions: any[]
  ) => {
    // Create a temporary container for this page
    const pageContainer = document.createElement('div');
    pageContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      background: #FDFCFB;
      font-family: 'Cormorant Garamond', Georgia, serif;
    `;

    // Build guest list HTML
    const guestsHtml = guests.map((rsvp, index) => {
      const globalIndex = rsvps.indexOf(rsvp);
      let cardHtml = `
        <div style="padding-bottom: 16px; border-bottom: 1px solid #F5F5F4; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <p style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; color: #292524;">${rsvp.name}</p>
              <p style="font-size: 12px; color: #78716C;">${rsvp.guests_count > 1 ? `${rsvp.guests_count} personas` : '1 persona'}${rsvp.children_count ? ` · ${rsvp.children_count} niños` : ''}</p>
            </div>
            <span style="font-size: 12px; padding: 4px 12px; border-radius: 9999px; background-color: ${rsvp.attendance === true ? '#F0F2EF' : '#FAF6F1'}; color: ${rsvp.attendance === true ? '#7A8B7A' : '#B8956A'};">${rsvp.attendance === true ? 'Asiste' : 'No asiste'}</span>
          </div>
      `;
      
      if (rsvp.email || rsvp.phone) {
        cardHtml += `<div style="font-size: 12px; color: #78716C; margin-bottom: 8px;">${rsvp.email ? `<span style="margin-right: 16px;">✉ ${rsvp.email}</span>` : ''}${rsvp.phone ? `<span>📞 ${rsvp.phone}</span>` : ''}</div>`;
      }
      if (rsvp.dietary_restrictions) {
        cardHtml += `<p style="font-size: 12px; color: #57534E; margin-bottom: 4px;"><span style="font-weight: 500;">Restricciones:</span> ${rsvp.dietary_restrictions}</p>`;
      }
      if (rsvp.menu_notes) {
        cardHtml += `<p style="font-size: 12px; color: #57534E; margin-bottom: 4px;"><span style="font-weight: 500;">Menú:</span> ${rsvp.menu_notes}</p>`;
      }
      if (rsvp.music_suggestion) {
        cardHtml += `<p style="font-size: 12px; color: #57534E; margin-bottom: 4px;"><span style="font-weight: 500;">🎵</span> ${rsvp.music_suggestion}</p>`;
      }
      if (rsvp.custom_answers && Object.keys(rsvp.custom_answers).length > 0) {
        const customAnswersHtml = Object.entries(rsvp.custom_answers).map(([key, value]) => {
          const questionDef = customQuestions.find((q: any) => q.id === key);
          const questionText = questionDef?.question || key.replace(/_/g, ' ').replace(/-/g, ' ');
          const answerText = typeof value === 'string' ? value : JSON.stringify(value);
          return `<p style="font-size: 11px; color: #57534E; margin-bottom: 2px;"><span style="font-weight: 500;">${questionText}:</span> ${answerText}</p>`;
        }).join('');
        cardHtml += `<div style="margin-top: 8px; margin-bottom: 8px;">${customAnswersHtml}</div>`;
      }
      if (rsvp.message) {
        cardHtml += `<p style="font-size: 12px; color: #78716C; font-style: italic; margin-top: 8px;">"${rsvp.message}"</p>`;
      }
      cardHtml += `<p style="font-size: 10px; color: #A8A29E; margin-top: 8px;">Confirmado el ${new Date(rsvp.created_at).toLocaleDateString('es-AR')}</p></div>`;
      
      return cardHtml;
    }).join('');

    pageContainer.innerHTML = `
      ${headerHtml}
      <h2 style="font-size: 18px; font-family: 'Cormorant Garamond', Georgia, serif; color: #292524; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #E7E5E4;">Lista de Invitados</h2>
      <div style="display: flex; flex-direction: column;">${guestsHtml}</div>
    `;

    document.body.appendChild(pageContainer);

    // Capture this page
    const canvas = await html2canvas(pageContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FDFCFB',
      height: 1123, // 297mm in pixels at 96 DPI
    });

    const imgData = canvas.toDataURL('image/png');
    
    if (!isFirstPage) {
      pdf.addPage();
    }
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);

    document.body.removeChild(pageContainer);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backgroundImage: paperNoiseSvg,
              backgroundBlendMode: 'soft-light',
            }}
          >
            {/* Decorative top border */}
            <div className="h-1 bg-gradient-to-r from-stone-300 via-stone-400 to-stone-300" />
            
            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#A8A29E] font-medium">
                    vows
                  </p>
                  <h2 className="font-serif text-2xl text-[#292524] mt-1">
                    Exportar Invitados
                  </h2>
                  <p className="text-sm text-[#78716C] mt-1">
                    {rsvps.length} respuestas · {totalGuests} personas
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 text-[#A8A29E] hover:text-[#78716C] hover:bg-[#F5F5F4] rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            {/* Content */}
            <div className="px-6 pb-6">
              {exportComplete ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-16 h-16 bg-[#F0F2EF] rounded-full flex items-center justify-center mb-4"
                  >
                    <Check className="w-8 h-8 text-[#7A8B7A]" />
                  </motion.div>
                  <p className="font-medium text-stone-800">¡Exportación exitosa!</p>
                  <p className="text-sm text-stone-500 mt-1">Tu archivo está listo</p>
                </motion.div>
              ) : (
                <>
                  {/* Format Selection */}
                  <p className="text-xs uppercase tracking-wider text-stone-400 font-medium mb-3">
                    Selecciona formato
                  </p>
                  <div className="space-y-3">
                    {exportOptions.map((option, index) => {
                      const Icon = option.icon;
                      const isSelected = selectedFormat === option.id;
                      
                      return (
                        <motion.button
                          key={option.id}
                          custom={index}
                          variants={optionVariants}
                          initial="initial"
                          animate="animate"
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => setSelectedFormat(option.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? `${option.bgColor} ${option.borderColor} shadow-md`
                              : 'bg-white border-stone-100 hover:border-stone-200 hover:shadow-sm'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${option.bgColor}`}>
                            <Icon className={`w-6 h-6 ${option.color}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className={`font-medium ${isSelected ? 'text-stone-800' : 'text-stone-700'}`}>
                              {option.label}
                            </p>
                            <p className="text-sm text-stone-500">
                              {option.description}
                            </p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? option.borderColor.replace('border-', 'bg-').replace('200', '500') + ' border-transparent' : 'border-stone-300'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {/* Stats Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-5 bg-[#FAF9F7] rounded-xl border border-[#EBE9E6]"
                  >
                    <p className="text-xs uppercase tracking-[0.15em] text-[#A8A29E] font-medium mb-4">
                      Resumen incluido
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xl font-serif text-[#7A8B7A]">{confirmed}</p>
                        <p className="text-xs text-[#78716C] mt-1">Confirman</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-serif text-[#B8956A]">{declined}</p>
                        <p className="text-xs text-[#78716C] mt-1">No asisten</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-serif text-[#57534E]">{totalGuests}</p>
                        <p className="text-xs text-[#78716C] mt-1">Total</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Export Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: selectedFormat ? 1.02 : 1 }}
                    whileTap={{ scale: selectedFormat ? 0.98 : 1 }}
                    onClick={handleExport}
                    disabled={!selectedFormat || isExporting}
                    className={`w-full mt-6 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                      selectedFormat && !isExporting
                        ? 'bg-stone-800 text-white shadow-lg hover:bg-stone-700 hover:shadow-xl'
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    {isExporting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Generando archivo...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        <span>{selectedFormat ? 'Exportar ahora' : 'Selecciona un formato'}</span>
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </div>
            
            {/* Hidden PDF Template */}
            {selectedFormat === 'pdf' && (
              <div 
                ref={pdfRef} 
                className="absolute -left-[9999px] top-0"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  padding: '20mm',
                  backgroundColor: '#FDFCFB',
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                }}
              >
                {/* PDF Content */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <p style={{ 
                    fontSize: '12px', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.3em', 
                    color: '#A8A29E',
                    marginBottom: '8px'
                  }}>
                    vows.ar
                  </p>
                  <h1 style={{ 
                    fontSize: '30px', 
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: '#292524',
                    marginBottom: '8px'
                  }}>
                    {couple.person1?.name || ''} & {couple.person2?.name || ''}
                  </h1>
                  <p style={{ fontSize: '14px', color: '#78716C' }}>
                    {content.logistics?.event_date && (
                      new Date(content.logistics.event_date).toLocaleDateString('es-AR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    )}
                  </p>
                </div>
                
                {/* Stats */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '32px', 
                  marginBottom: '32px', 
                  paddingBottom: '24px',
                  borderBottom: '1px solid #E7E5E4'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ 
                      fontSize: '24px', 
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: '#7A8B7A'
                    }}>{confirmed}</p>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#78716C', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Confirman</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ 
                      fontSize: '24px', 
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: '#B8956A'
                    }}>{declined}</p>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#78716C', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>No asisten</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ 
                      fontSize: '24px', 
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: '#57534E'
                    }}>{rsvps.length}</p>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#78716C', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Respuestas</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ 
                      fontSize: '24px', 
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: '#57534E'
                    }}>{totalGuests}</p>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#78716C', 
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Total Invitados</p>
                  </div>
                </div>
                
                {/* Guest List */}
                <h2 style={{ 
                  fontSize: '18px', 
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: '#292524',
                  marginBottom: '16px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #E7E5E4'
                }}>
                  Lista de Invitados
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {rsvps
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
                    .map((rsvp, index) => (
                    <div 
                      key={rsvp.id} 
                      style={{ 
                        paddingBottom: '16px', 
                        borderBottom: '1px solid #F5F5F4',
                        breakInside: 'avoid',
                        pageBreakInside: 'avoid',
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <div>
                          <p style={{ 
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '16px', 
                            color: '#292524'
                          }}>
                            {index + 1}. {rsvp.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#78716C' }}>
                            {rsvp.guests_count > 1 ? `${rsvp.guests_count} personas` : '1 persona'}
                            {rsvp.children_count ? ` · ${rsvp.children_count} niños` : ''}
                          </p>
                        </div>
                        <span style={{
                          fontSize: '12px',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          backgroundColor: rsvp.attendance === true ? '#F0F2EF' : '#FAF6F1',
                          color: rsvp.attendance === true ? '#7A8B7A' : '#B8956A',
                        }}>
                          {rsvp.attendance === true ? 'Asiste' : 'No asiste'}
                        </span>
                      </div>
                      
                      {(rsvp.email || rsvp.phone) && (
                        <div style={{ fontSize: '12px', color: '#78716C', marginBottom: '8px' }}>
                          {rsvp.email && <span style={{ marginRight: '16px' }}>✉ {rsvp.email}</span>}
                          {rsvp.phone && <span>📞 {rsvp.phone}</span>}
                        </div>
                      )}
                      
                      {rsvp.dietary_restrictions && (
                        <p style={{ fontSize: '12px', color: '#57534E', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 500 }}>Restricciones:</span> {rsvp.dietary_restrictions}
                        </p>
                      )}
                      {rsvp.menu_notes && (
                        <p style={{ fontSize: '12px', color: '#57534E', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 500 }}>Menú:</span> {rsvp.menu_notes}
                        </p>
                      )}
                      {rsvp.music_suggestion && (
                        <p style={{ fontSize: '12px', color: '#57534E', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 500 }}>🎵</span> {rsvp.music_suggestion}
                        </p>
                      )}
                      
                      {/* Custom Answers in PDF */}
                      {rsvp.custom_answers && Object.keys(rsvp.custom_answers).length > 0 && (
                        <div style={{ marginTop: '8px', marginBottom: '8px' }}>
                          {Object.entries(rsvp.custom_answers).map(([key, value]) => {
                            const questionDef = customQuestions.find((q: any) => q.id === key);
                            const questionText = questionDef?.question || key.replace(/_/g, ' ').replace(/-/g, ' ');
                            const answerText = typeof value === 'string' ? value : JSON.stringify(value);
                            return (
                              <p key={key} style={{ fontSize: '11px', color: '#57534E', marginBottom: '2px' }}>
                                <span style={{ fontWeight: 500 }}>{questionText}:</span> {answerText}
                              </p>
                            );
                          })}
                        </div>
                      )}
                      
                      {rsvp.message && (
                        <p style={{ fontSize: '12px', color: '#78716C', fontStyle: 'italic', marginTop: '8px' }}>
                          &ldquo;{rsvp.message}&rdquo;
                        </p>
                      )}
                      
                      <p style={{ fontSize: '10px', color: '#A8A29E', marginTop: '8px' }}>
                        Confirmado el {new Date(rsvp.created_at).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Footer */}
                <div style={{ 
                  marginTop: '48px', 
                  paddingTop: '24px', 
                  borderTop: '1px solid #E7E5E4',
                  textAlign: 'center'
                }}>
                  <p style={{ fontSize: '12px', color: '#A8A29E' }}>
                    Generado con <span style={{ fontFamily: "Georgia, serif" }}>♥</span> por vows.ar · {new Date().toLocaleDateString('es-AR')}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
