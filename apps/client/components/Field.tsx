import React from 'react';
import Text from './Text';
import BaseTextInput from './TextInput';
import { useController } from 'react-hook-form';
import { AsChild, Box, Heading } from '@/components';
import { Border, Space, Typography } from '@/constants';
import { useThemeColors } from '@/hooks/useThemeColors';

type Context = ReturnType<typeof useController>;
export const fieldContext = React.createContext<Context | null>(null);

const useField = (
  value?: Parameters<typeof useController>[0]
): Parameters<typeof useController>[0] => {
  const newValue = value ?? { ...(value || {}), name: '' };
  return newValue;
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
  value?: Parameters<typeof useController>[0];
};

export const Provider = React.forwardRef<ProviderRef, ProviderProps>(
  (props, ref) => {
    const { value, asChild = true, ...restProps } = props;

    const field = useField(value);
    const context = useController(field);

    return (
      <fieldContext.Provider value={context}>
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
  const { style, name, control, ...restProps } = props;

  const field = useField({ name, control });

  return (
    <Provider value={field}>
      <Box
        ref={ref}
        style={[{ gap: Space.sm }, style]}
        {...restProps}
      />
    </Provider>
  );
});

type LabelRef = React.ComponentRef<typeof Heading>;
type LabelProps = React.ComponentProps<typeof Heading>;
const Label = React.forwardRef<LabelRef, LabelProps>((props, ref) => {
  const { style, ...restProps } = props;
  const Colors = useThemeColors();

  return (
    <Heading
      ref={ref}
      style={[
        {
          color: Colors.text.subtle,
          fontSize: Typography.size.base,
          fontWeight: Typography.weight.medium,
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
    const { field } = useFieldContext();
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
        style={[{ backgroundColor: 'transparent' }, style]}
        {...restProps}
      />
    );
  }
);

type ControlRef = React.ComponentRef<typeof Box>;
type ControlProps = React.ComponentProps<typeof Box>;
const Control = React.forwardRef<ControlRef, ControlProps>((props, ref) => {
  const { style, ...restProps } = props;
  const Colors = useThemeColors();

  return (
    <Box
      ref={ref}
      style={[
        {
          height: 40,
          flexDirection: 'row',
          alignItems: 'center',
          position: 'relative',
          borderRadius: Border.radius['base'],
          backgroundColor: Colors.others.foreground,
        },
        style,
      ]}
      {...restProps}
    />
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
  const Colors = useThemeColors();

  if (!!error === true) return null;

  return (
    <Text
      ref={ref}
      style={[{ color: Colors.text.subtle }, style]}
      {...restProps}
    />
  );
});

type FeedbackRef = React.ComponentRef<typeof Text>;
type FeedbackProps = React.ComponentProps<typeof Text>;
const Feedback = React.forwardRef<FeedbackRef, FeedbackProps>((props, ref) => {
  const { style, leading = 'base', ...restProps } = props;
  const Colors = useThemeColors();
  const {
    fieldState: { error },
  } = useFieldContext();

  if (!error) return null;

  return (
    <Text
      ref={ref}
      leading={leading}
      style={[{ color: Colors.error.base }, style]}
      {...restProps}
    >
      {error.message?.toString()}
    </Text>
  );
});

const Field = {
  Root,
  Control,
  Float,
  Label,
  TextInput,
  Feedback,
  Hint,
};

export default Field;
