import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { type Quest, DIFFICULTY_COLORS } from './quest.types';
import { cardStyles } from './quest-card.styles';
import { StarRating } from './star-rating';

type QuestCardProps = {
  compact?: boolean;
  quest: Quest;
  onPress: () => void;
};

export function QuestCard({ compact = false, quest, onPress }: QuestCardProps) {
  const diffColor = DIFFICULTY_COLORS[quest.difficulty];

  return (
    <Pressable
      accessibilityHint="Відкриває деталі квесту"
      accessibilityLabel={`${quest.title}. ${quest.category}, ${quest.duration}, ${quest.distance}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [cardStyles.card, pressed && cardStyles.cardPressed]}
    >
      <View style={[cardStyles.imageContainer, compact && cardStyles.imageContainerCompact]}>
        <Image source={quest.image} style={cardStyles.image} contentFit="cover" />

        <View style={cardStyles.imageOverlay}>
          <View style={[cardStyles.categoryBadge, { backgroundColor: quest.accentColor }]}>
            <Text numberOfLines={1} style={cardStyles.categoryText}>{quest.category}</Text>
          </View>
          <View style={cardStyles.ratingBadge}>
            <StarRating rating={quest.rating} />
          </View>
        </View>

        <View
          style={[
            cardStyles.difficultyBadge,
            { backgroundColor: diffColor + '22', borderColor: diffColor + '55' },
          ]}
        >
          <View style={[cardStyles.difficultyDot, { backgroundColor: diffColor }]} />
          <Text numberOfLines={1} style={[cardStyles.difficultyText, { color: diffColor }]}>{quest.difficulty}</Text>
        </View>
      </View>

      <View style={[cardStyles.content, compact && cardStyles.contentCompact]}>
        <Text style={[cardStyles.title, compact && cardStyles.titleCompact]} numberOfLines={2}>{quest.title}</Text>

        <View style={cardStyles.metaRow}>
          <View style={cardStyles.metaItem}>
            <Text style={cardStyles.metaIcon}>🕒</Text>
            <Text numberOfLines={1} style={cardStyles.metaText}>{quest.duration}</Text>
          </View>
          <View style={cardStyles.metaSep} />
          <View style={cardStyles.metaItem}>
            <Text style={cardStyles.metaIcon}>📍</Text>
            <Text numberOfLines={1} style={cardStyles.metaText}>{quest.distance}</Text>
          </View>
          <View style={cardStyles.metaSep} />
          <View style={cardStyles.metaItem}>
            <Text style={cardStyles.metaIcon}>👥</Text>
            <Text numberOfLines={1} style={cardStyles.metaText}>{quest.participants.toLocaleString()}</Text>
          </View>
        </View>

        <View
          style={[cardStyles.startButton, { backgroundColor: quest.accentColor }]}
        >
          <Text style={cardStyles.startButtonText}>Детальніше</Text>
        </View>
      </View>
    </Pressable>
  );
}
