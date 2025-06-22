import React from 'react';
import AsChild from './AsChild';
import Box from './Box';
import { TouchableOpacity } from 'react-native';

type Context = {
  value: string;
  setValue: (opt: { value: string }) => void;
};

const radioGroupContext = React.createContext<Context | null>(null);

export const useRadioGroup = (context?: Partial<Context>): Context => {
  const isControlled =
    context?.value !== undefined && context.setValue !== undefined;
  const [internalValue, setInternalValue] = React.useState('');

  const value = isControlled ? context.value! : internalValue;

  const setValue = (opt: { value: string }) => {
    if (!isControlled) {
      setInternalValue(opt.value);
    } else {
      context.setValue?.({ value: opt.value });
    }
  };

  return { value, setValue };
};

export const useRadioGroupContext = () => {
  const context = React.useContext(radioGroupContext);
  if (!context) {
    throw new Error(
      'useRadioGroupContext must be used with <RadioGroup.Provider>'
    );
  }
  return context;
};

type ProviderRef = React.ComponentRef<typeof AsChild>;
type ProviderProps = React.ComponentProps<typeof AsChild> &
  React.ComponentProps<typeof radioGroupContext.Provider>;
const Provider = React.forwardRef<ProviderRef, ProviderProps>((props, ref) => {
  const { asChild = true, value, ...restProps } = props;

  return (
    <radioGroupContext.Provider value={value}>
      <AsChild
        ref={ref}
        asChild={asChild}
        {...restProps}
      />
    </radioGroupContext.Provider>
  );
});

type RootRef = React.ComponentRef<typeof Box>;
type RootProps = React.ComponentProps<typeof Box> & {
  value?: string;
  onValueChange?: (opt: { value: string }) => void;
};
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const { value, onValueChange, ...restProps } = props;

  const context = useRadioGroup({
    value,
    setValue: onValueChange,
  });

  return (
    <Provider value={context}>
      <Box
        ref={ref}
        {...restProps}
      />
    </Provider>
  );
});

type ItemRef = React.ComponentRef<typeof Box>;
type ItemProps = React.ComponentProps<typeof Box> & {
  value: string;
  onPress?: () => void;
};
const Item = React.forwardRef<ItemRef, ItemProps>((props, ref) => {
  const { style, onPress, value: itemValue, ...restProps } = props;
  const { value, setValue } = useRadioGroupContext();

  const handlePress = () => {
    if (value !== itemValue) {
      setValue({ value: itemValue });
    }
    onPress?.();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Box
        ref={ref}
        style={[{ position: 'relative' }, style]}
        {...restProps}
      />
    </TouchableOpacity>
  );
});

type IndicatorRef = React.ComponentRef<typeof Box>;
type IndicatorProps = React.ComponentProps<typeof Box> & {
  value: string;
};
const Indicator = React.forwardRef<IndicatorRef, IndicatorProps>(
  (props, ref) => {
    const { style, value: itemValue, ...restProps } = props;
    const { value } = useRadioGroupContext();

    if (value !== itemValue) return null;

    return (
      <Box
        ref={ref}
        style={[{ position: 'absolute' }, style]}
        {...restProps}
      />
    );
  }
);

const RadioGroup = {
  Provider,
  Root,
  Item,
  Indicator,
};

export default RadioGroup;
