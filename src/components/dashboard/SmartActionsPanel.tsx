'use client';

import { motion } from 'framer-motion';
import {
  Send,
  Bell,
  Download,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';
import type { DashboardData } from '@/app/actions/dashboard';

interface SmartActionsPanelProps {
  data: DashboardData;
}

interface SmartAction {
  id: string;
  type: 'reminder' | 'export' | 'insight' | 'alert' | 'suggestion';
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  action: {
    label: string;
    onClick: () => void;
  };
}

export function SmartActionsPanel({ data }: SmartActionsPanelProps) {
  const { invitation, rsvps, stats } = data;

  const eventDate = invitation.event_date ? new Date(invitation.event_date) : null;
  const today = new Date();
  const daysUntilEvent = eventDate
    ? Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Generate smart actions based on data
  const smartActions: SmartAction[] = (() => {
    const actions: SmartAction[] = [];

    // 1. Reminder Action - If event is close and not all confirmed
    if (daysUntilEvent && daysUntilEvent <= 14 && daysUntilEvent > 0) {
      const pendingCount = rsvps.filter(r => r.attendance === null).length;
      if (pendingCount > 0) {
        actions.push({
          id: 'reminder-close',
          type: 'reminder',
          title: 'Evento próximo',
          description: `Faltan ${daysUntilEvent} días. Envía recordatorio a ${pendingCount} invitados pendientes.`,
          icon: <Bell className="w-5 h-5" />,
          priority: 'high',
          action: {
            label: 'Enviar recordatorio',
            onClick: () => {
              // TODO: Implement reminder action
              console.log('Sending reminder to pending guests');
            },
          },
        });
      }
    }

    // 2. Export Action - If have data and event is close
    if (rsvps.length > 0 && daysUntilEvent && daysUntilEvent <= 7) {
      actions.push({
        id: 'export-final',
        type: 'export',
        title: 'Lista final para catering',
        description: 'Exporta la lista definitiva de invitados confirmados para el catering.',
        icon: <Download className="w-5 h-5" />,
        priority: 'high',
        action: {
          label: 'Exportar lista',
          onClick: () => {
            // TODO: Trigger export
            console.log('Exporting final list');
          },
        },
      });
    }

    // 3. Insight Action - Dietary restrictions
    const dietaryCount = rsvps.filter(r => r.dietary_restrictions || r.menu_notes).length;
    if (dietaryCount >= 5) {
      const percentage = Math.round((dietaryCount / rsvps.length) * 100);
      actions.push({
        id: 'dietary-insight',
        type: 'insight',
        title: `${percentage}% tienen restricciones alimentarias`,
        description: 'Considera agregar opciones de menú vegetarianas/veganas.',
        icon: <TrendingUp className="w-5 h-5" />,
        priority: 'medium',
        action: {
          label: 'Ver detalles',
          onClick: () => {
            // TODO: Filter by dietary
            console.log('Filtering dietary restrictions');
          },
        },
      });
    }

    // 4. Alert Action - Low confirmation rate
    if (rsvps.length > 10) {
      const confirmed = rsvps.filter(r => r.attendance === true).length;
      const rate = (confirmed / rsvps.length) * 100;
      if (rate < 50 && daysUntilEvent && daysUntilEvent <= 30) {
        actions.push({
          id: 'low-rate',
          type: 'alert',
          title: 'Tasa de confirmación baja',
          description: `Solo ${Math.round(rate)}% han confirmado. Considera enviar un recordatorio personalizado.`,
          icon: <AlertCircle className="w-5 h-5" />,
          priority: 'high',
          action: {
            label: 'Ver estrategias',
            onClick: () => {
              console.log('Showing reminder strategies');
            },
          },
        });
      }
    }

    // 5. Suggestion - Celebration when high completion
    const completionRate = stats.totalGuests + stats.declined > 0
      ? (stats.totalGuests / (stats.totalGuests + stats.declined)) * 100
      : 0;
    if (completionRate >= 80 && completionRate < 100) {
      actions.push({
        id: 'celebration',
        type: 'suggestion',
        title: '¡Casi completado!',
        description: `${Math.round(completionRate)}% de tu lista está confirmada. ¡Estás muy cerca!`,
        icon: <Sparkles className="w-5 h-5" />,
        priority: 'low',
        action: {
          label: 'Compartir progreso',
          onClick: () => {
            console.log('Sharing progress');
          },
        },
      });
    }

    // 6. Suggestion - Large groups optimization
    const largeGroups = rsvps.filter(r => r.guests_count >= 4).length;
    if (largeGroups >= 3) {
      actions.push({
        id: 'large-groups',
        type: 'suggestion',
        title: 'Familias grandes detectadas',
        description: `${largeGroups} grupos de 4+ personas. Considera mesas familiares en el seating plan.`,
        icon: <Users className="w-5 h-5" />,
        priority: 'medium',
        action: {
          label: 'Ver grupos',
          onClick: () => {
            console.log('Viewing large groups');
          },
        },
      });
    }

    return actions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  })();

  if (smartActions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-black/5 p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#A27B5C]/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-[#A27B5C]" />
          </div>
          <div>
            <h3 className="font-medium text-[#2C3333]">Todo en orden</h3>
            <p className="text-xs text-[#2C3333]/50">
              No hay acciones urgentes por ahora. Sigue así.
            </p>
          </div>
        </div>
        <div className="h-2 bg-[#E7D2CC]/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1 }}
            className="h-full bg-[#A27B5C] rounded-full"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2C3333] to-[#3D4A4A] flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-[#2C3333]">Acciones inteligentes sugeridas</h3>
          <p className="text-xs text-[#2C3333]/50">
            Basado en tus datos, aquí hay acciones que podrían ayudarte
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {smartActions.slice(0, 3).map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border transition-all cursor-pointer group ${
              action.priority === 'high'
                ? 'bg-red-50/50 border-red-200 hover:border-red-300'
                : action.priority === 'medium'
                ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                : 'bg-blue-50/50 border-blue-200 hover:border-blue-300'
            }`}
            onClick={action.action.onClick}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  action.priority === 'high'
                    ? 'bg-red-100 text-red-600'
                    : action.priority === 'medium'
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`font-medium text-sm ${
                      action.priority === 'high'
                        ? 'text-red-900'
                        : action.priority === 'medium'
                        ? 'text-amber-900'
                        : 'text-blue-900'
                    }`}
                  >
                    {action.title}
                  </h4>
                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-1 ${
                      action.priority === 'high'
                        ? 'text-red-400'
                        : action.priority === 'medium'
                        ? 'text-amber-400'
                        : 'text-blue-400'
                    }`}
                  />
                </div>
                <p
                  className={`text-xs mt-1 ${
                    action.priority === 'high'
                      ? 'text-red-700'
                      : action.priority === 'medium'
                      ? 'text-amber-700'
                      : 'text-blue-700'
                  }`}
                >
                  {action.description}
                </p>
                <div className="mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      action.action.onClick();
                    }}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                      action.priority === 'high'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : action.priority === 'medium'
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {action.action.label}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {smartActions.length > 3 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full py-3 text-center text-xs text-[#2C3333]/60 hover:text-[#2C3333] transition-colors"
          >
            Ver {smartActions.length - 3} sugerencias más
          </motion.button>
        )}
      </div>
    </div>
  );
}
