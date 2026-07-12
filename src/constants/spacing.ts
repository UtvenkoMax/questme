export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  huge: 80,
} as const;

export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

/** Shared layout and interaction measurements. Keep touch targets at 44pt or above. */
export const control = {
  compact: 36,
  icon: 44,
  input: 52,
  button: 52,
  buttonLarge: 56,
  tabBar: 68,
} as const;

export const opacity = {
  disabled: 0.46,
  pressed: 0.82,
  subtle: 0.68,
} as const;

export const zIndex = {
  base: 0,
  sticky: 10,
  modal: 100,
  toast: 200,
} as const;
