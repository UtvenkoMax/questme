import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pill } from '@/components/ui/layout';
import { type Quest as PersonalQuest } from '@/services/quest-service';
import { colors } from '@/theme';
import { styles } from '@/app/(main)/quests.styles';

type PersonalQuestCardProps = {
  onToggle: () => void;
  quest: PersonalQuest;
};

function PersonalQuestCard({ onToggle, quest }: PersonalQuestCardProps) {
  return (
    <Card style={[styles.personalCard, quest.completed && styles.personalCardDone]}>
      <View style={styles.personalHeader}>
        <View style={styles.personalTitleWrap}>
          <View style={[styles.checkIcon, quest.completed && styles.checkIconDone]}>
            <Feather color={quest.completed ? colors.white : colors.primary} name="check" size={16} />
          </View>
          <View style={styles.personalCopy}>
            <Text style={[styles.personalTitle, quest.completed && styles.personalTitleDone]}>{quest.title}</Text>
            <Text style={styles.personalDescription}>{quest.description}</Text>
          </View>
        </View>
        <Pill tone={quest.completed ? 'success' : 'accent'}>+{quest.points} XP</Pill>
      </View>
      <Button
        icon={quest.completed ? 'rotate-ccw' : 'check'}
        onPress={onToggle}
        size="md"
        title={quest.completed ? 'Скасувати' : 'Виконано'}
        variant={quest.completed ? 'ghost' : 'secondary'}
      />
    </Card>
  );
}

export { PersonalQuestCard };
