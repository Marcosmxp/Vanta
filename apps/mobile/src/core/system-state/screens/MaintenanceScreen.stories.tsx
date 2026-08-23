import type { Meta, StoryObj } from '@storybook/react-native';

import { MaintenanceScreen } from './MaintenanceScreen';

const meta = {
  title: 'Core/System State/Maintenance',
  component: MaintenanceScreen,
} satisfies Meta<typeof MaintenanceScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Generic: Story = {};

export const WithIncidentReference: Story = {
  args: {
    message: 'Estamos a aplicar uma atualização programada aos serviços Vanta.',
    incidentId: 'incident_story_001',
    retryAfterAt: '2026-08-23T10:45:00+01:00',
    onRetry: () => undefined,
  },
};
