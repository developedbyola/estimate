import React from 'react';
import { useViewStyle, ViewStyle } from '@/hooks/useViewStyle';
import { BlurView } from 'expo-blur';

type BlurRef = React.ComponentRef<typeof BlurView>;
type BlurProps = React.ComponentProps<typeof BlurView> & ViewStyle;
const Blur = React.forwardRef<BlurRef, BlurProps>((props, ref) => {
  const { px, style, bg, py, mx, my, mt, mb, pt, pb, ...restProps } = props;

  const ViewStyle = useViewStyle({ px, py, bg, pt, pb, mt, mb, mx, my });

  return (
    <BlurView
      ref={ref}
      style={[ViewStyle, { overflow: 'hidden' }, style]}
      {...restProps}
    />
  );
});

export default Blur;
