import { StyleSheet } from 'react-native';

export const startScreenStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#080A0F',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sliderPanel: {
    backgroundColor: 'rgba(8, 10, 15, 0.68)',
    borderRadius: 28,
    padding: 10,
  },
  trackWrap: {
    height: 64,
  },
  track: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 4,
  },
  trackFill: {
    bottom: 4,
    left: 4,
    position: 'absolute',
    top: 4,
    borderRadius: 28,
    backgroundColor: '#F7F1E5',
  },
  trackText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 4,
    elevation: 5,
  },
  thumbText: {
    color: '#121620',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 30,
  },
});
