import React from 'react';
import { ScrollView } from 'react-native';
import { useViewStyle, ViewStyle } from '@/hooks/useViewStyle';

type ScrollRef = React.ComponentRef<typeof ScrollView>;
type ScrollProps = React.ComponentProps<typeof ScrollView> & ViewStyle;
const Scroll = React.forwardRef<ScrollRef, ScrollProps>((props, ref) => {
  const { px, style, bg, py, mt, mb, mx, my, pt, pb, ...restProps } = props;

  const ViewStyle = useViewStyle({ px, py, bg, mt, mb, mx, my, pt, pb });

  return (
    <ScrollView
      ref={ref}
      style={[ViewStyle, style]}
      {...restProps}
    />
  );
});

export default Scroll;
