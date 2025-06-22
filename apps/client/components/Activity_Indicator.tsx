import React from "react";
import { ActivityIndicator } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

type RootRef = React.ComponentRef<typeof ActivityIndicator>;
type RootProps = React.ComponentProps<typeof ActivityIndicator>;

const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const Colors = useThemeColors();

  return <ActivityIndicator color={Colors.primary.base} {...props} ref={ref} />;
});

export default Root;
