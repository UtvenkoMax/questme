import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

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
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const openQuest = () => {
    Haptics.selectionAsync().catch(() => {});
    onPress();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityHint="Відкриває деталі маршруту"
        accessibilityLabel={`${quest.title}. ${quest.category}, ${quest.duration}, ${quest.distance}`}
        accessibilityRole="button"
        onPress={openQuest}
        onPressIn={() => {
          scale.value = withSpring(0.975, { damping: 16, stiffness: 240 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 220 });
        }}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View style={[styles.imageContainer, compact && styles.imageContainerCompact]}>
        <Image contentFit="cover" source={quest.image} style={styles.image} />
        <View style={styles.imageShade} />
        <View style={styles.imageOverlay}>
          <View style={styles.badgeStack}>
            <View style={styles.categoryBadge}>
              <Text numberOfLines={1} style={styles.categoryText}>
                {quest.category}
              </Text>
            </View>
            <View style={styles.smallBadgeRow}>
              {quest.isNew ? <Text style={styles.smallBadge}>Новий</Text> : null}
              {quest.isTeamQuest ? <Text style={styles.smallBadge}>Команда</Text> : null}
            </View>
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
    </Animated.View>
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
