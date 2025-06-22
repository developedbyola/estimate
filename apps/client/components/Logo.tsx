import React from 'react';
import { Image, useColorScheme } from 'react-native';

import fullLightSvg from '@/assets/images/brand/full/light.png';
import fullDarkPng from '@/assets/images/brand/full/dark.png';
import markLightSvg from '@/assets/images/brand/mark/light.png';
import markDarkPng from '@/assets/images/brand/mark/dark.png';

const imageMap = {
  light: {
    full: {
      svg: fullLightSvg, // Note: React Native Image does not support SVG by default
      png: fullLightSvg,
    },
    mark: {
      svg: markLightSvg,
      png: markLightSvg,
    },
  },
  dark: {
    full: {
      svg: fullDarkPng,
      png: fullDarkPng,
    },
    mark: {
      svg: markDarkPng,
      png: markDarkPng,
    },
  },
};

type LogoRef = React.ComponentRef<typeof Image>;
type LogoProps = React.ComponentProps<typeof Image> & {
  ext?: 'svg' | 'png';
  type?: 'full' | 'mark';
  theme?: 'light' | 'dark';
};
const Logo = React.forwardRef<LogoRef, LogoProps>((props, ref) => {
  const { theme = 'light', ext = 'svg', type = 'full', ...restProps } = props;
  const ColorSchema = useColorScheme() ?? theme;

  return (
    <Image
      ref={ref}
      source={imageMap[ColorSchema][type][ext]}
      {...restProps}
    />
  );
});

export default Logo;
