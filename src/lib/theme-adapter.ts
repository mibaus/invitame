/**
 * Theme Adapter - Sistema para adaptar componentes al tema bolt-dark
 */

export interface SkinTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  fontDisplay: string;
  fontBody: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  spacing: 'compact' | 'normal' | 'spacious';
}

export const SKIN_THEMES: Record<string, SkinTheme> = {
  'bolt-dark': {
    primary: '#ffffff',
    secondary: '#1a1a1a',
    accent: '#fbbf24', // amber-400
    background: '#000000',
    surface: '#18181b', // zinc-900
    fontDisplay: "'Cormorant Garamond', serif",
    fontBody: "'Lato', sans-serif",
    borderRadius: 'md',
    spacing: 'spacious',
  },
  'avant-garde-editorial': {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#FF0000', // red
    background: '#ffffff',
    surface: '#f5f5f5',
    fontDisplay: "'Playfair Display', serif",
    fontBody: "'Inter', sans-serif",
    borderRadius: 'none',
    spacing: 'normal',
  },
  'soft-seraphic': {
    primary: '#4a4a4a',
    secondary: '#fcf9f2',
    accent: '#96adc0', // soft blue-gray
    background: '#fcf9f2', // linen
    surface: '#ffffff',
    fontDisplay: "'Pinyon Script', cursive",
    fontBody: "'Montserrat', sans-serif",
    borderRadius: 'lg',
    spacing: 'spacious',
  },
  'japandi-zen': {
    primary: '#5C5B57', // piedra caliente
    secondary: '#F5F2EB', // marfil roto
    accent: '#B8956A', // bronce mate
    background: '#FAF8F5', // arena
    surface: '#F0EDE6', // lino natural
    fontDisplay: "'Playfair Display', serif",
    fontBody: "'Montserrat', sans-serif",
    borderRadius: 'md',
    spacing: 'spacious',
  },
  'the-monogram-edit': {
    primary: '#1A1A1A', // grafito profundo
    secondary: '#FFFFFF', // blanco puro
    accent: '#4A4A4A', // gris medio
    background: '#FFFFFF', // blanco puro
    surface: '#FAFAFA', // blanco roto
    fontDisplay: "'Cormorant Garamond', serif",
    fontBody: "'Inter', sans-serif",
    borderRadius: 'none',
    spacing: 'spacious',
  },
  'legacy-editorial': {
    primary: '#2C3333', // charcoal oscuro
    secondary: '#F8F9FA', // blanco roto
    accent: '#A27B5C', // bronce
    background: '#F8F9FA', // blanco roto
    surface: '#E7D2CC', // dusty rose
    fontDisplay: "'Butler', 'Playfair Display', serif",
    fontBody: "'Montserrat', sans-serif",
    borderRadius: 'none',
    spacing: 'spacious',
  },
};

export function getThemeClasses(skinId: string) {
  const theme = SKIN_THEMES['bolt-dark'];

  return {
    section: `py-16 md:py-24 px-4`,
    container: `max-w-4xl mx-auto`,
    card: `p-6 rounded-md border border-current/10`,
    heading: `text-3xl md:text-4xl lg:text-5xl font-light`,
    subheading: `text-xl md:text-2xl`,
    body: `text-base leading-relaxed`,
    label: `text-xs uppercase tracking-wider font-semibold`,
    input: `w-full px-4 py-3 bg-white/10 border border-current/20 rounded-md focus:outline-none focus:border-current/50 transition-colors`,
    textarea: `w-full px-4 py-3 bg-white/10 border border-current/20 rounded-md focus:outline-none focus:border-current/50 transition-colors min-h-[100px] resize-none`,
    button: `px-6 py-3 rounded-md border border-current transition-all hover:bg-current/10`,
    buttonPrimary: `px-6 py-3 rounded-md bg-current text-white transition-all hover:opacity-90`,
    spacing: 'space-y-8',
  };
}

export function getThemeStyles(skinId: string) {
  const theme = SKIN_THEMES['bolt-dark'];

  return {
    colors: {
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
      background: theme.background,
      surface: theme.surface,
    },
    fonts: {
      display: theme.fontDisplay,
      body: theme.fontBody,
    },
    section: {
      backgroundColor: theme.background,
      color: theme.primary,
    },
    card: {
      backgroundColor: theme.surface,
      borderColor: `${theme.primary}20`,
    },
    heading: {
      fontFamily: theme.fontDisplay,
      color: theme.primary,
    },
    body: {
      fontFamily: theme.fontBody,
      color: theme.primary,
    },
    accent: {
      color: theme.accent,
    },
  };
}

export function useTheme(skinId: string) {
  const theme = SKIN_THEMES['bolt-dark'];
  const classes = getThemeClasses(skinId);
  const styles = getThemeStyles(skinId);

  return {
    theme,
    classes,
    styles,
  };
}
