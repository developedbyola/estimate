import React from 'react';
import { Text as NativeText } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Colors, Typography } from '@/constants';

type RootRef = React.ComponentRef<typeof NativeText>;
type RootProps = React.ComponentProps<typeof NativeText> & {
  size?: keyof typeof Typography.size;
  align?: 'left' | 'right' | 'center';
  weight?: keyof typeof Typography.weight;
  leading?: keyof typeof Typography.leading;
  color?: keyof (typeof Colors)['dark' | 'light']['text'];
};

const Text = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const {
    style,
    align = 'left',
    size = 'base',
    color = 'subtle',
    leading = 'base',
    weight = 'normal',
    ...restProps
  } = props;
  const Colors = useThemeColors();

  return (
    <NativeText
      ref={ref}
      style={[
        {
          textAlign: align,
          color: Colors.text[color],
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
