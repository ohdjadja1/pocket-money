export const theme = {
  colors: {
    hunterGreen: '#436436',
    teaGreen: '#daefb3',
    duskBlue: '#384e77',
    sweetSalmon: '#ea9e8d',
    rosewood: '#b7245c',

    // Semantic aliases
    background: '#f0f8e8',
    cardBackground: '#daefb3',
    primaryButton: '#436436',
    primaryButtonText: '#f0f8e8',
    text: '#384e77',
    textMuted: 'rgba(56, 78, 119, 0.6)',
    heading: '#384e77',
    accent: '#ea9e8d',
    danger: '#b7245c',

    // Verdict colours
    verdictGo: '#436436',
    verdictPause: '#ea9e8d',
    verdictSkip: '#b7245c',
  },

  typography: {
    screenTitle: {
      fontSize: 28,
      fontFamily: 'Nunito_700Bold',
      color: '#384e77',
    },
    sectionHeading: {
      fontSize: 22,
      fontFamily: 'Nunito_600SemiBold',
      color: '#384e77',
    },
    cardTitle: {
      fontSize: 18,
      fontFamily: 'Nunito_600SemiBold',
      color: '#384e77',
    },
    body: {
      fontSize: 16,
      fontFamily: 'Nunito_400Regular',
      color: '#384e77',
    },
    caption: {
      fontSize: 13,
      fontFamily: 'Nunito_400Regular',
      color: 'rgba(56, 78, 119, 0.6)',
    },
  },

  spacing: {
    screenPadding: 24,
    cardPadding: 20,
    sectionGap: 24,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  radius: {
    card: 16,
    button: 16,
    input: 12,
    pill: 50,
  },

  button: {
    height: 52,
  },
} as const;

export type Theme = typeof theme;
