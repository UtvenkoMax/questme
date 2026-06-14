import { Platform, type TextStyle, type ViewStyle } from 'react-native';

type ShadowStyle = ViewStyle & {
  boxShadow?: string;
};

export const colors = {
  background: '#F6F4EF',
  backgroundAlt: '#EEF4F1',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F3',
  ink: '#151A22',
  inkMuted: '#53606E',
  inkSubtle: '#7B8591',
  border: '#DDE4DF',
  borderStrong: '#C6D1CB',
  primary: '#206C5C',
  primaryDark: '#144E43',
  primarySoft: '#DDEDE7',
  accent: '#F4B740',
  accentSoft: '#FFF1CC',
  blue: '#2F6FED',
  blueSoft: '#E5EEFF',
  danger: '#BD3D3D',
  dangerSoft: '#FCE7E7',
  success: '#227A55',
  successSoft: '#DCF2E7',
  warning: '#B56B10',
  warningSoft: '#FFF2D8',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const typography = {
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 38,
  } satisfies TextStyle,
  titleCompact: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 32,
  } satisfies TextStyle,
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  } satisfies TextStyle,
  body: {
    fontSize: 15,
    lineHeight: 22,
  } satisfies TextStyle,
  label: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  } satisfies TextStyle,
} as const;

export const shadows = {
  card: Platform.select<ShadowStyle>({
    android: {
      elevation: 2,
    },
    web: {
      boxShadow: '0px 8px 18px rgba(16, 24, 32, 0.08)',
    },
    default: {
      shadowColor: '#101820',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
    },
  }),
  floating: Platform.select<ShadowStyle>({
    android: {
      elevation: 8,
    },
    web: {
      boxShadow: '0px 12px 28px rgba(16, 24, 32, 0.12)',
    },
    default: {
      shadowColor: '#101820',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 28,
    },
  }),
} as const;

export const hitSlop = {
  sm: { bottom: 8, left: 8, right: 8, top: 8 },
  md: { bottom: 12, left: 12, right: 12, top: 12 },
} as const;
