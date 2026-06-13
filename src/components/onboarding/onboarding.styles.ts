import { Platform, StyleSheet, type ViewStyle } from 'react-native';

export const THUMB_SIZE = 60;
export const TRACK_PADDING = 4;

const panelShadow = Platform.select<ViewStyle>({
  default: {
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  web: {
    boxShadow: '0px -8px 20px rgba(0, 0, 0, 0.08)',
  },
});

const buttonShadow = Platform.select<ViewStyle>({
  default: {
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  web: {
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
});

const thumbShadow = Platform.select<ViewStyle>({
  default: {
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  web: {
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
  },
});

export const onboardingStyles = StyleSheet.create({
  screen: { flex: 1, overflow: 'hidden' },
  slideList: {
    ...StyleSheet.absoluteFillObject,
  },
  slide: {
    flex: 1,
    height: '100%',
    overflow: 'hidden',
  },
  imageWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  illustration: { width: '100%', height: '100%' },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 8,
    ...panelShadow,
  },
  accentLine: { width: 48, height: 4, borderRadius: 2, marginBottom: 20 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    marginBottom: 24,
  },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  dot: { height: 8, borderRadius: 4 },
  dotActive: { width: 28 },
  dotInactive: { width: 8, backgroundColor: '#E5E7EB' },
  nextButton: {
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 8,
    ...buttonShadow,
  },
  nextButtonPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  nextButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', letterSpacing: 0 },
  finalActions: { gap: 10, marginBottom: 8 },
  track: {
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: TRACK_PADDING,
  },
  trackFill: {
    position: 'absolute',
    top: TRACK_PADDING,
    bottom: TRACK_PADDING,
    left: TRACK_PADDING,
    borderRadius: 28,
  },
  trackText: { fontSize: 15, fontWeight: '700', textAlign: 'center' },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: TRACK_PADDING,
    ...thumbShadow,
  },
  thumbArrow: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', lineHeight: 30 },
  fallbackButton: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    justifyContent: 'center',
    minHeight: 54,
  },
  fallbackButtonText: { fontSize: 16, fontWeight: '800' },
});
