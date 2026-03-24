/**
 * app/item-entry.tsx — Item entry screen (placeholder)
 *
 * This screen is the entry point for the purchase evaluation flow.
 *
 * Planned implementation (not yet built):
 *   1. Large text input — user types the item they are considering buying.
 *   2. On submit — calls the Claude API (utils/categorise.ts, not yet created)
 *      to suggest a category from the list in data/questions.ts.
 *   3. Category confirm — user sees the suggested category with its emoji and
 *      can confirm or pick a different one from the full category list.
 *   4. On confirm — navigates to /questionnaire, passing the item name and
 *      chosen category key as route params.
 *
 * Currently shows a placeholder message.
 */

import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/theme';

export default function ItemEntryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Item entry — coming soon</Text>
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
