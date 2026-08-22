import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import type { Preview } from '@storybook/react-native';

import { darkTheme } from '../src/design-system';

const preview: Preview = {
  decorators: [
    (Story) => (
      <SafeAreaView style={styles.screen}>
        <Story />
      </SafeAreaView>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'Vanta App',
      values: [
        { name: 'Vanta App', value: darkTheme.colors.background.app },
        { name: 'Vanta Raised', value: darkTheme.colors.surface.raised },
      ],
    },
  },
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: darkTheme.colors.background.app,
    padding: darkTheme.spacing.lg,
  },
});

export default preview;
