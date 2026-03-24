/**
 * app/_layout.tsx — Root layout
 *
 * This is the first file Expo Router loads. It wraps every screen in the app
 * and is responsible for three things before anything else renders:
 *
 *   1. Loading the Nunito font family (three weights) from Google Fonts.
 *      All text in the app uses Nunito, so we must wait for fonts to be ready
 *      before showing any UI — otherwise React Native falls back to the system
 *      font and the screen flashes.
 *
 *   2. Setting up the Android notification channel and requesting permission.
 *      Android requires a named channel to be registered before any push
 *      notification can be shown. We do this once here at startup.
 *
 *   3. Deciding whether the user has completed onboarding. If not, they are
 *      redirected to /onboarding before seeing the home screen. The flag
 *      'onboardingComplete' in AsyncStorage is the source of truth.
 *
 * While fonts are loading or the async checks are running, a blank screen
 * matching the app background colour is shown to avoid a flash of unstyled
 * content (FOUC).
 *
 * The <Stack> navigator is the root navigation container. Every screen
 * defined in /app/*.tsx is automatically registered as a route by Expo Router.
 * screenOptions here sets the global header style so every screen looks
 * consistent without repeating the same styles in each file.
 */

import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { View } from 'react-native';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupNotifications } from '../utils/notifications';
import { theme } from '../utils/theme';

export default function RootLayout() {
  // useFonts returns [loaded, error]. We only care about the loaded boolean.
  // Until this is true, custom font names like 'Nunito_700Bold' are unavailable.
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  // Tracks whether the async startup checks (notifications + onboarding) are done.
  // We show nothing until this is true to prevent a flash of the home screen
  // before the onboarding redirect can fire.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Only run once fonts are available, so any screens we navigate to can
    // immediately render with the correct font.
    if (!fontsLoaded) return;

    async function init() {
      // Register the Android notification channel and request permission.
      // Safe to call on every launch — it's a no-op if already set up.
      await setupNotifications();

      // Check whether the user has already completed onboarding.
      // AsyncStorage.getItem returns null if the key doesn't exist.
      const onboardingDone = await AsyncStorage.getItem('onboardingComplete');
      if (!onboardingDone) {
        // Replace rather than push so the user can't press Back to skip onboarding.
        router.replace('/onboarding');
      }

      setReady(true);
    }

    init();
  }, [fontsLoaded]);

  // Show a blank background-coloured screen while loading.
  // Using the app background colour prevents a white flash on Android.
  if (!fontsLoaded || !ready) {
    return <View style={{ flex: 1, backgroundColor: theme.colors.background }} />;
  }

  return (
    <Stack
      screenOptions={{
        // Global header style applied to every screen unless overridden
        // with options={{ headerShown: false }} on a specific screen.
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.duskBlue,
        headerTitleStyle: {
          fontFamily: 'Nunito_700Bold',
          fontSize: 20,
          color: theme.colors.duskBlue,
        },
        // contentStyle is the background of the screen body below the header.
        contentStyle: { backgroundColor: theme.colors.background },
        // Remove the subtle shadow/border under the header bar.
        headerShadowVisible: false,
      }}
    >
      {/* Each Stack.Screen entry customises the header for that route.
          Routes not listed here still work — they just use the defaults above. */}
      <Stack.Screen name="index" options={{ title: 'Pocket Money' }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    </Stack>
  );
}
