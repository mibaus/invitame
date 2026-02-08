'use client';

import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Target,
  Heart,
  Users,
  Zap,
  CheckCircle2,
  Gift,
  Music,
  Calendar,
  Lock,
  Sparkles
} from 'lucide-react';
import type { DashboardData } from '@/app/actions/dashboard';

interface EngagementHubProps {
  data: DashboardData;
}

interface Badge {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  condition: (data: DashboardData, daysUntilEvent: number | null) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
}

const BADGES: Badge[] = [
  {
    id: 'first-steps',
    icon: <Star className="w-5 h-5" />,
    title: 'Primeros Pasos',
    description: 'Recibiste tu primera confirmación',
    condition: (data) => data.rsvps.length > 0,
    rarity: 'common',
    color: '#A27B5C',
  },
  {
    id: 'gathering-momentum',
    icon: <Users className="w-5 h-5" />,
    title: 'En Marcha',
    description: '50% de tus invitados confirmaron',
    condition: (data) => {
      const confirmed = data.rsvps.filter(r => r.attendance === true).length;
      const total = data.rsvps.length;
      return total > 0 && (confirmed / total) >= 0.5;
    },
    rarity: 'common',
    color: '#10B981',
  },
  {
    id: 'almost-there',
    icon: <Target className="w-5 h-5" />,
    title: 'Casi Listo',
    description: '75% de confirmaciones completado',
    condition: (data) => {
      const confirmed = data.stats.totalGuests;
      const total = data.stats.totalGuests + data.stats.declined;
      return total > 0 && (confirmed / total) >= 0.75;
    },
    rarity: 'rare',
    color: '#3B82F6',
  },
  {
    id: 'perfect-host',
    icon: <Trophy className="w-5 h-5" />,
    title: 'Anfitrión Perfecto',
    description: '100% de invitados confirmados',
    condition: (data) => {
      const noResponse = data.rsvps.filter(r => r.attendance === null).length;
      return data.rsvps.length > 10 && noResponse === 0;
    },
    rarity: 'legendary',
    color: '#F59E0B',
  },
  {
    id: 'considerate-host',
    icon: <Heart className="w-5 h-5" />,
    title: 'Anfitrión Considerado',
    description: 'Gestionaste 5+ restricciones dietéticas',
    condition: (data) => data.stats.specialMenus >= 5,
    rarity: 'rare',
    color: '#EC4899',
  },
  {
    id: 'party-planner',
    icon: <Music className="w-5 h-5" />,
    title: 'DJ Amateur',
    description: 'Recibiste 10+ sugerencias musicales',
    condition: (data) => data.stats.musicSuggestions >= 10,
    rarity: 'common',
    color: '#8B5CF6',
  },
  {
    id: 'early-bird',
    icon: <Calendar className="w-5 h-5" />,
    title: 'Organizado',
    description: 'Todo listo con 30+ días de anticipación',
    condition: (data, daysUntilEvent) => {
      const completion = data.stats.totalGuests + data.stats.declined > 0
        ? (data.stats.totalGuests / (data.stats.totalGuests + data.stats.declined)) * 100
        : 0;
      return completion >= 80 && daysUntilEvent !== null && daysUntilEvent >= 30;
    },
    rarity: 'epic',
    color: '#06B6D4',
  },
  {
    id: 'big-party',
    icon: <Gift className="w-5 h-5" />,
    title: 'Gran Celebración',
    description: '50+ invitados confirmados',
    condition: (data) => data.stats.totalGuests >= 50,
    rarity: 'epic',
    color: '#F97316',
  },
  {
    id: 'efficiency-master',
    icon: <Zap className="w-5 h-5" />,
    title: 'Velocidad Relámpago',
    description: '50% de confirmaciones en la primera semana',
    condition: (data) => {
      if (data.rsvps.length < 10) return false;
      const sorted = [...data.rsvps].sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      const firstDate = new Date(sorted[0].created_at);
      const oneWeekLater = new Date(firstDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const confirmedInFirstWeek = sorted.filter(r => 
        r.attendance === true && new Date(r.created_at) <= oneWeekLater
      ).length;
      return confirmedInFirstWeek >= data.rsvps.length * 0.5;
    },
    rarity: 'legendary',
    color: '#EAB308',
  },
];

const RARITY_STYLES = {
  common: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-600',
    glow: '',
  },
  rare: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    glow: 'shadow-blue-200',
  },
  epic: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    glow: 'shadow-purple-200',
  },
  legendary: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
    glow: 'shadow-amber-200',
  },
};

export function EngagementHub({ data }: EngagementHubProps) {
  const { invitation, rsvps, stats } = data;
  
  const eventDate = invitation.event_date ? new Date(invitation.event_date) : null;
  const today = new Date();
  const daysUntilEvent = eventDate
    ? Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Calculate earned badges
  const earnedBadges = BADGES.filter(badge => badge.condition(data, daysUntilEvent));
  const lockedBadges = BADGES.filter(badge => !badge.condition(data, daysUntilEvent));

  // Calculate progress metrics
  const completionRate = stats.totalGuests + stats.declined > 0
    ? Math.round((stats.totalGuests / (stats.totalGuests + stats.declined)) * 100)
    : 0;

  const nextMilestone = completionRate < 25 ? 25 : completionRate < 50 ? 50 : completionRate < 75 ? 75 : 100;
  const progressToNext = (completionRate / nextMilestone) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-black/5 p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-xl text-[#2C3333]">Tu Progreso</h3>
            <p className="text-xs text-[#2C3333]/50">
              {earnedBadges.length} de {BADGES.length} logros desbloqueados
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#A27B5C]" />
            <span className="text-2xl font-serif text-[#2C3333]">{earnedBadges.length}</span>
          </div>
        </div>

        {/* Progress to next milestone */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#2C3333]/50">Progreso hacia el siguiente hito</span>
            <span className="font-medium text-[#2C3333]">{completionRate}% / {nextMilestone}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-[#2C3333] to-[#A27B5C] rounded-full"
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-serif text-[#A27B5C]">{rsvps.length}</p>
            <p className="text-xs text-[#2C3333]/50">Respuestas</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-serif text-[#2C3333]">{stats.totalGuests}</p>
            <p className="text-xs text-[#2C3333]/50">Confirmados</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-serif text-[#2C3333]">{daysUntilEvent || '—'}</p>
            <p className="text-xs text-[#2C3333]/50">Días restantes</p>
          </div>
        </div>
      </motion.div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h4 className="font-medium text-[#2C3333] mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A27B5C]" />
            Logros Desbloqueados
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {earnedBadges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border ${RARITY_STYLES[badge.rarity].bg} ${RARITY_STYLES[badge.rarity].border} ${RARITY_STYLES[badge.rarity].glow} shadow-sm`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${badge.color}20`, color: badge.color }}
                >
                  {badge.icon}
                </div>
                <h5 className={`font-medium text-sm ${RARITY_STYLES[badge.rarity].text}`}>
                  {badge.title}
                </h5>
                <p className="text-xs text-[#2C3333]/50 mt-1">
                  {badge.description}
                </p>
                <span className={`text-[10px] uppercase tracking-wider mt-2 inline-block px-2 py-0.5 rounded ${RARITY_STYLES[badge.rarity].bg} ${RARITY_STYLES[badge.rarity].text}`}>
                  {badge.rarity}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h4 className="font-medium text-[#2C3333] mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#2C3333]/40" />
            Próximos Logros
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {lockedBadges.slice(0, 3).map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 opacity-60"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center mb-2 text-gray-400">
                  {badge.icon}
                </div>
                <h5 className="font-medium text-sm text-gray-500">
                  {badge.title}
                </h5>
                <p className="text-xs text-gray-400 mt-1">
                  {badge.description}
                </p>
              </motion.div>
            ))}
          </div>
          {lockedBadges.length > 3 && (
            <p className="text-center text-xs text-[#2C3333]/40 mt-3">
              +{lockedBadges.length - 3} logros más por desbloquear
            </p>
          )}
        </div>
      )}

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center p-4 bg-gradient-to-r from-[#E7D2CC]/30 to-[#A27B5C]/10 rounded-xl"
      >
        <p className="text-sm text-[#2C3333]/70 italic">
          {completionRate >= 75
            ? "¡Estás a punto de completar tu lista! Los últimos detalles son los más emocionantes."
            : completionRate >= 50
            ? "¡Vas por excelente camino! La mitad de tu lista ya está confirmada."
            : completionRate >= 25
            ? "¡Buen comienzo! Sigue compartiendo tu invitación para más confirmaciones."
            : "¡La aventura apenas comienza! Comparte tu invitación para recibir confirmaciones."}
        </p>
      </motion.div>
    </div>
  );
}
