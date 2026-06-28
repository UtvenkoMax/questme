import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader, SectionHeader } from '@/components/ui/layout';
import { Screen } from '@/components/ui/screen';
import { colors, radii, spacing, typography } from '@/theme';

const NOTIFICATIONS = [
  {
    action: 'Відкрити карту',
    icon: 'map-pin',
    id: 'nearby',
    text: 'Поруч є новий маршрут із 3 точками та geofence-підтвердженням.',
    title: 'Квест поруч',
    tone: 'primary',
  },
  {
    action: 'Переглянути',
    icon: 'users',
    id: 'team',
    text: 'Софія запросила вас у командний квест “Секретні Кавʼярні”.',
    title: 'Запрошення в команду',
    tone: 'success',
  },
  {
    action: 'Продовжити',
    icon: 'clock',
    id: 'reminder',
    text: 'У вас є незавершена персональна місія. Завершіть її, щоб отримати XP.',
    title: 'Нагадування',
    tone: 'warning',
  },
] as const;

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <Screen contentStyle={styles.content}>
      <Button fullWidth={false} icon="arrow-left" onPress={() => router.back()} size="sm" title="Назад" variant="ghost" />
      <PageHeader
        eyebrow="Inbox"
        subtitle="Системні повідомлення, командні запрошення та нагадування про прогрес."
        title="Повідомлення"
      />

      <Card style={styles.summary}>
        <SectionHeader
          subtitle="3 активні повідомлення"
          title="Сьогодні"
        />
      </Card>

      <View style={styles.list}>
        {NOTIFICATIONS.map((notification) => (
          <Card key={notification.id} style={styles.item}>
            <View style={[styles.icon, styles[`${notification.tone}Icon`]]}>
              <Feather color={colors.white} name={notification.icon} size={20} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{notification.title}</Text>
              <Text style={styles.text}>{notification.text}</Text>
              <Button
                fullWidth={false}
                onPress={() => (notification.id === 'nearby' ? router.push('/map') : router.push('/quests'))}
                size="sm"
                title={notification.action}
                variant="secondary"
              />
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  copy: {
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
  icon: {
    alignItems: 'center',
    borderRadius: radii.pill,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  item: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
  primaryIcon: {
    backgroundColor: colors.primary,
  },
  successIcon: {
    backgroundColor: colors.success,
  },
  summary: {
    gap: spacing.md,
  },
  text: {
    ...typography.body,
    color: colors.inkMuted,
  },
  title: {
    ...typography.subtitle,
    color: colors.ink,
    fontWeight: '700',
  },
  warningIcon: {
    backgroundColor: colors.warning,
  },
});
