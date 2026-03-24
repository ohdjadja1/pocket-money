/**
 * app/index.tsx — Home screen
 *
 * The main screen the user lands on after onboarding. Its job is motivational
 * and navigational: remind the user what they are saving for, and give them
 * the two primary entry points into the app.
 *
 * Structure:
 *   - Goal card     — reads 'userGoal' from AsyncStorage and displays it at the
 *                     top as a quiet motivational nudge. Shows a prompt if unset.
 *   - Primary CTA   — "Should I buy this?" navigates to /item-entry to start
 *                     the purchase evaluation flow.
 *   - Secondary CTA — "No-spend calendar" navigates to /calendar.
 *
 * Data flow:
 *   - User goal is read fresh from AsyncStorage on every mount (useEffect with
 *     empty deps array). This means changes made in Settings are reflected
 *     immediately on returning to Home without any global state manager.
 *
 * Navigation:
 *   - Uses expo-router's router.push() so the user can navigate back from
 *     item-entry or calendar using the hardware/gesture back button.
 */

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../utils/theme';

export default function HomeScreen() {
  // The user's financial goal string, e.g. "Trip to Japan".
  // Empty string until AsyncStorage resolves; the UI handles both states.
  const [goal, setGoal] = useState<string>('');

  // Load the goal once when the screen mounts.
  // No cleanup needed — AsyncStorage.getItem is non-cancellable and harmless
  // if the component unmounts before it resolves.
  useEffect(() => {
    AsyncStorage.getItem('userGoal').then((value) => {
      if (value) setGoal(value);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {/* ScrollView allows the content to scroll on very small screens,
          even though on most devices it all fits without scrolling. */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Goal card — shown whether or not a goal is set.
            When no goal is set, a gentle hint encourages the user to add one. */}
        {goal ? (
          <View style={styles.goalCard}>
            <Text style={styles.goalLabel}>Working towards</Text>
            <Text style={styles.goalText}>{goal}</Text>
          </View>
        ) : (
          <View style={styles.goalCard}>
            <Text style={styles.goalLabel}>No goal set yet</Text>
            <Text style={styles.goalHint}>
              Set one in onboarding to keep yourself motivated.
            </Text>
          </View>
        )}

        <Text style={styles.heading}>What would you like to do?</Text>

        {/* Primary action — starts the purchase evaluation questionnaire */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/item-entry')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Should I buy this?</Text>
        </TouchableOpacity>

        {/* Secondary action — opens the no-spend day calendar */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/calendar')}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>No-spend calendar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    // flexGrow: 1 allows the ScrollView content to expand to fill the screen
    // even when the content is shorter than the viewport.
    flexGrow: 1,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: 40,
  },
  goalCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.card,
    padding: theme.spacing.cardPadding,
    marginBottom: theme.spacing.sectionGap,
  },
  goalLabel: {
    // Spread the caption style and add uppercase treatment for a label look.
    ...theme.typography.caption,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  goalText: {
    ...theme.typography.sectionHeading,
  },
  goalHint: {
    ...theme.typography.body,
  },
  heading: {
    ...theme.typography.screenTitle,
    marginBottom: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: theme.colors.primaryButton,
    height: theme.button.height,
    borderRadius: theme.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  primaryButtonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: theme.colors.primaryButtonText,
  },
  secondaryButton: {
    // Outlined style — card background with a coloured border instead of
    // a filled background, visually lower priority than the primary button.
    backgroundColor: theme.colors.cardBackground,
    height: theme.button.height,
    borderRadius: theme.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.hunterGreen,
  },
  secondaryButtonText: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 17,
    color: theme.colors.hunterGreen,
  },
});
