import React from 'react';
import Text from './Text';

type Ref = React.ComponentRef<typeof Text>;
type Props = React.ComponentProps<typeof Text>;

const Heading = React.forwardRef<Ref, Props>((props, ref) => {
  const {
    style,
    size = '2xl',
    align = 'left',
    leading = '2xl',
    weight = 'semibold',
    color = 'text.strong',
    ...restProps
  } = props;

  return (
    <Text
      ref={ref}
      size={size}
      color={color}
      align={align}
      weight={weight}
      leading={leading}
      style={[style]}
      {...restProps}
    />
  );
});

export default Heading;
