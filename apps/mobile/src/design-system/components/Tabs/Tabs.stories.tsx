import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';

import { Tabs } from './Tabs';

const items = [
  { key: 'all', label: 'Todas' },
  { key: 'won', label: 'Ganhos', badge: '12' },
  { key: 'lost', label: 'Perdidas', badge: '8' },
] as const;

function TabsExample() {
  const [value, setValue] = useState('all');
  return <Tabs items={items} value={value} onChange={setValue} />;
}

const meta = {
  title: 'Components/Tabs',
  component: TabsExample,
} satisfies Meta<typeof TabsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {};
