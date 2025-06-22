import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useViewStyle, ViewStyle } from '@/hooks/useViewStyle';

type SafeRef = React.ComponentRef<typeof LinearGradient>;
type SafeProps = React.ComponentProps<typeof LinearGradient> & ViewStyle;
const Safe = React.forwardRef<SafeRef, SafeProps>((props, ref) => {
  const { px, style, bg, py, mt, mb, mx, my, pt, pb, ...restProps } = props;

  const ViewStyle = useViewStyle({ px, py, bg, mt, mb, mx, my, pt, pb });

  return (
    <LinearGradient
      ref={ref}
      style={[ViewStyle, style]}
      {...restProps}
    />
  );
});

export default Safe;
