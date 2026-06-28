import { Platform, type ViewStyle } from 'react-native';

import { questColors } from '@/constants/colors';
export { radii, spacing } from '@/constants/spacing';
export { typography } from '@/constants/typography';

type ShadowStyle = ViewStyle & {
  boxShadow?: string;
};

export const colors = {
  background: questColors.void,
  backgroundAlt: questColors.surface,
  surface: questColors.surface,
  surfaceMuted: questColors.surfaceUp,
  surfacePearl: questColors.surface,
  canvas: questColors.void,
  canvasParchment: questColors.surface,
  tile: questColors.surfaceUp,
  tileAlt: '#202033',
  ink: questColors.textPrimary,
  inkMuted: '#C7C3DA',
  inkSubtle: questColors.textSecondary,
  bodyMutedOnDark: '#C7C3DA',
  border: questColors.border,
  borderSoft: '#202030',
  borderStrong: '#35354A',
  primary: questColors.electric,
  primaryDark: '#5B22E5',
  primaryFocus: '#9B6CFF',
  primaryOnDark: '#A987FF',
  primarySoft: 'rgba(124, 58, 255, 0.16)',
  accent: questColors.acid,
  accentSoft: 'rgba(196, 255, 0, 0.14)',
  blue: questColors.electric,
  blueSoft: 'rgba(124, 58, 255, 0.16)',
  ember: questColors.ember,
  acid: questColors.acid,
  electric: questColors.electric,
  danger: questColors.danger,
  dangerSoft: 'rgba(255, 51, 95, 0.16)',
  success: questColors.success,
  successSoft: 'rgba(36, 209, 139, 0.14)',
  warning: questColors.warning,
  warningSoft: 'rgba(255, 209, 102, 0.14)',
  white: questColors.textPrimary,
  black: questColors.void,
} as const;

export const shadows = {
  card: Platform.select<ShadowStyle>({
    android: {
      elevation: 1,
    },
    web: {
      boxShadow: '0px 0px 20px rgba(124, 58, 255, 0.18)',
    },
    default: {
      shadowColor: questColors.electric,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
    },
  }),
  floating: Platform.select<ShadowStyle>({
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0px 0px 28px rgba(255, 77, 28, 0.22)',
    },
    default: {
      shadowColor: questColors.ember,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.22,
      shadowRadius: 32,
    },
  }),
  product: Platform.select<ShadowStyle>({
    android: {
      elevation: 6,
    },
    web: {
      boxShadow: '0px 0px 34px rgba(196, 255, 0, 0.16)',
    },
    default: {
      shadowColor: questColors.acid,
      shadowOffset: { width: 3, height: 5 },
      shadowOpacity: 0.16,
      shadowRadius: 30,
    },
  }),
} as const;

export const hitSlop = {
  sm: { bottom: 10, left: 10, right: 10, top: 10 },
  md: { bottom: 16, left: 16, right: 16, top: 16 },
} as const;
