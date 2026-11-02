/**
 * @param {object} props
 * @param {object} props.grade - Bắt buộc
 * @param {() => void} props.onPress - Bắt buộc
 */
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function GradeRow({ grade, onPress }) {
  if (!grade) return null;

  const courseName = grade.course?.name || `Môn học #${grade.courseId}`;
  const credits = grade.course?.credits || '-';

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Kết quả môn ${courseName}, điểm tổng kết ${grade.total}, điểm chữ ${grade.letter}`}
    >
      <View style={styles.leftInfo}>
        <Text style={styles.courseName}>{courseName}</Text>
        <Text style={styles.creditsText}>{credits} tín chỉ • {grade.semester}</Text>
      </View>
      <View style={styles.rightScore}>
        <Text style={styles.totalScore}>{grade.total}</Text>
        <View style={styles.letterBadge}>
          <Text style={styles.letterText}>{grade.letter}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  leftInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  courseName: {
    ...typography.bodyBold,
    color: colors.text,
  },
  creditsText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  rightScore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalScore: {
    ...typography.h3,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  letterBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.xs,
    minWidth: 32,
    alignItems: 'center',
  },
  letterText: {
    ...typography.captionBold,
    color: colors.primaryDark,
  },
});

export default React.memo(GradeRow);

