/**
 * @param {object} props
 * @param {'todo'|'done'} props.status - Bắt buộc
 * @param {() => void} props.onToggle - Bắt buộc
 */
import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function StatusToggle({ status, onToggle }) {
  const isDone = status === 'done';

  return (
    <TouchableOpacity
      style={[styles.container, isDone ? styles.doneContainer : styles.todoContainer]}
      onPress={onToggle}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isDone }}
      accessibilityLabel={isDone ? 'Đánh dấu chưa xong' : 'Đánh dấu đã hoàn thành'}
    >
      <Feather
        name={isDone ? 'check-circle' : 'circle'}
        size={16}
        color={isDone ? '#065F46' : '#B45309'}
        style={styles.icon}
        accessible={false}
      />
      <Text style={[styles.text, isDone ? styles.doneText : styles.todoText]}>
        {isDone ? 'Đã xong' : 'Chưa xong'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    borderWidth: 1,
  },
  todoContainer: {
    backgroundColor: '#FFFBEB',
    borderColor: colors.warning,
  },
  doneContainer: {
    backgroundColor: colors.successLight,
    borderColor: colors.success,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    ...typography.badge,
  },
  todoText: {
    color: '#B45309',
  },
  doneText: {
    color: '#065F46',
  },
});

