import React from 'react';
import Text from './Text';
import { Button, useColorScheme } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Border } from '@/constants';
import Action from './Action';
import { StatusBar } from 'expo-status-bar';

type Alert = {
  message: string;
  variant: 'success' | 'destructive' | 'warning' | 'info';
  action?: { label: string; onPress?: () => void };
};

const useAlertConfig = () => {
  const [visible, setVisible] = React.useState(false);
  const [alert, setAlert] = React.useState<Alert>({
    message: '',
    variant: 'success',
    action: {
      label: '',
      onPress: undefined,
    },
  });

  const close = () => {
    setVisible(false);
    alert.action?.onPress?.();
  };

  const open = (newAlert: Alert) => {
    setAlert(newAlert);
    setVisible(true);
  };

  return {
    open,
    alert,
    close,
    visible,
  };
};

type AlertContext = ReturnType<typeof useAlertConfig>;

const AlertContext = React.createContext<AlertContext | null>(null);

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const alertConfig = useAlertConfig();
  const colors = useThemeColors();

  return (
    <AlertContext.Provider value={alertConfig}>
      {children}
      {alertConfig.visible && (
        <AlertComponent
          visible={alertConfig.visible}
          alert={alertConfig.alert}
          close={alertConfig.close}
        />
      )}
    </AlertContext.Provider>
  );
};

const AlertComponent = ({
  visible,
  alert,
  close,
}: {
  visible: boolean;
  alert: Alert;
  close: () => void;
}) => {
  const theme = useColorScheme();
  const colors = useThemeColors();

  const backgroundColorMap = {
    success: colors.getColor('success.base'),
    destructive: colors.getColor('error.base'),
    warning: colors.getColor('warning.base'),
    info: colors.getColor('info.base'),
  };

  return (
    <React.Fragment>
      <StatusBar style={theme === 'dark' ? 'dark' : 'light'} />
      <AnimatePresence>
        {visible && (
          <MotiView
            key='alert'
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            style={{
              top: 0,
              gap: 16,
              left: 0,
              right: 0,
              paddingTop: 48,
              paddingInline: 16,
              paddingBottom: 16,
              alignItems: 'center',
              position: 'absolute',
              flexDirection: 'row',
              borderBottomLeftRadius: Border.radius['3xl'],
              borderBottomRightRadius: Border.radius['3xl'],
              backgroundColor: backgroundColorMap[alert.variant],
            }}
          >
            <Text
              size='sm'
              leading='xs'
              weight='medium'
              color='text.base'
              style={{ flex: 1 }}
            >
              {alert.message}
            </Text>
            {alert.action && (
              <Action.Root
                size='xs'
                onPress={close}
                style={{
                  borderRadius: 8,
                  backgroundColor: colors.getColor('bg.base'),
                }}
              >
                <Action.Label
                  size='xs'
                  style={{ color: colors.getColor('text.strong') }}
                >
                  {alert.action.label}
                </Action.Label>
              </Action.Root>
            )}
          </MotiView>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

const useAlert = () => {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an Alert.Provider');
  }
  return context;
};

export const Alert = {
  useAlert,
  Provider: AlertProvider,
};
