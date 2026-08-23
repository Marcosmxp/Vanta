import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SystemState, darkTheme, type SystemStateKind } from '../../../design-system';

export interface SystemStateScreenProps {
  kind: SystemStateKind;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SystemStateScreen({
  kind,
  title,
  description,
  actionLabel,
  onAction,
}: SystemStateScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <SystemState
          kind={kind}
          title={title}
          description={description}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: darkTheme.colors.background.app,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: darkTheme.spacing.xl,
  },
});
