export default {
  size: {
    '3xs': 10,
    '2xs': 12,
    xs: 13,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 36,
    '5xl': 40,
    '6xl': 48,
  },

  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  tracking: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
  },

  leading: {
    xs: 16, // ~16px
    sm: 20, // ~20px
    base: 24, // ~24px
    lg: 30, // ~28px
    xl: 36, // ~32px
    '2xl': 40,
    '3xl': 48,
  },
} as const;
