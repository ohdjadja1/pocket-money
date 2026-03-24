# Pocket Money

A personal mobile app that helps you pause before optional purchases and ask: *do I actually need this?*

Built with React Native / Expo. Personal use, Android (Pixel 7a).

---

## What it does

You enter an item you are considering buying. The app suggests a category, you answer a short set of yes/no questions, and you receive a verdict:

| Result | Label | Condition |
|---|---|---|
| 🟢 Go for it | Conscious buy | ≤ half the answers are "no" |
| 🟡 Sleep on it | Revisit tomorrow | Between half and 5/6 are "no" |
| 🔴 Skip it | Probably not for today | ≥ 5/6 are "no" |

A conscious buy is a win — the goal is thoughtful decisions, not fewer purchases.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React Native via Expo (SDK 55) |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Local storage | AsyncStorage |
| Notifications | expo-notifications |
| Haptics | expo-haptics |
| Animations | lottie-react-native |
| Fonts | @expo-google-fonts/nunito |
| Category suggestion | Claude API (claude-sonnet-4-20250514) |

---

## Running the app

### Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- A physical Android device with the dev client APK installed, or an Android emulator

### Start the dev server
```bash
npx expo start --android
```

This starts Metro (the JS bundler) on your laptop and opens the app on your connected device. Changes to TypeScript files are reflected immediately — no rebuild needed.

### Build a new APK
Use [expo.dev EAS Build](https://expo.dev) when you have added packages with native code (see below).

---

## When you need to rebuild the APK

React Native packages come in two kinds:

- **Pure JS packages** (e.g. date libraries, state managers) — work immediately after `npm install`, no rebuild needed.
- **Native packages** (e.g. `react-native-safe-area-context`, `expo-notifications`) — contain compiled Android/iOS code that must be baked into the APK. After installing one of these, you must trigger a new EAS Build on expo.dev before the app will work on your device.

Use `npx expo install <package>` instead of `npm install` — it picks the version compatible with your current Expo SDK automatically.

---

## Project structure

```
/app                    Screens — each file is a route (Expo Router)
/components             Reusable UI components (not yet built)
/data                   Static data (categories and questions)
/hooks                  Custom React hooks for AsyncStorage (not yet built)
/utils                  Shared utilities (theme, notifications, scoring)
```

### File reference

#### `/app/_layout.tsx`
Root layout. The first file Expo Router loads on every launch. Responsible for:
- Loading the Nunito font family (three weights) before any screen renders
- Setting up the Android notification channel and requesting permission
- Checking whether onboarding has been completed; redirecting to `/onboarding` if not
- Wrapping all screens in the Stack navigator with global header styles

#### `/app/index.tsx`
Home screen. Shows the user's financial goal as a motivational card, plus two buttons: "Should I buy this?" (→ item entry) and "No-spend calendar". Reads the goal from AsyncStorage on every mount so changes made in Settings are reflected immediately.

#### `/app/onboarding.tsx`
First-launch setup screen. Collects three inputs: financial goal (required), hourly wage (optional), and monthly no-spend target (optional). Saves all three to AsyncStorage and sets `onboardingComplete = true`. Uses `router.replace` so the user cannot navigate back to onboarding once done.

#### `/app/item-entry.tsx`
*Placeholder.* Will become the purchase evaluation entry point: text input for the item name, Claude API call for category suggestion, and category confirmation before navigating to the questionnaire.

#### `/app/calendar.tsx`
*Placeholder.* Will become the no-spend calendar: monthly grid, tap to mark no-spend days (today or up to 7 days back only), progress bar toward the monthly target, and a Lottie celebration animation when the target is reached.

#### `/data/questions.ts`
The single source of truth for all categories and questions. Exports:
- `Category` interface — shape of a category object (`key`, `label`, `emoji`, `questions`)
- `universalQuestions` — 7 questions shown for every category regardless of type
- `categories` — the full list of 9 supported categories with their specific questions
- `getQuestionsForCategory(key, wage?)` — merges universal + category questions and resolves the `[threshold]` placeholder using the user's hourly wage

Never hardcode questions in screen files — always call `getQuestionsForCategory` from here.

#### `/utils/theme.ts`
Design system tokens. Exports the `theme` object containing:
- `colors` — brand palette (Hunter Green, Tea Green, Dusk Blue, Sweet Salmon, Rosewood) plus semantic aliases (background, cardBackground, text, etc.) and verdict colours
- `typography` — five presets (`screenTitle`, `sectionHeading`, `cardTitle`, `body`, `caption`) as spreadable style objects
- `spacing` — named spacing values (xs through xl) and specific-use constants like `screenPadding` and `cardPadding`
- `radius` — border radii for cards, buttons, inputs, and pill tags
- `button.height` — standard 52px button height

All components should reference `theme` instead of hardcoding values.

#### `/utils/notifications.ts`
Notification setup and scheduling. Exports:
- `setupNotifications()` — registers the Android channel, requests OS permission, and configures foreground notification display. Called once by `_layout.tsx` on startup.
- `scheduleSleepOnItNotification(itemName)` — schedules a next-day 10:00 push notification for "sleep on it" verdicts. Returns the notification ID for later cancellation.
- `cancelNotification(id)` — cancels a previously scheduled notification.

---

## Screens planned but not yet built

| Screen | Route | Status |
|---|---|---|
| Questionnaire | `/questionnaire` | Not started |
| Result | `/result` | Not started |
| Want list | `/want-list` | Not started |
| History | `/history` | Not started |
| Settings | `/settings` | Not started |

---

## Design system

**Colours**
- Hunter Green `#436436` — primary buttons, active states, go verdict
- Tea Green `#daefb3` — card backgrounds
- Dusk Blue `#384e77` — all text and headings
- Sweet Salmon `#ea9e8d` — accents, sleep-on-it state
- Rosewood `#b7245c` — skip verdict, destructive actions

Pure white and pure black are never used.

**Font:** Nunito (Regular 400, SemiBold 600, Bold 700)

---

## Data storage

Everything is stored locally using AsyncStorage. No backend, no account, no sync.

| Key | Value |
|---|---|
| `onboardingComplete` | `'true'` once onboarding is done |
| `userGoal` | Free-text financial goal string |
| `userWage` | Hourly wage as a numeric string |
| `noSpendTarget` | Monthly no-spend day target as a numeric string |

Additional keys (history, want list, pending sleep-on-it sessions) will be added as those screens are built.
