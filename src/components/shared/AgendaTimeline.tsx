'use client';

import type { AgendaItem } from '@/types';

interface AgendaTimelineProps {
  items: AgendaItem[];
  className?: string;
  styles?: {
    containerClassName?: string;
    itemClassName?: string;
    timeClassName?: string;
    titleClassName?: string;
  };
}

/**
 * AgendaTimeline - Componente para mostrar la agenda del evento
 */
export function AgendaTimeline({
  items,
  className = '',
  styles = {},
}: AgendaTimelineProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`agenda-timeline ${className} ${styles.containerClassName || ''}`}>
      <div className="space-y-6">
        {items.map((item, index) => (
          <AgendaTimelineItem
            key={item.id}
            item={item}
            isLast={index === items.length - 1}
            styles={styles}
          />
        ))}
      </div>
    </div>
  );
}

interface AgendaTimelineItemProps {
  item: AgendaItem;
  isLast: boolean;
  styles?: {
    itemClassName?: string;
    timeClassName?: string;
    titleClassName?: string;
  };
}

function AgendaTimelineItem({ item, isLast, styles = {} }: AgendaTimelineItemProps) {
  return (
    <div className={`agenda-item flex gap-4 ${styles.itemClassName || ''}`}>
      {/* Time Column */}
      <div className="agenda-time flex-shrink-0 w-16 text-right">
        <span className={`font-heading text-lg ${styles.timeClassName || ''}`}>
          {item.time}
        </span>
      </div>

      {/* Timeline Connector */}
      <div className="agenda-connector flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-current opacity-60" />
        {!isLast && <div className="w-px flex-1 bg-current opacity-20 my-1" />}
      </div>

      {/* Content */}
      <div className="agenda-content flex-1 pb-6">
        <h4 className={`font-medium ${styles.titleClassName || ''}`}>
          {item.title}
        </h4>
        {item.description && (
          <p className="text-sm opacity-60 mt-1">{item.description}</p>
        )}
        {item.location && (
          <p className="text-xs opacity-40 mt-2 flex items-center gap-1">
            <LocationIcon className="w-3 h-3" />
            {item.location}
          </p>
        )}
      </div>
    </div>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    </svg>
  );
}
