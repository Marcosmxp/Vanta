import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge, Card, darkTheme } from '../../../design-system';

export type ProfileDestination = 'security' | 'responsible-gaming' | 'support' | 'legal';

export interface ProfileMenuCardProps {
  onOpenDestination: (destination: ProfileDestination) => void;
}

const items: readonly {
  destination: ProfileDestination;
  title: string;
  description: string;
  status: string;
  active: boolean;
}[] = [
  {
    destination: 'security',
    title: 'Security Center',
    description: 'Sessões, dispositivos, autenticação e proteção da conta.',
    status: 'Ativo',
    active: true,
  },
  {
    destination: 'responsible-gaming',
    title: 'Jogo responsável',
    description: 'Limites, pausas, autoexclusão e controlos de proteção.',
    status: 'Ativo',
    active: true,
  },
  {
    destination: 'support',
    title: 'Suporte',
    description: 'Ajuda, contacto e acompanhamento de pedidos.',
    status: 'Ativo',
    active: true,
  },
  {
    destination: 'legal',
    title: 'Legal e privacidade',
    description: 'Termos, privacidade, regras e informação regulatória.',
    status: 'Ativo',
    active: true,
  },
];

export function ProfileMenuCard({ onOpenDestination }: ProfileMenuCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>CONTA</Text>
        <Text style={styles.title}>Controlo e transparência</Text>
      </View>

      <View style={styles.list}>
        {items.map((item) => (
          <Pressable
            key={item.destination}
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${item.title}`}
            onPress={() => onOpenDestination(item.destination)}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          >
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowDescription}>{item.description}</Text>
            </View>
            <View style={styles.rowMeta}>
              <Badge label={item.status} tone={item.active ? 'success' : 'neutral'} />
              <Text style={styles.chevron}>›</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: darkTheme.spacing.lg,
  },
  copy: {
    gap: darkTheme.spacing.xs,
  },
  eyebrow: {
    ...darkTheme.typography.labelSmall,
    color: darkTheme.colors.brand.primary,
    letterSpacing: 1.2,
  },
  title: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.primary,
  },
  list: {
    gap: darkTheme.spacing.xs,
  },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: darkTheme.colors.border.default,
  },
  pressed: {
    opacity: 0.7,
  },
  rowCopy: {
    flex: 1,
    gap: darkTheme.spacing.xs,
  },
  rowTitle: {
    ...darkTheme.typography.bodyStrong,
    color: darkTheme.colors.text.primary,
  },
  rowDescription: {
    ...darkTheme.typography.caption,
    color: darkTheme.colors.text.secondary,
  },
  rowMeta: {
    alignItems: 'flex-end',
    gap: darkTheme.spacing.xs,
  },
  chevron: {
    ...darkTheme.typography.heading3,
    color: darkTheme.colors.text.secondary,
  },
});
