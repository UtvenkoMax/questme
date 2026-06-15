import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { ProgressBar } from '@/components/ui/layout';
import { colors } from '@/theme';
import { styles } from '@/app/(main)/quests.styles';

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
          <View style={styles.heroCopy}>
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
          </View>
        </View>
      </Card>
    </View>
  );
}
