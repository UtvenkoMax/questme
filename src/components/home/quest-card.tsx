import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/theme';

import { type Quest, DIFFICULTY_COLORS } from './quest.types';
import { cardStyles as styles } from './quest-card.styles';
import { StarRating } from './star-rating';

type QuestCardProps = {
  compact?: boolean;
  onPress: () => void;
  quest: Quest;
};

export function QuestCard({ compact = false, onPress, quest }: QuestCardProps) {
  const difficultyColor = DIFFICULTY_COLORS[quest.difficulty];

  return (
    <Pressable
      accessibilityHint="Відкриває деталі маршруту"
      accessibilityLabel={`${quest.title}. ${quest.category}, ${quest.duration}, ${quest.distance}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={[styles.imageContainer, compact && styles.imageContainerCompact]}>
        <Image contentFit="cover" source={quest.image} style={styles.image} />
        <View style={styles.imageShade} />
        <View style={styles.imageOverlay}>
          <View style={styles.categoryBadge}>
            <Text numberOfLines={1} style={styles.categoryText}>
              {quest.category}
            </Text>
          </View>
          <View style={styles.ratingBadge}>
            <StarRating rating={quest.rating} />
          </View>
        </View>
      </View>

      <View style={[styles.content, compact && styles.contentCompact]}>
        <View style={styles.titleRow}>
          <Text numberOfLines={2} style={[styles.title, compact && styles.titleCompact]}>
            {quest.title}
          </Text>
          <View style={[styles.difficultyBadge, { backgroundColor: `${difficultyColor}18` }]}>
            <View style={[styles.difficultyDot, { backgroundColor: difficultyColor }]} />
            <Text numberOfLines={1} style={[styles.difficultyText, { color: difficultyColor }]}>
              {quest.difficulty}
            </Text>
          </View>
        </View>

        <Text numberOfLines={2} style={styles.description}>
          {quest.description}
        </Text>

        <View style={styles.metaRow}>
          <Meta icon="clock" value={quest.duration} />
          <Meta icon="map-pin" value={quest.distance} />
          <Meta icon="users" value={quest.participants.toLocaleString('uk-UA')} />
        </View>

        <View style={styles.footer}>
          <View style={styles.location}>
            <Feather color={colors.inkMuted} name="navigation" size={14} />
            <Text numberOfLines={1} style={styles.locationText}>
              {quest.location}
            </Text>
          </View>
          <View style={styles.detailButton}>
            <Text style={styles.detailButtonText}>Деталі</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

type MetaProps = {
  icon: React.ComponentProps<typeof Feather>['name'];
  value: string;
};

function Meta({ icon, value }: MetaProps) {
  return (
    <View style={styles.metaItem}>
      <Feather color={colors.inkMuted} name={icon} size={14} />
      <Text numberOfLines={1} style={styles.metaText}>
        {value}
      </Text>
    </View>
  );
}
