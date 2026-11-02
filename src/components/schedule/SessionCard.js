/**
 * @param {object} props
 * @param {object} props.session - Bắt buộc
 * @param {() => void} props.onPress - Bắt buộc
 */
import React from 'react';
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function SessionCard({ session, onPress }) {
  if (!session) return null;

  const courseName = session.course?.name || `Môn học #${session.courseId}`;
  const courseCode = session.course?.code || '';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Buổi học ${courseName}, từ ${session.startTime} đến ${session.endTime}, tại phòng ${session.room}`}
    >
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>{session.startTime}</Text>
        <Text style={styles.timeDivider}>|</Text>
        <Text style={styles.timeText}>{session.endTime}</Text>
      </View>
      <View style={styles.content}>
        {courseCode ? <Text style={styles.code}>{courseCode}</Text> : null}
        <Text style={styles.courseName}>{courseName}</Text>
        <View style={styles.roomRow}>
          <Feather name="map-pin" size={14} color={colors.textMuted} style={styles.roomIcon} accessible={false} />
          <Text style={styles.roomText}>Phòng: {session.room}</Text>
        </View>
        {session.note ? <Text style={styles.note}>Ghi chú: {session.note}</Text> : null}
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
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  timeBox: {
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    minWidth: 70,
  },
  timeText: {
    ...typography.captionBold,
    color: colors.primaryDark,
  },
  timeDivider: {
    fontSize: 10,
    color: colors.primary,
    marginVertical: -2,
  },
  content: {
    flex: 1,
  },
  code: {
    ...typography.badge,
    color: colors.primary,
  },
  courseName: {
    ...typography.bodyBold,
    color: colors.text,
    marginVertical: 2,
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  roomIcon: {
    marginRight: 4,
  },
  roomText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  note: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
});

export default React.memo(SessionCard);

