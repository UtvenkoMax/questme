import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/layout';
import { colors } from '@/theme';
import { styles } from '@/styles/quests.styles';

type QuestHeroProps = {
  progress: {
    level: number;
    totalPoints: number;
    completedCount: number;
    totalCount: number;
    xpForNextLevel: number;
    xpInCurrentLevel: number;
    levelProgressPercent: number;
  };
};

export function QuestHero({ progress }: QuestHeroProps) {
  return (
    <View style={styles.heroWrapper}>
      <Card style={styles.heroCard} padded={false}>
        <View style={styles.heroInner}>
          <LinearGradient
            colors={['#06162F', '#0A4E9A', '#0D8BBD']}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={styles.heroGradient}
          />
          <Animated.View entering={FadeInRight.duration(700)} style={styles.heroGlowOne} />
          <Animated.View entering={FadeInDown.duration(800).delay(120)} style={styles.heroGlowTwo} />
          <Animated.View entering={FadeInDown.duration(520)} style={styles.heroCopy}>
            <View style={styles.heroPillContainer}>
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>Рівень {progress.level}</Text>
              </View>
              <View style={[styles.heroPill, styles.heroPillAccent]}>
                <Feather name="zap" size={12} color={colors.white} />
                <Text style={[styles.heroPillText, {color: colors.white}]}> {progress.totalPoints} XP</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>Прогрес дня</Text>
            <Text style={styles.heroText}>
              {progress.completedCount} з {progress.totalCount} квестів виконано. Залишилось {progress.xpForNextLevel - progress.xpInCurrentLevel} XP до нового рівня!
            </Text>
            
            <View style={styles.progressWrapper}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Прогрес рівня</Text>
                <Text style={styles.progressPercent}>{progress.levelProgressPercent}%</Text>
              </View>
              <ProgressBar percent={progress.levelProgressPercent} style={styles.heroProgressBar} />
            </View>
          </Animated.View>
        </View>
      </Card>
    </View>
  );
}
