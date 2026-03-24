/**
 * utils/theme.ts — Design system tokens
 *
 * Single source of truth for every visual constant in the app: colours,
 * typography styles, spacing values, border radii, and button sizes.
 *
 * Usage: import { theme } from '../utils/theme' and reference tokens like
 * theme.colors.hunterGreen or spread typography presets like ...theme.typography.body.
 *
 * All screen components should use these tokens instead of hardcoded values.
 * This ensures visual consistency and makes global restyling a one-file change.
 *
 * Colour palette:
 *   Hunter Green  #436436  — primary actions, filled states, go verdict
 *   Tea Green     #daefb3  — card backgrounds
 *   Dusk Blue     #384e77  — all text and headings
 *   Sweet Salmon  #ea9e8d  — accents, sleep-on-it verdict
 *   Rosewood      #b7245c  — skip verdict, destructive actions only
 *   Background    #f0f8e8  — lightened tea green tint used for all screens
 *
 * Note: pure white (#ffffff) and pure black (#000000) are never used.
 *
 * Typography:
 *   All text uses Nunito, loaded via @expo-google-fonts/nunito.
 *   Font must be loaded by _layout.tsx before these styles can render correctly.
 *   Spreading a typography preset (e.g. ...theme.typography.body) applies
 *   fontSize, fontFamily, and color together.
 */

export const theme = {
  colors: {
    // Brand palette
    hunterGreen: '#436436',
    teaGreen: '#daefb3',
    duskBlue: '#384e77',
    sweetSalmon: '#ea9e8d',
    rosewood: '#b7245c',

    // Semantic aliases — use these in components rather than raw hex values
    // so the meaning is clear and palette changes propagate automatically.
    background: '#f0f8e8',         // main screen background
    cardBackground: '#daefb3',     // card and input surface colour
    primaryButton: '#436436',      // filled button background
    primaryButtonText: '#f0f8e8',  // text on filled buttons
    text: '#384e77',               // default body text
    textMuted: 'rgba(56, 78, 119, 0.6)',  // placeholder and caption text
    heading: '#384e77',            // screen and section headings
    accent: '#ea9e8d',             // highlights and secondary accents
    danger: '#b7245c',             // destructive action buttons

    // Verdict colours — used on the result screen
    verdictGo: '#436436',      // 🟢 Conscious buy
    verdictPause: '#ea9e8d',   // 🟡 Sleep on it
    verdictSkip: '#b7245c',    // 🔴 Probably not for today
  },

  typography: {
    // 28px Bold — main screen title (one per screen)
    screenTitle: {
      fontSize: 28,
      fontFamily: 'Nunito_700Bold',
      color: '#384e77',
    },
    // 22px SemiBold — section headings within a screen
    sectionHeading: {
      fontSize: 22,
      fontFamily: 'Nunito_600SemiBold',
      color: '#384e77',
    },
    // 18px SemiBold — card titles, question text, form labels
    cardTitle: {
      fontSize: 18,
      fontFamily: 'Nunito_600SemiBold',
      color: '#384e77',
    },
    // 16px Regular — standard body copy and input text
    body: {
      fontSize: 16,
      fontFamily: 'Nunito_400Regular',
      color: '#384e77',
    },
    // 13px Regular, muted — secondary labels, helper text, timestamps
    caption: {
      fontSize: 13,
      fontFamily: 'Nunito_400Regular',
      color: 'rgba(56, 78, 119, 0.6)',
    },
  },

  spacing: {
    screenPadding: 24,  // horizontal padding on all screens
    cardPadding: 20,    // internal padding inside card components
    sectionGap: 24,     // vertical gap between major sections
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  radius: {
    card: 16,    // cards and primary buttons
    button: 16,  // all buttons
    input: 12,   // text inputs
    pill: 50,    // pill-shaped tags and badges
  },

  button: {
    height: 52,  // standard height for all full-width buttons
  },
} as const;

// Exported type allows components to accept theme-typed props if needed.
export type Theme = typeof theme;
