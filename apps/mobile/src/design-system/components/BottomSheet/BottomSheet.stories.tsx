import React from 'react';
import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { darkTheme } from '../../theme';
import { BottomSheet } from './BottomSheet';

const meta = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  args: {
    visible: true,
    title: 'Configurar aposta',
    onRequestClose: () => undefined,
    children: <Text style={{ color: darkTheme.colors.text.secondary }}>Ajuste valor, risco e linhas.</Text>,
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;
export const BetConfiguration: Story = {};
