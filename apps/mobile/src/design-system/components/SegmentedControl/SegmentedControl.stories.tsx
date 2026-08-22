import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';

import { SegmentedControl } from './SegmentedControl';

const options = [
  { value: 'low', label: 'Baixo' },
  { value: 'medium', label: 'Médio' },
  { value: 'high', label: 'Alto' },
] as const;

function RiskExample() {
  const [value, setValue] = useState('medium');
  return <SegmentedControl options={options} value={value} onChange={setValue} />;
}

const meta = {
  title: 'Components/SegmentedControl',
  component: RiskExample,
} satisfies Meta<typeof RiskExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const RiskLevel: Story = {};
