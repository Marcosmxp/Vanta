import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge, Button, Card, darkTheme } from '../../../design-system';
import type { SecurityCapabilities, SecuritySession } from '../types';

export interface SecuritySessionDetailsScreenProps {
  sessionId: string;
  session?: SecuritySession | null;
  capabilities: SecurityCapabilities;
  onRevokeSession?: () => void;
}

export function SecuritySessionDetailsScreen({
  sessionId,
  session = null,
  capabilities,
  onRevokeSession,
}: SecuritySessionDetailsScreenProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SESSÃO</Text>
          <Text style={styles.title}>{session?.deviceLabel ?? 'Detalhe protegido'}</Text>
          <Text style={styles.subtitle}>ID: {sessionId}</Text>
        </View>

        {session ? (
          <>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Estado</Text>
                <Badge label={session.status === 'active' ? 'Ativa' : 'Revogada'} tone={session.status === 'active' ? 'success' : 'neutral'} />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Dispositivo</Text>
                <Text style={styles.value}>{session.deviceLabel}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Plataforma</Text>
                <Text style={styles.value}>{session.platform}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Confiança</Text>
                <Text style={styles.value}>{session.trust === 'trusted' ? 'Reconhecido' : 'Não reconhecido'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>MFA usado</Text>
                <Text style={styles.value}>{session.mfaUsed ? 'Sim' : 'Não'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>IP</Text>
                <Text style={styles.value}>{session.ipMasked ?? 'Protegido'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>País</Text>
                <Text style={styles.value}>{session.countryCode ?? 'Protegido'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Última atividade</Text>
                <Text style={styles.value}>{session.lastSeenAt}</Text>
              </View>
            </Card>

            <Button
              label={session.current ? 'Sessão atual protegida' : 'Encerrar esta sessão'}
              variant="danger"
              fullWidth
              disabled={session.current || !capabilities.canRevokeSession || session.status !== 'active'}
              onPress={onRevokeSession}
            />
          </>
        ) : (
          <Card style={styles.card}>
            <Text style={styles.emptyTitle}>Detalhe indisponível</Text>
            <Text style={styles.emptyDescription}>
              O dispositivo deve ser carregado novamente da API autenticada usando apenas o sessionId da rota.
            </Text>
          </Card>
        )}

        <Text style={styles.footer}>
          Tokens, cookies, refresh tokens e segredos de autenticação nunca são mostrados nesta tela.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: darkTheme.colors.background.app },
  content: {
    paddingHorizontal: darkTheme.spacing.lg,
    paddingTop: darkTheme.spacing.lg,
    paddingBottom: darkTheme.spacing['4xl'],
    gap: darkTheme.spacing.xl,
  },
  header: { gap: darkTheme.spacing.xs },
  eyebrow: { ...darkTheme.typography.labelSmall, color: darkTheme.colors.brand.primary, letterSpacing: 1.2 },
  title: { ...darkTheme.typography.heading1, color: darkTheme.colors.text.primary },
  subtitle: { ...darkTheme.typography.caption, color: darkTheme.colors.text.secondary },
  card: { gap: darkTheme.spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: darkTheme.spacing.lg },
  label: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  value: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary, textAlign: 'right', flexShrink: 1 },
  emptyTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary },
  emptyDescription: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  footer: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled, textAlign: 'center' },
});
