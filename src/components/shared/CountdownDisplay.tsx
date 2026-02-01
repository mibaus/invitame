'use client';

import { useCountdown, formatCountdownUnit } from '@/hooks';
import { cn } from '@/lib/utils';
import type { CountdownConfig } from '@/types';

interface CountdownDisplayProps {
  config: CountdownConfig;
  className?: string;
}

interface TimeUnitProps {
  value: number;
  label: string;
  style: CountdownConfig['style'];
}

function TimeUnit({ value, label, style }: TimeUnitProps) {
  const styleClasses = {
    classic: 'bg-charcoal-900 text-gold-500 rounded-lg p-4 min-w-[80px]',
    flip: 'bg-gradient-to-b from-charcoal-800 to-charcoal-900 text-gold-400 rounded-xl p-4 min-w-[90px] shadow-xl',
    minimal: 'text-gold-500 p-2 min-w-[60px]',
    elegant:
      'bg-black/30 backdrop-blur-sm border border-gold-500/20 text-cream-100 rounded-2xl p-5 min-w-[100px]',
  };

  const numberStyles = {
    classic: 'text-4xl font-bold font-heading',
    flip: 'text-5xl font-bold font-heading tracking-wider',
    minimal: 'text-3xl font-light font-heading',
    elegant: 'text-5xl font-serif font-light tracking-wide',
  };

  const labelStyles = {
    classic: 'text-xs uppercase tracking-wider mt-1 text-cream-300',
    flip: 'text-xs uppercase tracking-widest mt-2 text-gold-300',
    minimal: 'text-xs uppercase tracking-wide mt-1 text-cream-400',
    elegant: 'text-sm uppercase tracking-[0.2em] mt-2 text-gold-400 font-light',
  };

  return (
    <div className={cn('flex flex-col items-center', styleClasses[style])}>
      <span className={numberStyles[style]}>{formatCountdownUnit(value)}</span>
      <span className={labelStyles[style]}>{label}</span>
    </div>
  );
}

export function CountdownDisplay({ config, className }: CountdownDisplayProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(config.target_date);

  if (!config.enabled) return null;

  if (isExpired) {
    return (
      <div className={cn('text-center', className)}>
        <p className="text-2xl font-heading text-gold-500">¡El gran día ha llegado!</p>
      </div>
    );
  }

  const gapStyles = {
    classic: 'gap-3',
    flip: 'gap-4',
    minimal: 'gap-2',
    elegant: 'gap-6',
  };

  return (
    <div className={cn('flex flex-wrap justify-center', gapStyles[config.style], className)}>
      <TimeUnit value={days} label="Días" style={config.style} />
      <TimeUnit value={hours} label="Horas" style={config.style} />
      <TimeUnit value={minutes} label="Minutos" style={config.style} />
      {config.show_seconds && <TimeUnit value={seconds} label="Segundos" style={config.style} />}
    </div>
  );
}
