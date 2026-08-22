import React from 'react';
import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { darkTheme } from '../../theme';
import { IconButton } from './IconButton';

const icon = <Text style={{ color: darkTheme.colors.text.primary, fontSize: 20 }}>+</Text>;

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  args: {
    accessibilityLabel: 'Adicionar',
    icon,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Brand: Story = { args: { variant: 'brand' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Disabled: Story = { args: { disabled: true } };
