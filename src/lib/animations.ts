import type { Transition, Variants } from 'framer-motion';

/**
 * INVITA.ME - Framer Motion Animation Presets
 * Based on: docs/DESIGN_BIBLE.md Section V & IX
 * 
 * Each tier has a distinct "feel":
 * - Essential: Imperceptible, ultra-refined movement
 * - Pro: Presence with personality, satisfying snap
 * - Premium: Dramatic, memorable, tactile theater
 */

/* =============================================
   SPRING CONFIGURATIONS BY TIER
   ============================================= */

export const essentialSpring: Transition = {
  type: 'spring',
  stiffness: 120,
  damping: 25,
  mass: 1,
};

export const proSpring: Transition = {
  type: 'spring',
  stiffness: 100,
  damping: 15,
  mass: 0.8,
  bounce: 0.15,
};

export const premiumSpring: Transition = {
  type: 'spring',
  stiffness: 80,
  damping: 12,
  mass: 0.6,
  bounce: 0.25,
};

/* =============================================
   SPRING PRESETS MAP
   ============================================= */

export type AnimationTier = 'essential' | 'pro' | 'premium';

export const springPresets: Record<AnimationTier, Transition> = {
  essential: essentialSpring,
  pro: proSpring,
  premium: premiumSpring,
};

/* =============================================
   EASING CURVES
   ============================================= */

export const easings = {
  luxury: [0.25, 0.1, 0.25, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const,
  snap: [0.4, 0, 0, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
};

/* =============================================
   FADE VARIANTS
   ============================================= */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easings.luxury,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

/* =============================================
   STAGGER CONTAINER VARIANTS
   ============================================= */

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

/* =============================================
   STAGGER ITEM VARIANTS (by tier)
   ============================================= */

export const staggerItemEssential: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: essentialSpring,
  },
};

export const staggerItemPro: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: proSpring,
  },
};

export const staggerItemPremium: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: premiumSpring,
  },
};

export const staggerItems: Record<AnimationTier, Variants> = {
  essential: staggerItemEssential,
  pro: staggerItemPro,
  premium: staggerItemPremium,
};

/* =============================================
   BUTTON / TAP VARIANTS
   ============================================= */

export const buttonTap: Variants = {
  initial: { scale: 1 },
  tap: { 
    scale: 0.98,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
    },
  },
};

export const buttonTapSubtle: Variants = {
  initial: { scale: 1 },
  tap: { 
    scale: 0.99,
    transition: {
      type: 'spring',
      stiffness: 600,
      damping: 35,
    },
  },
  hover: {
    scale: 1.01,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
  },
};

/* =============================================
   PAGE TRANSITION VARIANTS
   ============================================= */

export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: easings.luxury,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(4px)',
    transition: {
      duration: 0.3,
    },
  },
};

export const pageTransitionSimple: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: easings.smooth,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/* =============================================
   SCALE VARIANTS
   ============================================= */

export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9 
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: proSpring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

export const popIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8 
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
      bounce: 0.3,
    },
  },
};

/* =============================================
   INVITATION ENTRY TIMELINE
   Based on Design Bible Section V
   ============================================= */

export const invitationEntryTimeline = {
  background: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.6, ease: easings.luxury },
    },
  },
  heroTypography: {
    initial: { opacity: 0, y: 40 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.2,
        type: 'spring',
        stiffness: 80,
        damping: 20,
      },
    },
  },
  dateLocation: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.4,
        duration: 0.4,
        ease: easings.smooth,
      },
    },
  },
  decorativeElements: {
    initial: { opacity: 0 },
    animate: (custom: number) => ({
      opacity: 1,
      transition: { 
        delay: 0.6 + (custom * 0.1),
        ...proSpring,
      },
    }),
  },
  ctaButton: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 1,
        type: 'spring',
        stiffness: 150,
        damping: 15,
        bounce: 0.3,
      },
    },
  },
};

/* =============================================
   DRAG / INERTIA CONFIG (Premium tier)
   ============================================= */

export const dragInertiaConfig = {
  power: 0.8,
  timeConstant: 700,
  bounceStiffness: 300,
  bounceDamping: 20,
};

/* =============================================
   PARALLAX HELPERS
   ============================================= */

export const parallaxConfig = {
  background: { inputRange: [0, 1], outputRange: ['0%', '30%'] },
  midground: { inputRange: [0, 1], outputRange: ['0%', '15%'] },
  foreground: { inputRange: [0, 1], outputRange: ['0%', '-10%'] },
};

/* =============================================
   REDUCED MOTION VARIANTS
   ============================================= */

export const reducedMotionFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.01 },
  },
};

export function getMotionSafeVariants(
  variants: Variants,
  prefersReducedMotion: boolean
): Variants {
  return prefersReducedMotion ? reducedMotionFade : variants;
}
