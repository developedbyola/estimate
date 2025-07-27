import React from 'react';
import { MotiView } from 'moti';
import { Space } from '@/constants';
import { GestureResponderEvent, Pressable } from 'react-native';

type TabsContext = {
  value: string;
  setValue: (value: string) => void;
};

type UseTabsConfigParams = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};
const useTabsConfig = (params?: UseTabsConfigParams): TabsContext => {
  const {
    defaultValue = '',
    value: externalValue,
    onValueChange: setExternalValue,
  } = params || {};

  const isControlled = externalValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const value = isControlled ? externalValue : internalValue;

  const setValue = (value: string) => {
    if (!isControlled) {
      setInternalValue(value);
    }
    setExternalValue?.(value);
  };

  return { value, setValue };
};

const tabsContext = React.createContext<TabsContext | null>(null);

const useTabs = () => {
  const context = React.useContext(tabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within a TabsProvider');
  }
  return context;
};

type ProviderRef = React.ComponentRef<typeof MotiView>;
type ProviderProps = React.ComponentProps<typeof MotiView> &
  React.ComponentProps<typeof tabsContext.Provider>;

const Provider = React.forwardRef<ProviderRef, ProviderProps>((props, ref) => {
  const { value, ...restProps } = props;

  return (
    <tabsContext.Provider value={value}>
      <MotiView
        ref={ref}
        {...restProps}
      />
    </tabsContext.Provider>
  );
});

type RootRef = React.ComponentRef<typeof MotiView>;
type RootProps = React.ComponentProps<typeof MotiView> & UseTabsConfigParams;

const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const { value, defaultValue, onValueChange, ...restProps } = props;

  const context = useTabsConfig({
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

type ListRef = React.ComponentRef<typeof MotiView>;
type ListProps = React.ComponentProps<typeof MotiView>;

const List = React.forwardRef<ListRef, ListProps>((props, ref) => {
  const { style, ...restProps } = props;
  useTabs();

  return (
    <MotiView
      ref={ref}
      style={[{ flexDirection: 'row', gap: Space['xs'] }, style]}
      {...restProps}
    />
  );
});

type TriggerRef = React.ComponentRef<typeof Pressable>;
type TriggerProps = React.ComponentProps<typeof Pressable> & { value: string };
const Trigger = React.forwardRef<TriggerRef, TriggerProps>((props, ref) => {
  const { style, value, onPress, ...restProps } = props;
  const { setValue } = useTabs();

  const handlePress = (e: GestureResponderEvent) => {
    setValue(value);
    onPress?.(e);
  };

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      style={(state) => [
        {},
        typeof style === 'function' ? style(state) : style,
      ]}
      {...restProps}
    />
  );
});

type ContentRef = React.ComponentRef<typeof MotiView>;
type ContentProps = React.ComponentProps<typeof MotiView> & { value: string };
const Content = React.forwardRef<ContentRef, ContentProps>((props, ref) => {
  const { style, value, ...restProps } = props;
  const { value: tabsValue } = useTabs();

  if (value !== tabsValue) return null;

  return (
    <MotiView
      ref={ref}
      style={[{}, style]}
      {...restProps}
    />
  );
});

export const Tabs = {
  Root,
  List,
  Trigger,
  Content,
  Provider,
};
