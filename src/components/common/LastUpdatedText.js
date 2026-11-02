/**
 * @param {object} props
 * @param {string|null} props.timestamp
 */
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import typography from '../../theme/typography';
import { formatDate } from '../../utils/date';

export default function LastUpdatedText({ timestamp }) {
  if (!timestamp) return null;

  const formatted = formatDate(timestamp, 'datetime');
  if (!formatted) return null;

  return (
    <Text style={styles.text}>Cập nhật lần cuối: {formatted}</Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});

