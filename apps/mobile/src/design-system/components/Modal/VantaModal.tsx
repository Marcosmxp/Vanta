import React, { type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { darkTheme } from '../../theme';

export interface VantaModalProps {
  visible: boolean;
  title: string;
  children: ReactNode;
  onRequestClose: () => void;
}

export function VantaModal({ visible, title, children, onRequestClose }: VantaModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} statusBarTranslucent onRequestClose={onRequestClose}>
      <View style={styles.overlay}>
        <Pressable accessibilityLabel="Fechar diálogo" accessibilityRole="button" style={StyleSheet.absoluteFill} onPress={onRequestClose} />
        <View accessibilityViewIsModal style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: darkTheme.colors.overlay.scrim,
    padding: darkTheme.spacing.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    borderRadius: darkTheme.radius.xl,
    borderWidth: 1,
    borderColor: darkTheme.colors.border.default,
    backgroundColor: darkTheme.colors.surface.raised,
    padding: darkTheme.spacing.xl,
    gap: darkTheme.spacing.lg,
    ...darkTheme.shadows.floating,
  },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  content: { gap: darkTheme.spacing.md },
});
