import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card, SystemState, darkTheme } from '../../../design-system';
import {
  disconnectedSupportCapabilities,
  disconnectedSupportSnapshot,
} from '../provider/SupportProvider';
import type { SupportCapabilities, SupportRequestStatus, SupportSnapshot } from '../types';

export interface SupportOverviewScreenProps {
  snapshot?: SupportSnapshot;
  capabilities?: SupportCapabilities;
  onCreateRequest?: () => void;
  onOpenRequest?: (requestId: string) => void;
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

export function SupportOverviewScreen({
  snapshot = disconnectedSupportSnapshot,
  capabilities = disconnectedSupportCapabilities,
  onCreateRequest,
  onOpenRequest,
}: SupportOverviewScreenProps) {
  const ready = snapshot.availability === 'ready';
  const unavailableDescription = snapshot.message ?? 'Os dados de suporte só são apresentados depois de confirmados pela API autenticada.';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SUPORTE VANTA</Text>
          <Text style={styles.title}>Ajuda, pedidos e transparência</Text>
          <Text style={styles.subtitle}>
            Consulte tópicos de ajuda e acompanhe pedidos sem expor credenciais ou dados sensíveis desnecessários.
          </Text>
        </View>

        <Card style={styles.statusCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Disponibilidade</Text>
            <Badge
              label={ready ? 'Online' : snapshot.availability === 'restricted' ? 'Restrito' : 'Indisponível'}
              tone={ready ? 'success' : snapshot.availability === 'restricted' ? 'warning' : 'neutral'}
            />
          </View>
          <Text style={styles.cardText}>
            {snapshot.message ?? 'Os canais e pedidos apresentados são fornecidos pela API autenticada.'}
          </Text>
          <Button
            label="Criar pedido"
            fullWidth
            disabled={!capabilities.canCreateRequest || !onCreateRequest}
            onPress={onCreateRequest}
          />
          <Text style={styles.helper}>{capabilities.message}</Text>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tópicos de ajuda</Text>
          {snapshot.topics.length === 0 ? (
            <SystemState
              kind={ready ? 'empty' : 'error'}
              compact
              title={ready ? 'Nenhum tópico disponível' : 'Tópicos indisponíveis'}
              description={ready ? 'Não existem tópicos publicados para apresentar neste momento.' : unavailableDescription}
            />
          ) : (
            snapshot.topics.map((topic) => (
              <Card key={topic.topicId} style={styles.listCard}>
                <Text style={styles.itemEyebrow}>{topic.category.toUpperCase()}</Text>
                <Text style={styles.itemTitle}>{topic.title}</Text>
                <Text style={styles.itemText}>{topic.summary}</Text>
              </Card>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Canais oficiais</Text>
          {snapshot.channels.length === 0 ? (
            <SystemState
              kind={ready ? 'empty' : 'error'}
              compact
              title={ready ? 'Nenhum canal publicado' : 'Canais oficiais indisponíveis'}
              description={ready ? 'O backend ainda não publicou canais de contacto para este contexto.' : unavailableDescription}
            />
          ) : (
            snapshot.channels.map((channel) => (
              <Card key={channel.channelId} style={styles.channelCard}>
                <View style={styles.rowBetween}>
                  <View style={styles.flexCopy}>
                    <Text style={styles.itemTitle}>{channel.label}</Text>
                    <Text style={styles.itemText}>{channel.target}</Text>
                  </View>
                  <Badge label={channel.type} tone="neutral" />
                </View>
              </Card>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Pedidos recentes</Text>
            <Text style={styles.count}>{snapshot.recentRequests.length}</Text>
          </View>
          {snapshot.recentRequests.length === 0 ? (
            <SystemState
              kind={ready ? 'empty' : 'error'}
              compact
              title={ready ? 'Nenhum pedido de suporte' : 'Pedidos indisponíveis'}
              description={ready ? 'Os pedidos criados pela sua conta aparecerão aqui.' : unavailableDescription}
            />
          ) : (
            snapshot.recentRequests.map((request) => (
              <Pressable
                key={request.requestId}
                accessibilityRole="button"
                onPress={() => onOpenRequest?.(request.requestId)}
                disabled={!onOpenRequest}
              >
                <Card style={styles.listCard}>
                  <View style={styles.rowBetween}>
                    <View style={styles.flexCopy}>
                      <Text style={styles.itemTitle}>{request.subject}</Text>
                      <Text style={styles.itemText}>{request.category}</Text>
                    </View>
                    <Badge
                      label={statusLabel(request.status)}
                      tone={request.status === 'resolved' ? 'success' : request.status === 'waiting-player' ? 'warning' : 'neutral'}
                    />
                  </View>
                  <Text style={styles.meta}>Atualizado: {new Date(request.updatedAt).toLocaleString('pt-PT')}</Text>
                </Card>
              </Pressable>
            ))
          )}
        </View>

        <Card style={styles.warningCard}>
          <Text style={styles.warningTitle}>Nunca envie segredos no suporte</Text>
          <Text style={styles.warningText}>
            Não envie passwords, códigos OTP, tokens, recovery codes, PAN/CVV de cartões, chaves privadas ou imagens KYC por mensagem.
          </Text>
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
  statusCard: { gap: darkTheme.spacing.md },
  cardTitle: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  cardText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  helper: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled },
  section: { gap: darkTheme.spacing.md },
  sectionTitle: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  flexCopy: { flex: 1, gap: darkTheme.spacing.xs },
  listCard: { gap: darkTheme.spacing.sm },
  channelCard: { gap: darkTheme.spacing.xs },
  itemEyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary },
  itemTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  itemText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  meta: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled },
  count: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.brand.primary },
  warningCard: { gap: darkTheme.spacing.sm, borderColor: darkTheme.colors.status.warning },
  warningTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.status.warning },
  warningText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
});
