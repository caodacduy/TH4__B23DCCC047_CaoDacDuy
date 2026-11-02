/**
 * @param {object} props
 * @param {object} props.course - Bắt buộc
 * @param {string} props.course.code
 * @param {string} props.course.name
 * @param {number} props.course.credits
 * @param {string} props.course.lecturer
 * @param {() => void} props.onPress - Bắt buộc
 */
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function CourseCard({ course, onPress }) {
  if (!course) return null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Môn học ${course.name}, mã ${course.code}`}
    >
      <View style={styles.header}>
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>{course.code}</Text>
        </View>
        <Text style={styles.creditsText}>{course.credits} tín chỉ</Text>
      </View>
      <Text style={styles.name}>{course.name}</Text>
      <Text style={styles.lecturer}>Giảng viên: {course.lecturer}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 44,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  codeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.xs,
  },
  codeText: {
    ...typography.badge,
    color: colors.primaryDark,
  },
  creditsText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  lecturer: {
    ...typography.caption,
    color: colors.textMuted,
  },
});

export default React.memo(CourseCard);

