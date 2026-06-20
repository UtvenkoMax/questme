export const questColors = {
  void: '#0A0A0F',
  surface: '#111118',
  surfaceUp: '#1A1A25',
  electric: '#7C3AFF',
  acid: '#C4FF00',
  ember: '#FF4D1C',
  textPrimary: '#F0EEFF',
  textSecondary: '#7B7A8E',
  border: '#2A2A3A',
  success: '#24D18B',
  warning: '#FFD166',
  danger: '#FF335F',
  overlay: 'rgba(10, 10, 15, 0.72)',
  overlayStrong: 'rgba(10, 10, 15, 0.9)',
} as const;

export const gradients = {
  heroShade: ['rgba(10,10,15,0.06)', 'rgba(10,10,15,0.62)', questColors.void] as const,
  electricGlow: ['rgba(124,58,255,0.18)', 'rgba(196,255,0,0.04)'] as const,
  emberCta: [questColors.ember, '#FF7A1C'] as const,
  cardNoise: ['rgba(255,255,255,0.05)', 'rgba(124,58,255,0.08)'] as const,
} as const;
