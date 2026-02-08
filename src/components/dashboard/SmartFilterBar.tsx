'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, X, Filter } from 'lucide-react';
import type { RSVPRecord, DietaryRestrictions } from '@/app/actions/dashboard';

interface FilterState {
  status: ('confirmed' | 'declined')[];
  catering: ('celiac' | 'vegan' | 'vegetarian' | 'allergic' | 'other')[];
  other: ('hasChildren' | 'hasMusicSuggestion')[];
}

interface SmartFilterBarProps {
  rsvps: RSVPRecord[];
  onFilterChange: (filteredRsvps: RSVPRecord[]) => void;
  onFiltersChange: (filters: FilterState) => void;
  filteredCount: number;
}

export function SmartFilterBar({ rsvps, onFilterChange, onFiltersChange, filteredCount }: SmartFilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    catering: [],
    other: []
  });
  
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.filter-dropdown')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Apply filters with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = rsvps.filter(rsvp => {
        // Status filter
        if (filters.status.length > 0) {
          const statusMatch = 
            (filters.status.includes('confirmed') && rsvp.attendance === true) ||
            (filters.status.includes('declined') && rsvp.attendance === false);
          if (!statusMatch) return false;
        }

        // Catering filter
        if (filters.catering.length > 0) {
          const restrictions = rsvp.dietary_restrictions;
          let hasMatch = false;

          if (typeof restrictions === 'object' && restrictions !== null) {
            if (filters.catering.includes('celiac') && restrictions.celiac) hasMatch = true;
            if (filters.catering.includes('vegan') && restrictions.vegan) hasMatch = true;
            if (filters.catering.includes('vegetarian') && restrictions.vegetarian) hasMatch = true;
            if (filters.catering.includes('allergic') && restrictions.allergic) hasMatch = true;
            if (filters.catering.includes('other') && restrictions.other) hasMatch = true;
          } else if (typeof restrictions === 'string' && restrictions) {
            const text = restrictions.toLowerCase();
            if (filters.catering.includes('celiac') && (text.includes('celíaco') || text.includes('celiac'))) hasMatch = true;
            if (filters.catering.includes('vegan') && text.includes('vegano')) hasMatch = true;
            if (filters.catering.includes('vegetarian') && text.includes('vegetariano')) hasMatch = true;
            if (filters.catering.includes('allergic') && (text.includes('alérg') || text.includes('alerg'))) hasMatch = true;
            if (filters.catering.includes('other') && !hasMatch && restrictions) hasMatch = true;
          }

          if (!hasMatch) return false;
        }

        // Other filter
        if (filters.other.length > 0) {
          if (filters.other.includes('hasChildren') && rsvp.children_count === 0) return false;
          if (filters.other.includes('hasMusicSuggestion') && !rsvp.music_suggestion) return false;
        }

        return true;
      });

      onFilterChange(filtered);
      onFiltersChange(filters);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [filters, rsvps, onFilterChange, onFiltersChange]);

  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentValues = prev[category];
      const newValue = value as FilterState[keyof FilterState];
      
      return {
        ...prev,
        [category]: currentValues.includes(newValue)
          ? currentValues.filter(item => item !== newValue)
          : [...currentValues, newValue]
      };
    });
  };

  const clearAllFilters = () => {
    setFilters({ status: [], catering: [], other: [] });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.catering.length > 0 || filters.other.length > 0;

  const statusOptions = [
    { value: 'confirmed', label: 'Confirmados' },
    { value: 'declined', label: 'No asisten' }
  ];

  const cateringOptions = [
    { value: 'celiac', label: 'Celíacos' },
    { value: 'vegan', label: 'Veganos' },
    { value: 'vegetarian', label: 'Vegetarianos' },
    { value: 'allergic', label: 'Alérgicos' },
    { value: 'other', label: 'Otras restricciones' }
  ];

  const otherOptions = [
    { value: 'hasChildren', label: 'Con niños' },
    { value: 'hasMusicSuggestion', label: 'Con sugerencia de música' }
  ];

  const FilterDropdown = ({ 
    title, 
    options, 
    category, 
    selectedValues 
  }: { 
    title: string; 
    options: Array<{ value: string; label: string }>; 
    category: keyof FilterState; 
    selectedValues: string[]; 
  }) => (
    <div className="relative filter-dropdown">
      <button
        onClick={() => setOpenDropdown(openDropdown === category ? null : category)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
          openDropdown === category || selectedValues.length > 0
            ? 'border-[#A27B5C] bg-[#F9F9F9] text-[#A27B5C]'
            : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
        }`}
      >
        <Filter className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">{title}</span>
        {selectedValues.length > 0 && (
          <span className="px-1.5 py-0.5 bg-[#A27B5C] text-white text-[10px] rounded-full">
            {selectedValues.length}
          </span>
        )}
        <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === category ? 'rotate-180' : ''}`} />
      </button>

      {openDropdown === category && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-lg z-10">
          <div className="p-2 max-h-48 overflow-y-auto">
            {options.map(option => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-stone-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleFilter(category, option.value);
                  }}
                  className="w-3.5 h-3.5 text-[#A27B5C] border-stone-300 rounded focus:ring-2 focus:ring-[#A27B5C] focus:ring-offset-0"
                  style={{
                    accentColor: '#A27B5C'
                  }}
                />
                <span className="text-xs text-stone-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xs font-serif text-stone-300 tracking-wider uppercase">
            Filtros Inteligentes
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Limpiar
            </button>
          )}
        </div>
        
        {/* Filtered count */}
        <div className="text-xs text-stone-500">
          {hasActiveFilters ? (
            <span>Mostrando <span className="font-medium text-stone-700">{filteredCount}</span> invitados</span>
          ) : (
            <span>{rsvps.length} invitados totales</span>
          )}
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-2">
        <FilterDropdown
          title="Estado"
          options={statusOptions}
          category="status"
          selectedValues={filters.status}
        />
        
        <FilterDropdown
          title="Catering"
          options={cateringOptions}
          category="catering"
          selectedValues={filters.catering}
        />
        
        <FilterDropdown
          title="Otros"
          options={otherOptions}
          category="other"
          selectedValues={filters.other}
        />
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-stone-100">
          <div className="flex flex-wrap gap-1.5">
            {filters.status.map(value => (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#F9F9F9] border border-stone-200 rounded text-xs text-stone-600"
              >
                {statusOptions.find(opt => opt.value === value)?.label}
                <button
                  onClick={() => toggleFilter('status', value)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.catering.map(value => (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#F9F9F9] border border-stone-200 rounded text-xs text-stone-600"
              >
                {cateringOptions.find(opt => opt.value === value)?.label}
                <button
                  onClick={() => toggleFilter('catering', value)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.other.map(value => (
              <span
                key={value}
                className="inline-flex items-center gap-1 px-2 py-1 bg-[#F9F9F9] border border-stone-200 rounded text-xs text-stone-600"
              >
                {otherOptions.find(opt => opt.value === value)?.label}
                <button
                  onClick={() => toggleFilter('other', value)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
