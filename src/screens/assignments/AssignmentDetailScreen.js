import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import StatusToggle from '../../components/assignment/StatusToggle';
import SyncBadge from '../../components/common/SyncBadge';
import { assignmentService } from '../../api/assignmentService';
import { useAppData } from '../../context/AppDataContext';
import { formatDate, isOverdue } from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AssignmentDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { toggleAssignmentStatus, pendingAssignmentIds } = useAppData();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchAssignmentDetail = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await assignmentService.getById(id);
      setAssignment(data);
      if (data?.title) {
        navigation.setOptions({ title: data.title });
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, navigation]);

  useEffect(() => {
    fetchAssignmentDetail();
  }, [fetchAssignmentDetail]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAssignmentDetail();
  }, [fetchAssignmentDetail]);

  const handleToggle = async () => {
    if (!assignment) return;
    const newStatus = assignment.status === 'todo' ? 'done' : 'todo';
    setAssignment((prev) => ({ ...prev, status: newStatus }));
    await toggleAssignmentStatus(assignment.id);
  };

  if (loading && !assignment) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết bài tập..." />
      </ScreenContainer>
    );
  }

  if (error && !assignment) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải chi tiết bài tập'} onRetry={fetchAssignmentDetail} />
      </ScreenContainer>
    );
  }

  const overdue = assignment?.status !== 'done' && isOverdue(assignment?.dueDate);
  const courseName = assignment?.course?.name || `Môn học #${assignment?.courseId}`;
  const isPending = pendingAssignmentIds.has(Number(id));

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.titleArea}>
              <Text style={styles.courseName}>{courseName}</Text>
              <Text style={styles.title}>{assignment?.title}</Text>
            </View>
            <SyncBadge pending={isPending} />
          </View>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Trạng thái hoàn thành:</Text>
            <StatusToggle status={assignment?.status} onToggle={handleToggle} />
          </View>

          <View style={styles.infoGroup}>
            <InfoRow
              label="Hạn nộp"
              value={`${formatDate(assignment?.dueDate, 'datetime')}${
                overdue ? ' (Quá hạn)' : ''
              }`}
            />
            <InfoRow
              label="Cập nhật lần cuối"
              value={formatDate(assignment?.updatedAt, 'datetime')}
            />
          </View>

          {assignment?.description ? (
            <View style={styles.descBox}>
              <Text style={styles.descLabel}>Nội dung yêu cầu:</Text>
              <Text style={styles.descText}>{assignment.description}</Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  titleArea: {
    flex: 1,
    marginRight: spacing.sm,
  },
  courseName: {
    ...typography.captionBold,
    color: colors.primary,
    marginBottom: 4,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.sm,
  },
  toggleLabel: {
    ...typography.bodyBold,
    color: colors.text,
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
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  descText: {
    ...typography.body,
    color: colors.textMuted,
  },
});

