import React from 'react';
import { View } from 'react-native';
import { useViewStyle, ViewStyle } from '@/hooks/useViewStyle';

type BoxRef = React.ComponentRef<typeof View>;
type BoxProps = React.ComponentProps<typeof View> & ViewStyle;
const Box = React.forwardRef<BoxRef, BoxProps>((props, ref) => {
  const { px, style, bg, py, mx, my, mt, mb, pt, pb, ...restProps } = props;

  const ViewStyle = useViewStyle({ px, py, bg, pt, pb, mt, mb, mx, my });

  return (
    <View
      ref={ref}
      style={[ViewStyle, style]}
      {...restProps}
    />
  );
});

export default Box;
