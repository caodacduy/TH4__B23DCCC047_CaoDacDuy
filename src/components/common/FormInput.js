/**
 * @param {object} props
 * @param {string} props.label - Bắt buộc
 * @param {string} props.value - Bắt buộc
 * @param {(text: string) => void} props.onChangeText - Bắt buộc
 * @param {string} [props.error]
 * @param {string} [props.placeholder]
 * @param {string} [props.keyboardType='default']
 * @param {boolean} [props.multiline=false]
 * @param {number} [props.numberOfLines=1]
 */
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function FormInput({
  label,
  value,
  onChangeText,
  error = '',
  placeholder = '',
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          Boolean(error) && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        accessibilityLabel={`Ô nhập ${label}`}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.captionBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    color: colors.text,
    ...typography.body,
  },
  multilineInput: {
    minHeight: 88,
    textAlignVertical: 'top',
    paddingVertical: spacing.sm,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});

