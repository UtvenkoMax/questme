import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';

import { colors, radii } from '@/theme';

type ConfettiBurstProps = {
  active: boolean;
};

const CONFETTI_COLORS = [
  colors.primary,
  colors.primaryOnDark,
  colors.ink,
  colors.borderStrong,
  colors.white,
] as const;

const PIECE_COUNT = 44;

function makePiece(index: number) {
  const lane = (index % 11) - 5;
  const row = Math.floor(index / 11);
  const direction = index % 2 === 0 ? 1 : -1;

  return {
    color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    delay: row * 22 + (index % 3) * 14,
    endX: lane * 34 + direction * (42 + (index % 5) * 11),
    endY: 250 + row * 54 + (index % 4) * 28,
    height: 8 + (index % 4) * 3,
    rotate: direction * (180 + (index % 7) * 42),
    startX: lane * 10,
    width: 6 + (index % 3) * 4,
  };
}

const PIECES = Array.from({ length: PIECE_COUNT }, (_, index) => makePiece(index));

export function ConfettiBurst({ active }: ConfettiBurstProps) {
  const { height, width } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const pieces = useMemo(() => PIECES, []);

  useEffect(() => {
    if (!active) {
      progress.setValue(0);
      return;
    }

    progress.setValue(0);
    Animated.timing(progress, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [active, progress]);

  if (!active) return null;

  const originX = width / 2;
  const originY = Math.max(height * 0.08, 48);

  return (
    <View pointerEvents="none" style={styles.container}>
      {pieces.map((piece, index) => {
        const delayOffset = Math.max(piece.delay / 1500, 0.01);
        const start = Math.min(delayOffset, 0.42);
        const middle = Math.min(start + 0.18, 0.72);

        const translateX = progress.interpolate({
          inputRange: [0, start, 1],
          outputRange: [piece.startX, piece.startX, piece.endX],
        });
        const translateY = progress.interpolate({
          inputRange: [0, start, 1],
          outputRange: [0, -28, Math.min(piece.endY, height * 0.82)],
        });
        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${piece.rotate}deg`],
        });
        const opacity = progress.interpolate({
          inputRange: [0, start, middle, 0.88, 1],
          outputRange: [0, 0, 1, 1, 0],
        });

        return (
          <Animated.View
            key={`${piece.color}-${index}`}
            style={[
              styles.piece,
              {
                backgroundColor: piece.color,
                height: piece.height,
                left: originX,
                opacity,
                top: originY,
                transform: [{ translateX }, { translateY }, { rotate }],
                width: piece.width,
              },
              index % 3 === 0 && styles.roundPiece,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    elevation: 100,
    overflow: 'hidden',
    zIndex: 100,
  },
  piece: {
    borderRadius: radii.xs,
    position: 'absolute',
  },
  roundPiece: {
    borderRadius: radii.pill,
  },
});
