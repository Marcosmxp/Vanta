import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SystemState, darkTheme } from '../../../design-system';

export interface MaintenanceScreenProps {
  message?: string | null;
  incidentId?: string | null;
  retryAfterAt?: string | null;
  onRetry?: () => void;
}

function retryDescription(retryAfterAt: string | null | undefined) {
  if (!retryAfterAt) return null;
  return `Nova tentativa sugerida após ${new Date(retryAfterAt).toLocaleString('pt-PT')}.`;
}

export function MaintenanceScreen({
  message,
  incidentId,
  retryAfterAt,
  onRetry,
}: MaintenanceScreenProps) {
  const retryCopy = retryDescription(retryAfterAt);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.brand}>VANTA</Text>
        <SystemState
          kind="maintenance"
          title="Manutenção em curso"
          description={message ?? 'Alguns serviços Vanta estão temporariamente indisponíveis. Nenhuma operação sensível será assumida como concluída enquanto o serviço estiver indisponível.'}
          actionLabel={onRetry ? 'Tentar novamente' : undefined}
          onAction={onRetry}
        />
        {retryCopy ? <Text style={styles.meta}>{retryCopy}</Text> : null}
        {incidentId ? <Text style={styles.meta}>Referência pública: {incidentId}</Text> : null}
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
    gap: darkTheme.spacing.xl,
  },
  brand: {
    ...darkTheme.typography.brandWordmark,
    color: darkTheme.colors.text.primary,
    textAlign: 'center',
  },
  meta: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.disabled,
    textAlign: 'center',
  },
});
