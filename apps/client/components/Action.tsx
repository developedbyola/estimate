import React from 'react';
import Text from './Text';
import { Ionicons } from '@expo/vector-icons';
import { Border, Space } from '@/constants';
import {
  Pressable,
  GestureResponderEvent,
  PressableStateCallbackType,
  NativeSyntheticEvent,
  NativeMouseEvent,
} from 'react-native';
import AsChild from './AsChild';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ActivityIndicator } from '.';

type ActionContext = {
  loading: boolean;
  state: PressableStateCallbackType;
  size: '2xs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  variant: 'primary' | 'ghost' | 'surface' | 'outline' | 'destructive';
};

export const ActionContext = React.createContext<ActionContext | null>(null);

export const useAction = (value?: Partial<ActionContext>): ActionContext => {
  const newValue = value || {};

  return {
    state: newValue.state || {
      ...(newValue.state || {}),
      pressed: false,
      hovered: false,
    },
    size: newValue.size || 'base',
    variant: newValue.variant || 'primary',
    loading: newValue.loading || false,
  };
};

export const useActionContext = () => {
  const context = React.useContext(ActionContext);
  if (!context) {
    throw new Error('Action context component is missing');
  }
  return context;
};

type ProviderRef = React.ComponentRef<typeof AsChild>;
type ProviderProps = Omit<
  React.ComponentProps<typeof AsChild>,
  keyof React.ComponentProps<(typeof ActionContext)['Provider']>
> &
  React.ComponentProps<(typeof ActionContext)['Provider']>;
const Provider = React.forwardRef<ProviderRef, ProviderProps>((props, ref) => {
  const {
    asChild = true,
    onHoverIn,
    onHoverOut,
    onPressIn,
    onPressOut,
    value,
    ...restProps
  } = props;
  const [state, setState] = React.useState<PressableStateCallbackType>({
    pressed: value?.state.pressed || false,
    hovered: value?.state.hovered || false,
  });

  const handlePressIn = (event: GestureResponderEvent) => {
    onPressIn?.(event);
    setState((s) => ({ ...s, hovered: true }));
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    onPressOut?.(event);
    setState((s) => ({ ...s, hovered: false }));
  };

  const handleHoverIn = (event: NativeSyntheticEvent<NativeMouseEvent>) => {
    onHoverIn?.(event);
    setState((s) => ({ ...s, hovered: true }));
  };

  const handleHoverOut = (event: NativeSyntheticEvent<NativeMouseEvent>) => {
    onHoverOut?.(event);
    setState((s) => ({ ...s, hovered: false }));
  };

  return (
    <ActionContext.Provider value={value}>
      <AsChild
        ref={ref}
        asChild={asChild}
        onHoverIn={handleHoverIn}
        onPressIn={handlePressIn}
        onHoverOut={handleHoverOut}
        onPressOut={handlePressOut}
        {...restProps}
      />
    </ActionContext.Provider>
  );
});

type RootRef = React.ComponentRef<typeof Pressable>;
type RootProps = React.ComponentProps<typeof Pressable> &
  Partial<Pick<ActionContext, 'size' | 'variant' | 'loading'>>;
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const {
    style,
    onPressIn,
    onPressOut,
    size = 'base',
    variant = 'primary',
    loading = false,
    disabled = loading,
    ...restProps
  } = props;

  const context = useAction({ size, variant, loading });
  const colors = useThemeColors();

  const variants = (state: PressableStateCallbackType) => ({
    outline: {
      borderWidth: Border.width.xs,
      borderColor: colors.getColor('border.soft'),
    },
    ghost: {
      backgroundColor: state.pressed
        ? colors.getColor('bg.soft')
        : 'transparent',
    },
    surface: {
      backgroundColor: colors.getColor('bg.soft'),
      opacity: state.pressed ? 0.8 : 1,
    },
    primary: {
      backgroundColor: state.pressed
        ? colors.getColor('primary.subtle')
        : colors.getColor('primary.base'),
    },
    destructive: {
      backgroundColor: state.pressed
        ? colors.getColor('error.base')
        : colors.getColor('error.subtle'),
    },
  });

  const sizes = {
    '2xs': {
      height: 26,
    },
    xs: {
      height: 30,
    },
    sm: {
      height: 36,
    },
    lg: {
      height: 48,
    },
    xl: {
      height: 52,
    },
    base: {
      height: 44,
    },
  };

  return (
    <Provider value={context}>
      <Pressable
        ref={ref}
        disabled={disabled}
        style={(state) => [
          {
            gap: Space.sm,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            paddingInline: Space['xl'],
            borderRadius: Border.radius['xl'],
            opacity: disabled || loading ? 0.5 : 1,
          },
          {
            ...sizes[size],
            ...variants(state)[variant],
          },
          typeof style === 'function' ? style(state) : style,
        ]}
        {...restProps}
      />
    </Provider>
  );
});

type LoaderRef = React.ComponentRef<typeof ActivityIndicator>;
type LoaderComponent = React.ComponentProps<typeof ActivityIndicator>;
const Loader = React.forwardRef<LoaderRef, LoaderComponent>((props, ref) => {
  const { style, color = 'white', ...restProps } = props;
  const { loading } = useActionContext();

  if (!loading) return null;

  return (
    <ActivityIndicator
      ref={ref}
      color={color}
      {...restProps}
    />
  );
});

type ActionLabelRef = React.ComponentRef<typeof Text>;
type ActionLabelProps = React.ComponentProps<typeof Text>;
const Label = React.forwardRef<ActionLabelRef, ActionLabelProps>(
  (props, ref) => {
    const colors = useThemeColors();
    const { style, size = 'base', weight = 'medium', ...restProps } = props;
    const { variant, state } = useActionContext();

    const variants = (state: PressableStateCallbackType) => ({
      outline: {
        color: colors.getColor('text.strong'),
      },
      ghost: {
        color: state.pressed
          ? colors.getColor('text.base')
          : colors.getColor('text.subtle'),
      },
      surface: {
        color: state.pressed
          ? colors.getColor('text.base')
          : colors.getColor('text.subtle'),
      },
      primary: {
        color: colors.getColor('text.base'),
      },
      destructive: {
        color: colors.getColor('text.base'),
      },
    });

    return (
      <Text
        ref={ref}
        size={size}
        weight={weight}
        style={[{ ...variants(state)[variant] }, style]}
        {...restProps}
      />
    );
  }
);

type ActionIconRef = React.ComponentRef<typeof Ionicons>;
type ActionIconProps = React.ComponentProps<typeof Ionicons>;
const Icon = React.forwardRef<ActionIconRef, ActionIconProps>((props, ref) => {
  const { style, ...restProps } = props;
  const Colors = useThemeColors();
  const { variant, size, state } = useActionContext();

  const variants = (state: PressableStateCallbackType) => ({
    outline: {
      color: Colors.getColor('text.strong'),
    },
    ghost: {
      color: state.pressed
        ? Colors.getColor('text.base')
        : Colors.getColor('text.subtle'),
    },
    surface: {
      color: state.pressed
        ? Colors.getColor('text.base')
        : Colors.getColor('text.subtle'),
    },
    primary: {
      color: state.pressed
        ? Colors.getColor('text.base')
        : Colors.getColor('text.subtle'),
    },
    destructive: {
      color: state.pressed
        ? Colors.getColor('text.base')
        : Colors.getColor('text.subtle'),
    },
  });

  const sizes = {
    '2xs': {
      width: 16,
      height: 16,
    },
    xs: {
      width: 20,
      height: 20,
    },
    sm: {
      width: 20,
      height: 20,
    },
    base: {
      width: 24,
      height: 24,
    },
    lg: {
      width: 24,
      height: 24,
    },
    xl: {
      width: 20,
      height: 20,
    },
  };

  return (
    <Ionicons
      ref={ref}
      size={24}
      style={[{ ...variants(state)[variant] }, { ...sizes[size] }, style]}
      {...restProps}
    />
  );
});

const Action = {
  Root,
  Label,
  Loader,
  Icon,
};

export default Action;
