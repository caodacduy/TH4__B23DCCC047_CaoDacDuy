import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import EmptyState from '../../components/common/EmptyState';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { useAppData } from '../../context/AppDataContext';
import { ROUTES } from '../../navigation/routes';

export default function ScheduleScreen({ navigation }) {
  const { sessions, courses, loading, refreshing, error, lastUpdated, refreshAll } = useAppData();

  // Xác định thứ hôm nay (JS: 0=CN -> 8; 1=T2 -> 2; ...)
  const getTodayDayOfWeek = () => {
    const day = new Date().getDay();
    return day === 0 ? 8 : day + 1;
  };

  const [selectedDay, setSelectedDay] = useState(getTodayDayOfWeek());

  // Lọc các buổi học theo ngày đã chọn
  const daySessions = useMemo(() => {
    const courseMap = new Map();
    courses.forEach((c) => courseMap.set(c.id, c));

    return sessions
      .filter((s) => s.dayOfWeek === selectedDay)
      .map((s) => ({
        ...s,
        course: s.course || courseMap.get(s.courseId),
      }))
      .sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
  }, [sessions, courses, selectedDay]);

  if (loading && sessions.length === 0) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thời khóa biểu..." />
      </ScreenContainer>
    );
  }

  if (error && sessions.length === 0) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải thời khóa biểu'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        <View style={styles.metaRow}>
          <LastUpdatedText timestamp={lastUpdated} />
        </View>
      </View>

      <FlatList
        data={daySessions}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshAll} colors={[colors.primary]} />
        }
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <SessionCard
            session={item}
            onPress={() =>
              navigation.navigate(ROUTES.SESSION_DETAIL, { id: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Không có lịch học hôm nay"
            description="Bạn không có buổi học nào trong ngày đã chọn. Hãy tận hưởng thời gian rảnh nhé!"
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metaRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
});

