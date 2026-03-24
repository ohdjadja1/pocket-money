/**
 * app/onboarding.tsx — First-launch onboarding screen
 *
 * Shown exactly once: the first time the user opens the app, before the home
 * screen is accessible. After completion, the flag 'onboardingComplete' is
 * written to AsyncStorage, and _layout.tsx will never redirect here again.
 *
 * Collects three pieces of user data:
 *   - userGoal        (required) — free-text financial goal, e.g. "Trip to Japan"
 *   - userWage        (optional) — hourly wage in the user's currency; used to
 *                                  calculate the "hours of work" question threshold
 *   - noSpendTarget   (optional) — how many no-spend days per month the user aims for
 *
 * Only the goal is required to proceed. Wage and target can be set later in
 * Settings if the user doesn't know them yet.
 *
 * Structure:
 *   SafeAreaView
 *   └─ KeyboardAvoidingView   — pushes content up on iOS when keyboard appears
 *      └─ ScrollView
 *         ├─ Heading + subheading
 *         ├─ Goal input
 *         ├─ Wage input (numeric)
 *         ├─ No-spend target input (numeric)
 *         └─ "Let's go" button (disabled until goal is filled)
 *
 * On submit: saves all three values + 'onboardingComplete' atomically using
 * AsyncStorage.multiSet, then navigates to the home screen with router.replace
 * (replace instead of push so the user can't back-navigate to onboarding).
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../utils/theme';

export default function OnboardingScreen() {
  const [goal, setGoal] = useState('');
  const [wage, setWage] = useState('');
  const [noSpendTarget, setNoSpendTarget] = useState('');

  async function handleFinish() {
    // multiSet writes all three keys atomically in a single AsyncStorage call,
    // which is faster and avoids partial writes if something interrupts.
    await AsyncStorage.multiSet([
      ['userGoal', goal.trim()],
      ['userWage', wage.trim()],
      ['noSpendTarget', noSpendTarget.trim()],
      // This flag is what _layout.tsx checks to decide whether to show onboarding.
      ['onboardingComplete', 'true'],
    ]);
    // Replace the navigation stack so the user lands on Home with no back button.
    router.replace('/');
  }

  // The button is only enabled once the user has typed something for their goal.
  // Wage and no-spend target are optional so they don't block progression.
  const canProceed = goal.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* KeyboardAvoidingView lifts content above the software keyboard on iOS.
          On Android, the OS handles this differently so we pass undefined. */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* keyboardShouldPersistTaps="handled" means tapping the button while
            the keyboard is open will trigger the button press, not just dismiss
            the keyboard — important for a smooth one-tap submit. */}
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Let's get you set up.</Text>
          <Text style={styles.subheading}>
            This takes under a minute. No account needed.
          </Text>

          {/* GOAL INPUT — required field */}
          <Text style={styles.label}>What are you saving up for?</Text>
          <Text style={styles.hint}>Even a rough idea helps.</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Trip to Japan"
            placeholderTextColor={theme.colors.textMuted}
            value={goal}
            onChangeText={setGoal}
          />

          {/* WAGE INPUT — optional, used later to personalise the "hours of work"
              question in the questionnaire */}
          <Text style={styles.label}>Your hourly wage (optional)</Text>
          <Text style={styles.hint}>
            Used to calculate how long you'll work to pay for something.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 18"
            placeholderTextColor={theme.colors.textMuted}
            value={wage}
            onChangeText={setWage}
            keyboardType="numeric"
          />

          {/* NO-SPEND TARGET — optional, used by the calendar screen */}
          <Text style={styles.label}>Monthly no-spend target (optional)</Text>
          <Text style={styles.hint}>How many no-spend days do you aim for?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 10"
            placeholderTextColor={theme.colors.textMuted}
            value={noSpendTarget}
            onChangeText={setNoSpendTarget}
            keyboardType="numeric"
          />

          {/* Submit button — visually disabled (lighter colour) when goal is empty */}
          <TouchableOpacity
            style={[styles.button, !canProceed && styles.buttonDisabled]}
            onPress={handleFinish}
            disabled={!canProceed}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Let's go</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.screenPadding,
    paddingTop: theme.spacing.xl,
    paddingBottom: 40,
  },
  heading: {
    ...theme.typography.screenTitle,
    marginBottom: 8,
  },
  subheading: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...theme.typography.cardTitle,
    marginBottom: 4,
    marginTop: theme.spacing.lg,
  },
  hint: {
    ...theme.typography.caption,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.input,
    height: 52,
    paddingHorizontal: 16,
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    color: theme.colors.text,
  },
  button: {
    backgroundColor: theme.colors.primaryButton,
    height: theme.button.height,
    borderRadius: theme.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  // Dimmed state when the goal field is empty — same shape, muted colour.
  buttonDisabled: {
    backgroundColor: theme.colors.teaGreen,
  },
  buttonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: theme.colors.primaryButtonText,
  },
});
