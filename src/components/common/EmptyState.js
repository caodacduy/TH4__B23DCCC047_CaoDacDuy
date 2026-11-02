/**
 * @param {object} props
 * @param {string} props.title - Bắt buộc
 * @param {string} [props.description='']
 * @param {string} [props.actionLabel='Thử lại']
 * @param {() => void} [props.onAction]
 */
import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { View, Text, StyleSheet } from 'react-native';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function EmptyState({
  title,
  description = '',
  actionLabel = 'Thử lại',
  onAction,
}) {
  return (
    <View style={styles.container}>
      <Feather name="inbox" size={48} color={colors.textMuted} style={styles.icon} accessible={false} />
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {onAction ? (
        <View style={styles.buttonWrapper}>
          <AppButton
            title={actionLabel}
            variant="outline"
            onPress={onAction}
            accessibilityLabel={actionLabel}
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
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: spacing.sm,
  },
  buttonWrapper: {
    marginTop: spacing.md,
    minWidth: 140,
  },
});

