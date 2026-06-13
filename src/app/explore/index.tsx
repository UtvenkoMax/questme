import { useRouter } from 'expo-router';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuestCard } from '@/components/home/quest-card';
import { homeStyles as s } from '@/components/home/home.styles';
import { MOCK_QUESTS } from '@/components/home/quest.types';

export default function ExploreHomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <View style={s.header}>
        <View style={s.headerCopy}>
          <Text style={s.greeting}>QuestMe</Text>
          <Text style={s.headerTitle}>Доступні квести</Text>
          <Text style={s.resultCount}>{MOCK_QUESTS.length} маршрути у добірці</Text>
        </View>
      </View>

      <FlatList
        contentContainerStyle={s.list}
        data={MOCK_QUESTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <QuestCard quest={item} onPress={() => router.push(`/quest/${item.id}` as any)} />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
