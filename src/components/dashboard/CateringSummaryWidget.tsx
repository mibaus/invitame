'use client';

import React from 'react';

interface DietaryRestrictions {
  celiac: boolean;
  vegan: boolean;
  vegetarian: boolean;
  allergic: boolean;
  other: boolean;
  other_text?: string;
}

interface CateringSummaryProps {
  rsvps: Array<{
    id: string;
    name: string;
    attendance: boolean | null;
    guests_count: number;
    dietary_restrictions: DietaryRestrictions | string | null;
    menu_notes: string | null;
  }>;
}

export function CateringSummaryWidget({ rsvps }: CateringSummaryProps) {
  // Calculate dietary restriction counts
  const calculateRestrictions = () => {
    const restrictions = {
      celiac: 0,
      vegan: 0,
      vegetarian: 0,
      allergic: 0,
      other: 0,
      total: 0
    };

    const confirmedRsvps = rsvps.filter(r => r.attendance === true);

    confirmedRsvps.forEach(rsvp => {
      const restrictions_data = rsvp.dietary_restrictions;
      
      if (typeof restrictions_data === 'object' && restrictions_data !== null) {
        // New checkbox format
        if (restrictions_data.celiac) restrictions.celiac += rsvp.guests_count;
        if (restrictions_data.vegan) restrictions.vegan += rsvp.guests_count;
        if (restrictions_data.vegetarian) restrictions.vegetarian += rsvp.guests_count;
        if (restrictions_data.allergic) {
          restrictions.allergic += rsvp.guests_count;
          restrictions.total += rsvp.guests_count;
        }
        if (restrictions_data.other) {
          restrictions.other += rsvp.guests_count;
          restrictions.total += rsvp.guests_count;
        }
      } else if (typeof restrictions_data === 'string' && restrictions_data) {
        // Legacy text format - try to parse
        const text = restrictions_data.toLowerCase();
        if (text.includes('celíaco') || text.includes('celiac')) {
          restrictions.celiac += rsvp.guests_count;
        }
        if (text.includes('vegano')) {
          restrictions.vegan += rsvp.guests_count;
        }
        if (text.includes('vegetariano')) {
          restrictions.vegetarian += rsvp.guests_count;
        }
        if (text.includes('alérg') || text.includes('alerg')) {
          restrictions.allergic += rsvp.guests_count;
          restrictions.total += rsvp.guests_count;
        }
      }
      
      // Count menu notes as special requirements
      if (rsvp.menu_notes) {
        restrictions.total += rsvp.guests_count;
      }
    });

    return restrictions;
  };

  const restrictions = calculateRestrictions();
  const hasAnyRestrictions = Object.values(restrictions).some(count => count > 0);

  if (!hasAnyRestrictions) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
        <div className="text-center">
          <h3 className="text-xs font-serif text-stone-300 mb-6 tracking-wider uppercase">
            Resumen de Catering
          </h3>
          <div className="py-8">
            <p className="text-sm text-stone-400 font-light">Sin restricciones alimentarias</p>
            <p className="text-xs text-stone-300 mt-2">Todos los invitados con menú estándar</p>
          </div>
        </div>
      </div>
    );
  }

  const restrictionItems = [
    { 
      key: 'celiac' as keyof typeof restrictions, 
      label: 'Celíacos', 
    },
    { 
      key: 'vegan' as keyof typeof restrictions, 
      label: 'Veganos', 
    },
    { 
      key: 'vegetarian' as keyof typeof restrictions, 
      label: 'Vegetarianos', 
    },
    { 
      key: 'allergic' as keyof typeof restrictions, 
      label: 'Alérgicos', 
    },
    { 
      key: 'other' as keyof typeof restrictions, 
      label: 'Otros', 
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-xs font-serif text-stone-300 tracking-wider uppercase mb-2">
          Resumen de Catering
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-serif text-stone-800">{restrictions.total}</span>
          <span className="text-xs text-stone-400 tracking-wider uppercase">invitados con restricciones</span>
        </div>
      </div>
      
      {/* Restriction Labels */}
      <div className="flex flex-wrap gap-3">
        {restrictionItems.map(({ key, label }) => {
          const count = restrictions[key];
          if (count === 0) return null;
          
          return (
            <div 
              key={key}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F9F9F9] border border-stone-200 rounded-full"
            >
              <span className="font-serif text-lg text-stone-800">{count}</span>
              <span className="text-xs text-stone-500 tracking-wider uppercase font-light">
                {label}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Critical Allergy Notice */}
      {restrictions.allergic > 0 && (
        <div className="mt-6 pt-6 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#A27B5C]"></div>
            <span className="text-xs text-stone-500 font-light">
              {restrictions.allergic} invitado{restrictions.allergic > 1 ? 's' : ''} con alergias identificadas
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
