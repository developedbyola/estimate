import React from 'react';
import { Image, useColorScheme } from 'react-native';

import IosDark from '@/assets/images/icons/ios-dark.png';
import IosLight from '@/assets/images/icons/ios-light.png';
import IosTinted from '@/assets/images/icons/ios-tinted.png';

const imageMap = {
  ios: {
    dark: IosDark,
    light: IosLight,
    tinted: IosTinted,
  },
};

type LogoRef = React.ComponentRef<typeof Image>;
type LogoProps = React.ComponentProps<typeof Image> & {
  type?: 'ios';
  theme?: 'light' | 'dark' | 'tinted';
};
const Logo = React.forwardRef<LogoRef, LogoProps>((props, ref) => {
  const { theme = 'light', type = 'ios', ...restProps } = props;
  const ColorSchema = useColorScheme() ?? theme;

  return (
    <Image
      ref={ref}
      source={imageMap[type][ColorSchema]}
      {...restProps}
    />
  );
});

export default Logo;
