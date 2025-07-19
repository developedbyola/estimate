import React from 'react';
import Text from './Text';
import { Button } from 'react-native';
import { AnimatePresence, MotiView } from 'moti';
import { useThemeColors } from '@/hooks/useThemeColors';

type Alert = {
  message: string;
  variant: 'success' | 'destructive' | 'warning' | 'info';
  action: { label: string; onPress?: () => void };
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
  return (
    <AlertContext.Provider value={alertConfig}>
      {alertConfig.visible && (
        <AlertComponent
          visible={alertConfig.visible}
          alert={alertConfig.alert}
          close={alertConfig.close}
        />
      )}
      {children}
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
  const colors = useThemeColors();

  const backgroundColorMap = {
    success: colors.getColor('success.base'),
    destructive: colors.getColor('error.base'),
    warning: colors.getColor('warning.base'),
    info: colors.getColor('info.base'),
  };

  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -10 }}
          style={{
            gap: 12,
            paddingBlock: 12,
            paddingInline: 12,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: backgroundColorMap[alert.variant],
          }}
        >
          <Text
            size='base'
            leading='sm'
            weight='medium'
            color='text.base'
          >
            {alert.message}
          </Text>
          <Button
            onPress={close}
            title={alert.action.label}
          />
        </MotiView>
      )}
    </AnimatePresence>
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
