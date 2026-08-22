export const motion = {
  duration: {
    instant: 0,
    fast: 120,
    normal: 220,
    slow: 360,
    cinematic: 520,
  },
  easing: {
    standard: [0.2, 0, 0, 1] as const,
    emphasized: [0.2, 0.8, 0.2, 1] as const,
    enter: [0, 0, 0.2, 1] as const,
    exit: [0.4, 0, 1, 1] as const,
  },
} as const;

export type VantaMotion = typeof motion;
