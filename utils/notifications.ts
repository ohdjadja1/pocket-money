/**
 * utils/notifications.ts — Notification setup and scheduling
 *
 * Provides two capabilities:
 *
 *   1. setupNotifications()
 *      Called once at app startup from _layout.tsx. Registers the Android
 *      notification channel (required before any notification can appear on
 *      Android 8+) and requests the OS-level permission from the user.
 *      Also configures how notifications behave when the app is in the foreground.
 *
 *   2. scheduleSleepOnItNotification(itemName)
 *      Called from the result screen when a user gets the 🟡 "Sleep on it"
 *      verdict. Schedules a single push notification for the next day at 10:00
 *      that gently prompts the user to revisit their decision.
 *      Returns the notification ID string, which should be saved to AsyncStorage
 *      alongside the pending item so it can be cancelled if the user returns
 *      and makes a decision before the notification fires.
 *
 *   3. cancelNotification(id)
 *      Cancels a previously scheduled notification by its ID. Call this when
 *      the user completes the revisit flow for a pending "sleep on it" item.
 *
 * Android channel details:
 *   - Channel ID: 'reminders'
 *   - Importance: DEFAULT (shows in notification shade, no heads-up display)
 *   - Target device: Pixel 7a running Android
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Sets up the notification infrastructure. Call once at app startup.
 * Safe to call on every launch — channel creation and permission requests
 * are idempotent (no effect if already set up).
 */
export async function setupNotifications(): Promise<void> {
  // Android 8+ requires notification channels. Each channel groups related
  // notifications and lets the user control them independently in Settings.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  // Request the notification permission if not already granted.
  // On Android 13+ this shows a system dialog. On older Android it is
  // automatically granted. On iOS it always shows the dialog.
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }

  // Configure how notifications are handled when the app is open in the foreground.
  // By default, expo-notifications suppresses foreground notifications.
  // shouldShowBanner/shouldShowAlert ensure the notification is still visible.
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,   // show the notification as a banner
      shouldPlaySound: false,  // no sound — keep it unobtrusive
      shouldSetBadge: false,   // no app icon badge
      shouldShowBanner: true,
      shouldShowList: true,    // include in notification centre
    }),
  });
}

/**
 * Schedules a "Still thinking about that [item]?" notification for the
 * next day at 10:00 local time.
 *
 * @param itemName — The name of the item the user was considering.
 * @returns         The notification ID. Save this to AsyncStorage so it can
 *                  be cancelled via cancelNotification() if needed.
 */
export async function scheduleSleepOnItNotification(
  itemName: string
): Promise<string> {
  // Build the trigger date: same day + 1, at 10:00 am.
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);  // 10:00:00.000

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Pocket Money',
      body: `Still thinking about that ${itemName}?`,
      // data is passed to the app when the notification is tapped.
      // The receiving screen can read itemName from here to restore context.
      data: { itemName },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: tomorrow,
      channelId: 'reminders',  // must match the channel registered above
    },
  });

  return id;
}

/**
 * Cancels a previously scheduled notification.
 * Call this when a "sleep on it" session is resolved before the notification fires.
 *
 * @param id — The notification ID returned by scheduleSleepOnItNotification.
 */
export async function cancelNotification(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}
