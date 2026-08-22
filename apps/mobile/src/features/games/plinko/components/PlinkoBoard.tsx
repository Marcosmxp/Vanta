import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Circle, RoundedRect } from '@shopify/react-native-skia';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { darkTheme } from '../../../../design-system';
import type { PlinkoDirection } from '../types';
import { buildPlinkoGeometry } from '../utils/geometry';

export interface PlinkoBoardProps {
  rows: number;
  width: number;
  height?: number;
  path?: readonly PlinkoDirection[];
  activeSlot?: number | null;
}

const BALL_SIZE = 14;

export function PlinkoBoard({
  rows,
  width,
  height = 360,
  path = [],
  activeSlot = null,
}: PlinkoBoardProps) {
  const geometry = useMemo(
    () => buildPlinkoGeometry(rows, width, height, path),
    [height, path, rows, width],
  );
  const progress = useSharedValue(0);

  const inputRange = useMemo(
    () => geometry.path.map((_, index) => index),
    [geometry.path],
  );
  const xRange = useMemo(
    () => geometry.path.map((point) => point.x - BALL_SIZE / 2),
    [geometry.path],
  );
  const yRange = useMemo(
    () => geometry.path.map((point) => point.y - BALL_SIZE / 2),
    [geometry.path],
  );

  useEffect(() => {
    progress.value = 0;
    if (geometry.path.length > 1) {
      progress.value = withTiming(geometry.path.length - 1, {
        duration: Math.max(650, (geometry.path.length - 1) * 115),
        easing: Easing.linear,
      });
    }
  }, [geometry.path.length, progress]);

  const animatedBallStyle = useAnimatedStyle(() => {
    if (inputRange.length < 2) {
      return {
        transform: [
          { translateX: xRange[0] ?? width / 2 - BALL_SIZE / 2 },
          { translateY: yRange[0] ?? 8 },
        ],
      };
    }

    return {
      transform: [
        {
          translateX: interpolate(
            progress.value,
            inputRange,
            xRange,
            Extrapolation.CLAMP,
          ),
        },
        {
          translateY: interpolate(
            progress.value,
            inputRange,
            yRange,
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  }, [inputRange, width, xRange, yRange]);

  const slotWidth = width / (rows + 3) * 0.72;

  return (
    <View
      accessibilityLabel="Tabuleiro Plinko"
      style={[styles.container, { width, height }]}
    >
      <Canvas style={StyleSheet.absoluteFill}>
        {geometry.slotCenters.map((center, slot) => (
          <RoundedRect
            key={`slot-${slot}`}
            x={center - slotWidth / 2}
            y={height - 30}
            width={slotWidth}
            height={18}
            r={5}
            color={
              activeSlot === slot
                ? darkTheme.colors.brand.primary
                : darkTheme.colors.surface.interactive
            }
          />
        ))}

        {geometry.pegs.map((peg) => (
          <Circle
            key={`peg-${peg.row}-${peg.column}`}
            cx={peg.x}
            cy={peg.y}
            r={3.2}
            color={darkTheme.colors.text.secondary}
          />
        ))}
      </Canvas>

      <Animated.View pointerEvents="none" style={[styles.ball, animatedBallStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignSelf: 'center',
    borderRadius: darkTheme.radius.xl,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.default,
    backgroundColor: darkTheme.colors.background.deep,
  },
  ball: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: darkTheme.colors.brand.primary,
    ...darkTheme.shadows.brandGlow,
  },
});
