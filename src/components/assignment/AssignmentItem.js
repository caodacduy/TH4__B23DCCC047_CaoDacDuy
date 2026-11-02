/**
 * @param {object} props
 * @param {object} props.assignment - Bắt buộc
 * @param {boolean} [props.pending=false]
 * @param {() => void} props.onPress - Bắt buộc
 * @param {() => void} props.onToggleStatus - Bắt buộc
 */
import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { formatDate, isOverdue } from '../../utils/date';

function AssignmentItem({
  assignment,
  pending = false,
  onPress,
  onToggleStatus,
}) {
  if (!assignment) return null;

  const overdue = assignment.status !== 'done' && isOverdue(assignment.dueDate);
  const courseName = assignment.course?.name || `Môn học #${assignment.courseId}`;

  return (
    <TouchableOpacity
      style={[styles.card, overdue && styles.overdueCard]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Bài tập ${assignment.title}, môn ${courseName}, hạn ${formatDate(assignment.dueDate, 'date')}`}
    >
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          <Text style={styles.courseName}>{courseName}</Text>
          <Text
            style={[
              styles.title,
              assignment.status === 'done' && styles.titleDone,
            ]}
          >
            {assignment.title}
          </Text>
        </View>
        <SyncBadge pending={pending} />
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.dueArea}>
          <Feather name="calendar" size={14} color={overdue ? colors.danger : colors.textMuted} style={styles.dueIcon} accessible={false} />
          <Text style={[styles.dueText, overdue && styles.overdueText]}>
            Hạn: {formatDate(assignment.dueDate, 'datetime')}
            {overdue ? ' (Quá hạn)' : ''}
          </Text>
        </View>
        <StatusToggle status={assignment.status} onToggle={onToggleStatus} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  overdueCard: {
    borderColor: colors.danger,
    backgroundColor: '#FFFBFB',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleArea: {
    flex: 1,
    marginRight: spacing.sm,
  },
  courseName: {
    ...typography.captionBold,
    color: colors.primary,
    marginBottom: 2,
  },
  title: {
    ...typography.bodyBold,
    color: colors.text,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dueArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  dueIcon: {
    marginRight: 4,
  },
  dueText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  overdueText: {
    color: colors.danger,
    fontWeight: '700',
  },
});

export default React.memo(AssignmentItem);

