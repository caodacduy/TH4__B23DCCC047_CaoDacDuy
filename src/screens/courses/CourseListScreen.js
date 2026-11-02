import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import EmptyState from '../../components/common/EmptyState';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import CourseCard from '../../components/course/CourseCard';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';

export default function CourseListScreen({ navigation }) {
  const { courses, loading, refreshing, error, lastUpdated, refreshAll } = useAppData();

  const [searchText, setSearchText] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');

  // Trích xuất danh sách các học kỳ duy nhất để tạo options cho FilterChips
  const semesterOptions = useMemo(() => {
    const semesters = Array.from(new Set(courses.map((c) => c.semester).filter(Boolean)));
    return [
      { label: 'Tất cả', value: 'ALL' },
      ...semesters.map((s) => ({ label: s, value: s })),
    ];
  }, [courses]);

  // Lọc theo từ khóa tìm kiếm và học kỳ
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchText.toLowerCase()) ||
        c.code.toLowerCase().includes(searchText.toLowerCase());

      const matchSemester = selectedSemester === 'ALL' || c.semester === selectedSemester;

      return matchSearch && matchSemester;
    });
  }, [courses, searchText, selectedSemester]);

  if (loading && courses.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải danh sách môn học..." />
      </ScreenContainer>
    );
  }

  if (error && courses.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải danh sách môn học'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.filterSection}>
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm theo tên hoặc mã môn..."
        />
        <View style={styles.chipsWrapper}>
          <FilterChips
            options={semesterOptions}
            selected={selectedSemester}
            onSelect={setSelectedSemester}
          />
        </View>
        <View style={styles.metaRow}>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshAll} colors={[colors.primary]} />
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() =>
              navigation.navigate(ROUTES.COURSE_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không tìm thấy môn học nào"
            description={
              searchText || selectedSemester !== 'ALL'
                ? 'Không có môn học nào khớp với bộ lọc hoặc từ khóa tìm kiếm.'
                : 'Hiện tại chưa có môn học nào trong hệ thống.'
            }
            actionLabel={searchText || selectedSemester !== 'ALL' ? 'Xóa bộ lọc' : 'Tải lại'}
            onAction={
              searchText || selectedSemester !== 'ALL'
                ? () => {
                    setSearchText('');
                    setSelectedSemester('ALL');
                  }
                : refreshAll
            }
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filterSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
  },
  chipsWrapper: {
    marginVertical: spacing.sm,
  },
  metaRow: {
    marginBottom: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
});

