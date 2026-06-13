import { View, Text } from 'react-native';
import { cardStyles } from './quest-card.styles';

export function StarRating({ rating }: { rating: number }) {
  return (
    <View style={cardStyles.starRow}>
      <Text style={cardStyles.starIcon}>★</Text>
      <Text style={cardStyles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}
