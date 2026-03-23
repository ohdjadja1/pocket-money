# CLAUDE.md — Pocket Money

This file is the source of truth for this project. Read it fully before making any changes.

---

## What this app is

Pocket Money is a personal mobile app that helps the user pause before optional purchases and ask: *do I actually need this?* The user enters an item they are considering buying, answers a short set of yes/no questions tailored to its category, and receives a verdict. The app is intended for discretionary purchases only — not food, utilities, or essentials.

The app is currently built for personal use on a Pixel 7a running Android, with the possibility of wider release later.

---

## Core philosophy

- The app should feel like a **warm, wise friend** — not a supervisor, not a guilt trip.
- A **conscious buy is a win**. Affirm good purchases as warmly as discouraging unnecessary ones.
- **Sustainability is built in** — repairability, longevity, and secondhand alternatives are considered in the questions.
- Keep everything **fast and simple**. The full flow should take under 2 minutes.

Never make the tone preachy, moralistic, or cold. When in doubt, warmer is better.

---

## User flow

1. User inputs the **item name** (e.g. "Canon R50 camera")
2. App **suggests a category** intelligently via Claude API — user confirms or changes
3. User sees **all yes/no questions** for that category on one screen and answers them
4. App returns a **verdict** based on the ratio of negative (no) answers:

| Condition | Outcome | Label |
|---|---|---|
| ≤ 1/2 negative | 🟢 Go for it | "Conscious buy" |
| Between 1/2 and 5/6 negative | 🟡 Pause | "Sleep on it" |
| ≥ 5/6 negative | 🔴 Skip it | "Probably not for today" |

---

## Sleep on it flow

When a user receives the 🟡 result:
1. Their item name and answers are saved locally
2. A push notification fires the next day: *"Still thinking about that [item name]?"*
3. On return, they see their previous answers and can change any of them
4. They see a summary of all answers
5. They make a **final yes/no call themselves**
6. That decision — not the algorithm — is what gets logged in history

---

## History log

Every completed session is saved with:
- Item name
- Category
- Date
- Outcome: Conscious buy 🟢 / Sleep on it 🟡 / Probably not 🔴 / user's own final call

History is stored locally using AsyncStorage. No backend, no account, no sync — personal use only for now.

---

## Screens

### 1. Onboarding (first launch only)
- User sets their **financial goal** (free text, e.g. "Trip to Japan")
- User sets their **hourly wage** (number, used for the "how long will I work for this?" question)
- User sets their **monthly no-spend target** (number of days)
- Warm, encouraging tone — this is exciting, not admin

### 2. Home
- Displays the user's **financial goal** prominently as motivation
- Shows current month's **no-spend streak** as a small summary
- Two primary buttons: **"Should I buy this?"** → item entry, **"No-spend calendar"** → calendar screen
- Access to **Want List** and **History** via bottom navigation

### 3. Item entry + category confirm
- Large text input for item name
- On submit, Claude API suggests a category
- User sees the suggested category with its emoji and can confirm or pick a different one from a list
- Friendly copy: "What are you thinking of buying?"

### 4. Questionnaire
- All questions displayed at once on one scrollable screen — not one at a time
- Yes/No toggle for each question
- User's **financial goal** pinned at the bottom as a quiet reminder
- "See my verdict" button at the bottom, only active once all questions are answered
- Haptic feedback on each toggle

### 5. Result screens (three variants)
- **🟢 Conscious buy** — warm, affirming. "Sounds like a thoughtful purchase. Go for it."
- **🟡 Sleep on it** — gentle. "You're on the fence. Give it a night — you'll know in the morning." Saves session and schedules notification.
- **🔴 Probably not for today** — kind, not harsh. "Probably not one for today. Your future self will thank you."
- All three show a summary of how many questions were answered negatively
- Options: Save to history / Start over / Add to want list

### 6. No-spend calendar
- Monthly calendar view
- Tap any day to toggle as a no-spend day — only today or up to 7 days in the past, never future days
- Two visual day states: no-spend (filled, Hunter Green) and neutral (empty)
- Month navigation buttons (previous/next)
- Progress bar toward monthly target
- When monthly target is reached: **celebratory Lottie animation** + message referencing the user's goal

### 7. Want list
- List of items saved without completing the full questionnaire
- Each item shows: name, category emoji, date saved, **days elapsed** since saving
- Tap an item to start the full questionnaire for it
- Swipe to delete
- Friendly empty state: "Nothing here yet. Next time you're tempted, save it here and see how you feel in a week."

### 8. History
- Scrollable list of all completed decisions
- Each item: name, category emoji, date, outcome colour dot
- Optional stat at top: estimated money saved (sum of prices of "Probably not" items — price is optionally entered on the result screen)
- Friendly empty state: "Nothing yet. Every good decision starts somewhere."

### 9. Settings
- Edit financial goal
- Edit hourly wage
- Edit monthly no-spend target
- Clear history (with confirmation)

---

## Categories and questions

Questions are stored in `/data/questions.ts` as structured data. Never hardcode questions inside screen components.

Each category has: `key`, `label`, `emoji`, `questions: string[]`.

### Universal questions (added to every category)
- "Have I thought about this for at least one week?"
- "Is buying this worth giving up progress towards my goal?"
- "Where will this item be in five years?"
- "Will I have to work more than [threshold] hours to pay for it?" *(threshold derived from user's hourly wage setting)*
- "Do I have space to put it away when not in use?"
- "Can I be happy without it?"
- "Does it solve a problem I have genuinely noticed?"

### 🧥 Clothing & Accessories
- "Do I already own something similar?"
- "Have I worn similar items I own in the last 6 months?"
- "Could I borrow or thrift this instead?"
- "Is it made to last (quality stitching, natural fibres)?"
- "Can it be repaired if damaged?"
- "Do I love it, not just like it?"
- "Will it work with at least 3 things I already own?"

### 📱 Electronics
- "Do I already own one?"
- "Is my current one broken or truly insufficient?"
- "Could the current one be repaired instead of replaced?"
- "Is the battery replaceable?"
- "Are spare parts and repairs available for this model?"
- "Could I borrow or rent one for the specific use case I have in mind?"

### 🛋️ Furniture & Home
- "Do I have a functional equivalent already?"
- "Is this replacing something broken — and could that be repaired?"
- "Will it fit my life long-term, not just my current home?"
- "Is it made of durable, repairable materials?"
- "Could I find this secondhand?"

### 📚 Books, Media & Entertainment
- "Could I borrow it from a library or friend?"
- "Do I already own something unread or unwatched in this genre?"
- "Will I return to it more than once?"
- "Is a digital version sufficient?"

### 🏋️ Sports & Hobbies
- "Have I done this activity enough to justify owning the gear?"
- "Could I rent or borrow to try it first?"
- "Do I already own something that serves this purpose?"
- "Is this gear built to last, or fashion-driven?"

### 🧴 Beauty & Personal Care
- "Do I have an unfinished equivalent at home?"
- "Is the packaging refillable or recyclable?"
- "Is this a genuine gap in my routine?"

### 🧸 Toys & Kids
- "Could I borrow, swap, or buy secondhand?"
- "Will this hold attention beyond a few weeks?"
- "Is it durable and repairable?"

### 🔧 Tools & Equipment
- "Will I use this more than a handful of times?"
- "Could I borrow or rent it?"
- "Do I already own something that could do this job?"
- "Are spare parts available for this model?"

### 🎁 Gifts
- "Does the recipient actually want or need this?"
- "Could an experience replace a physical gift?"
- "Is it something they would choose themselves?"

---

## Design system

### Colours
| Name | Hex | Usage |
|---|---|---|
| Hunter Green | `#436436` | Primary buttons, active states, filled no-spend days, 🟢 result |
| Tea Green | `#daefb3` | Backgrounds, card surfaces |
| Dusk Blue | `#384e77` | Headings, body text, icons |
| Sweet Salmon | `#ea9e8d` | Accents, highlights, 🟡 sleep on it state |
| Rosewood | `#b7245c` | 🔴 result, destructive actions only |

- Main screen background: `#f0f8e8` (lightened Tea Green tint)
- Card background: `#daefb3` (Tea Green)
- Never use pure white (`#ffffff`) or pure black (`#000000`)

### Typography
- **Font:** Nunito (loaded via @expo-google-fonts/nunito)
- **Weights:** Regular (400), SemiBold (600), Bold (700)
- **Screen titles:** 28px Bold, Dusk Blue
- **Section headings:** 22px SemiBold, Dusk Blue
- **Card titles / question text:** 18px SemiBold, Dusk Blue
- **Body text:** 16px Regular, Dusk Blue
- **Captions / labels:** 13px Regular, Dusk Blue at 60% opacity

### Spacing & shape
- **Border radius:** 16px cards and buttons, 12px inputs, 50px pill tags
- **Button height:** 52px
- **Card padding:** 20px
- **Screen horizontal padding:** 24px
- **Section vertical spacing:** 24px

### Tone of copy
Conversational, second-person, warm. No exclamation mark overload. No moralising.

- 🟢 "Sounds like a thoughtful purchase. Go for it."
- 🟡 "You're on the fence. Give it a night — you'll know in the morning."
- 🔴 "Probably not one for today. Your future self will thank you."
- Empty history: "Nothing yet. Every good decision starts somewhere."
- Onboarding: "What are you saving up for? Even a rough idea helps."

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React Native via Expo |
| Language | TypeScript |
| Navigation | Expo Router |
| Local storage | AsyncStorage |
| Notifications | expo-notifications |
| Haptics | expo-haptics |
| Animations | lottie-react-native |
| Fonts | @expo-google-fonts/nunito |
| Category suggestion | Claude API (claude-sonnet-4-20250514) |

### Android-specific
- Notification channel must be set up on first launch (see `utils/notifications.ts`)
- Channel name: "reminders", importance: DEFAULT
- Target device: Pixel 7a

---

## Folder structure

```
/app
  _layout.tsx         ← root layout: font loading, notification setup, onboarding redirect
  index.tsx           ← Home
  onboarding.tsx      ← First launch setup
  item-entry.tsx      ← Item name input + category confirm
  questionnaire.tsx   ← All questions at once
  result.tsx          ← Verdict screen
  calendar.tsx        ← No-spend calendar
  want-list.tsx       ← Want list with countdowns
  history.tsx         ← Decision history
  settings.tsx        ← Edit goal, wage, target
/components
  QuestionRow.tsx     ← Single yes/no question row with haptic toggle
  ResultCard.tsx      ← Verdict display card
  HistoryItem.tsx     ← Single history list row
  WantListItem.tsx    ← Single want list row with days elapsed
  GoalBanner.tsx      ← Pinned goal reminder strip
  CalendarDay.tsx     ← Single day cell in calendar
/data
  questions.ts        ← All categories and questions as structured data
/hooks
  useHistory.ts       ← AsyncStorage read/write for history
  useSession.ts       ← Current questionnaire session state
  useSettings.ts      ← Goal, wage, no-spend target
/utils
  theme.ts            ← All design tokens
  scoring.ts          ← Verdict ratio logic
  categorise.ts       ← Claude API call for category suggestion
  notifications.ts    ← Android channel setup + sleep on it scheduling
```

---

## Claude API usage

Used only for category suggestion. Model: `claude-sonnet-4-20250514`.

Prompt template:
```
Given this item: "[item name]"
Return only the single most appropriate category key from this list:
clothing, electronics, furniture, books, sports, beauty, toys, tools, gifts

Return only the key. No explanation.
```

Always fall back to manual category selection if the API call fails.

---

## What not to do

- Do not add a backend or user accounts — local only for now
- Do not make questions two-part (no "and" / "or" in a single question)
- Do not make the verdict feel like a judgement on the person — only on the purchase
- Do not hardcode questions inside screen components — always use `/data/questions.ts`
- Do not use more than one font family
- Do not use pure white or pure black anywhere
- Do not add paywalls, upsells, or any subscription prompts — ever

---

## Current status

🟡 Spec complete. Starting build. Personal use, Android (Pixel 7a).

## Further specs

- Personal goal visible on the home screen and during the questionnaire as motivation
- Monthly no-spend tracker — calendar view, tap to mark a day (today or up to 7 days back, never future), monthly goal, celebratory animation when goal is reached
- Want list with countdown — save an item without doing the full questionnaire; see how long it's been sitting there
- Haptic feedback throughout
Estimated savings tally — optional, calculate from "didn't need it" items in history
- enable users to black list some categories - whenever an item belongs to one of those categories, the questionnaire is skipped in favour of a gentle reminder that the user decided to not buy this anymore


## Future visions
- I might wish to share the app later. For personal use, AsyncStorage (local only) is perfect. If you later want to share the app with others, you'd move history to a lightweight backend (Supabase is free and excellent for this). Don't build it now.
- make custom weights for the different questions
- add custom questions