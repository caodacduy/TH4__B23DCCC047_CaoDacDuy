/**
 * @param {object} props
 * @param {string} props.message - Bắt buộc
 * @param {() => void} [props.onRetry]
 */
import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Feather name="alert-triangle" size={48} color={colors.danger} style={styles.icon} accessible={false} />
      <Text style={styles.title}>Đã xảy ra sự cố</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <View style={styles.buttonWrapper}>
          <AppButton
            title="Thử lại"
            onPress={onRetry}
            variant="outline"
            accessibilityLabel="Nút thử lại"
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  icon: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  buttonWrapper: {
    minWidth: 140,
  },
});

