'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DietaryRestrictionsDropdownProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  /** Estilos personalizados por skin */
  styles?: {
    containerClassName?: string;
    triggerClassName?: string;
    dropdownClassName?: string;
    optionClassName?: string;
    tagClassName?: string;
    inputClassName?: string;
    labelClassName?: string;
  };
  /** Colores personalizados para mantener la estética del skin */
  colors?: {
    border?: string;
    text?: string;
    placeholder?: string;
    background?: string;
    hover?: string;
    selected?: string;
    tagBg?: string;
    tagText?: string;
    buttonBg?: string;
    buttonHover?: string;
    buttonText?: string;
    checkColor?: string;
    checkBg?: string;
  };
  /** Configuración de alergias agrupadas */
  allergyGroups?: {
    [key: string]: string[];
  };
}

export function DietaryRestrictionsDropdown({
  value = [],
  onChange,
  options,
  placeholder = "Selecciona restricciones alimentarias...",
  className = '',
  styles = {},
  colors = {},
  allergyGroups = {}
}: DietaryRestrictionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customOption, setCustomOption] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [allergySubmenuOpen, setAllergySubmenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Colores por defecto que pueden ser sobrescritos por cada skin
  const defaultColors = {
    border: 'border-gray-300',
    text: 'text-gray-900',
    placeholder: 'text-gray-500',
    background: 'bg-white',
    hover: 'hover:bg-gray-50',
    selected: 'bg-blue-50 border-blue-200',
    tagBg: 'bg-gray-100',
    tagText: 'text-gray-700',
    buttonBg: '#3B82F6',
    buttonHover: '#2563EB',
    buttonText: '#FFFFFF',
    checkColor: '#FFFFFF',
    checkBg: '#3B82F6',
    ...colors
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCustomInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateDropdownPosition = () => {
    if (triggerRef.current && styles.dropdownClassName?.includes('fixed')) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const handleToggleDropdown = () => {
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (option: string) => {
    // Si es "Alergias" y tiene subopciones, abrir submenú
    if (option === 'Alergias' && allergyGroups['Alergias']) {
      setAllergySubmenuOpen(true);
      return;
    }
    
    if (value.includes(option)) {
      onChange(value.filter(item => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const handleSelectAllergy = (allergy: string) => {
    // Remover "Alergias" si está presente y agregar la alergia específica
    const newValue = value.filter(item => item !== 'Alergias');
    if (!newValue.includes(allergy)) {
      onChange([...newValue, allergy]);
    }
    setAllergySubmenuOpen(false);
  };

  const handleBackToMain = () => {
    setAllergySubmenuOpen(false);
  };

  const handleAddCustomOption = () => {
    if (customOption.trim() && !value.includes(customOption.trim())) {
      onChange([...value, customOption.trim()]);
      setCustomOption('');
      setShowCustomInput(false);
    }
  };

  const handleRemoveTag = (optionToRemove: string) => {
    onChange(value.filter(option => option !== optionToRemove));
  };

  // Resetear submenú cuando se cierra el dropdown
  useEffect(() => {
    if (!isOpen) {
      setAllergySubmenuOpen(false);
    }
  }, [isOpen]);

  const selectedOptions = value.filter(option => options.includes(option));
  const customOptions = value.filter(option => !options.includes(option));

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={handleToggleDropdown}
        className={cn(
          "w-full px-4 py-3 border-2 rounded-xl cursor-pointer transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          defaultColors.border,
          defaultColors.background,
          defaultColors.text,
          "hover:border-opacity-60",
          styles.triggerClassName
        )}
        style={{
          borderColor: colors.border ? undefined : undefined,
          backgroundColor: colors.background || undefined,
          color: colors.text || undefined
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {value.length === 0 ? (
              <span className={cn(defaultColors.placeholder)} style={{ color: colors.placeholder || undefined }}>
                {placeholder}
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {value.map((option, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                      defaultColors.tagBg,
                      defaultColors.tagText,
                      styles.tagClassName
                    )}
                    style={{
                      backgroundColor: colors.tagBg || undefined,
                      color: colors.tagText || undefined
                    }}
                  >
                    {option}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(option);
                      }}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
            style={{ color: colors.text || undefined }}
          />
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "z-50 border-2 rounded-xl shadow-lg max-h-60 overflow-auto",
              defaultColors.border,
              defaultColors.background,
              styles.dropdownClassName
            )}
            style={{
              borderColor: colors.border || undefined,
              backgroundColor: colors.background || undefined,
              ...(styles.dropdownClassName?.includes('fixed') ? {
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`
              } : {})
            }}
          >
            {allergySubmenuOpen ? (
              /* Submenú de alergias */
              <div className="p-2">
                {/* Botón de volver */}
                <div
                  onClick={handleBackToMain}
                  className={cn(
                    "px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm flex items-center gap-2 mb-2",
                    defaultColors.hover,
                    styles.optionClassName
                  )}
                  style={{ color: colors.text || undefined }}
                >
                  <span>← Volver</span>
                </div>
                
                {/* Opciones de alergias */}
                {allergyGroups['Alergias']?.map((allergy, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectAllergy(allergy)}
                    className={cn(
                      "px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm",
                      defaultColors.hover,
                      value.includes(allergy) && defaultColors.selected,
                      styles.optionClassName
                    )}
                    style={{
                      backgroundColor: value.includes(allergy) ? colors.selected : undefined,
                      color: colors.text || undefined
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{allergy}</span>
                      {value.includes(allergy) && (
                        <div 
                          className="w-4 h-4 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: defaultColors.checkBg }}
                        >
                          <svg 
                            className="w-2 h-2" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                            style={{ color: defaultColors.checkColor }}
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Menú principal */
              <div className="p-2">
                {options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectOption(option)}
                    className={cn(
                      "px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm",
                      defaultColors.hover,
                      value.includes(option) && defaultColors.selected,
                      styles.optionClassName
                    )}
                    style={{
                      backgroundColor: value.includes(option) ? colors.selected : undefined,
                      color: colors.text || undefined
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      <div className="flex items-center gap-2">
                        {option === 'Alergias' && allergyGroups['Alergias'] && (
                          <span className="text-xs opacity-60">→</span>
                        )}
                        {value.includes(option) && (
                          <div 
                            className="w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: defaultColors.checkBg }}
                          >
                            <svg 
                              className="w-2 h-2" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                              style={{ color: defaultColors.checkColor }}
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Separador */}
                {options.length > 0 && (
                  <div className="my-2 border-t border-gray-200" style={{ borderColor: colors.border || undefined }} />
                )}

                {/* Opción personalizada */}
                <div className="p-2">
                  {!showCustomInput ? (
                    <button
                      onClick={() => setShowCustomInput(true)}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-2",
                        defaultColors.hover,
                        styles.optionClassName
                      )}
                      style={{ color: colors.text || undefined }}
                    >
                      <Plus className="w-4 h-4" />
                      Agregar opción personalizada
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={customOption}
                        onChange={(e) => setCustomOption(e.target.value)}
                        placeholder="Escribe tu restricción..."
                        className={cn(
                          "w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2",
                          defaultColors.border,
                          styles.inputClassName
                        )}
                        style={{
                          borderColor: colors.border || undefined,
                          color: colors.text || undefined
                        }}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddCustomOption();
                          } else if (e.key === 'Escape') {
                            setShowCustomInput(false);
                            setCustomOption('');
                          }
                        }}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddCustomOption}
                          className="flex-1 px-3 py-1 text-white rounded-lg text-sm transition-colors hover:opacity-90"
                          style={{ backgroundColor: defaultColors.buttonBg }}
                        >
                          Agregar
                        </button>
                        <button
                          onClick={() => {
                            setShowCustomInput(false);
                            setCustomOption('');
                          }}
                          className="flex-1 px-3 py-1 border rounded-lg text-sm hover:bg-gray-50 transition-colors"
                          style={{ borderColor: colors.border || undefined }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
