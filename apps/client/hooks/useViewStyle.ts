import { ColorKeys, Space } from '@/constants';
import { useThemeColors } from './useThemeColors';

export type ViewStyle = {
  py?: keyof typeof Space;
  px?: keyof typeof Space;
  pt?: keyof typeof Space;
  pb?: keyof typeof Space;
  mx?: keyof typeof Space;
  my?: keyof typeof Space;
  mt?: keyof typeof Space;
  mb?: keyof typeof Space;
  bg?: ColorKeys;
};

export const useViewStyle = (styles: ViewStyle) => {
  const { py, px, pt, pb, mx, my, mt, mb, bg } = styles;
  const colors = useThemeColors();

  return {
    paddingTop: pt ? Space[pt] : undefined,
    paddingBottom: pb ? Space[pb] : undefined,
    paddingVertical: py ? Space[py] : undefined,
    paddingHorizontal: px ? Space[px] : undefined,
    marginTop: mt ? Space[mt] : undefined,
    marginBottom: mb ? Space[mb] : undefined,
    marginVertical: my ? Space[my] : undefined,
    marginHorizontal: mx ? Space[mx] : undefined,
    backgroundColor: bg ? colors.getColor(bg) : 'transparent',
  };
};
