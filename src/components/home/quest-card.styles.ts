import { Platform, StyleSheet, type ViewStyle } from 'react-native';

const cardShadow = Platform.select<ViewStyle>({
  default: {
    elevation: 6,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  web: {
    boxShadow: '0px 6px 16px rgba(168, 85, 247, 0.1)',
  },
});

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    ...cardShadow,
  },
  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.95,
  },
  imageContainer: { height: 180, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute',
    top: 12, left: 12, right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  categoryBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  categoryText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', letterSpacing: 0 },
  ratingBadge: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
  },
  starRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  starIcon: { fontSize: 12, color: '#F59E0B' },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  difficultyBadge: {
    position: 'absolute',
    bottom: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 10, borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  difficultyDot: { width: 7, height: 7, borderRadius: 3.5 },
  difficultyText: { fontSize: 11, fontWeight: '700' },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 18, fontWeight: '800', color: '#111827', letterSpacing: 0, lineHeight: 23 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 },
  metaIcon: { fontSize: 13 },
  metaText: { fontSize: 12, color: '#6B7280', fontWeight: '600', flexShrink: 1 },
  metaSep: { width: 1, height: 14, backgroundColor: '#E5E7EB' },
  startButton: { borderRadius: 14, minHeight: 46, alignItems: 'center', justifyContent: 'center' },
  startButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 0 },
});
