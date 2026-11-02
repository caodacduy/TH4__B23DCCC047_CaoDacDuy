import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import { gradeService } from '../../api/gradeService';
import { toScale4 } from '../../utils/gpa';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function GradeDetailScreen({ route, navigation }) {
  const { id } = route.params || {};

  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchGradeDetail = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const data = await gradeService.getById(id);
      setGrade(data);
      const title = data.course?.name || 'Chi tiết kết quả';
      navigation.setOptions({ title });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id, navigation]);

  useEffect(() => {
    fetchGradeDetail();
  }, [fetchGradeDetail]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGradeDetail();
  }, [fetchGradeDetail]);

  if (loading && !grade) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải chi tiết kết quả học tập..." />
      </ScreenContainer>
    );
  }

  if (error && !grade) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải chi tiết kết quả'} onRetry={fetchGradeDetail} />
      </ScreenContainer>
    );
  }

  const { scale4 } = toScale4(grade?.total || 0);
  const courseName = grade?.course?.name || `Môn học #${grade?.courseId}`;

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Card tổng hợp điểm */}
        <View style={styles.summaryCard}>
          <Text style={styles.courseName}>{courseName}</Text>
          <Text style={styles.semester}>{grade?.semester}</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{grade?.total}</Text>
              <Text style={styles.scoreLabel}>Điểm 10</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{grade?.letter}</Text>
              <Text style={styles.scoreLabel}>Điểm chữ</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>{scale4.toFixed(1)}</Text>
              <Text style={styles.scoreLabel}>Điểm hệ 4</Text>
            </View>
          </View>
        </View>

        {/* Chi tiết từng cột điểm */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cơ cấu điểm</Text>
          <InfoRow label="Chuyên cần (10%)" value={`${grade?.attendance} / 10`} />
          <InfoRow label="Giữa kỳ (30%)" value={`${grade?.midterm} / 10`} />
          <InfoRow label="Cuối kỳ (60%)" value={`${grade?.final} / 10`} />
          <InfoRow label="Tổng kết" value={`${grade?.total} / 10`} />
        </View>

        {/* Thông tin môn học */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin môn học</Text>
          <InfoRow label="Tên môn" value={courseName} />
          <InfoRow label="Mã môn" value={grade?.course?.code || '-'} />
          <InfoRow label="Số tín chỉ" value={grade?.course?.credits ? `${grade.course.credits} tín chỉ` : '-'} />
          <InfoRow label="Giảng viên" value={grade?.course?.lecturer || '-'} />
          <InfoRow label="Học kỳ" value={grade?.semester} />
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
  summaryCard: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  courseName: {
    ...typography.h3,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  semester: {
    ...typography.caption,
    color: colors.primaryLight,
    marginBottom: spacing.lg,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
  },
  scoreItem: {
    alignItems: 'center',
    flex: 1,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.primaryLight,
    marginTop: spacing.xs,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
});

