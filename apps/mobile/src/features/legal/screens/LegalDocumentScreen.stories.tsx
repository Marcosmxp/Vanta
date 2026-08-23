import type { Meta, StoryObj } from '@storybook/react-native';

import { legalStoryDocument } from '../storybookFixtures';
import { LegalDocumentScreen } from './LegalDocumentScreen';

const meta = {
  title: 'Features/Legal/Document',
  component: LegalDocumentScreen,
  args: {
    documentId: 'privacy_story_v1',
    document: null,
  },
} satisfies Meta<typeof LegalDocumentScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {};
export const VersionedDocument: Story = { args: { document: legalStoryDocument } };
