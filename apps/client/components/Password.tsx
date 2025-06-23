import React from 'react';
import Field from './Field';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Space } from '@/constants';
import { useThemeColors } from '@/hooks/useThemeColors';

type PasswordContext = {
  showPassword: boolean;
  setShowPassword: React.Dispatch<
    React.SetStateAction<PasswordContext['showPassword']>
  >;
};

const passwordContext = React.createContext<PasswordContext | null>(null);
const usePassword = () => {
  const context = React.useContext(passwordContext);
  if (!context) {
    throw new Error('Context Provider component is missing');
  }
  return context;
};

type RootProps = {
  show?: boolean;
  children?: React.ReactNode;
};
const Root = (props: RootProps) => {
  const { show = false, children } = props;
  const [showPassword, setShowPassword] = React.useState(show);

  return (
    <passwordContext.Provider value={{ showPassword, setShowPassword }}>
      {children}
    </passwordContext.Provider>
  );
};

type TextInputRef = React.ComponentRef<typeof Field.TextInput>;
type TextInputProps = React.ComponentProps<typeof Field.TextInput>;
const TextInput = React.forwardRef<TextInputRef, TextInputProps>(
  (props, ref) => {
    const { style, ...restProps } = props;
    const { showPassword } = usePassword();

    return (
      <Field.TextInput
        ref={ref}
        {...restProps}
        secureTextEntry={!showPassword}
      />
    );
  }
);

type IndicatorRef = React.ComponentRef<typeof Ionicons>;
type IndicatorProps = Omit<React.ComponentProps<typeof Ionicons>, 'name'>;
const Indicator = React.forwardRef<IndicatorRef, IndicatorProps>(
  (props, ref) => {
    const colors = useThemeColors();
    const { style, size, ...restProps } = props;
    const { showPassword, setShowPassword } = usePassword();

    return (
      <TouchableOpacity
        hitSlop={20}
        onPress={() => setShowPassword(!showPassword)}
      >
        <Ionicons
          ref={ref}
          size={size || 20}
          color={colors.getColor('text.inactive')}
          name={showPassword ? 'lock-closed-outline' : 'lock-open-outline'}
          style={[{ paddingInline: Space['xl'] }, style]}
          {...restProps}
        />
      </TouchableOpacity>
    );
  }
);

const Password = {
  Root,
  TextInput,
  Indicator,
};

export default Password;
