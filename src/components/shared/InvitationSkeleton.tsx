'use client';

import { cn } from '@/lib/utils';

/**
 * InvitationSkeleton - Loading state para invitaciones
 * UX Bible: Loading States - Skeleton screens que reflejan estructura real
 */

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

function SkeletonPulse({ className, style }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "animate-pulse rounded",
        "bg-gradient-to-r from-sandstone-light via-warm-cream to-sandstone-light",
        "bg-[length:200%_100%]",
        className
      )}
      style={{
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

export function InvitationSkeleton() {
  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Hero Skeleton */}
      <section className="relative h-screen flex flex-col items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-sandstone/30 to-sandstone-light/50" />
        
        <div className="relative z-10 text-center space-y-6 w-full max-w-lg">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4">
            <SkeletonPulse className="h-px w-16" />
            <SkeletonPulse className="h-2 w-2 rotate-45" />
            <SkeletonPulse className="h-px w-16" />
          </div>
          
          {/* Subtitle */}
          <SkeletonPulse className="h-4 w-32 mx-auto" />
          
          {/* Main title */}
          <SkeletonPulse className="h-16 w-72 mx-auto" />
          
          {/* Date */}
          <SkeletonPulse className="h-6 w-56 mx-auto" />
          
          {/* Countdown */}
          <div className="flex justify-center gap-4 pt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <SkeletonPulse className="h-12 w-12 mx-auto mb-2" />
                <SkeletonPulse className="h-3 w-10 mx-auto" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <SkeletonPulse className="h-6 w-6 rounded-full" />
        </div>
      </section>

      {/* Message Section Skeleton */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <SkeletonPulse className="h-4 w-24 mx-auto mb-8" />
          <SkeletonPulse className="h-5 w-48 mx-auto" />
          <SkeletonPulse className="h-5 w-40 mx-auto mb-12" />
          
          <SkeletonPulse className="h-4 w-full" />
          <SkeletonPulse className="h-4 w-5/6 mx-auto" />
          <SkeletonPulse className="h-4 w-4/5 mx-auto" />
        </div>
      </section>

      {/* Gallery Skeleton */}
      <section className="py-20 px-4 bg-sandstone-light/20">
        <div className="max-w-5xl mx-auto">
          <SkeletonPulse className="h-8 w-56 mx-auto mb-12" />
          <div className="flex gap-4 overflow-hidden justify-center">
            {[1, 2, 3].map((i) => (
              <SkeletonPulse key={i} className="h-48 w-48 rounded-lg flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>

      {/* Venue Skeleton */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <SkeletonPulse className="h-8 w-32 mx-auto mb-12" />
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="p-6 rounded-xl bg-warm-cream-light">
                <SkeletonPulse className="h-6 w-32 mb-4" />
                <SkeletonPulse className="h-4 w-full mb-2" />
                <SkeletonPulse className="h-4 w-3/4 mb-4" />
                <SkeletonPulse className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky CTA Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-warm-cream/95 backdrop-blur-sm border-t border-sandstone/20">
        <div className="max-w-md mx-auto">
          <SkeletonPulse className="h-14 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonPulse 
          key={i} 
          className="h-4" 
          style={{ width: `${100 - (i * 10)}%` }} 
        />
      ))}
    </div>
  );
}
