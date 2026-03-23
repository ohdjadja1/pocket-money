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
  const [goal, setGoal] = useState<string>('');

  useEffect(() => {
    AsyncStorage.getItem('userGoal').then((value) => {
      if (value) setGoal(value);
    });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/item-entry')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Should I buy this?</Text>
        </TouchableOpacity>

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
