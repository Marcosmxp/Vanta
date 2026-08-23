import {
  disconnectedSupportCapabilities,
  disconnectedSupportSnapshot,
} from '../../../features/support/provider/SupportProvider';
import { SupportRequestScreen } from '../../../features/support/screens/SupportRequestScreen';

export function SupportRequestCreateRouteScreen() {
  const categories = Array.from(new Set(disconnectedSupportSnapshot.topics.map((topic) => topic.category)));

  return (
    <SupportRequestScreen
      categories={categories}
      capabilities={disconnectedSupportCapabilities}
    />
  );
}
