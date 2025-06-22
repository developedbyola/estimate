import React from 'react';
import PagerView from 'react-native-pager-view';
import Box from './Box';

type PagerContext = {
  value: number;
  onValueChange: (value: number) => void;
};

const PagerContext = React.createContext<PagerContext | null>(null);
export const usePagerContext = () => {
  const context = React.useContext(PagerContext);
  if (context === null) {
    throw new Error('usePagerContext must be used within a Pager');
  }
  return context;
};

type RootRef = React.ComponentRef<typeof PagerView>;
type RootProps = React.ComponentProps<typeof PagerView> & {
  initialValue?: number;
  onValueChange?: (value: number) => void;
};
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const { children, initialValue, onValueChange, ...restProps } = props;
  const [value, setValue] = React.useState<number>(initialValue ?? 0);
  const context: PagerContext = React.useMemo(
    () => ({
      value,
      onValueChange: setValue,
    }),
    [value]
  );

  return (
    <PagerContext.Provider value={context}>
      <PagerView
        {...restProps}
        ref={ref}
      />
    </PagerContext.Provider>
  );
});

type ContentRef = React.ComponentRef<typeof Box>;
type ContentProps = React.ComponentProps<typeof Box> & {
  index: number;
};
const Content = React.forwardRef<ContentRef, ContentProps>((props, ref) => {
  const { children, index, ...restProps } = props;
  const { value } = usePagerContext();

  if (value !== index) return null;

  return (
    <Box
      {...restProps}
      ref={ref}
    />
  );
});

const Pager = {
  Root,
  Content,
};

export default Pager;
