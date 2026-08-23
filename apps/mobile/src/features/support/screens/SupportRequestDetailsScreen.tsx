import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Card, darkTheme } from '../../../design-system';
import type { SupportRequestStatus, SupportRequestSummary } from '../types';

export interface SupportRequestDetailsScreenProps {
  request: SupportRequestSummary | null;
}

function statusLabel(status: SupportRequestStatus) {
  switch (status) {
    case 'open':
      return 'Aberto';
    case 'waiting-player':
      return 'A aguardar resposta';
    case 'resolved':
      return 'Resolvido';
    case 'closed':
      return 'Fechado';
  }
}

export function SupportRequestDetailsScreen({ request }: SupportRequestDetailsScreenProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>PEDIDO DE SUPORTE</Text>
          <Text style={styles.title}>{request?.subject ?? 'Pedido indisponível'}</Text>
          <Text style={styles.subtitle}>
            O detalhe é sempre recarregado pela API autenticada usando apenas o identificador opaco do pedido.
          </Text>
        </View>

        <Card style={styles.card}>
          {request ? (
            <>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Estado</Text>
                <Badge
                  label={statusLabel(request.status)}
                  tone={request.status === 'resolved' ? 'success' : request.status === 'waiting-player' ? 'warning' : 'neutral'}
                />
              </View>
              <View style={styles.row}><Text style={styles.label}>ID</Text><Text style={styles.value}>{request.requestId}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Categoria</Text><Text style={styles.value}>{request.category}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Criado</Text><Text style={styles.value}>{new Date(request.createdAt).toLocaleString('pt-PT')}</Text></View>
              <View style={styles.row}><Text style={styles.label}>Atualizado</Text><Text style={styles.value}>{new Date(request.updatedAt).toLocaleString('pt-PT')}</Text></View>
            </>
          ) : (
            <Text style={styles.empty}>O pedido será carregado quando a API autenticada estiver disponível e confirmar ownership.</Text>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: darkTheme.colors.background.app },
  content: { padding: darkTheme.spacing.lg, paddingBottom: darkTheme.spacing['4xl'], gap: darkTheme.spacing.xl },
  header: { gap: darkTheme.spacing.sm },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.3 },
  title: { ...darkTheme.typography.heading1, color: darkTheme.colors.text.primary },
  subtitle: { ...darkTheme.typography.bodyLarge, color: darkTheme.colors.text.secondary },
  card: { gap: darkTheme.spacing.md },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: darkTheme.spacing.lg, borderTopWidth: 1, borderTopColor: darkTheme.colors.border.default, paddingTop: darkTheme.spacing.md },
  label: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  value: { ...darkTheme.typography.bodyStrong, flexShrink: 1, textAlign: 'right', color: darkTheme.colors.text.primary },
  empty: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
});
