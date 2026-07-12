import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { QuestCard } from '@/components/quest/QuestCard';
import { AppButton, AppCard, Avatar, Badge, IconAction, SearchInput, SectionHeader } from '@/components/ui/app';
import { EmptyState, LoadingState, Notice } from '@/components/ui/status';
import { colors, radii, spacing, typography } from '@/theme';
import { questOfDay, type FeedQuest } from '@/data/questme';
import { useQuestFeed } from '@/hooks/useQuestFeed';

const recentSearches = ['С„РѕС‚Рѕ', 'РїРѕСЂСѓС‡', 'РґРѕ 100 РіСЂРЅ'];

export default function FeedScreen() {
  const router = useRouter();
  const { categories, feedFilters, quests, refresh, refreshing, searchQuery, selectedCategory, selectedFilter, setSearchQuery, setSelectedCategory, setSelectedFilter } = useQuestFeed();
  const [notice, setNotice] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [initialLoading] = useState(false);
  const visibleQuests = useMemo(() => quests, [quests]);

  const takeQuest = (quest: FeedQuest) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    setNotice(`РљРІРµСЃС‚ В«${quest.title}В» РґРѕРґР°РЅРѕ РґРѕ РІР°С€РёС… Р·Р°РІРґР°РЅСЊ.`);
  };

  if (initialLoading) {
    return <View style={styles.loading}><LoadingState text="Р—Р°РІР°РЅС‚Р°Р¶СѓС”РјРѕ РєРІРµСЃС‚РёвЂ¦" /></View>;
  }

  return (
    <View style={styles.screen}>
      <FlatList
        contentContainerStyle={styles.list}
        data={visibleQuests}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState action={<AppButton label="РЎРєРёРЅСѓС‚Рё С„С–Р»СЊС‚СЂРё" onPress={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedFilter('all'); }} tone="secondary" />} text="РЎРїСЂРѕР±СѓР№С‚Рµ С–РЅС€Сѓ РєР°С‚РµРіРѕСЂС–СЋ, Р·Р°РїРёС‚ Р°Р±Рѕ РїРµСЂРµРіР»СЏРЅСЊС‚Рµ Р·Р±РµСЂРµР¶РµРЅС– РєРІРµСЃС‚Рё." title="Р—Р° С†РёРјРё С„С–Р»СЊС‚СЂР°РјРё РєРІРµСЃС‚С–РІ РЅРµРјР°С”" />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.topBar}>
              <Pressable accessibilityLabel="Open profile" accessibilityRole="button" onPress={() => router.push('/profile')} style={styles.profileAction}>
                <Avatar label="QM" /><View><Text style={styles.greeting}>Р”РѕР±СЂРѕРіРѕ РґРЅСЏ</Text><Text style={styles.name}>РўРІС–Р№ РЅР°СЃС‚СѓРїРЅРёР№ РєРІРµСЃС‚</Text></View>
              </Pressable>
              <View style={styles.topActions}>
                <IconAction accessibilityLabel="Open map" icon="map-pin" onPress={() => router.push('/map')} />
                <IconAction accessibilityLabel="Open notifications" icon="bell" onPress={() => router.push('/notifications')} />
              </View>
            </View>

            <SearchInput onChangeText={setSearchQuery} onClear={() => setSearchQuery('')} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="РЁСѓРєР°С‚Рё РєРІРµСЃС‚Рё, РјС–СЃС†СЏ Р°Р±Рѕ Р°РІС‚РѕСЂС–РІ" value={searchQuery} />
            {searchFocused && !searchQuery ? <View style={styles.recent}><Text style={styles.recentLabel}>РќРµРґР°РІРЅС– Р·Р°РїРёС‚Рё</Text><View style={styles.recentItems}>{recentSearches.map((item) => <Pressable accessibilityRole="button" key={item} onPress={() => setSearchQuery(item)} style={styles.recentChip}><Text style={styles.recentText}>{item}</Text></Pressable>)}</View></View> : null}

            <ScrollView contentContainerStyle={styles.categoryRail} horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => {
                const active = category.id === selectedCategory;
                return <Pressable accessibilityRole="button" key={category.id} onPress={() => setSelectedCategory(category.id)} style={[styles.category, active && styles.categoryActive]}><Text style={styles.categoryIcon}>{category.icon}</Text><Text style={[styles.categoryText, active && styles.categoryTextActive]}>{category.label}</Text></Pressable>;
              })}
            </ScrollView>

            <QuestOfDay onTake={() => takeQuest(questOfDay)} />
            <SectionHeader eyebrow="РџРµСЂСЃРѕРЅР°Р»СЊРЅР° РґРѕР±С–СЂРєР°" title="РљРІРµСЃС‚Рё РґР»СЏ РІР°СЃ" />
            <ScrollView contentContainerStyle={styles.filterRail} horizontal showsHorizontalScrollIndicator={false}>
              {feedFilters.map((filter) => <FilterChip active={filter.id === selectedFilter} key={filter.id} label={filter.label} onPress={() => setSelectedFilter(filter.id)} />)}
            </ScrollView>
            {notice ? <Notice tone="success">{notice}</Notice> : null}
          </View>
        }
        refreshControl={<RefreshControl colors={[colors.primary]} onRefresh={refresh} refreshing={refreshing} tintColor={colors.primary} />}
        renderItem={({ item, index }) => <QuestCard index={index} onOpen={(quest) => router.push({ pathname: '/quest/[id]', params: { id: quest.id } })} onTake={takeQuest} quest={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function FilterChip({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={[styles.filter, active && styles.filterActive]}><Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text></Pressable>;
}

function QuestOfDay({ onTake }: { onTake: () => void }) {
  return <AppCard style={styles.questOfDay}><View style={styles.dayTop}><Badge label="РљРІРµСЃС‚ РґРЅСЏ" tone="reward" /><Text style={styles.dayDeadline}>РґРѕ {questOfDay.deadline}</Text></View><Text numberOfLines={2} style={styles.dayTitle}>{questOfDay.title}</Text><View style={styles.dayMeta}><View style={styles.authorRow}><Avatar label={questOfDay.avatar} size={30} /><Text style={styles.authorText}>@{questOfDay.author}</Text></View><Text style={styles.dayReward}>{questOfDay.reward} РіСЂРЅ</Text></View><AppButton label="Р’Р·СЏС‚Рё РєРІРµСЃС‚" onPress={onTake} /></AppCard>;
}

const styles = StyleSheet.create({
  authorRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs }, authorText: { ...typography.captionStrong, color: colors.inkMuted },
  category: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.pill, borderWidth: 1, flexDirection: 'row', gap: spacing.xs, minHeight: 40, paddingHorizontal: spacing.md }, categoryActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary }, categoryIcon: { fontSize: 15 }, categoryRail: { gap: spacing.sm, paddingRight: spacing.lg }, categoryText: { ...typography.captionStrong, color: colors.inkMuted }, categoryTextActive: { color: colors.ink },
  dayDeadline: { ...typography.captionStrong, color: colors.inkMuted }, dayMeta: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }, dayReward: { ...typography.titleCompact, color: colors.accent }, dayTitle: { ...typography.subtitle, color: colors.ink }, dayTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  filter: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.pill, borderWidth: 1, minHeight: 36, paddingHorizontal: spacing.md, justifyContent: 'center' }, filterActive: { backgroundColor: colors.primary, borderColor: colors.primary }, filterRail: { gap: spacing.sm, paddingRight: spacing.lg }, filterText: { ...typography.captionStrong, color: colors.inkMuted }, filterTextActive: { color: colors.white },
  greeting: { ...typography.caption, color: colors.inkMuted }, header: { gap: spacing.lg }, list: { gap: spacing.md, paddingBottom: 132, paddingHorizontal: spacing.lg, paddingTop: spacing.lg }, loading: { backgroundColor: colors.background, flex: 1, justifyContent: 'center', padding: spacing.lg },
  name: { ...typography.subtitle, color: colors.ink }, profileAction: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: spacing.sm }, questOfDay: { backgroundColor: 'rgba(124,58,255,0.12)', borderColor: 'rgba(124,58,255,0.44)', gap: spacing.md },
  recent: { gap: spacing.xs, marginTop: -spacing.sm }, recentChip: { backgroundColor: colors.surfaceMuted, borderRadius: radii.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }, recentItems: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }, recentLabel: { ...typography.caption, color: colors.inkSubtle }, recentText: { ...typography.captionStrong, color: colors.inkMuted }, screen: { backgroundColor: colors.background, flex: 1 },
  topActions: { flexDirection: 'row', gap: spacing.xs }, topBar: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
});
