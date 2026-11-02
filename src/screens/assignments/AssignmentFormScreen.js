import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import FilterChips from '../../components/common/FilterChips';
import { useAppData } from '../../context/AppDataContext';
import { validateAssignment } from '../../utils/validators';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { Text } from 'react-native';

export default function AssignmentFormScreen({ navigation }) {
  const { courses, addAssignment } = useAppData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const courseOptions = courses.map((c) => ({ label: c.name, value: String(c.id) }));

  const handleSubmit = useCallback(async () => {
    const { isValid, errors: validationErrors } = validateAssignment({
      title,
      dueDate,
      courseId: selectedCourseId,
    });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await addAssignment({
        title: title.trim(),
        description: description.trim(),
        dueDate,
        courseId: selectedCourseId,
      });
      Alert.alert('Thành công', 'Bài tập đã được thêm!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Lỗi', err?.message || 'Không thể thêm bài tập. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }, [title, description, dueDate, selectedCourseId, addAssignment, navigation]);

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <Text style={styles.heading}>Thêm bài tập mới</Text>

        <FormInput
          label="Tiêu đề *"
          value={title}
          onChangeText={setTitle}
          placeholder="Nhập tiêu đề bài tập..."
          error={errors.title}
        />

        <FormInput
          label="Mô tả"
          value={description}
          onChangeText={setDescription}
          placeholder="Mô tả nội dung bài tập (tùy chọn)..."
          multiline
          numberOfLines={3}
        />

        <FormInput
          label="Hạn nộp * (ISO 8601, VD: 2026-11-20T23:59:00)"
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="2026-11-20T23:59:00"
          error={errors.dueDate}
        />

        <Text style={styles.sectionLabel}>Môn học *</Text>
        {errors.courseId ? (
          <Text style={styles.errorText}>{errors.courseId}</Text>
        ) : null}
        <FilterChips
          options={courseOptions}
          selected={selectedCourseId}
          onSelect={setSelectedCourseId}
        />

        <View style={styles.buttonRow}>
          <View style={styles.cancelBtn}>
            <AppButton
              title="Hủy"
              onPress={() => navigation.goBack()}
              variant="outline"
              accessibilityLabel="Hủy bỏ thêm bài tập"
            />
          </View>
          <View style={styles.submitBtn}>
            <AppButton
              title="Lưu bài tập"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              accessibilityLabel="Lưu bài tập mới"
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heading: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  cancelBtn: {
    flex: 1,
  },
  submitBtn: {
    flex: 2,
  },
});

