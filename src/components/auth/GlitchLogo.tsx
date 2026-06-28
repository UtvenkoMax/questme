import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { questColors } from '@/constants/colors';
import { radii, spacing } from '@/constants/spacing';
import { typography } from '@/constants/typography';

export function GlitchLogo({ compact = false }: { compact?: boolean }) {
  const jitter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(jitter, { duration: 120, toValue: 1, useNativeDriver: true }),
        Animated.timing(jitter, { duration: 140, toValue: -1, useNativeDriver: true }),
        Animated.timing(jitter, { duration: 900, toValue: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [jitter]);

  const translateX = jitter.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-2, 0, 2],
  });

  return (
    <View style={[styles.frame, compact && styles.frameCompact]}>
      <Animated.Text style={[styles.shadowAcid, { transform: [{ translateX }] }]}>QM</Animated.Text>
      <Animated.Text style={[styles.shadowEmber, { transform: [{ translateX: Animated.multiply(translateX, -1) }] }]}>QM</Animated.Text>
      <Text style={styles.logo}>QM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: questColors.surface,
    borderColor: questColors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    height: 86,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 112,
  },
  frameCompact: {
    height: 62,
    width: 84,
  },
  logo: {
    ...typography.title,
    color: questColors.textPrimary,
    letterSpacing: 0,
  },
  shadowAcid: {
    ...typography.title,
    color: questColors.acid,
    left: spacing.md,
    opacity: 0.74,
    position: 'absolute',
  },
  shadowEmber: {
    ...typography.title,
    color: questColors.ember,
    opacity: 0.72,
    position: 'absolute',
    right: spacing.md,
  },
});
