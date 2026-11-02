import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FilterChips from '../../components/common/FilterChips';
import AppButton from '../../components/common/AppButton';
import EmptyState from '../../components/common/EmptyState';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';
import { isOverdue } from '../../utils/date';

const STATUS_FILTERS = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chưa xong', value: 'TODO' },
  { label: 'Đã xong', value: 'DONE' },
  { label: 'Quá hạn', value: 'OVERDUE' },
];

export default function AssignmentListScreen({ navigation }) {
  const {
    assignments,
    courses,
    loading,
    refreshing,
    error,
    lastUpdated,
    refreshAll,
    toggleAssignmentStatus,
    pendingAssignmentIds,
  } = useAppData();

  const [filter, setFilter] = useState('ALL');

  // Ghép course vào assignment nếu chưa có
  const fullAssignments = useMemo(() => {
    const courseMap = new Map();
    courses.forEach((c) => courseMap.set(c.id, c));

    return assignments.map((a) => ({
      ...a,
      course: a.course || courseMap.get(a.courseId),
    }));
  }, [assignments, courses]);

  // Lọc theo trạng thái
  const filteredAssignments = useMemo(() => {
    return fullAssignments.filter((item) => {
      if (filter === 'TODO') return item.status === 'todo';
      if (filter === 'DONE') return item.status === 'done';
      if (filter === 'OVERDUE') return item.status !== 'done' && isOverdue(item.dueDate);
      return true;
    });
  }, [fullAssignments, filter]);

  if (loading && assignments.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách bài tập..." />
      </ScreenContainer>
    );
  }

  if (error && assignments.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải danh sách bài tập'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <View style={styles.filterWrapper}>
          <FilterChips
            options={STATUS_FILTERS}
            selected={filter}
            onSelect={setFilter}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <AppButton
            title="+ Thêm bài tập"
            onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)}
            accessibilityLabel="Thêm bài tập mới"
          />
        </View>
        <View style={styles.metaRow}>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>
      </View>

      <FlatList
        data={filteredAssignments}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshAll} colors={[colors.primary]} />
        }
        contentContainerStyle={styles.listContent}
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
            title="Không có bài tập nào"
            description={
              filter !== 'ALL'
                ? 'Không có bài tập nào thỏa mãn bộ lọc đã chọn.'
                : 'Bạn hiện chưa có bài tập nào cần làm.'
            }
            actionLabel={filter !== 'ALL' ? 'Xem tất cả' : 'Thêm bài tập mới'}
            onAction={
              filter !== 'ALL'
                ? () => setFilter('ALL')
                : () => navigation.navigate(ROUTES.ASSIGNMENT_FORM)
            }
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.background,
  },
  filterWrapper: {
    marginBottom: spacing.sm,
  },
  buttonWrapper: {
    marginBottom: spacing.sm,
  },
  metaRow: {
    marginBottom: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
});

