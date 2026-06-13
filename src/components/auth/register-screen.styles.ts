import { StyleSheet } from 'react-native';

export const registerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F0EA',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  contentWide: {
    alignSelf: 'center',
    maxWidth: 560,
    width: '100%',
  },
  contentCompact: {
    justifyContent: 'flex-start',
    paddingVertical: 18,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 28,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#4F5A68',
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    gap: 10,
    marginBottom: 34,
  },
  headerCompact: {
    marginBottom: 22,
  },
  eyebrow: {
    color: '#2D6A5F',
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#171B22',
    fontSize: 40,
    fontWeight: '800',
  },
  titleCompact: {
    fontSize: 32,
    lineHeight: 38,
  },
  subtitle: {
    color: '#59616F',
    fontSize: 17,
    lineHeight: 24,
  },
  subtitleCompact: {
    fontSize: 15,
    lineHeight: 21,
  },
  form: {
    gap: 18,
  },
  field: {
    gap: 8,
  },
  fieldHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#242A33',
    fontSize: 15,
    fontWeight: '700',
  },
  inlineButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  inlineButtonPressed: {
    opacity: 0.65,
  },
  inlineButtonText: {
    color: '#2D6A5F',
    fontSize: 14,
    fontWeight: '800',
  },
  input: {
    minHeight: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D6D0C8',
    backgroundColor: '#FFFFFF',
    color: '#171B22',
    fontSize: 17,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#C44949',
  },
  errorText: {
    color: '#B33A3A',
    fontSize: 13,
    lineHeight: 18,
  },
  passwordStrength: {
    gap: 8,
    marginTop: -6,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 6,
  },
  strengthBar: {
    backgroundColor: '#D6D0C8',
    borderRadius: 999,
    flex: 1,
    height: 6,
  },
  strengthBarActive: {
    backgroundColor: '#2D6A5F',
  },
  helperText: {
    color: '#59616F',
    fontSize: 13,
    lineHeight: 18,
  },
  submitError: {
    color: '#B33A3A',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    textAlign: 'center',
  },
  submitButton: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: '#2D6A5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#9BA29B',
  },
  submitButtonPressed: {
    opacity: 0.86,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});
