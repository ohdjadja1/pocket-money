/**
 * app/calendar.tsx — No-spend calendar screen (placeholder)
 *
 * This screen lets the user track which days of the month they avoided
 * discretionary spending.
 *
 * Planned implementation (not yet built):
 *   - Monthly calendar grid — one cell per day of the current month.
 *   - Tap to toggle a day as "no-spend" (Hunter Green fill) or neutral (empty).
 *     Restriction: only today or up to 7 days in the past can be toggled.
 *     Future days cannot be marked.
 *   - No-spend days are persisted to AsyncStorage as an array of date strings.
 *   - Month navigation — previous/next arrows to browse history (view only
 *     for past months, no editing beyond the 7-day window).
 *   - Progress bar toward the monthly no-spend target set during onboarding.
 *   - Celebratory Lottie animation + message referencing the user's goal
 *     when the monthly target is reached.
 *
 * Currently shows a placeholder message.
 */

import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No-spend calendar — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.screenPadding,
  },
  text: {
    ...theme.typography.body,
  },
});
