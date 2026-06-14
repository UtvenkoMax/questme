import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/theme';
import { getResponsiveMetrics } from '@/utils/responsive';

type ScreenProps = {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: Edge[];
  keyboard?: boolean;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  wide?: boolean;
};

export function Screen({
  children,
  contentStyle,
  edges = ['top', 'bottom'],
  keyboard = false,
  scroll = true,
  style,
  wide = false,
}: ScreenProps) {
  const { height, width } = useWindowDimensions();
  const layout = getResponsiveMetrics(width, height);
  const maxWidth = wide ? layout.listMaxWidth : layout.contentMaxWidth;
  const content = (
    <View
      style={[
        styles.content,
        { maxWidth, paddingHorizontal: layout.gutter },
        contentStyle,
      ]}>
      {children}
    </View>
  );

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {content}
    </ScrollView>
  ) : (
    content
  );

  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      {keyboard ? (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    alignSelf: 'center',
    flexGrow: 1,
    paddingBottom: 28,
    paddingTop: 18,
    width: '100%',
  },
});
