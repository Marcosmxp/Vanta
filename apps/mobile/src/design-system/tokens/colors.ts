export const colorPrimitives = {
  neutral: {
    0: '#FFFFFF',
    50: '#F5F7FA',
    100: '#E7EAF0',
    300: '#9299A6',
    500: '#5E6470',
    700: '#252A32',
    800: '#181C22',
    850: '#12151A',
    900: '#0B0D10',
    950: '#07090C',
  },
  red: {
    400: '#FF4D5A',
    500: '#FF3344',
    600: '#E51F32',
    700: '#C81729',
  },
  green: {
    500: '#29D17D',
  },
  amber: {
    500: '#FFB020',
  },
} as const;

export const colors = {
  background: {
    app: colorPrimitives.neutral[900],
    deep: colorPrimitives.neutral[950],
  },
  surface: {
    default: colorPrimitives.neutral[850],
    raised: colorPrimitives.neutral[800],
    interactive: colorPrimitives.neutral[700],
  },
  border: {
    default: colorPrimitives.neutral[700],
    strong: colorPrimitives.neutral[500],
  },
  text: {
    primary: colorPrimitives.neutral[50],
    secondary: colorPrimitives.neutral[300],
    disabled: colorPrimitives.neutral[500],
    onBrand: colorPrimitives.neutral[0],
  },
  brand: {
    primary: colorPrimitives.red[500],
    pressed: colorPrimitives.red[600],
    strong: colorPrimitives.red[700],
  },
  status: {
    success: colorPrimitives.green[500],
    warning: colorPrimitives.amber[500],
    danger: colorPrimitives.red[400],
  },
  statusSurface: {
    success: 'rgba(41, 209, 125, 0.16)',
    warning: 'rgba(255, 176, 32, 0.16)',
    danger: 'rgba(255, 77, 90, 0.16)',
  },
  overlay: {
    scrim: 'rgba(7, 9, 12, 0.72)',
  },
} as const;

export type VantaColors = typeof colors;
