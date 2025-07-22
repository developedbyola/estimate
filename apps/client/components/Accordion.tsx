import React from 'react';
import { Border } from '@/constants';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatePresence, MotiView } from 'moti';
import { useThemeColors } from '@/hooks/useThemeColors';

type AccordionContext = {
  values: string[];
  type: 'multiple' | 'single';
  toggle: (value: string) => void;
};

const accordionContext = React.createContext<AccordionContext | null>(null);

type UseAccordionContextParams = {
  value?: string[] | string;
  type?: 'multiple' | 'single';
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
};
export const useAccordionContext = (
  params?: UseAccordionContextParams
): AccordionContext => {
  const {
    type = 'single',
    defaultValue = [],
    value: externalValue,
    onValueChange: setExternalValue,
  } = params || {};

  const isControlled = externalValue !== undefined;

  const [internalValue, setInternalValue] = React.useState<string[]>(
    Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  );

  const values = isControlled
    ? Array.isArray(externalValue)
      ? externalValue
      : [externalValue]
    : internalValue;

  const toggle = (value: string) => {
    let newValues: string[] = [];
    if (type === 'single') {
      newValues = values[0] === value ? [] : [value];
    } else {
      newValues = values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value];
    }
    if (!isControlled) {
      setInternalValue(newValues);
      return;
    }
    setExternalValue?.(newValues);
  };

  return { values, type, toggle };
};

export const useAccordion = () => {
  const context = React.useContext(accordionContext);
  if (!context) {
    throw new Error('useAccordion must be used within an AccordionProvider');
  }
  return context;
};

type AccordionItemContext = { value: string };
const accordionItemContext = React.createContext<AccordionItemContext | null>(
  null
);
const useAccordionItem = () => {
  const { values, type, toggle } = useAccordion();
  const context = React.useContext(accordionItemContext);

  if (!context) {
    throw new Error('useAccordionItem must be used within an ItemProvider');
  }
  const { value } = context;
  const isVisible =
    type === 'single' ? values[0] === value : values.includes(value);

  return { value, isVisible, toggle, type };
};

type ProviderRef = React.ComponentRef<typeof MotiView>;
type ProviderProps = Omit<
  React.ComponentProps<typeof MotiView>,
  keyof typeof accordionContext.Provider
> &
  React.ComponentProps<typeof accordionContext.Provider>;
const Provider = React.forwardRef<ProviderRef, ProviderProps>((props, ref) => {
  const { value, ...restProps } = props;

  return (
    <accordionContext.Provider value={value}>
      <MotiView
        ref={ref}
        {...restProps}
      />
    </accordionContext.Provider>
  );
});

type RootRef = React.ComponentRef<typeof MotiView>;
type RootProps = Omit<
  React.ComponentProps<typeof MotiView>,
  keyof UseAccordionContextParams
> &
  UseAccordionContextParams;
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const { style, value, defaultValue, onValueChange, type, ...restProps } =
    props;

  const context = useAccordionContext({
    value,
    defaultValue,
    onValueChange,
    type,
  });

  return (
    <Provider value={context}>
      <MotiView
        ref={ref}
        style={[style]}
        {...restProps}
      />
    </Provider>
  );
});

type ItemRef = React.ComponentRef<typeof MotiView>;
type ItemProps = Omit<React.ComponentProps<typeof MotiView>, 'value'> & {
  value: string;
};
const Item = React.forwardRef<ItemRef, ItemProps>((props, ref) => {
  const { style, value, ...restProps } = props;

  return (
    <accordionItemContext.Provider value={{ value }}>
      <MotiView
        ref={ref}
        style={[style]}
        {...restProps}
      />
    </accordionItemContext.Provider>
  );
});

type ItemHeaderRef = React.ComponentRef<typeof Pressable>;
type ItemHeaderProps = React.ComponentProps<typeof Pressable>;
const ItemHeader = React.forwardRef<ItemHeaderRef, ItemHeaderProps>(
  (props, ref) => {
    const colors = useThemeColors();
    const { style, ...restProps } = props;

    const { value, toggle } = useAccordionItem();

    return (
      <Pressable
        ref={ref}
        onPress={() => toggle(value)}
        style={(props) => [
          {
            gap: 8,
            minHeight: 46,
            paddingInline: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: Border.radius['xl'],
            backgroundColor: colors.getColor('bg.soft'),
          },
          typeof style === 'function' ? style(props) : style || {},
        ]}
        {...restProps}
      />
    );
  }
);

type ItemIconRef = React.ComponentRef<typeof Ionicons>;
type ItemIconProps = Omit<React.ComponentProps<typeof Ionicons>, 'name'>;
const ItemIcon = React.forwardRef<ItemIconRef, ItemIconProps>((props, ref) => {
  const colors = useThemeColors();
  const {
    style,
    size = 16,
    color = colors.getColor('icon.inactive'),
    ...restProps
  } = props;

  const { isVisible } = useAccordionItem();
  const iconName = 'chevron-forward';

  return (
    <MotiView
      animate={{ rotateZ: isVisible ? '90deg' : '0deg' }}
      transition={{ duration: 250, type: 'timing' }}
    >
      <Ionicons
        ref={ref}
        size={size}
        color={color}
        style={[style]}
        name={iconName as any}
        {...restProps}
      />
    </MotiView>
  );
});

type ItemContentRef = React.ComponentRef<typeof MotiView>;
type ItemContentProps = React.ComponentProps<typeof MotiView>;
const ItemContent = React.forwardRef<ItemContentRef, ItemContentProps>(
  (props, ref) => {
    const { style, ...restProps } = props;
    const { isVisible } = useAccordionItem();

    return (
      <AnimatePresence initial={false}>
        {isVisible && (
          <MotiView
            ref={ref}
            from={{ maxHeight: 0, opacity: 0 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 1000, opacity: 1 }}
            transition={{ duration: 350, type: 'timing' }}
            exitTransition={{ type: 'timing', duration: 300 }}
            style={[{ paddingBlock: 12, overflow: 'hidden' }, style]}
            {...restProps}
          />
        )}
      </AnimatePresence>
    );
  }
);

export const Accordion = {
  Root,
  Item,
  Provider,
  ItemIcon,
  ItemHeader,
  ItemContent,
  useAccordion,
  useAccordionContext,
};
