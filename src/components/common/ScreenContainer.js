/**
 * @param {object} props
 * @param {React.ReactNode} props.children - Bắt buộc
 * @param {boolean} [props.scroll=false]
 */
import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import OfflineBanner from './OfflineBanner';
import colors from '../../theme/colors';

export default function ScreenContainer({ children, scroll = false }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <OfflineBanner />
      {scroll ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.container}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

