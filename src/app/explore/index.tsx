import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuestCard } from '@/components/home/quest-card';
import { homeStyles as s } from '@/components/home/home.styles';
import { MOCK_QUESTS } from '@/components/home/quest.types';
import { getResponsiveMetrics } from '@/utils/responsive';

export default function ExploreHomeScreen() {
  const router = useRouter();
  const { height, width } = useWindowDimensions();
  const layout = useMemo(() => getResponsiveMetrics(width, height), [height, width]);

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <View style={[s.header, { paddingHorizontal: layout.gutter }, layout.isWide && s.headerWide]}>
        <View style={s.headerCopy}>
          <Text style={s.greeting}>QuestMe</Text>
          <Text style={s.headerTitle}>Доступні квести</Text>
          <Text style={s.resultCount}>{MOCK_QUESTS.length} маршрути у добірці</Text>
        </View>
      </View>

      <FlatList
        key={`explore-${layout.listColumns}`}
        columnWrapperStyle={layout.listColumns > 1 ? s.listColumn : undefined}
        contentContainerStyle={[
          s.list,
          { paddingHorizontal: layout.gutter },
          layout.isWide && s.listWide,
        ]}
        data={MOCK_QUESTS}
        keyExtractor={(item) => item.id}
        numColumns={layout.listColumns}
        renderItem={({ item }) => (
          <View style={[s.questItem, layout.listColumns > 1 && s.questItemGrid]}>
            <QuestCard
              compact={layout.isCompactWidth}
              quest={item}
              onPress={() => router.push(`/quest/${item.id}` as any)}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
