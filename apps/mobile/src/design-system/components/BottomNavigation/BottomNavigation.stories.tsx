import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';

import { BottomNavigation } from './BottomNavigation';

const items = [
  { key: 'home', label: 'Home' },
  { key: 'play', label: 'Jogar', emphasized: true },
  { key: 'wallet', label: 'Carteira' },
  { key: 'profile', label: 'Perfil' },
] as const;

function NavigationExample() {
  const [value, setValue] = useState('home');
  return <BottomNavigation items={items} value={value} onChange={setValue} />;
}

const meta = {
  title: 'Components/BottomNavigation',
  component: NavigationExample,
} satisfies Meta<typeof NavigationExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const PrimaryNavigation: Story = {};
