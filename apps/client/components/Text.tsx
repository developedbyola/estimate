import React from 'react';
import { Text as NativeText } from 'react-native';
import { Typography, ColorKeys } from '@/constants';
import { useThemeColors } from '@/hooks/useThemeColors';

type RootRef = React.ComponentRef<typeof NativeText>;
type RootProps = React.ComponentProps<typeof NativeText> & {
  size?: keyof typeof Typography.size;
  align?: 'left' | 'right' | 'center';
  weight?: keyof typeof Typography.weight;
  leading?: keyof typeof Typography.leading;
  color?: ColorKeys;
};

const Text = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const {
    style,
    align = 'left',
    size = 'base',
    leading = 'base',
    weight = 'normal',
    color = 'text.subtle',
    ...restProps
  } = props;

  const colors = useThemeColors();

  return (
    <NativeText
      ref={ref}
      style={[
        {
          textAlign: align,
          color: colors.getColor(color),
          fontSize: Typography.size[size],
          fontWeight: Typography.weight[weight],
          lineHeight: Typography.leading[leading],
        },
        style,
      ]}
      {...restProps}
    />
  );
});

export default Text;
