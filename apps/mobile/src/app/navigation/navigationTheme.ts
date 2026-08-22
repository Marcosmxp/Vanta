import { DarkTheme, type Theme } from '@react-navigation/native';

import { darkTheme } from '../../design-system';

export const vantaNavigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: darkTheme.colors.brand.primary,
    background: darkTheme.colors.background.app,
    card: darkTheme.colors.surface.default,
    text: darkTheme.colors.text.primary,
    border: darkTheme.colors.border.default,
    notification: darkTheme.colors.status.danger,
  },
};
