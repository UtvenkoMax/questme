import { Platform, type TextStyle, type ViewStyle } from 'react-native';

type ShadowStyle = ViewStyle & {
  boxShadow?: string;
};

const systemFontFamily = Platform.select({
  web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  default: undefined,
});

export const colors = {
  background: '#F5F5F7',
  backgroundAlt: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#FAFAFC',
  surfacePearl: '#FAFAFC',
  canvas: '#FFFFFF',
  canvasParchment: '#F5F5F7',
  tile: '#272729',
  tileAlt: '#2A2A2C',
  ink: '#1D1D1F',
  inkMuted: '#333333',
  inkSubtle: '#7A7A7A',
  bodyMutedOnDark: '#CCCCCC',
  border: '#E0E0E0',
  borderSoft: '#F0F0F0',
  borderStrong: '#D2D2D7',
  primary: '#0066CC',
  primaryDark: '#0051A3',
  primaryFocus: '#0071E3',
  primaryOnDark: '#2997FF',
  primarySoft: '#EAF4FF',
  accent: '#0066CC',
  accentSoft: '#EAF4FF',
  blue: '#0066CC',
  blueSoft: '#EAF4FF',
  danger: '#B42318',
  dangerSoft: '#FFF1F0',
  success: '#227A55',
  successSoft: '#F0FAF5',
  warning: '#8A5A00',
  warningSoft: '#FFF7E6',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 17,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 80,
} as const;

export const radii = {
  xs: 5,
  sm: 8,
  md: 11,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  eyebrow: {
    fontFamily: systemFontFamily,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 18,
  } satisfies TextStyle,
  title: {
    fontFamily: systemFontFamily,
    fontSize: 40,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 44,
  } satisfies TextStyle,
  titleCompact: {
    fontFamily: systemFontFamily,
    fontSize: 34,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 40,
  } satisfies TextStyle,
  subtitle: {
    fontFamily: systemFontFamily,
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 25,
  } satisfies TextStyle,
  body: {
    fontFamily: systemFontFamily,
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 25,
  } satisfies TextStyle,
  label: {
    fontFamily: systemFontFamily,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 18,
  } satisfies TextStyle,
  caption: {
    fontFamily: systemFontFamily,
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 20,
  } satisfies TextStyle,
  captionStrong: {
    fontFamily: systemFontFamily,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 18,
  } satisfies TextStyle,
  nav: {
    fontFamily: systemFontFamily,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 14,
  } satisfies TextStyle,
} as const;

export const shadows = {
  card: Platform.select<ShadowStyle>({
    android: {
      elevation: 1,
    },
    web: {
      boxShadow: '0px 14px 34px rgba(0, 0, 0, 0.04)',
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.04,
      shadowRadius: 24,
    },
  }),
  floating: Platform.select<ShadowStyle>({
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0px 18px 46px rgba(0, 0, 0, 0.08)',
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.08,
      shadowRadius: 32,
    },
  }),
  product: Platform.select<ShadowStyle>({
    android: {
      elevation: 6,
    },
    web: {
      boxShadow: '3px 5px 30px rgba(0, 0, 0, 0.22)',
    },
    default: {
      shadowColor: '#000000',
      shadowOffset: { width: 3, height: 5 },
      shadowOpacity: 0.22,
      shadowRadius: 30,
    },
  }),
} as const;

export const hitSlop = {
  sm: { bottom: 10, left: 10, right: 10, top: 10 },
  md: { bottom: 16, left: 16, right: 16, top: 16 },
} as const;
