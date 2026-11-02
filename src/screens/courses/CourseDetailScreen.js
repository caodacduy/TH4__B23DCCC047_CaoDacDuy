import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import SessionCard from '../../components/schedule/SessionCard';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import { courseService } from '../../api/courseService';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function CourseDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { sessions, assignments, toggleAssignmentStatus, pendingAssignmentIds } = useAppData();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourseDetail = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await courseService.getById(id);
      setCourse(data);
      if (data?.name) {
        navigation.setOptions({ title: data.name });
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, navigation]);

  useEffect(() => {
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCourseDetail();
  }, [fetchCourseDetail]);

  // Lọc lịch học và bài tập thuộc môn này
  const courseSessions = useMemo(() => {
    return sessions.filter((s) => s.courseId === Number(id));
  }, [sessions, id]);

  const courseAssignments = useMemo(() => {
    return assignments.filter((a) => a.courseId === Number(id));
  }, [assignments, id]);

  if (loading && !course) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thông tin môn học..." />
      </ScreenContainer>
    );
  }

  if (error && !course) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải thông tin môn học'} onRetry={fetchCourseDetail} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        <View style={styles.card}>
          <Text style={styles.courseName}>{course?.name}</Text>
          <Text style={styles.codeText}>{course?.code}</Text>

          <View style={styles.infoGroup}>
            <InfoRow label="Số tín chỉ" value={`${course?.credits} tín chỉ`} />
            <InfoRow label="Giảng viên" value={course?.lecturer} />
            <InfoRow label="Học kỳ" value={course?.semester} />
          </View>

          {course?.description ? (
            <View style={styles.descBox}>
              <Text style={styles.descLabel}>Mô tả môn học:</Text>
              <Text style={styles.descText}>{course?.description}</Text>
            </View>
          ) : null}
        </View>

        {/* Lịch học của môn */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lịch học ({courseSessions.length})</Text>
        </View>
        {courseSessions.length > 0 ? (
          courseSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={{ ...session, course }}
              onPress={() =>
                navigation.navigate(ROUTES.SESSION_DETAIL, { id: session.id })
              }
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Chưa có lịch học cho môn này.</Text>
        )}

        {/* Bài tập của môn */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bài tập ({courseAssignments.length})</Text>
        </View>
        {courseAssignments.length > 0 ? (
          courseAssignments.map((assignment) => (
            <AssignmentItem
              key={assignment.id}
              assignment={{ ...assignment, course }}
              pending={pendingAssignmentIds.has(assignment.id)}
              onPress={() =>
                navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: assignment.id })
              }
              onToggleStatus={() => toggleAssignmentStatus(assignment.id)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>Chưa có bài tập nào cho môn này.</Text>
        )}
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
    marginBottom: spacing.md,
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
  descBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: spacing.xs,
  },
  descLabel: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  descText: {
    ...typography.body,
    color: colors.textMuted,
  },
  sectionHeader: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginVertical: spacing.sm,
  },
});

