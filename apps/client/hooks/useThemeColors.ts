/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants";
import { useColorScheme } from "react-native";

export const useThemeColors = (defaultTheme?: "light" | "dark") => {
  const theme = useColorScheme() || defaultTheme || "light";

  return Colors[theme];
};
