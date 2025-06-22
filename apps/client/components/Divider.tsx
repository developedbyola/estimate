import React from 'react';
import Box from './Box';

type DividerRef = React.ComponentRef<typeof Box>;
type DividerProps = React.ComponentProps<typeof Box> & {
  x?: '1' | '2' | '3' | '4';
  y?: '1' | '2' | '3' | '4';
};
const Divider = React.forwardRef<DividerRef, DividerProps>((props, ref) => {
  const { style, x, y, ...restProps } = props;

  return (
    <Box
      ref={ref}
      style={[
        x && {
          height: '100%',
          width: Number(x),
        },
        y && {
          width: '100%',
          height: Number(y),
        },
        style,
      ]}
      {...restProps}
    />
  );
});

export default Divider;
