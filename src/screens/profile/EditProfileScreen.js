import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import FormInput from '../../components/common/FormInput';
import AppButton from '../../components/common/AppButton';
import { useAppData } from '../../context/AppDataContext';
import { validateProfile } from '../../utils/validators';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';
import { Text } from 'react-native';

export default function EditProfileScreen({ navigation }) {
  const { student, updateStudentProfile } = useAppData();

  const [fullName, setFullName] = useState(student?.fullName || '');
  const [email, setEmail] = useState(student?.email || '');
  const [phone, setPhone] = useState(student?.phone || '');
  const [className, setClassName] = useState(student?.className || '');
  const [major, setMajor] = useState(student?.major || '');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const { isValid, errors: validationErrors } = validateProfile({
      fullName,
      email,
      phone,
    });

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await updateStudentProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        className: className.trim(),
        major: major.trim(),
      });
      Alert.alert('Thành công', 'Thông tin cá nhân đã được cập nhật!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Lỗi', err?.message || 'Không thể cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }, [fullName, email, phone, className, major, updateStudentProfile, navigation]);

  return (
    <ScreenContainer scroll>
      <View style={styles.container}>
        <Text style={styles.heading}>Chỉnh sửa thông tin</Text>

        <FormInput
          label="Họ tên *"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nhập họ tên đầy đủ..."
          error={errors.fullName}
        />

        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          error={errors.email}
        />

        <FormInput
          label="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          placeholder="0912345678"
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <FormInput
          label="Lớp"
          value={className}
          onChangeText={setClassName}
          placeholder="VD: CNTT-K21A"
        />

        <FormInput
          label="Ngành học"
          value={major}
          onChangeText={setMajor}
          placeholder="VD: Công nghệ thông tin"
        />

        <View style={styles.buttonRow}>
          <View style={styles.cancelBtn}>
            <AppButton
              title="Hủy"
              onPress={() => navigation.goBack()}
              variant="outline"
              accessibilityLabel="Hủy bỏ chỉnh sửa"
            />
          </View>
          <View style={styles.submitBtn}>
            <AppButton
              title="Lưu thay đổi"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              accessibilityLabel="Lưu thông tin cá nhân"
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

