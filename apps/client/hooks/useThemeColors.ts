/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from 'react-native';
import Colors, { ColorKeys } from '@/constants/Colors';

type Theme = 'light' | 'dark';

/**
 * Generate all valid color keys like "primary-base", "text-soft", etc.
 */

/**
 * Returns theme colors and a color accessor by key.
 */
export const useThemeColors = (defaultTheme?: Theme) => {
  const colorScheme = useColorScheme();
  const theme: Theme =
    colorScheme === 'light' || colorScheme === 'dark'
      ? colorScheme
      : defaultTheme || 'light';

  const colors = Colors[theme];

  const getColor = (key: ColorKeys): string => {
    const [section, shade] = key.split('.') as [keyof typeof colors, string];
    return colors[section]?.[shade as keyof (typeof colors)[typeof section]];
  };

  return {
    theme,
    colors,
    getColor,
  };
};
