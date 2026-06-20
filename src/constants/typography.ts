import { Platform, type TextStyle } from 'react-native';

export const fontFamilies = {
  display: 'SpaceGrotesk_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_600SemiBold',
  mono: 'JetBrainsMono_600SemiBold',
} as const;

const webFallbacks = Platform.select({
  web: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  default: undefined,
});

export const typeScale = {
  micro: 11,
  caption: 13,
  body: 15,
  bodyLarge: 18,
  titleSmall: 24,
  title: 32,
  display: 48,
  mega: 64,
} as const;

export const typography = {
  display: {
    fontFamily: Platform.select({ web: webFallbacks, default: fontFamilies.display }),
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 50,
  } satisfies TextStyle,
  title: {
    fontFamily: Platform.select({ web: webFallbacks, default: fontFamilies.display }),
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 36,
  } satisfies TextStyle,
  titleCompact: {
    fontFamily: Platform.select({ web: webFallbacks, default: fontFamilies.display }),
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 28,
  } satisfies TextStyle,
  subtitle: {
    fontFamily: Platform.select({ web: webFallbacks, default: fontFamilies.bodyMedium }),
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 25,
  } satisfies TextStyle,
  body: {
    fontFamily: Platform.select({ web: webFallbacks, default: fontFamilies.body }),
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 22,
  } satisfies TextStyle,
  label: {
    fontFamily: Platform.select({ web: webFallbacks, default: fontFamilies.mono }),
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 18,
  } satisfies TextStyle,
  eyebrow: {
    fontFamily: Platform.select({ web: webFallbacks, default: fontFamilies.mono }),
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 16,
  } satisfies TextStyle,
  caption: {
    fontFamily: Platform.select({ web: webFallbacks, default: fontFamilies.body }),
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 18,
  } satisfies TextStyle,
  captionStrong: {
    fontFamily: Platform.select({ web: webFallbacks, default: fontFamilies.bodyMedium }),
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 18,
  } satisfies TextStyle,
  nav: {
    fontFamily: Platform.select({ web: webFallbacks, default: fontFamilies.mono }),
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 14,
  } satisfies TextStyle,
} as const;
