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
    await AsyncStorage.multiSet([
      ['userGoal', goal.trim()],
      ['userWage', wage.trim()],
      ['noSpendTarget', noSpendTarget.trim()],
      ['onboardingComplete', 'true'],
    ]);
    router.replace('/');
  }

  const canProceed = goal.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Let's get you set up.</Text>
          <Text style={styles.subheading}>
            This takes under a minute. No account needed.
          </Text>

          <Text style={styles.label}>What are you saving up for?</Text>
          <Text style={styles.hint}>Even a rough idea helps.</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Trip to Japan"
            placeholderTextColor={theme.colors.textMuted}
            value={goal}
            onChangeText={setGoal}
          />

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
  buttonDisabled: {
    backgroundColor: theme.colors.teaGreen,
  },
  buttonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 17,
    color: theme.colors.primaryButtonText,
  },
});
