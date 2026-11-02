/**
 * @param {object} props
 * @param {number} props.gpa - Bắt buộc (làm tròn 2 chữ số thập phân)
 * @param {number} props.totalCredits - Bắt buộc
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function GpaSummary({ gpa = 0, totalCredits = 0 }) {
  const formattedGpa = Number(gpa).toFixed(2);

  return (
    <View style={styles.card}>
      <View style={styles.item}>
        <Text style={styles.label}>GPA Tích lũy (Hệ 4)</Text>
        <Text style={styles.gpaValue}>{formattedGpa}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>Tín chỉ tích lũy</Text>
        <Text style={styles.creditsValue}>{totalCredits}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: spacing.sm,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  label: {
    ...typography.caption,
    color: colors.primaryLight,
    marginBottom: spacing.xs,
  },
  gpaValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  creditsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
});

