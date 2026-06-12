import { StyleSheet } from 'react-native';

const KEY_SIZE = 76;
const KEY_GAP = 18;
const KEYPAD_WIDTH = KEY_SIZE * 3 + KEY_GAP * 2;

export const pinCodeStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F0EA',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 34,
  },
  header: {
    alignItems: 'center',
    gap: 16,
    height: '50%',
    justifyContent: 'center',
    marginBottom: 0,
    width: '100%',
  },
  title: {
    color: '#171B22',
    fontSize: 38,
    fontWeight: '800',
    lineHeight: 44,
    textAlign: 'center',
  },
  message: {
    color: '#59616F',
    fontSize: 16,
    lineHeight: 22,
    minHeight: 24,
    textAlign: 'center',
  },
  pinPanel: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 18,
    paddingTop: 0,
    width: '100%',
  },
  dots: {
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 16,
    marginTop: 18,
    minHeight: 22,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#4F5A68',
  },
  dotFilled: {
    backgroundColor: '#2D6A5F',
    borderColor: '#2D6A5F',
  },
  keypad: {
    alignItems: 'center',
    gap: 14,
    width: KEYPAD_WIDTH,
  },
  keypadRow: {
    flexDirection: 'row',
    gap: KEY_GAP,
    justifyContent: 'center',
  },
  keypadBottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: KEYPAD_WIDTH,
  },
  bottomSpacer: {
    width: KEY_SIZE,
  },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: KEY_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#A9A49D',
    borderWidth: 2.2,
  },
  keyPressed: {
    backgroundColor: '#E5DED5',
  },
  keyText: {
    color: '#171B22',
    fontSize: 30,
    fontWeight: '500',
    lineHeight: 34,
  },
  cancelButton: {
    width: KEY_SIZE,
    minHeight: KEY_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonPressed: {
    opacity: 0.62,
  },
  cancelText: {
    color: '#4F5A68',
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    alignSelf: 'stretch',
    gap: 12,
    marginTop: 30,
  },
  primaryButton: {
    minHeight: 58,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D6A5F',
  },
  buttonDisabled: {
    backgroundColor: '#59656F',
  },
  buttonPressed: {
    opacity: 0.86,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
