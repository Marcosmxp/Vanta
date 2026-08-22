import React from 'react';
import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';

import { darkTheme } from '../../theme';
import { VantaModal } from './VantaModal';

const meta = {
  title: 'Components/Modal',
  component: VantaModal,
  args: {
    visible: true,
    title: 'Confirmar aposta',
    onRequestClose: () => undefined,
    children: <Text style={{ color: darkTheme.colors.text.secondary }}>Aposta de € 10,00 no Plinko.</Text>,
  },
} satisfies Meta<typeof VantaModal>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Confirmation: Story = {};
