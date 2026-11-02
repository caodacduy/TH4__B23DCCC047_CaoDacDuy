/**
 * @param {object} props
 * @param {number} props.selectedDay - Bắt buộc (2: Thứ 2 -> 8: Chủ nhật)
 * @param {(day: number) => void} props.onSelectDay - Bắt buộc
 */
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const DAYS = [
  { value: 2, label: 'Thứ 2' },
  { value: 3, label: 'Thứ 3' },
  { value: 4, label: 'Thứ 4' },
  { value: 5, label: 'Thứ 5' },
  { value: 6, label: 'Thứ 6' },
  { value: 7, label: 'Thứ 7' },
  { value: 8, label: 'Chủ nhật' },
];

export default function DaySelector({ selectedDay, onSelectDay }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {DAYS.map((item) => {
        const isSelected = selectedDay === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.button, isSelected && styles.selectedButton]}
            onPress={() => onSelectDay(item.value)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Chọn lịch ${item.label}`}
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  button: {
    minHeight: 44,
    minWidth: 54,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    ...typography.captionBold,
    color: colors.text,
  },
  selectedText: {
    color: colors.white,
  },
});

