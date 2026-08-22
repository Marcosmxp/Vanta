import React from 'react';
import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { darkTheme } from '../../theme';
import { Card } from './Card';

const content = <Text style={{ color: darkTheme.colors.text.primary }}>Saldo disponível: € 1.250,00</Text>;

const meta = {
  title: 'Components/Card',
  component: Card,
  args: { children: content },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Elevated: Story = { args: { elevated: true } };
export const Interactive: Story = { args: { onPress: () => undefined, accessibilityLabel: 'Abrir carteira' } };
