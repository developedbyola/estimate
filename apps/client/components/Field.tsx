import React from 'react';
import Text from './Text';
import BaseTextInput from './TextInput';
import { AsChild, Box } from '@/components';
import { Border, Space } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { useController } from 'react-hook-form';
import { TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

type Context = ReturnType<typeof useController> & {
  isTextHidden: boolean;
  toggleTextHidden: () => void;
};
export const fieldContext = React.createContext<Context | null>(null);

type UseFieldParams = Parameters<typeof useController>[0] & {
  isTextHidden?: boolean;
};

const useField = (params?: UseFieldParams) => {
  const [isTextHidden, setIsTextHidden] = React.useState(
    params?.isTextHidden ?? false
  );
  const value = params ?? { ...(params || {}), name: '' };
  return {
    ...value,
    isTextHidden,
    toggleTextHidden: () => setIsTextHidden((prev) => !prev),
  };
};

export const useFieldContext = () => {
  const context = React.useContext(fieldContext);

  if (!context) {
    throw new Error('Field context provider is missing');
  }

  return context;
};

type ProviderRef = React.ComponentRef<typeof AsChild>;
type ProviderProps = React.ComponentProps<typeof AsChild> & {
  value?: UseFieldParams;
};

export const Provider = React.forwardRef<ProviderRef, ProviderProps>(
  (props, ref) => {
    const { value, asChild = true, ...restProps } = props;

    const { isTextHidden, toggleTextHidden, ...controllerProps } =
      useField(value);
    const context = useController(controllerProps);

    return (
      <fieldContext.Provider
        value={{ ...context, isTextHidden, toggleTextHidden }}
      >
        <AsChild
          ref={ref}
          asChild={asChild}
          {...restProps}
        />
      </fieldContext.Provider>
    );
  }
);

type RootRef = React.ComponentRef<typeof Box>;
type RootProps = Omit<
  React.ComponentProps<typeof Box>,
  keyof React.ComponentProps<typeof Provider>['value']
> &
  React.ComponentProps<typeof Provider>['value'];
const Root = React.forwardRef<RootRef, RootProps>((props, ref) => {
  const { style, name, control, isTextHidden, ...restProps } = props;

  const field = useField({ name, control, isTextHidden });

  return (
    <Provider value={field}>
      <Box
        ref={ref}
        style={[{}, style]}
        {...restProps}
      />
    </Provider>
  );
});

type ContainerRef = React.ComponentRef<typeof Box>;
type ContainerProps = React.ComponentProps<typeof Box>;
const Container = React.forwardRef<ContainerRef, ContainerProps>(
  (props, ref) => {
    const { style, bg = 'bg.subtle', ...restProps } = props;
    return (
      <Box
        bg={bg}
        ref={ref}
        style={[
          {
            height: 52,
            paddingBlock: 8,
            gap: Space['2xs'],
            paddingInline: 12,
            overflow: 'hidden',
            borderRadius: Border.radius['lg'],
          },
          style,
        ]}
        {...restProps}
      />
    );
  }
);

type RowRef = React.ComponentRef<typeof Box>;
type RowProps = React.ComponentProps<typeof Box>;
const Row = React.forwardRef<RowRef, RowProps>((props, ref) => {
  const { style, ...restProps } = props;

  return (
    <Box
      ref={ref}
      style={[
        {
          flex: 1,
          flexDirection: 'row',
          position: 'relative',
          alignItems: 'center',
        },
        style,
      ]}
      {...restProps}
    />
  );
});

type TextInputRef = React.ComponentRef<typeof BaseTextInput>;
type TextInputProps = React.ComponentProps<typeof BaseTextInput>;
const TextInput = React.forwardRef<TextInputRef, TextInputProps>(
  (props, ref) => {
    const { field, isTextHidden } = useFieldContext();
    const {
      style,
      onBlur = field.onBlur,
      value = field.value ?? '',
      onChangeText = field.onChange,
      ...restProps
    } = props;

    return (
      <BaseTextInput
        ref={ref}
        value={value}
        onBlur={onBlur}
        onChangeText={onChangeText}
        secureTextEntry={isTextHidden}
        style={[
          {
            fontSize: 16,
            paddingInline: 0,
            backgroundColor: 'transparent',
            fontWeight: field.value ? '600' : '400',
          },
          style,
        ]}
        {...restProps}
      />
    );
  }
);

type ToggleTextHiddenRef = React.ComponentRef<typeof TouchableOpacity>;
type ToggleTextHiddenProps = React.ComponentProps<typeof TouchableOpacity>;
const ToggleTextHidden = React.forwardRef<
  ToggleTextHiddenRef,
  ToggleTextHiddenProps
>((props, ref) => {
  const colors = useThemeColors();
  const { style, hitSlop = 20, ...restProps } = props;
  const { toggleTextHidden, isTextHidden } = useFieldContext();

  const iconName = isTextHidden ? 'lock-closed' : 'lock-open';

  return (
    <TouchableOpacity
      ref={ref}
      onPress={toggleTextHidden}
      hitSlop={hitSlop}
      style={[style]}
      {...restProps}
    >
      <Ionicons
        size={20}
        name={iconName}
        color={colors.getColor('icon.inactive')}
      />
    </TouchableOpacity>
  );
});

type FloatRef = React.ComponentRef<typeof Box>;
type FloatProps = React.ComponentProps<typeof Box>;
const Float = React.forwardRef<FloatRef, FloatProps>((props, ref) => {
  const { style, ...restProps } = props;

  return (
    <Box
      ref={ref}
      style={[
        {
          top: 0,
          height: '100%',
          position: 'absolute',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        style,
      ]}
      {...restProps}
    />
  );
});

type HintRef = React.ComponentRef<typeof Text>;
type HintProps = React.ComponentProps<typeof Text>;
const Hint = React.forwardRef<HintRef, HintProps>((props, ref) => {
  const { style, ...restProps } = props;
  const {
    fieldState: { error },
  } = useFieldContext();
  const colors = useThemeColors();

  if (!!error === true) return null;

  return (
    <Text
      ref={ref}
      style={[{ color: colors.getColor('text.subtle') }, style]}
      {...restProps}
    />
  );
});

type LabelRef = React.ComponentRef<typeof Text>;
type LabelProps = React.ComponentProps<typeof Text>;
const Label = React.forwardRef<LabelRef, LabelProps>((props, ref) => {
  const { style, ...restProps } = props;
  useFieldContext();
  const colors = useThemeColors();

  return (
    <Text
      ref={ref}
      style={[
        {
          fontSize: 14,
          lineHeight: 16,
          letterSpacing: -0.05,
          color: colors.getColor('text.strong'),
        },
        style,
      ]}
      {...restProps}
    />
  );
});

type FeedbackRef = React.ComponentRef<typeof Text>;
type FeedbackProps = React.ComponentProps<typeof Text>;
const Feedback = React.forwardRef<FeedbackRef, FeedbackProps>((props, ref) => {
  const { style, leading = 'base', ...restProps } = props;
  const colors = useThemeColors();
  const {
    fieldState: { error },
  } = useFieldContext();

  if (!error) return null;

  return (
    <Text
      ref={ref}
      leading={leading}
      style={[
        {
          fontSize: 16,
          fontWeight: '400',
          color: colors.getColor('error.base'),
        },
        style,
      ]}
      {...restProps}
    >
      {error.message?.toString()}
    </Text>
  );
});

const Field = {
  Root,
  Hint,
  Float,
  Label,
  Container,
  Row,
  ToggleTextHidden,
  Feedback,
  TextInput,
};

export default Field;
