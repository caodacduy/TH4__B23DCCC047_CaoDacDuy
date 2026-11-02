import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import InfoRow from '../../components/profile/InfoRow';
import GpaSummary from '../../components/grade/GpaSummary';
import SyncBadge from '../../components/common/SyncBadge';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { calcGpa } from '../../utils/gpa';
import { ROUTES } from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ProfileScreen({ navigation }) {
  const {
    student,
    grades,
    courses,
    loading,
    refreshing,
    error,
    refreshAll,
    isStudentPending,
  } = useAppData();

  const { gpa, totalCredits } = useMemo(
    () => calcGpa(grades, courses),
    [grades, courses],
  );

  if (loading && !student) {
    return (
      <ScreenContainer>
        <LoadingView message="Đang tải thông tin cá nhân..." />
      </ScreenContainer>
    );
  }

  if (error && !student) {
    return (
      <ScreenContainer>
        <ErrorView message={error.message || 'Không thể tải thông tin cá nhân'} onRetry={refreshAll} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshAll} colors={[colors.primary]} />
        }
      >
        {/* Avatar + Tên */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {student?.fullName ? student.fullName.charAt(0) : 'S'}
            </Text>
          </View>
          <Text style={styles.studentName}>{student?.fullName || 'Sinh viên'}</Text>
          <Text style={styles.studentCode}>{student?.studentCode || 'N/A'}</Text>
          {isStudentPending ? (
            <View style={styles.badgeWrapper}>
              <SyncBadge pending={isStudentPending} />
            </View>
          ) : null}
        </View>

        {/* GPA Summary */}
        <GpaSummary gpa={gpa} totalCredits={totalCredits} />

        {/* Thông tin cá nhân */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
          <InfoRow label="Mã sinh viên" value={student?.studentCode} />
          <InfoRow label="Họ tên" value={student?.fullName} />
          <InfoRow label="Lớp" value={student?.className} />
          <InfoRow label="Ngành" value={student?.major} />
          <InfoRow label="Email" value={student?.email} />
          <InfoRow label="Điện thoại" value={student?.phone} />
        </View>

        {/* Nút điều hướng */}
        <View style={styles.actionButtons}>
          <View style={styles.actionBtn}>
            <AppButton
              title="Chỉnh sửa thông tin"
              onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
              variant="outline"
              accessibilityLabel="Chỉnh sửa thông tin cá nhân"
            />
          </View>
          <View style={styles.actionBtn}>
            <AppButton
              title="Kết quả học tập"
              onPress={() => navigation.navigate(ROUTES.GRADE_LIST)}
              accessibilityLabel="Xem kết quả học tập"
            />
          </View>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '700',
  },
  studentName: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  studentCode: {
    ...typography.captionBold,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  badgeWrapper: {
    marginTop: spacing.sm,
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
  actionButtons: {
    gap: spacing.md,
  },
  actionBtn: {
    marginBottom: spacing.sm,
  },
});

