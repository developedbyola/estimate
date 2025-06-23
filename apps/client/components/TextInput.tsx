import React from 'react';
import { Typography, Border, Space } from '@/constants';
import { useThemeColors } from '@/hooks/useThemeColors';
import { TextInput as NativeTextInput } from 'react-native';

type Ref = React.ComponentRef<typeof NativeTextInput>;
type Props = React.ComponentProps<typeof NativeTextInput>;

const TextInput = React.forwardRef<Ref, Props>((props, ref) => {
  const { style, returnKeyType = 'done', ...restProps } = props;
  const colors = useThemeColors();

  return (
    <NativeTextInput
      ref={ref}
      returnKeyType={returnKeyType}
      placeholderTextColor={colors.getColor('text.inactive')}
      style={[
        {
          flex: 1,
          paddingInline: Space.lg,
          color: colors.getColor('text.base'),
          fontSize: Typography.size.lg,
          borderRadius: Border.radius['xl'],
        },
        style,
      ]}
      {...restProps}
    />
  );
});

export default TextInput;
