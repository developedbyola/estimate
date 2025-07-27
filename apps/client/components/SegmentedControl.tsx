import React from 'react';
import NativeSegmentedControl from '@react-native-segmented-control/segmented-control';
import { MotiView } from 'moti';

type SegmentedControlsContext = {
  value: number;
  setValue: (index: number) => void;
};

type UseSegmentedControlConfigParams = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
};

const useSegmentedControlConfig = (
  params?: UseSegmentedControlConfigParams
) => {
  const {
    value: externalValue,
    defaultValue = 0,
    onValueChange: setExternalValue,
  } = params || {};

  const isControlled = externalValue !== undefined;

  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const value = isControlled ? defaultValue : internalValue;

  const setValue = (value: number) => {
    if (!isControlled) {
      setInternalValue(value);
    }
    setExternalValue?.(value);
  };

  return { value, setValue };
};

const SegmentedControlsContext =
  React.createContext<SegmentedControlsContext | null>(null);

const useSegmentedControl = () => {
  const context = React.useContext(SegmentedControlsContext);
  if (!context) {
    throw new Error(
      'useSegmentedControls must be used within a SegmentedControlsProvider'
    );
  }
  return context;
};

type ProviderRef = React.ForwardedRef<typeof MotiView>;
type ProviderProps = Omit<
  React.ComponentProps<typeof MotiView>,
  keyof React.ComponentProps<typeof SegmentedControlsContext.Provider>
> &
  React.ComponentProps<typeof SegmentedControlsContext.Provider>;
const Provider = React.forwardRef<ProviderRef, ProviderProps>((props, ref) => {
  const { value, ...restProps } = props;
  return (
    <SegmentedControlsContext.Provider
      value={value}
      {...restProps}
    >
      <MotiView
        ref={ref}
        {...restProps}
      />
    </SegmentedControlsContext.Provider>
  );
});

type RootRef = React.ForwardedRef<typeof MotiView>;
type RootProps = Omit<
  React.ComponentProps<typeof MotiView>,
  keyof UseSegmentedControlConfigParams
> &
  UseSegmentedControlConfigParams;
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const { value, defaultValue, onValueChange, ...restProps } = props;

  const context = useSegmentedControlConfig({
    value,
    defaultValue,
    onValueChange,
  });

  return (
    <Provider value={context}>
      <MotiView
        ref={ref}
        {...restProps}
      />
    </Provider>
  );
});

type ControlRef = React.ForwardedRef<typeof MotiView>;
type ControlProps = Omit<
  React.ComponentProps<typeof MotiView>,
  keyof React.ComponentProps<typeof NativeSegmentedControl>
> &
  React.ComponentProps<typeof NativeSegmentedControl>;
const Control = React.forwardRef<ControlRef, ControlProps>((props, ref) => {
  const {
    values,
    enabled,
    onChange,
    tabStyle,
    momentary,
    tintColor,
    fontStyle,
    appearance,
    sliderStyle,
    selectedIndex,
    activeFontStyle,
    backgroundColor,
    ...restProps
  } = props;
  const { setValue } = useSegmentedControl();

  return (
    <MotiView
      ref={ref}
      {...restProps}
    >
      <NativeSegmentedControl
        values={values}
        onChange={(e) => setValue(e.nativeEvent.selectedSegmentIndex)}
        enabled={enabled}
        momentary={momentary}
        tintColor={tintColor}
        appearance={appearance}
        sliderStyle={sliderStyle}
        selectedIndex={selectedIndex}
        activeFontStyle={activeFontStyle}
        tabStyle={tabStyle}
        fontStyle={fontStyle}
        backgroundColor={backgroundColor}
      />
    </MotiView>
  );
});

type ContentRef = React.ForwardedRef<typeof MotiView>;
type ContentProps = React.ComponentProps<typeof MotiView> & {
  value: number;
};
const Content = React.forwardRef<ContentRef, ContentProps>((props, ref) => {
  const { style, value, ...restProps } = props;
  const { value: segmentedValue } = useSegmentedControl();

  if (value !== segmentedValue) return null;

  return (
    <MotiView
      ref={ref}
      style={[{}, style]}
      {...restProps}
    />
  );
});

export const SegmentedControl = {
  Root,
  Control,
  Content,
  Provider,
  useSegmentedControl,
  useSegmentedControlConfig,
};
