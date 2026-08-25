import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useI18n, type TranslationKey } from '../../../core/i18n';
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

const statusKeys: Record<SupportRequestStatus, TranslationKey> = {
  open: 'support.status.open',
  'waiting-player': 'support.status.waiting-player',
  resolved: 'support.status.resolved',
  closed: 'support.status.closed',
};

export function SupportOverviewScreen({
  snapshot = disconnectedSupportSnapshot,
  capabilities = disconnectedSupportCapabilities,
  onCreateRequest,
  onOpenRequest,
}: SupportOverviewScreenProps) {
  const { locale, t } = useI18n();
  const ready = snapshot.availability === 'ready';
  const topics = snapshot.topics ?? [];
  const channels = snapshot.channels ?? [];
  const recentRequests = snapshot.recentRequests ?? [];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{t('support.eyebrow')}</Text>
          <Text style={styles.title}>{t('support.title')}</Text>
          <Text style={styles.subtitle}>{t('support.subtitle')}</Text>
        </View>

        <Card style={styles.statusCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>{t('support.availability')}</Text>
            <Badge
              label={ready ? t('common.online') : snapshot.availability === 'restricted' ? t('common.restricted') : t('common.unavailable')}
              tone={ready ? 'success' : snapshot.availability === 'restricted' ? 'warning' : 'neutral'}
            />
          </View>
          <Button
            label={t('support.createRequest')}
            fullWidth
            disabled={!capabilities.canCreateRequest || !onCreateRequest}
            onPress={onCreateRequest}
          />
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support.helpTopics')}</Text>
          {topics.length === 0 ? (
            <SystemState
              kind={ready ? 'empty' : 'error'}
              compact
              title={ready ? t('support.noTopics') : t('support.topicsUnavailable')}
              description={ready ? t('support.noTopicsDescription') : t('support.unavailableDescription')}
            />
          ) : (
            topics.map((topic) => (
              <Card key={topic.topicId} style={styles.listCard}>
                <Text style={styles.itemTitle}>{topic.title}</Text>
                <Text style={styles.itemText}>{topic.summary}</Text>
              </Card>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support.channels')}</Text>
          {channels.length === 0 ? (
            <SystemState
              kind={ready ? 'empty' : 'error'}
              compact
              title={ready ? t('support.noChannels') : t('support.channelsUnavailable')}
              description={ready ? t('support.noChannelsDescription') : t('support.unavailableDescription')}
            />
          ) : (
            channels.map((channel) => (
              <Card key={channel.channelId} style={styles.channelCard}>
                <Text style={styles.itemTitle}>{channel.label}</Text>
                <Text style={styles.itemText}>{channel.target}</Text>
              </Card>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>{t('support.recentRequests')}</Text>
            <Text style={styles.count}>{recentRequests.length}</Text>
          </View>
          {recentRequests.length === 0 ? (
            <SystemState
              kind={ready ? 'empty' : 'error'}
              compact
              title={ready ? t('support.noRequests') : t('support.requestsUnavailable')}
              description={ready ? t('support.noRequestsDescription') : t('support.unavailableDescription')}
            />
          ) : (
            recentRequests.map((request) => (
              <Pressable
                key={request.requestId}
                accessibilityRole="button"
                onPress={() => onOpenRequest?.(request.requestId)}
                disabled={!onOpenRequest}
              >
                <Card style={styles.listCard}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.itemTitle}>{request.subject}</Text>
                    <Badge
                      label={t(statusKeys[request.status])}
                      tone={request.status === 'resolved' ? 'success' : request.status === 'waiting-player' ? 'warning' : 'neutral'}
                    />
                  </View>
                  <Text style={styles.meta}>{t('support.updatedAt')}: {new Date(request.updatedAt).toLocaleString(locale)}</Text>
                </Card>
              </Pressable>
            ))
          )}
        </View>

        <Card style={styles.warningCard}>
          <Text style={styles.warningTitle}>{t('support.warningTitle')}</Text>
          <Text style={styles.warningText}>{t('support.warningText')}</Text>
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
  section: { gap: darkTheme.spacing.md },
  sectionTitle: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: darkTheme.spacing.md },
  listCard: { gap: darkTheme.spacing.sm },
  channelCard: { gap: darkTheme.spacing.xs },
  itemTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.text.primary, flex: 1 },
  itemText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
  meta: { ...darkTheme.typography.caption, color: darkTheme.colors.text.disabled },
  count: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.brand.primary },
  warningCard: { gap: darkTheme.spacing.sm, borderColor: darkTheme.colors.status.warning },
  warningTitle: { ...darkTheme.typography.bodyStrong, color: darkTheme.colors.status.warning },
  warningText: { ...darkTheme.typography.bodyMedium, color: darkTheme.colors.text.secondary },
});
