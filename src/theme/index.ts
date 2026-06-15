import { Platform, type TextStyle, type ViewStyle } from 'react-native';

type ShadowStyle = ViewStyle & {
  boxShadow?: string;
};

// Premium, modern, tech-friendly palette
export const colors = {
  background: '#F8FAFC', // Sleek slate background
  backgroundAlt: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  ink: '#0F172A', // Deep slate for text
  inkMuted: '#475569',
  inkSubtle: '#94A3B8',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  
  // Gamified, energetic Primary (Indigo/Violet)
  primary: '#4F46E5', // Vibrant Indigo
  primaryDark: '#3730A3',
  primarySoft: '#EEF2FF',
  
  // Accents for attention/actions
  accent: '#F59E0B', // Warm Amber for gamification elements
  accentSoft: '#FEF3C7',
  blue: '#3B82F6',
  blueSoft: '#EFF6FF',
  danger: '#EF4444',
  dangerSoft: '#FEF2F2',
  success: '#10B981',
  successSoft: '#ECFDF5',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
} as const;

export const radii = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24, // softer, more modern curves
  xl: 32,
  pill: 999,
} as const;

export const typography = {
  eyebrow: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  title: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
    lineHeight: 40,
  } satisfies TextStyle,
  titleCompact: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 34,
  } satisfies TextStyle,
  subtitle: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 24,
  } satisfies TextStyle,
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  } satisfies TextStyle,
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  } satisfies TextStyle,
} as const;

export const shadows = {
  card: Platform.select<ShadowStyle>({
    android: {
      elevation: 3,
    },
    web: {
      boxShadow: '0px 10px 24px rgba(15, 23, 42, 0.06)',
    },
    default: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.06,
      shadowRadius: 24,
    },
  }),
  floating: Platform.select<ShadowStyle>({
    android: {
      elevation: 12,
    },
    web: {
      boxShadow: '0px 20px 40px rgba(79, 70, 229, 0.15)',
    },
    default: {
      shadowColor: '#4F46E5', // Colored shadow for premium tech feel
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.15,
      shadowRadius: 32,
    },
  }),
} as const;

export const hitSlop = {
  sm: { bottom: 10, left: 10, right: 10, top: 10 },
  md: { bottom: 16, left: 16, right: 16, top: 16 },
} as const;
