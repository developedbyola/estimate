/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

type NormalColors = {
  base: string;
  on: string;
  hover: string;
  active: string;
};

type TextColors = {
  base: string;
  body: string;
  muted: string;
  subtle: string;
  inverted: string;
};

type OthersColors = {
  border: string;
  overlay: string;
  surface: string;
  background: string;
  foreground: string;
  inverted: string;
  backdrop: string;
};

type ThemeColors = {
  [key: string]: {
    primary: NormalColors;
    warning: NormalColors;
    error: NormalColors;
    success: NormalColors;
    secondary: NormalColors;
    text: TextColors;
    others: OthersColors;
  };
};

export default {
  light: {
    primary: {
      on: '#ffffff',
      base: '#0072e3',
      hover: '#007AF5',
      active: '#0066CC',
    },
    secondary: {
      on: '#000000',
      base: '#E37100',
      hover: '#FF850A',
      active: '#E07000',
    },
    warning: {
      on: '#FFFFFF',
      base: '#e17100',
      hover: '#ff6900',
      active: '#ca3500',
    },
    error: {
      on: '#FFFFFF',
      base: '#e7000b',
      hover: '#fb2c36',
      active: '#c10007',
    },
    success: {
      on: '#FFFFFF',
      base: '#00a63e',
      hover: '#00c950',
      active: '#008236',
    },
    text: {
      base: '#171717',
      body: '#404040',
      muted: '#737373',
      subtle: '#525252',
      inverted: '#FFFFFF',
    },
    others: {
      border: '#e5e5e5',
      surface: '#e5e5e5',
      background: '#ffffff',
      foreground: '#f5f5f5',
      inverted: '#171717',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      overlay: 'rgba(255, 255, 255, 0.6)',
    },
  },
  dark: {
    primary: {
      on: '#ffffff',
      base: '#0072e3',
      hover: '#007AF5',
      active: '#0066CC',
    },
    secondary: {
      on: '#000000',
      base: '#00E0DC',
      hover: '#E9D520',
      active: '#CCBA14',
    },
    warning: {
      on: '#FFFFFF',
      base: '#e17100',
      hover: '#ff6900',
      active: '#ca3500',
    },
    error: {
      on: '#FFFFFF',
      base: '#e7000b',
      hover: '#fb2c36',
      active: '#c10007',
    },
    success: {
      on: '#FFFFFF',
      base: '#00a63e',
      hover: '#00c950',
      active: '#008236',
    },
    text: {
      base: '#ffffff',
      body: '#d4d4d4',
      muted: '#737373',
      subtle: '#a1a1a1',
      inverted: '#171717',
    },
    others: {
      border: '#737373',
      surface: '#404040',
      inverted: '#ffffff',
      background: '#171717',
      foreground: '#262626',
      overlay: 'rgba(0, 0, 0, 0.6)',
      backdrop: 'rgba(255, 255, 255, 0.1)',
    },
  },
} satisfies ThemeColors;
