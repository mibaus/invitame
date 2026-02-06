'use client';

import { Plus, Trash2, Clock, Church, Wine, Utensils, Music, Camera, Sparkles } from 'lucide-react';

interface AgendaItem {
  time: string;
  title: string;
  description?: string;
  icon?: string;
}

interface AgendaEditorProps {
  items: AgendaItem[];
  onChange: (items: AgendaItem[]) => void;
}

const ICON_OPTIONS = [
  { value: 'church', label: 'Ceremonia', icon: Church },
  { value: 'wine', label: 'Cóctel', icon: Wine },
  { value: 'utensils', label: 'Cena', icon: Utensils },
  { value: 'music', label: 'Fiesta', icon: Music },
  { value: 'camera', label: 'Fotos', icon: Camera },
  { value: 'sparkles', label: 'Especial', icon: Sparkles },
  { value: 'clock', label: 'General', icon: Clock },
] as const;

const DEFAULT_ITEMS: AgendaItem[] = [
  { time: '18:00', title: 'Ceremonia', description: 'Ceremonia religiosa', icon: 'church' },
  { time: '19:00', title: 'Cóctel', description: 'Recepción y brindis de bienvenida', icon: 'wine' },
  { time: '20:00', title: 'Cena', description: 'Cena de gala', icon: 'utensils' },
  { time: '22:00', title: 'Fiesta', description: 'Baile y celebración', icon: 'music' },
];

export function AgendaEditor({ items, onChange }: AgendaEditorProps) {
  const currentItems = items.length > 0 ? items : DEFAULT_ITEMS;

  const addItem = () => {
    const newItem: AgendaItem = {
      time: '12:00',
      title: 'Nuevo evento',
      description: '',
      icon: 'clock',
    };
    onChange([...currentItems, newItem]);
  };

  const removeItem = (index: number) => {
    const newItems = currentItems.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const updateItem = (index: number, field: keyof AgendaItem, value: string) => {
    const newItems = currentItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(newItems);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentItems.length - 1) return;
    
    const newItems = [...currentItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {currentItems.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
          >
            <div className="flex items-center gap-3">
              {/* Time */}
              <div className="w-24">
                <label className="block text-xs font-medium text-gray-500 mb-1">Hora</label>
                <input
                  type="time"
                  value={item.time}
                  onChange={(e) => updateItem(index, 'time', e.target.value)}
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Icon */}
              <div className="w-28">
                <label className="block text-xs font-medium text-gray-500 mb-1">Icono</label>
                <select
                  value={item.icon || 'clock'}
                  onChange={(e) => updateItem(index, 'icon', e.target.value)}
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ej: Ceremonia"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 pt-5">
                <button
                  type="button"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 rounded"
                  title="Mover arriba"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === currentItems.length - 1}
                  className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30 rounded"
                  title="Mover abajo"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-1.5 text-red-400 hover:text-red-600 rounded"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Descripción (opcional)</label>
              <input
                type="text"
                value={item.description || ''}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Breve descripción del evento..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={addItem}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/50 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Agregar evento
      </button>

      {/* Help Text */}
      <p className="text-xs text-gray-500">
        Los eventos se mostrarán en orden cronológico en la sección "Agenda del Día" de tu invitación.
      </p>
    </div>
  );
}
