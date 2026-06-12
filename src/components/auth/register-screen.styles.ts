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
  subtitle: {
    color: '#59616F',
    fontSize: 17,
    lineHeight: 24,
  },
  form: {
    gap: 18,
  },
  field: {
    gap: 8,
  },
  label: {
    color: '#242A33',
    fontSize: 15,
    fontWeight: '700',
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
