'use client';

import { forwardRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface PaperSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 1 | 2 | 3;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

interface NoiseConfig {
  baseFrequency: number;
  numOctaves: number;
  opacity: number;
}

const NOISE_CONFIG: Record<'low' | 'medium' | 'high', NoiseConfig> = {
  low: {
    baseFrequency: 0.85,
    numOctaves: 4,
    opacity: 0.025,
  },
  medium: {
    baseFrequency: 0.6,
    numOctaves: 3,
    opacity: 0.045,
  },
  high: {
    baseFrequency: 0.4,
    numOctaves: 3,
    opacity: 0.065,
  },
};

const ELEVATION_SHADOWS: Record<1 | 2 | 3 | 4, string> = {
  1: 'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.03)]',
  2: 'shadow-[0_4px_6px_rgba(0,0,0,0.04),0_10px_20px_rgba(0,0,0,0.03)]',
  3: 'shadow-[0_8px_16px_rgba(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.06),0_40px_80px_rgba(0,0,0,0.04)]',
  4: 'shadow-[0_8px_16px_rgba(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.06),0_40px_80px_rgba(0,0,0,0.04)]', // Fallback
};

function generateNoiseSvg(config: NoiseConfig): string {
  const svg = `<svg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='${config.baseFrequency}' numOctaves='${config.numOctaves}' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23noise)' opacity='${config.opacity}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export const PaperSurface = forwardRef<HTMLDivElement, PaperSurfaceProps>(
  ({ children, elevation = 1, intensity = 'medium', className, style, ...props }, ref) => {
    const noiseConfig = NOISE_CONFIG[intensity];

    // We can randomize or memoize. Static is better for SSR consistency if possible, 
    // but here it depends on config props.
    const noiseSvgUrl = useMemo(() => generateNoiseSvg(noiseConfig), [noiseConfig]);

    const combinedStyle: React.CSSProperties = {
      ...style,
      backgroundImage: `${noiseSvgUrl}`,
      backgroundBlendMode: 'soft-light',
      backgroundSize: '256px 256px',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative bg-white', // Default base color
          ELEVATION_SHADOWS[elevation],
          className
        )}
        style={combinedStyle}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PaperSurface.displayName = 'PaperSurface';

export default PaperSurface;
