/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

type BaseColors = {
  primary: {
    base: string;
    dark: string;
    subtle: string;
    darker: string;
    inactive: string;
  };
  success: {
    base: string;
    dark: string;
    subtle: string;
    strong: string;
    soft: string;
  };
  info: {
    base: string;
    dark: string;
    subtle: string;
    strong: string;
    soft: string;
  };
  warning: {
    base: string;
    dark: string;
    subtle: string;
    strong: string;
    soft: string;
  };
  error: {
    base: string;
    dark: string;
    subtle: string;
    strong: string;
    soft: string;
  };
  bg: {
    soft: string;
    base: string;
    inactive: string;
    subtle: string;
    strong: string;
    overlay: string;
    backdrop: string;
    glass: string;
  };
  border: {
    base: string;
    soft: string;
    subtle: string;
    inactive: string;
    strong: string;
  };
  text: {
    base: string;
    subtle: string;
    soft: string;
    inactive: string;
    strong: string;
  };
  icon: {
    on: string;
    base: string;
    soft: string;
    subtle: string;
    strong: string;
    inactive: string;
  };
};

type ThemeColors = {
  dark: BaseColors;
  light: BaseColors;
};

const Colors = {
  light: {
    primary: {
      base: '#3b82f6', // blue-500
      dark: '#2563eb', // blue-600
      subtle: '#93c5fd', // blue-300
      darker: '#1d4ed8', // blue-700
      inactive: '#bfdbfe', // blue-200
    },
    success: {
      base: '#10b981', // emerald-500
      dark: '#059669', // emerald-600
      subtle: '#a7f3d0', // emerald-200
      strong: '#065f46', // emerald-700
      soft: '#d1fae5', // emerald-100
    },
    info: {
      base: '#0ea5e9', // sky-500
      dark: '#0284c7', // sky-600
      subtle: '#bae6fd', // sky-200
      strong: '#0369a1', // sky-700
      soft: '#e0f2fe', // sky-100
    },
    warning: {
      base: '#f59e0b', // amber-500
      dark: '#d97706', // amber-600
      subtle: '#fde68a', // amber-200
      strong: '#b45309', // amber-700
      soft: '#fef3c7', // amber-100
    },
    error: {
      base: '#ef4444', // red-500
      dark: '#dc2626', // red-600
      subtle: '#fca5a5', // red-300
      strong: '#b91c1c', // red-700
      soft: '#fee2e2', // red-100
    },
    bg: {
      soft: '#f9fafb', // gray-50
      base: '#ffffff', // white
      inactive: '#e5e7eb', // gray-200
      subtle: '#f3f4f6', // gray-100
      strong: '#111827', // gray-900
      overlay: 'rgba(255, 255, 255, 0.8)', // semi-transparent white
      backdrop: 'rgba(0, 0, 0, 0.3)', // dark overlay for modals
      glass: 'rgba(255, 255, 255, 0.6)', // frosted glass effect
    },
    border: {
      base: '#d1d5db', // gray-300
      soft: '#e5e7eb', // gray-200
      subtle: '#f3f4f6', // gray-100
      inactive: '#9ca3af', // gray-400
      strong: '#111827', // gray-900
    },
    text: {
      base: '#ffffff', // gray-900
      subtle: '#4b5563', // gray-600
      soft: '#6b7280', // gray-500
      inactive: '#9ca3af', // gray-400
      strong: '#111827', // gray-900
    },
    icon: {
      on: '#111827', // gray-900
      base: '#ffffff', // white
      soft: '#f3f4f6', // gray-100
      subtle: '#e5e7eb', // gray-200
      strong: '#111827', // gray-900
      inactive: '#9ca3af', // gray-400
    },
  },
  dark: {
    primary: {
      base: '#60a5fa', // blue-400
      dark: '#3b82f6', // blue-500
      subtle: '#1e40af', // blue-800
      darker: '#2563eb', // blue-600
      inactive: '#1e40af', // blue-800
    },
    success: {
      base: '#34d399', // emerald-400
      dark: '#10b981', // emerald-500
      subtle: '#065f46', // emerald-800
      strong: '#a7f3d0', // emerald-200
      soft: '#064e3b', // emerald-900
    },
    info: {
      base: '#38bdf8', // sky-400
      dark: '#0ea5e9', // sky-500
      subtle: '#0369a1', // sky-800
      strong: '#bae6fd', // sky-200
      soft: '#0c4a6e', // sky-900
    },
    warning: {
      base: '#fbbf24', // amber-400
      dark: '#f59e0b', // amber-500
      subtle: '#92400e', // amber-800
      strong: '#fde68a', // amber-200
      soft: '#78350f', // amber-900
    },
    error: {
      base: '#f87171', // red-400
      dark: '#ef4444', // red-500
      subtle: '#991b1b', // red-800
      strong: '#fecaca', // red-200
      soft: '#7f1d1d', // red-900
    },
    bg: {
      soft: '#1f2937', // gray-800
      base: '#111827', // gray-900
      inactive: '#374151', // gray-700
      subtle: '#1f2937', // gray-800
      strong: '#f9fafb', // gray-50
      overlay: 'rgba(17, 24, 39, 0.9)', // semi-transparent dark
      backdrop: 'rgba(0, 0, 0, 0.6)', // darker overlay for modals
      glass: 'rgba(31, 41, 55, 0.7)', // dark frosted glass effect
    },
    border: {
      base: '#4b5563', // gray-600
      soft: '#374151', // gray-700
      subtle: '#1f2937', // gray-800
      inactive: '#6b7280', // gray-500
      strong: '#f9fafb', // gray-50
    },
    text: {
      base: '#f9fafb', // gray-50
      subtle: '#d1d5db', // gray-300
      soft: '#9ca3af', // gray-400
      inactive: '#6b7280', // gray-500
      strong: '#ffffff', // gray-50
    },
    icon: {
      on: '#f9fafb', // gray-50
      base: '#111827', // gray-900
      soft: '#1f2937', // gray-800
      subtle: '#374151', // gray-700
      strong: '#f9fafb', // gray-50
      inactive: '#6b7280', // gray-500
    },
  },
} satisfies ThemeColors;

export default Colors;

export type ColorKeys = {
  [K in keyof BaseColors]: K extends string
    ? keyof BaseColors[K] extends string
      ? `${K}.${keyof BaseColors[K]}`
      : never
    : never;
}[keyof BaseColors];
