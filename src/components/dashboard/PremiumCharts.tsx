'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { DashboardData } from '@/app/actions/dashboard';

interface ConfirmationFlowProps {
  data: DashboardData;
}

interface FlowStage {
  id: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export function ConfirmationFlow({ data }: ConfirmationFlowProps) {
  const { rsvps } = data;

  const stages: FlowStage[] = useMemo(() => {
    const totalInvited = rsvps.length || 1; // Avoid division by zero
    const confirmed = rsvps.filter(r => r.attendance === true).length;
    const declined = rsvps.filter(r => r.attendance === false).length;
    const noResponse = rsvps.filter(r => r.attendance === null).length;

    return [
      {
        id: 'invited',
        label: 'Invitados',
        count: totalInvited,
        percentage: 100,
        color: '#2C3333',
      },
      {
        id: 'responded',
        label: 'Respondieron',
        count: confirmed + declined,
        percentage: ((confirmed + declined) / totalInvited) * 100,
        color: '#A27B5C',
      },
      {
        id: 'confirmed',
        label: 'Confirmados',
        count: confirmed,
        percentage: (confirmed / totalInvited) * 100,
        color: '#10B981',
      },
    ];
  }, [rsvps]);

  const maxCount = Math.max(...stages.map(s => s.count));

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-xl text-[#2C3333]">Flujo de Confirmaciones</h3>
          <p className="text-xs text-[#2C3333]/50 mt-1">
            Visualización del embudo de respuestas
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-serif text-[#A27B5C]">
            {Math.round(stages[stages.length - 1].percentage)}%
          </p>
          <p className="text-xs text-[#2C3333]/50">tasa de conversión</p>
        </div>
      </div>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={stage.id} className="relative">
            {/* Connector line */}
            {index < stages.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-6 bg-gray-200" />
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="flex items-center gap-4"
            >
              {/* Icon circle */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${stage.color}20` }}
              >
                <span
                  className="text-lg font-serif"
                  style={{ color: stage.color }}
                >
                  {stage.count}
                </span>
              </div>

              {/* Bar */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#2C3333]">
                    {stage.label}
                  </span>
                  <span className="text-xs text-[#2C3333]/50">
                    {Math.round(stage.percentage)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stage.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.15 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Drop-off indicators */}
      {stages.length > 1 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#2C3333]/50">
              {rsvps.filter(r => r.attendance === null).length} sin respuesta
            </span>
            <span className="text-red-500">
              {rsvps.filter(r => r.attendance === false).length} rechazos
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface GuestCompositionProps {
  data: DashboardData;
}

interface CompositionItem {
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export function GuestComposition({ data }: GuestCompositionProps) {
  const { rsvps, stats } = data;

  const composition: CompositionItem[] = useMemo(() => {
    const total = rsvps.length || 1;
    const confirmed = rsvps.filter(r => r.attendance === true).length;
    const declined = rsvps.filter(r => r.attendance === false).length;
    const pending = rsvps.filter(r => r.attendance === null).length;
    const withDietary = rsvps.filter(r => r.dietary_restrictions || r.menu_notes).length;
    const withMusic = rsvps.filter(r => r.music_suggestion).length;

    return [
      {
        label: 'Confirmados',
        count: confirmed,
        percentage: (confirmed / total) * 100,
        color: '#10B981',
      },
      {
        label: 'Rechazos',
        count: declined,
        percentage: (declined / total) * 100,
        color: '#EF4444',
      },
      {
        label: 'Sin respuesta',
        count: pending,
        percentage: (pending / total) * 100,
        color: '#F59E0B',
      },
      {
        label: 'Dietas especiales',
        count: withDietary,
        percentage: (withDietary / total) * 100,
        color: '#8B5CF6',
      },
      {
        label: 'Sugerencias música',
        count: withMusic,
        percentage: (withMusic / total) * 100,
        color: '#EC4899',
      },
    ];
  }, [rsvps]);

  // Group by guest count (family size)
  const familySizes = useMemo(() => {
    const sizes = [1, 2, 3, 4, 5];
    const counts = sizes.map(size => ({
      size,
      count: rsvps.filter(r => r.guests_count === size).length,
    })).filter(item => item.count > 0);
    
    const maxCount = Math.max(...counts.map(c => c.count), 1);
    return { counts, maxCount };
  }, [rsvps]);

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
      <h3 className="font-serif text-xl text-[#2C3333] mb-1">Composición de Invitados</h3>
      <p className="text-xs text-[#2C3333]/50 mb-6">
        Distribución por estado y características
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {composition.slice(0, 4).map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl border"
            style={{ 
              borderColor: `${item.color}30`,
              backgroundColor: `${item.color}10`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-[#2C3333]/70">{item.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-serif text-[#2C3333]">
                {item.count}
              </span>
              <span className="text-xs text-[#2C3333]/50">
                {Math.round(item.percentage)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Family sizes */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs font-medium text-[#2C3333] mb-3">
          Distribución por tamaño de grupo
        </p>
        <div className="space-y-2">
          {familySizes.counts.map((item, index) => (
            <motion.div
              key={item.size}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs text-[#2C3333]/50 w-16">
                {item.size} {item.size === 1 ? 'persona' : 'personas'}
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.count / familySizes.maxCount) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  className="h-full bg-[#A27B5C] rounded-full"
                />
              </div>
              <span className="text-xs text-[#2C3333] w-8 text-right">
                {item.count}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface TimelineOfConfirmationsProps {
  data: DashboardData;
}

interface TimelineItem {
  date: string;
  count: number;
  cumulative: number;
}

export function TimelineOfConfirmations({ data }: TimelineOfConfirmationsProps) {
  const { rsvps } = data;

  const timeline = useMemo(() => {
    // Group RSVPs by date
    const byDate = rsvps.reduce((acc, rsvp) => {
      const date = new Date(rsvp.created_at).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
      });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort by date and calculate cumulative
    const sorted = Object.entries(byDate)
      .sort((a, b) => {
        const dateA = new Date(a[0]);
        const dateB = new Date(b[0]);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-7); // Last 7 days with activity

    let cumulative = 0;
    return sorted.map(([date, count]) => {
      cumulative += count;
      return { date, count, cumulative };
    });
  }, [rsvps]);

  const maxCumulative = Math.max(...timeline.map(t => t.cumulative), 1);
  const maxDaily = Math.max(...timeline.map(t => t.count), 1);

  if (timeline.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
        <h3 className="font-serif text-xl text-[#2C3333] mb-1">
          Timeline de Confirmaciones
        </h3>
        <p className="text-xs text-[#2C3333]/50">
          Las confirmaciones aparecerán aquí cuando los invitados respondan.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-serif text-xl text-[#2C3333]">
            Timeline de Confirmaciones
          </h3>
          <p className="text-xs text-[#2C3333]/50 mt-1">
            Actividad de los últimos {timeline.length} días
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-serif text-[#A27B5C]">
            +{timeline[timeline.length - 1]?.count || 0}
          </p>
          <p className="text-xs text-[#2C3333]/50">últimas 24h</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-32 mb-4">
        {timeline.map((item, index) => (
          <motion.div
            key={item.date}
            initial={{ height: 0 }}
            animate={{ height: `${(item.count / maxDaily) * 100}%` }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="flex-1 bg-[#A27B5C] rounded-t-lg relative group cursor-pointer"
            style={{ minHeight: item.count > 0 ? '4px' : '0' }}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#2C3333] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.count} confirmaciones
            </div>
          </motion.div>
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-[#2C3333]/50">
        {timeline.map((item) => (
          <span key={item.date} className="flex-1 text-center">
            {item.date}
          </span>
        ))}
      </div>

      {/* Cumulative line */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs font-medium text-[#2C3333] mb-3">
          Total acumulado: {timeline[timeline.length - 1]?.cumulative || 0} confirmaciones
        </p>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-[#2C3333] to-[#A27B5C] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
