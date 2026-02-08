'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Users,
  Target,
  Heart,
  Zap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Lightbulb
} from 'lucide-react';
import type { DashboardData } from '@/app/actions/dashboard';

interface EventStoryCardProps {
  data: DashboardData;
}

interface StoryMilestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'creation' | 'first_rsvp' | 'milestone_25' | 'milestone_50' | 'milestone_75' | 'event';
  completed: boolean;
}

interface SmartInsight {
  id: string;
  type: 'prediction' | 'suggestion' | 'alert' | 'celebration';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
}

export function EventStoryCard({ data }: EventStoryCardProps) {
  const { invitation, rsvps, stats } = data;
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);

  const eventDate = invitation.event_date ? new Date(invitation.event_date) : null;
  // Use first RSVP date or current date as fallback for timeline start
  const firstRsvpDate = rsvps.length > 0 
    ? new Date(Math.min(...rsvps.map(r => new Date(r.created_at).getTime())))
    : new Date();
  const today = new Date();

  // Calculate days until event
  const daysUntilEvent = useMemo(() => {
    if (!eventDate) return null;
    const diff = eventDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [eventDate, today]);

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    if (!stats.totalGuests) return 0;
    const expectedTotal = stats.totalGuests + stats.declined;
    return Math.round((stats.totalGuests / expectedTotal) * 100) || 0;
  }, [stats]);

  // Generate milestones
  const milestones: StoryMilestone[] = useMemo(() => {
    const list: StoryMilestone[] = [];
    
    // Start from first RSVP or current date
    const timelineStart = rsvps.length > 0 ? firstRsvpDate : new Date();

    if (rsvps.length > 0) {
      const firstRSVP = [...rsvps].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )[0];
      
      list.push({
        id: 'first_rsvp',
        title: 'Primera confirmación',
        description: `${firstRSVP.name} fue el primero en confirmar`,
        date: new Date(firstRSVP.created_at),
        type: 'first_rsvp',
        completed: true,
      });
    }

    const confirmedCount = rsvps.filter(r => r.attendance === true).length;
    
    if (confirmedCount >= 25) {
      list.push({
        id: 'milestone_25',
        title: '25% completado',
        description: 'Ya tienes a una cuarta parte de tus invitados',
        date: today,
        type: 'milestone_25',
        completed: true,
      });
    }

    if (confirmedCount >= 50) {
      list.push({
        id: 'milestone_50',
        title: '50% completado',
        description: '¡La mitad de tu lista ya confirmó!',
        date: today,
        type: 'milestone_50',
        completed: true,
      });
    }

    if (completionPercentage >= 75) {
      list.push({
        id: 'milestone_75',
        title: '75% completado',
        description: 'Casi listos, solo faltan unos pocos',
        date: today,
        type: 'milestone_75',
        completed: true,
      });
    }

    if (eventDate) {
      list.push({
        id: 'event',
        title: 'El gran día',
        description: `Tu ${invitation.skin_id === 'wedding' ? 'boda' : 'evento'} ha llegado`,
        date: eventDate,
        type: 'event',
        completed: daysUntilEvent !== null && daysUntilEvent <= 0,
      });
    }

    return list.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [firstRsvpDate, rsvps, completionPercentage, eventDate, invitation.skin_id, daysUntilEvent]);

  // Generate smart insights
  const insights: SmartInsight[] = useMemo(() => {
    const list: SmartInsight[] = [];

    // Prediction insight
    if (rsvps.length > 0 && daysUntilEvent && daysUntilEvent > 7) {
      const confirmed = rsvps.filter(r => r.attendance === true).length;
      const total = rsvps.length;
      const conversionRate = (confirmed / total) * 100;
      
      // Simple prediction based on days left and current rate
      const projectedAdditional = Math.round((confirmed / (30 - daysUntilEvent)) * daysUntilEvent);
      
      if (projectedAdditional > 0) {
        list.push({
          id: 'prediction',
          type: 'prediction',
          title: 'Proyección inteligente',
          message: `Basado en tu ritmo actual, podrías esperar ~${projectedAdditional} confirmaciones más antes del evento.`,
          icon: <TrendingUp className="w-5 h-5" />,
          priority: 'medium',
        });
      }
    }

    // Dietary alert
    const dietaryCount = rsvps.filter(r => r.dietary_restrictions || r.menu_notes).length;
    if (dietaryCount > 0) {
      const percentage = Math.round((dietaryCount / rsvps.length) * 100);
      if (percentage >= 10) {
        list.push({
          id: 'dietary',
          type: 'alert',
          title: 'Atención a menús especiales',
          message: `${percentage}% de tus invitados tienen restricciones alimentarias. Considera opciones de menú adicionales.`,
          icon: <AlertCircle className="w-5 h-5" />,
          priority: 'high',
        });
      }
    }

    // Celebration for milestones
    if (completionPercentage >= 75 && completionPercentage < 100) {
      list.push({
        id: 'celebration',
        type: 'celebration',
        title: '¡Casi lo logras!',
        message: `${completionPercentage}% de confirmaciones. ¡Estás muy cerca de completar tu lista!`,
        icon: <Sparkles className="w-5 h-5" />,
        priority: 'low',
      });
    }

    // Suggestion for high attendance
    if (stats.totalGuests > 0 && stats.totalGuests < 100 && daysUntilEvent && daysUntilEvent <= 14) {
      list.push({
        id: 'suggestion',
        type: 'suggestion',
        title: 'Sugerencia de organización',
        message: 'El evento está próximo. ¿Ya revisaste el seating plan y la distribución de mesas?',
        icon: <Lightbulb className="w-5 h-5" />,
        priority: 'medium',
      });
    }

    return list.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [rsvps, stats, completionPercentage, daysUntilEvent]);

  // Generate narrative
  const narrative = useMemo(() => {
    if (daysUntilEvent === null) {
      return {
        headline: 'Tu evento está tomando forma',
        subtext: `${rsvps.length} respuestas recibidas hasta ahora`,
        mood: 'neutral',
      };
    }

    if (daysUntilEvent <= 0) {
      return {
        headline: '¡El día ha llegado!',
        subtext: `Todo está listo para tu ${invitation.skin_id === 'wedding' ? 'gran día' : 'evento'}`,
        mood: 'celebration',
      };
    }

    if (completionPercentage >= 90) {
      return {
        headline: '¡Todo listo!',
        subtext: `${stats.totalGuests} invitados confirmados. Solo faltan ${daysUntilEvent} días.`,
        mood: 'celebration',
      };
    }

    if (completionPercentage >= 75) {
      return {
        headline: 'Casi completado',
        subtext: `Tu ${invitation.skin_id === 'wedding' ? 'boda' : 'evento'} está al ${completionPercentage}% listo`,
        mood: 'positive',
      };
    }

    if (completionPercentage >= 50) {
      return {
        headline: 'Vas por buen camino',
        subtext: `Ya tienes confirmada más de la mitad de tu lista`,
        mood: 'positive',
      };
    }

    if (rsvps.length === 0) {
      return {
        headline: 'La aventura comienza',
        subtext: `Faltan ${daysUntilEvent} días. Comparte tu invitación para recibir confirmaciones.`,
        mood: 'neutral',
      };
    }

    return {
      headline: 'En progreso',
      subtext: `${stats.totalGuests} confirmados de ${stats.totalGuests + stats.declined} esperados`,
      mood: 'neutral',
    };
  }, [daysUntilEvent, completionPercentage, rsvps.length, stats, invitation.skin_id]);

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'celebration':
        return 'from-[#A27B5C] to-[#D4A574]';
      case 'positive':
        return 'from-[#2C3333] to-[#3D4A4A]';
      default:
        return 'from-[#2C3333] to-[#4A5555]';
    }
  };

  const getMoodIcon = () => {
    switch (narrative.mood) {
      case 'celebration':
        return <Heart className="w-6 h-6 text-white" />;
      case 'positive':
        return <Zap className="w-6 h-6 text-white" />;
      default:
        return <Target className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Story Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br p-8 text-white shadow-xl"
        style={{
          background: `linear-gradient(135deg, #2C3333 0%, ${narrative.mood === 'celebration' ? '#A27B5C' : '#3D4A4A'} 100%)`,
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {getMoodIcon()}
                </div>
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-widest font-medium">
                    Resumen de tu evento
                  </p>
                  <h2 className="font-serif text-3xl text-white">
                    {narrative.headline}
                  </h2>
                </div>
              </motion.div>
              <p className="text-white/80 text-sm max-w-lg">
                {narrative.subtext}
              </p>
            </div>
            
            {daysUntilEvent !== null && daysUntilEvent > 0 && (
              <div className="text-right">
                <div className="inline-flex flex-col items-center px-6 py-4 bg-white/10 backdrop-blur-sm rounded-2xl">
                  <span className="text-4xl font-serif text-white">{daysUntilEvent}</span>
                  <span className="text-white/60 text-xs uppercase tracking-wider">días</span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-xs uppercase tracking-wider font-medium">
                Progreso de confirmaciones
              </span>
              <span className="text-white font-medium">
                {completionPercentage}%
              </span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>

          {/* Milestones Scroll */}
          <div className="relative">
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex-shrink-0 flex flex-col items-center min-w-[140px] p-4 rounded-2xl border-2 transition-all ${
                    milestone.completed
                      ? 'bg-white/20 border-white/30'
                      : 'bg-white/5 border-white/10 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    milestone.completed ? 'bg-white text-[#2C3333]' : 'bg-white/20 text-white/60'
                  }`}>
                    {milestone.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Calendar className="w-5 h-5" />
                    )}
                  </div>
                  <p className="text-white text-xs font-medium text-center mb-1">
                    {milestone.title}
                  </p>
                  <p className="text-white/50 text-[10px] text-center">
                    {milestone.date.toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Smart Insights */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                insight.type === 'prediction'
                  ? 'bg-blue-50/50 border-blue-200 hover:border-blue-300'
                  : insight.type === 'alert'
                  ? 'bg-amber-50/50 border-amber-200 hover:border-amber-300'
                  : insight.type === 'celebration'
                  ? 'bg-[#E7D2CC]/30 border-[#A27B5C]/30 hover:border-[#A27B5C]/50'
                  : 'bg-gray-50/50 border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setExpandedInsight(
                expandedInsight === insight.id ? null : insight.id
              )}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  insight.type === 'prediction'
                    ? 'bg-blue-100 text-blue-600'
                    : insight.type === 'alert'
                    ? 'bg-amber-100 text-amber-600'
                    : insight.type === 'celebration'
                    ? 'bg-[#A27B5C]/20 text-[#A27B5C]'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium text-sm ${
                      insight.type === 'prediction'
                        ? 'text-blue-900'
                        : insight.type === 'alert'
                        ? 'text-amber-900'
                        : insight.type === 'celebration'
                        ? 'text-[#2C3333]'
                        : 'text-gray-900'
                    }`}>
                      {insight.title}
                    </h3>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      insight.type === 'prediction'
                        ? 'text-blue-400'
                        : insight.type === 'alert'
                        ? 'text-amber-400'
                        : insight.type === 'celebration'
                        ? 'text-[#A27B5C]'
                        : 'text-gray-400'
                    } ${expandedInsight === insight.id ? 'rotate-90' : ''}`} />
                  </div>
                  <p className={`text-xs mt-1 ${
                    insight.type === 'prediction'
                      ? 'text-blue-700'
                      : insight.type === 'alert'
                      ? 'text-amber-700'
                      : insight.type === 'celebration'
                      ? 'text-[#2C3333]/70'
                      : 'text-gray-600'
                  }`}>
                    {insight.message}
                  </p>
                  
                  {expandedInsight === insight.id && insight.action && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`mt-3 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                        insight.type === 'prediction'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : insight.type === 'alert'
                          ? 'bg-amber-600 text-white hover:bg-amber-700'
                          : insight.type === 'celebration'
                          ? 'bg-[#A27B5C] text-white hover:bg-[#8B6B4E]'
                          : 'bg-gray-800 text-white hover:bg-gray-900'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        insight.action?.onClick();
                      }}
                    >
                      {insight.action.label}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper hook for scroll hiding
export function useScrollHide() {
  return {
    scrollbarHide: `
      scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `,
  };
}
