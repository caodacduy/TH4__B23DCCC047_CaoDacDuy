import React, { useMemo } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import CourseCard from '../../components/course/CourseCard';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { useAppData } from '../../context/AppDataContext';
import { useSync } from '../../context/SyncContext';
import { ROUTES } from '../../navigation/routes';
import { daysLeft } from '../../utils/date';

export default function HomeScreen({ navigation }) {
  const {
    student,
    courses,
    assignments,
    loading,
    refreshing,
    error,
    lastUpdated,
    refreshAll,
    toggleAssignmentStatus,
    pendingAssignmentIds,
    isStudentPending,
  } = useAppData();

  const { pendingCount, syncing, syncNow } = useSync();

  // Lọc bài tập đến hạn trong 7 ngày tới
  const upcomingAssignments = useMemo(() => {
    return assignments.filter((item) => {
      if (item.status === 'done') return false;
      const days = daysLeft(item.dueDate);
      return days >= 0 && days <= 7;
    });
  }, [assignments]);

  if (loading && !student && courses.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải dữ liệu tổng quan..." />
      </ScreenContainer>
    );
  }

  if (error && !student && courses.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải dữ liệu'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={upcomingAssignments}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshAll} colors={[colors.primary]} />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            {/* Header sinh viên */}
            <View style={styles.headerCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {student?.fullName ? student.fullName.charAt(0) : 'S'}
                </Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.greeting}>Xin chào,</Text>
                <Text style={styles.studentName}>{student?.fullName || 'Sinh viên'}</Text>
                <Text style={styles.studentCode}>MSSV: {student?.studentCode || 'N/A'}</Text>
              </View>
              {isStudentPending ? (
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingText}>Đang chờ đồng bộ</Text>
                </View>
              ) : null}
            </View>

            {/* Thông báo Outbox nếu có thao tác chưa đồng bộ */}
            {pendingCount > 0 ? (
              <TouchableOpacity
                style={styles.syncNotice}
                onPress={syncNow}
                disabled={syncing}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Đồng bộ ngay các thay đổi"
              >
                <Feather name="refresh-cw" size={18} color="#92400E" style={styles.syncIcon} accessible={false} />
                <Text style={styles.syncText}>
                  {syncing
                    ? 'Đang đồng bộ...'
                    : `Có ${pendingCount} thao tác chưa đồng bộ. Nhấn để đồng bộ.`}
                </Text>
              </TouchableOpacity>
            ) : null}

            {/* Thời gian cập nhật */}
            <View style={styles.metaRow}>
              <LastUpdatedText timestamp={lastUpdated} />
            </View>

            {/* Section: Môn học đang học */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Môn học đang học ({courses.length})</Text>
            </View>

            <View style={styles.coursesContainer}>
              {courses.slice(0, 3).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={() =>
                    navigation.navigate(ROUTES.COURSE_DETAIL, { id: course.id })
                  }
                />
              ))}
            </View>

            {/* Section: Bài tập đến hạn trong 7 ngày tới */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Bài tập đến hạn (7 ngày tới) ({upcomingAssignments.length})
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <AssignmentItem
            assignment={item}
            pending={pendingAssignmentIds.has(item.id)}
            onPress={() =>
              navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, { id: item.id })
            }
            onToggleStatus={() => toggleAssignmentStatus(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không có bài tập đến hạn"
            description="Bạn không có bài tập nào cần nộp trong vòng 7 ngày tới."
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  headerCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.textMuted,
  },
  studentName: {
    ...typography.h3,
    color: colors.text,
  },
  studentCode: {
    ...typography.captionBold,
    color: colors.primary,
  },
  pendingBadge: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.xs,
  },
  pendingText: {
    ...typography.badge,
    color: '#B45309',
  },
  syncNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    padding: spacing.md,
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.warning,
    minHeight: 44,
  },
  syncIcon: {
    marginRight: spacing.sm,
  },
  syncText: {
    ...typography.bodyBold,
    color: '#92400E',
    flex: 1,
  },
  metaRow: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    marginVertical: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  coursesContainer: {
    marginBottom: spacing.md,
  },
});

