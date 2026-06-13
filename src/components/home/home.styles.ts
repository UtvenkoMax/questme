import { Platform, StyleSheet, type ViewStyle } from 'react-native';

const controlShadow = Platform.select<ViewStyle>({
  default: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  web: {
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
  },
});

export const homeStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8F9FF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerCopy: {
    flex: 1,
    gap: 3,
  },
  greeting: { fontSize: 14, color: '#9CA3AF', fontWeight: '500', marginBottom: 2 },
  headerTitle: { fontSize: 26, color: '#111827', fontWeight: '800', letterSpacing: 0 },
  resultCount: { color: '#6B7280', fontSize: 14, fontWeight: '600', lineHeight: 20 },
  searchBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    ...controlShadow,
  },
  searchIcon: { fontSize: 20 },
  chipList: { paddingHorizontal: 20, gap: 8, paddingBottom: 16 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, backgroundColor: '#FFFFFF',
    borderWidth: 1.5, borderColor: '#E5E7EB',
    minHeight: 38,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: '#A855F7', borderColor: '#A855F7' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  chipTextActive: { color: '#FFFFFF' },
  list: { paddingHorizontal: 20, paddingBottom: 32, gap: 16, flexGrow: 1 },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    marginTop: 18,
    padding: 22,
  },
  emptyTitle: { color: '#111827', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  emptyText: { color: '#6B7280', fontSize: 14, lineHeight: 20, textAlign: 'center' },
});
