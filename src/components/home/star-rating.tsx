import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { colors } from '@/theme';
import { cardStyles } from './quest-card.styles';

export function StarRating({ rating }: { rating: number }) {
  return (
    <View style={cardStyles.starRow}>
      <Feather color={colors.primary} name="star" size={12} />
      <Text style={cardStyles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}
