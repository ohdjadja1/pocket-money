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
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      await setupNotifications();

      const onboardingDone = await AsyncStorage.getItem('onboardingComplete');
      if (!onboardingDone) {
        router.replace('/onboarding');
      }

      setReady(true);
    }

    if (fontsLoaded) {
      init();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !ready) {
    return (
      <View
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      />
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.duskBlue,
        headerTitleStyle: {
          fontFamily: 'Nunito_700Bold',
          fontSize: 20,
          color: theme.colors.duskBlue,
        },
        contentStyle: { backgroundColor: theme.colors.background },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Pocket Money' }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    </Stack>
  );
}
