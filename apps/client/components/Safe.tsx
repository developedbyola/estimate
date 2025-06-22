import React from 'react';
import { SafeAreaView } from 'react-native';
import { useViewStyle, ViewStyle } from '@/hooks/useViewStyle';

type SafeRef = React.ComponentRef<typeof SafeAreaView>;
type SafeProps = React.ComponentProps<typeof SafeAreaView> & ViewStyle;
const Safe = React.forwardRef<SafeRef, SafeProps>((props, ref) => {
  const { px, style, bg, py, mt, my, mb, mx, pt, pb, ...restProps } = props;

  const ViewStyle = useViewStyle({ px, py, bg, pt, pb, mt, mb, mx, my });

  return (
    <SafeAreaView
      ref={ref}
      style={[ViewStyle, style]}
      {...restProps}
    />
  );
});

export default Safe;
