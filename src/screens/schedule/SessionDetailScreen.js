import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import { sessionService } from '../../api/sessionService';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const DAY_NAMES = {
  2: 'Thứ Hai',
  3: 'Thứ Ba',
  4: 'Thứ Tư',
  5: 'Thứ Năm',
  6: 'Thứ Sáu',
  7: 'Thứ Bảy',
  8: 'Chủ Nhật',
};

export default function SessionDetailScreen({ route, navigation }) {
  const { id } = route.params || {};

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessionDetail = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await sessionService.getById(id);
      setSession(data);
      const courseName = data.course?.name || 'Chi tiết buổi học';
      navigation.setOptions({ title: courseName });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, navigation]);

  useEffect(() => {
    fetchSessionDetail();
  }, [fetchSessionDetail]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSessionDetail();
  }, [fetchSessionDetail]);

  if (loading && !session) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết buổi học..." />
      </ScreenContainer>
    );
  }

  if (error && !session) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải chi tiết buổi học'} onRetry={fetchSessionDetail} />
      </ScreenContainer>
    );
  }

  const course = session?.course;
  const dayName = DAY_NAMES[session?.dayOfWeek] || `Thứ ${session?.dayOfWeek}`;

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        <View style={styles.card}>
          <Text style={styles.courseName}>{course?.name || 'Buổi học'}</Text>
          {course?.code ? <Text style={styles.codeText}>{course.code}</Text> : null}

          <View style={styles.infoGroup}>
            <InfoRow label="Ngày học" value={dayName} />
            <InfoRow
              label="Thời gian"
              value={`${session?.startTime} - ${session?.endTime}`}
            />
            <InfoRow label="Phòng học" value={session?.room || '-'} />
            <InfoRow label="Giảng viên" value={course?.lecturer || '-'} />
            <InfoRow label="Số tín chỉ" value={course?.credits ? `${course.credits} tín chỉ` : '-'} />
            <InfoRow label="Học kỳ" value={course?.semester || '-'} />
          </View>

          {session?.note ? (
            <View style={styles.noteBox}>
              <Text style={styles.noteLabel}>Ghi chú cho buổi học:</Text>
              <Text style={styles.noteText}>{session.note}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  courseName: {
    ...typography.h2,
    color: colors.text,
  },
  codeText: {
    ...typography.captionBold,
    color: colors.primary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  infoGroup: {
    marginVertical: spacing.sm,
  },
  noteBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: spacing.xs,
  },
  noteLabel: {
    ...typography.captionBold,
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  noteText: {
    ...typography.body,
    color: colors.text,
  },
});

