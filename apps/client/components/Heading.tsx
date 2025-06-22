import React from 'react';
import { Text } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Colors, Typography } from '@/constants';

type Ref = React.ComponentRef<typeof Text>;
type Props = React.ComponentProps<typeof Text> & {
  size?: keyof typeof Typography.size;
  weight?: keyof typeof Typography.weight;
  leading?: keyof typeof Typography.leading;
  align?: 'left' | 'right' | 'center';
  color?: keyof (typeof Colors)['dark' | 'light']['text'];
};

const Heading = React.forwardRef<Ref, Props>((props, ref) => {
  const {
    style,
    size = '2xl',
    color = 'base',
    leading = '2xl',
    align = 'left',
    weight = 'semibold',
    ...restProps
  } = props;
  const Colors = useThemeColors();

  return (
    <Text
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

export default Heading;
