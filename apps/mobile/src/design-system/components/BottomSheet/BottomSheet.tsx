import React, { type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { darkTheme } from '../../theme';

export interface BottomSheetProps {
  visible: boolean;
  title?: string;
  children: ReactNode;
  onRequestClose: () => void;
}

export function BottomSheet({ visible, title, children, onRequestClose }: BottomSheetProps) {
  return (
    <Modal animationType="slide" transparent visible={visible} statusBarTranslucent onRequestClose={onRequestClose}>
      <View style={styles.overlay}>
        <Pressable accessibilityLabel="Fechar painel" accessibilityRole="button" style={StyleSheet.absoluteFill} onPress={onRequestClose} />
        <View accessibilityViewIsModal style={styles.sheet}>
          <View style={styles.handle} />
          {title ? <Text style={styles.title}>{title}</Text> : null}
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: darkTheme.colors.overlay.scrim },
  sheet: {
    maxHeight: '85%',
    borderTopLeftRadius: darkTheme.radius['2xl'],
    borderTopRightRadius: darkTheme.radius['2xl'],
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: darkTheme.colors.border.default,
    backgroundColor: darkTheme.colors.surface.raised,
    paddingHorizontal: darkTheme.spacing.xl,
    paddingTop: darkTheme.spacing.sm,
    paddingBottom: darkTheme.spacing['3xl'],
    gap: darkTheme.spacing.lg,
    ...darkTheme.shadows.floating,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: darkTheme.radius.full,
    backgroundColor: darkTheme.colors.border.strong,
  },
  title: { ...darkTheme.typography.heading3, color: darkTheme.colors.text.primary },
  content: { gap: darkTheme.spacing.md },
});
