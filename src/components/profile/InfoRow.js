/**
 * @param {object} props
 * @param {string} props.label - Bắt buộc
 * @param {string|number} props.value - Bắt buộc
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 44,
  },
  label: {
    ...typography.body,
    color: colors.textMuted,
    flex: 1,
  },
  value: {
    ...typography.bodyBold,
    color: colors.text,
    flex: 2,
    textAlign: 'right',
  },
});

