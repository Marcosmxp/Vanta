import { colors, motion, radius, shadows, spacing, typography } from '../tokens';

export const darkTheme = {
  colors,
  spacing,
  radius,
  typography,
  shadows,
  motion,
} as const;

export type VantaTheme = typeof darkTheme;
