import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import FilterChips from '../../components/common/FilterChips';
import EmptyState from '../../components/common/EmptyState';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import { useAppData } from '../../context/AppDataContext';
import { calcGpa } from '../../utils/gpa';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function GradeListScreen({ navigation }) {
  const { grades, courses, loading, refreshing, error, refreshAll } = useAppData();

  const [selectedSemester, setSelectedSemester] = useState('ALL');

  // Tạo danh sách học kỳ từ dữ liệu grades
  const semesterOptions = useMemo(() => {
    const semesters = Array.from(new Set(grades.map((g) => g.semester).filter(Boolean)));
    return [
      { label: 'Tất cả', value: 'ALL' },
      ...semesters.map((s) => ({ label: s, value: s })),
    ];
  }, [grades]);

  // Lọc điểm theo học kỳ
  const filteredGrades = useMemo(() => {
    const courseMap = new Map();
    courses.forEach((c) => courseMap.set(c.id, c));

    return grades
      .filter((g) => selectedSemester === 'ALL' || g.semester === selectedSemester)
      .map((g) => ({
        ...g,
        course: g.course || courseMap.get(g.courseId),
      }));
  }, [grades, courses, selectedSemester]);

  // Tính GPA cho nhóm điểm đang lọc
  const { gpa, totalCredits } = useMemo(
    () => calcGpa(filteredGrades, courses),
    [filteredGrades, courses],
  );

  if (loading && grades.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải kết quả học tập..." />
      </ScreenContainer>
    );
  }

  if (error && grades.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải kết quả học tập'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filteredGrades}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshAll} colors={[colors.primary]} />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <GpaSummary gpa={gpa} totalCredits={totalCredits} />
            <View style={styles.filterWrapper}>
              <FilterChips
                options={semesterOptions}
                selected={selectedSemester}
                onSelect={setSelectedSemester}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <GradeRow
            grade={item}
            onPress={() =>
              navigation.navigate(ROUTES.GRADE_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không có dữ liệu điểm"
            description={
              selectedSemester !== 'ALL'
                ? 'Không có môn học nào trong học kỳ đã chọn.'
                : 'Chưa có dữ liệu kết quả học tập.'
            }
            actionLabel={selectedSemester !== 'ALL' ? 'Xem tất cả' : undefined}
            onAction={selectedSemester !== 'ALL' ? () => setSelectedSemester('ALL') : undefined}
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
  filterWrapper: {
    marginBottom: spacing.md,
  },
});

