import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader, Pill, SectionHeader } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
import { Notice } from '@/components/ui/status';
import { TextField } from '@/components/ui/text-field';
import { colors, radii, spacing, typography } from '@/theme';
import { getResponsiveMetrics } from '@/utils/responsive';

type CommunityTask = {
  author: string;
  description: string;
  id: string;
  location: string;
  reward: string;
  title: string;
};

const INITIAL_TASKS: CommunityTask[] = [
  {
    author: 'Анна',
    description: 'Зробити фото трьох історичних дверей на Подолі і додати короткий факт про кожні.',
    id: 'doors',
    location: 'Поділ',
    reward: '+120 XP',
    title: 'Мисливці за старими дверима',
  },
  {
    author: 'Дмитро',
    description: 'Пробігти або пройти набережною 3 км і зняти короткий фінішний кліп.',
    id: 'river',
    location: 'Набережна',
    reward: '+90 XP',
    title: 'Ранковий маршрут біля води',
  },
  {
    author: 'Софія',
    description: 'Знайти кавʼярню з локальним обсмаженням, зробити чекін і порадити напій.',
    id: 'coffee',
    location: 'Центр',
    reward: '+75 XP',
    title: 'Кавовий чекін',
  },
];

export default function PublishScreen() {
  const { height, width } = useWindowDimensions();
  const layout = useMemo(() => getResponsiveMetrics(width, height), [height, width]);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<{ text: string; tone: 'danger' | 'success' } | null>(null);

  const canPublish = title.trim().length >= 3 && description.trim().length >= 10;

  const publishTask = () => {
    if (!canPublish) {
      setMessage({ text: 'Додайте назву і короткий опис завдання.', tone: 'danger' });
      return;
    }

    const nextTask: CommunityTask = {
      author: 'Ви',
      description: description.trim(),
      id: `${Date.now()}`,
      location: location.trim() || 'Локація не вказана',
      reward: '+50 XP',
      title: title.trim(),
    };

    setTasks((currentTasks) => [nextTask, ...currentTasks]);
    setTitle('');
    setLocation('');
    setDescription('');
    setMessage({ text: 'Завдання опубліковано у стрічці спільноти.', tone: 'success' });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  return (
    <Screen contentStyle={styles.content} keyboard wide>
      <PageHeader
        eyebrow="Community"
        subtitle="Місце, де люди публікують завдання для інших учасників QuestMe."
        title="Опублікувати завдання"
      />

      <View style={[styles.layout, layout.isWide && styles.layoutWide]}>
        <Card style={styles.formCard}>
          <SectionHeader
            subtitle="Сформулюйте завдання так, щоб його можна було виконати і підтвердити."
            title="Нове завдання"
          />
          <TextField
            label="Назва"
            onChangeText={setTitle}
            placeholder="Наприклад: знайти найкращий вид на місто"
            value={title}
          />
          <TextField
            label="Локація"
            onChangeText={setLocation}
            placeholder="Район, парк або точка старту"
            value={location}
          />
          <TextField
            label="Опис"
            multiline
            onChangeText={setDescription}
            placeholder="Що треба зробити, як підтвердити виконання, скільки часу це займе"
            value={description}
          />
          {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}
          <Button disabled={!canPublish} icon="send" onPress={publishTask} title="Опублікувати" />
        </Card>

        <View style={styles.feed}>
          <SectionHeader subtitle="Завдання, які вже додали учасники" title="Стрічка спільноти" />
          {tasks.map((task) => (
            <CommunityTaskCard key={task.id} task={task} />
          ))}
        </View>
      </View>
    </Screen>
  );
}

function CommunityTaskCard({ task }: { task: CommunityTask }) {
  return (
    <Card style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{task.author.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View style={styles.taskCopy}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskAuthor}>Опублікував: {task.author}</Text>
        </View>
        <Pill tone="primary">{task.reward}</Pill>
      </View>
      <Text style={styles.taskDescription}>{task.description}</Text>
      <View style={styles.taskFooter}>
        <View style={styles.meta}>
          <Feather color={colors.inkSubtle} name="map-pin" size={14} />
          <Text numberOfLines={1} style={styles.metaText}>
            {task.location}
          </Text>
        </View>
        <View style={styles.meta}>
          <Feather color={colors.inkSubtle} name="video" size={14} />
          <Text style={styles.metaText}>Відео-підтвердження</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  layout: {
    gap: spacing.xxl,
  },
  layoutWide: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  formCard: {
    flex: 0.9,
    gap: spacing.lg,
    minWidth: 0,
  },
  feed: {
    flex: 1.1,
    gap: spacing.lg,
    minWidth: 0,
  },
  taskCard: {
    gap: spacing.lg,
  },
  taskHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  avatarText: {
    ...typography.captionStrong,
    color: colors.primary,
  },
  taskCopy: {
    flex: 1,
    gap: spacing.xs,
    minWidth: 0,
  },
  taskTitle: {
    ...typography.subtitle,
    color: colors.ink,
    fontWeight: '600',
  },
  taskAuthor: {
    ...typography.caption,
    color: colors.inkSubtle,
  },
  taskDescription: {
    ...typography.body,
    color: colors.inkMuted,
  },
  taskFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  meta: {
    alignItems: 'center',
    backgroundColor: colors.surfacePearl,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.inkMuted,
  },
});
